from contextlib import asynccontextmanager
from datetime import datetime, timedelta
from typing import Optional
import csv
import io

from fastapi import FastAPI, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from sqlalchemy import func
import bcrypt

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.platypus import (
    SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
)

from database import User, Equipment, MaintenanceEvent, SeverityEnum, init_db, get_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Auth models & routes
# ---------------------------------------------------------------------------

class RegisterRequest(BaseModel):
    full_name: str
    email: EmailStr
    employee_id: str
    user_role: str
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class AuthResponse(BaseModel):
    message: str
    email: str


class UserResponse(BaseModel):
    message: str
    full_name: str
    email: str
    employee_id: str
    user_role: str


def hash_password(plain_password: str) -> str:
    hashed = bcrypt.hashpw(plain_password.encode("utf-8"), bcrypt.gensalt())
    return hashed.decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))


@app.post("/register", response_model=UserResponse)
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        full_name=data.full_name,
        email=data.email,
        employee_id=data.employee_id,
        user_role=data.user_role,
        hashed_password=hash_password(data.password),
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "Registration successful",
        "full_name": new_user.full_name,
        "email": new_user.email,
        "employee_id": new_user.employee_id,
        "user_role": new_user.user_role,
    }


@app.post("/login", response_model=AuthResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return {"message": "Login successful", "email": user.email}


@app.get("/")
def root():
    return {"status": "backend is running"}


# ---------------------------------------------------------------------------
# Reports models & routes
# ---------------------------------------------------------------------------

class KpiCard(BaseModel):
    label: str
    value: str
    footnote: str
    tone: str


class KpiResponse(BaseModel):
    kpis: list[KpiCard]


class EventRow(BaseModel):
    date: str
    time: str
    equipment_id: str
    event: str
    severity: SeverityEnum
    technician: str
    initials: Optional[str] = None
    avatar_color: Optional[str] = None


class EventsResponse(BaseModel):
    rows: list[EventRow]
    total: int
    page: int
    page_size: int


RANGE_TO_DAYS = {
    "Last 7 Days": 7,
    "Last 30 Days": 30,
    "Last 90 Days": 90,
    "Last Year": 365,
}


def _range_start(range_label: str) -> Optional[datetime]:
    days = RANGE_TO_DAYS.get(range_label)
    if days is None:
        return None
    return datetime.utcnow() - timedelta(days=days)


def _base_query(db: Session, role: str, user_id: Optional[int], severity, range_label: str):
    q = db.query(MaintenanceEvent).join(Equipment)

    if role == "technician":
        if user_id is None:
            raise HTTPException(400, "user_id is required for technician role")
        q = q.filter(MaintenanceEvent.technician_id == user_id)

    if severity is not None:
        q = q.filter(MaintenanceEvent.severity == severity)

    start = _range_start(range_label)
    if start is not None:
        q = q.filter(MaintenanceEvent.occurred_at >= start)

    return q


@app.get("/api/kpis", response_model=KpiResponse)
def get_kpis(
    role: str = Query(...),
    user_id: Optional[int] = Query(None),
    range: str = Query("Last 30 Days"),
    db: Session = Depends(get_db),
):
    start = _range_start(range) or (datetime.utcnow() - timedelta(days=30))

    if role == "manager":
        total_events = db.query(func.count(MaintenanceEvent.id)).filter(
            MaintenanceEvent.occurred_at >= start
        ).scalar()
        critical = db.query(func.count(MaintenanceEvent.id)).filter(
            MaintenanceEvent.occurred_at >= start,
            MaintenanceEvent.severity == SeverityEnum.CRITICAL,
        ).scalar()
        return KpiResponse(kpis=[
            KpiCard(label="TOTAL EVENTS (30D)", value=f"{total_events:,}", footnote="vs previous period", tone="neutral"),
            KpiCard(label="CRITICAL FAILURES", value=str(critical), footnote="Requires immediate review", tone="danger"),
            KpiCard(label="AI PREDICTION ACCURACY", value="N/A", footnote="No prediction data yet", tone="neutral"),
        ])

    if user_id is None:
        raise HTTPException(400, "user_id is required for technician role")

    completed = db.query(func.count(MaintenanceEvent.id)).filter(
        MaintenanceEvent.technician_id == user_id,
        MaintenanceEvent.resolved_at.isnot(None),
        MaintenanceEvent.occurred_at >= start,
    ).scalar()
    open_tasks = db.query(func.count(MaintenanceEvent.id)).filter(
        MaintenanceEvent.technician_id == user_id,
        MaintenanceEvent.resolved_at.is_(None),
    ).scalar()
    avg_response = db.query(
        func.avg(func.extract("epoch", MaintenanceEvent.resolved_at) - func.extract("epoch", MaintenanceEvent.occurred_at))
    ).filter(
        MaintenanceEvent.technician_id == user_id,
        MaintenanceEvent.resolved_at.isnot(None),
        MaintenanceEvent.occurred_at >= start,
    ).scalar()
    avg_minutes = int(avg_response / 60) if avg_response else 0

    return KpiResponse(kpis=[
        KpiCard(label="JOBS COMPLETED (30D)", value=str(completed), footnote="vs previous period", tone="neutral"),
        KpiCard(label="OPEN TASKS", value=str(open_tasks), footnote="Check urgent flags", tone="danger"),
        KpiCard(label="AVG. RESPONSE TIME", value=f"{avg_minutes} min", footnote="Based on selected range", tone="neutral"),
    ])


@app.get("/api/maintenance-events", response_model=EventsResponse)
def list_events(
    role: str = Query(...),
    user_id: Optional[int] = Query(None),
    severity: Optional[SeverityEnum] = Query(None),
    range: str = Query("Last 30 Days"),
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
):
    q = _base_query(db, role, user_id, severity, range)
    total = q.count()

    events = q.order_by(MaintenanceEvent.occurred_at.desc()).offset((page - 1) * page_size).limit(page_size).all()

    rows = [
        EventRow(
            date=e.occurred_at.strftime("%b %d, %Y"),
            time=e.occurred_at.strftime("%H:%M:%S UTC"),
            equipment_id=e.equipment.equipment_id,
            event=e.event_type,
            severity=e.severity,
            technician=(e.technician.full_name if e.technician else "Automated"),
            initials=None,
            avatar_color=None,
        )
        for e in events
    ]

    return EventsResponse(rows=rows, total=total, page=page, page_size=page_size)


@app.get("/api/maintenance-events/export.csv")
def export_events_csv(
    role: str = Query(...),
    user_id: Optional[int] = Query(None),
    severity: Optional[SeverityEnum] = Query(None),
    range: str = Query("Last 30 Days"),
    db: Session = Depends(get_db),
):
    if role != "manager":
        raise HTTPException(403, "Export is only available to managers")

    q = _base_query(db, role, user_id, severity, range)
    events = q.order_by(MaintenanceEvent.occurred_at.desc()).all()

    buffer = io.StringIO()
    writer = csv.writer(buffer)
    writer.writerow(["Date & Time", "Equipment ID", "Event Type", "Severity", "Technician"])
    for e in events:
        writer.writerow([
            e.occurred_at.strftime("%b %d, %Y %H:%M:%S UTC"),
            e.equipment.equipment_id,
            e.event_type,
            e.severity.value,
            e.technician.full_name if e.technician else "Automated",
        ])
    buffer.seek(0)

    return StreamingResponse(
        buffer,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=maintenance-history.csv"},
    )


# ---------------------------------------------------------------------------
# PDF export (reportlab)
# ---------------------------------------------------------------------------

SEVERITY_COLORS = {
    SeverityEnum.CRITICAL: colors.HexColor("#c0392b"),
    SeverityEnum.WARNING: colors.HexColor("#d68910"),
    SeverityEnum.INFO: colors.HexColor("#2874a6"),
}


@app.get("/api/maintenance-events/export.pdf")
def export_events_pdf(
    role: str = Query(...),
    user_id: Optional[int] = Query(None),
    severity: Optional[SeverityEnum] = Query(None),
    range: str = Query("Last 30 Days"),
    db: Session = Depends(get_db),
):
    if role != "manager":
        raise HTTPException(403, "Export is only available to managers")

    q = _base_query(db, role, user_id, severity, range)
    events = q.order_by(MaintenanceEvent.occurred_at.desc()).all()

    total_events = len(events)
    critical_count = sum(1 for e in events if e.severity == SeverityEnum.CRITICAL)
    generated_at = datetime.utcnow().strftime("%b %d, %Y %H:%M:%S UTC")

    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=landscape(A4),
        leftMargin=1.5 * cm,
        rightMargin=1.5 * cm,
        topMargin=1.5 * cm,
        bottomMargin=1.5 * cm,
        title="Maintenance History Report",
    )

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle("TitleStyle", parent=styles["Heading1"], fontSize=18, spaceAfter=2)
    subtitle_style = ParagraphStyle("SubtitleStyle", parent=styles["Normal"], fontSize=9,
                                     textColor=colors.HexColor("#666666"), spaceAfter=14)
    kpi_label_style = ParagraphStyle("KpiLabel", parent=styles["Normal"], fontSize=8,
                                      textColor=colors.HexColor("#888888"))
    kpi_value_style = ParagraphStyle("KpiValue", parent=styles["Normal"], fontSize=20, leading=24,
                                      fontName="Helvetica-Bold")

    elements = []
    elements.append(Paragraph("Maintenance History Report", title_style))
    elements.append(Paragraph(f"Range: {range} &nbsp;|&nbsp; Generated: {generated_at}", subtitle_style))

    kpi_table_data = [
        [Paragraph("TOTAL EVENTS", kpi_label_style), Paragraph("CRITICAL FAILURES", kpi_label_style)],
        [Paragraph(str(total_events), kpi_value_style), Paragraph(str(critical_count), kpi_value_style)],
    ]
    kpi_table = Table(kpi_table_data, colWidths=[6 * cm, 6 * cm])
    kpi_table.setStyle(TableStyle([
        ("BOX", (0, 0), (0, 1), 0.75, colors.HexColor("#dddddd")),
        ("BOX", (1, 0), (1, 1), 0.75, colors.HexColor("#dddddd")),
        ("LEFTPADDING", (0, 0), (-1, -1), 12),
        ("RIGHTPADDING", (0, 0), (-1, -1), 12),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
    ]))
    elements.append(kpi_table)
    elements.append(Spacer(1, 18))

    header = ["Date", "Time", "Equipment ID", "Event Type", "Severity", "Technician"]
    data = [header]
    severity_cell_indices = []

    for i, e in enumerate(events, start=1):
        data.append([
            e.occurred_at.strftime("%b %d, %Y"),
            e.occurred_at.strftime("%H:%M:%S UTC"),
            e.equipment.equipment_id,
            e.event_type,
            e.severity.value,
            e.technician.full_name if e.technician else "Automated",
        ])
        severity_cell_indices.append((i, e.severity))

    events_table = Table(data, repeatRows=1, colWidths=[3.2*cm, 3.2*cm, 3.5*cm, 5*cm, 3*cm, 5*cm])

    table_style = [
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#f4f4f4")),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 8.5),
        ("BOTTOMPADDING", (0, 0), (-1, 0), 8),
        ("TOPPADDING", (0, 0), (-1, 0), 8),
        ("LINEBELOW", (0, 0), (-1, 0), 1, colors.HexColor("#cccccc")),
        ("LINEBELOW", (0, 1), (-1, -1), 0.5, colors.HexColor("#eeeeee")),
        ("TOPPADDING", (0, 1), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 1), (-1, -1), 5),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ]

    for row_idx, sev in severity_cell_indices:
        color = SEVERITY_COLORS.get(sev)
        if color:
            table_style.append(("TEXTCOLOR", (4, row_idx), (4, row_idx), color))
            table_style.append(("FONTNAME", (4, row_idx), (4, row_idx), "Helvetica-Bold"))

    events_table.setStyle(TableStyle(table_style))
    elements.append(events_table)

    def add_page_number(canvas, doc_):
        canvas.saveState()
        canvas.setFont("Helvetica", 8)
        canvas.setFillColor(colors.HexColor("#888888"))
        canvas.drawRightString(landscape(A4)[0] - 1.5 * cm, 1 * cm, f"Page {doc_.page}")
        canvas.restoreState()

    doc.build(elements, onFirstPage=add_page_number, onLaterPages=add_page_number)
    buffer.seek(0)

    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=maintenance-history.pdf"},
    )