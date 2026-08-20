from sqlalchemy import create_engine, Column, Integer, String, DateTime, Enum as SAEnum, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
import enum
from datetime import datetime

# --- Connection settings ---
DATABASE_URL = "postgresql://postgres:rahman87@localhost:5432/repAIr_DB"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class SeverityEnum(str, enum.Enum):
    CRITICAL = "CRITICAL"
    WARNING = "WARNING"
    INFO = "INFO"


# --- User table definition ---
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    employee_id = Column(String, nullable=False)
    user_role = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)

    events = relationship("MaintenanceEvent", back_populates="technician")


# --- Equipment table ---
class Equipment(Base):
    __tablename__ = "equipment"

    id = Column(Integer, primary_key=True, index=True)
    equipment_id = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=True)
    type = Column(String, nullable=True)
    location = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    events = relationship("MaintenanceEvent", back_populates="equipment")


# --- Maintenance events table ---
class MaintenanceEvent(Base):
    __tablename__ = "maintenance_events"

    id = Column(Integer, primary_key=True, index=True)
    equipment_id = Column(Integer, ForeignKey("equipment.id"), index=True)
    technician_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    event_type = Column(String, nullable=False)
    severity = Column(SAEnum(SeverityEnum), nullable=False, index=True)
    occurred_at = Column(DateTime, index=True, nullable=False)
    resolved_at = Column(DateTime, nullable=True)
    notes = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    equipment = relationship("Equipment", back_populates="events")
    technician = relationship("User", back_populates="events")


# --- Creates the tables in the database if they don't exist yet ---
def init_db():
    Base.metadata.create_all(bind=engine)


# --- Dependency for getting a DB session in each request ---
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()