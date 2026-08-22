import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Wrench,
  Download,
  FileText,
  ClipboardList,
  AlertTriangle,
  Radio,
  ChevronDown,
  SlidersHorizontal,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const API_BASE = "http://localhost:8000";

const severityStyles = {
  CRITICAL: "bg-red-50 text-red-600",
  WARNING: "bg-amber-50 text-amber-600",
  INFO: "bg-gray-100 text-gray-500",
};

const iconByLabel = {
  "TOTAL EVENTS (30D)": ClipboardList,
  "CRITICAL FAILURES": AlertTriangle,
  "AI PREDICTION ACCURACY": Radio,
  "JOBS COMPLETED (30D)": ClipboardList,
  "OPEN TASKS": AlertTriangle,
  "AVG. RESPONSE TIME": Radio,
};

const roleMeta = {
  manager: {
    subtitle: "Review historical maintenance ledgers, failure reports, and AI predictions.",
    showExport: true,
    tableTitle: "Maintenance History",
  },
  technician: {
    subtitle: "Review your completed jobs, response times, and open tasks.",
    showExport: false,
    tableTitle: "My Work Log",
  },
};

const SEVERITY_OPTIONS = ["All Severities", "CRITICAL", "WARNING", "INFO"];
const RANGE_OPTIONS = ["Last 7 Days", "Last 30 Days", "Last 90 Days", "Last Year"];
const PAGE_SIZE = 10;

export default function ReportsPage({ userRole = "manager", currentUser }) {
  const meta = roleMeta[userRole] || roleMeta.manager;

  const [severity, setSeverity] = useState("All Severities");
  const [range, setRange] = useState("Last 30 Days");
  const [page, setPage] = useState(1);

  const [kpis, setKpis] = useState([]);
  const [history, setHistory] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exportingPDF, setExportingPDF] = useState(false);

  const fetchReportsData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const commonParams = {
        role: userRole,
        user_id: currentUser?.id,
        range,
      };

      const [kpiRes, eventsRes] = await Promise.all([
        axios.get(`${API_BASE}/api/kpis`, { params: commonParams }),
        axios.get(`${API_BASE}/api/maintenance-events`, {
          params: {
            ...commonParams,
            severity: severity === "All Severities" ? undefined : severity,
            page,
            page_size: PAGE_SIZE,
          },
        }),
      ]);

      setKpis(
        kpiRes.data.kpis.map((k) => ({
          ...k,
          icon: iconByLabel[k.label] || Radio,
          footnoteColor: k.tone === "danger" ? "text-red-600" : "text-gray-400",
        }))
      );

      setHistory(
        eventsRes.data.rows.map((r) => ({
          date: r.date,
          time: r.time,
          equipmentId: r.equipment_id,
          event: r.event,
          severity: r.severity,
          technician: r.technician,
          initials: r.initials,
          avatarColor: r.avatar_color || "bg-gray-100 text-gray-600",
        }))
      );
      setTotal(eventsRes.data.total);
    } catch (err) {
      console.error("Failed to load reports data:", err);
      setError("Could not load data from the server.");
      setKpis([]);
      setHistory([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [userRole, currentUser?.id, range, severity, page]);

  useEffect(() => {
    fetchReportsData();
  }, [fetchReportsData]);

  useEffect(() => {
    setPage(1);
  }, [severity, range]);

  async function exportCSV() {
    try {
      const response = await axios.get(`${API_BASE}/api/maintenance-events/export.csv`, {
        params: {
          role: userRole,
          user_id: currentUser?.id,
          range,
          severity: severity === "All Severities" ? undefined : severity,
        },
        responseType: "blob",
      });
      const url = URL.createObjectURL(response.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = "maintenance-history.csv";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("CSV export failed:", err);
    }
  }

  async function exportPDF() {
    try {
      setExportingPDF(true);
      const response = await axios.get(`${API_BASE}/api/maintenance-events/export.pdf`, {
        params: {
          role: userRole,
          user_id: currentUser?.id,
          range,
          severity: severity === "All Severities" ? undefined : severity,
        },
        responseType: "blob",
      });
      const url = URL.createObjectURL(response.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = "maintenance-history.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF export failed:", err);
    } finally {
      setExportingPDF(false);
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="flex-1 overflow-y-auto bg-[#eef1f6] px-10 py-8 font-sans text-[#1f2430]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-extrabold tracking-tight text-gray-900">
            Analytical Hub
          </h1>
          <p className="mt-1 text-sm text-gray-400">{meta.subtitle}</p>
        </div>

        {meta.showExport && (
          <div className="flex gap-3">
            <button onClick={exportCSV} className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50">
              <Download size={15} strokeWidth={2.2} />
              Export CSV
            </button>
            <button
              onClick={exportPDF}
              disabled={exportingPDF}
              className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 disabled:opacity-60"
            >
              <FileText size={15} strokeWidth={2.2} />
              {exportingPDF ? "Generating..." : "Generate PDF"}
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {kpis.map((k) => (
          <KpiCard key={k.label} {...k} />
        ))}
      </div>

      <div className="mt-5 rounded-2xl border border-[#eceff4] bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-[17px] font-bold text-gray-900">
            {meta.tableTitle}{" "}
            {loading && <span className="text-xs font-normal text-gray-400 ml-2">(Syncing...)</span>}
          </h2>

          <div className="flex items-center gap-2">
            <Dropdown value={severity} options={SEVERITY_OPTIONS} onChange={setSeverity} />
            <Dropdown value={range} options={RANGE_OPTIONS} onChange={setRange} />
            <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50">
              <SlidersHorizontal size={15} strokeWidth={2.2} />
            </button>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#eceff4] text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                <th className="pb-3 pr-4 font-semibold">Date &amp; Time</th>
                <th className="pb-3 pr-4 font-semibold">Equipment ID</th>
                <th className="pb-3 pr-4 font-semibold">Event Type</th>
                <th className="pb-3 pr-4 font-semibold">Severity</th>
                <th className="pb-3 pr-4 font-semibold">Technician</th>
                <th className="pb-3 pr-0 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {history.map((row, idx) => (
                <tr
                  key={row.equipmentId + (row.time || idx)}
                  className="border-b border-[#f1f3f7] text-sm last:border-0"
                >
                  <td className="py-3.5 pr-4 align-top">
                    <p className="font-semibold text-gray-800">{row.date}</p>
                    <p className="text-xs text-gray-400">{row.time}</p>
                  </td>
                  <td className="py-3.5 pr-4 align-top font-mono text-[13px] text-gray-600">
                    {row.equipmentId}
                  </td>
                  <td className="py-3.5 pr-4 align-top text-gray-800">{row.event}</td>
                  <td className="py-3.5 pr-4 align-top">
                    <span
                      className={`inline-block rounded px-2 py-0.5 text-[10px] font-bold tracking-wide ${
                        severityStyles[row.severity] || "bg-gray-100 text-gray-500"
                      } ${row.severity === "CRITICAL" ? "animate-pulse" : ""}`}
                    >
                      {row.severity}
                    </span>
                  </td>
                  <td className="py-3.5 pr-4 align-top">
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${row.avatarColor}`}
                      >
                        {row.initials ?? <Wrench size={11} strokeWidth={2.5} />}
                      </div>
                      <span className="text-gray-700">{row.technician}</span>
                    </div>
                  </td>
                  <td className="py-3.5 pr-0 text-right align-top">
                    <button className="text-red-500 hover:text-red-600">
                      <Eye size={16} strokeWidth={2} />
                    </button>
                  </td>
                </tr>
              ))}
              {!loading && history.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-sm text-gray-400">
                    No events found for this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-1">
          <p className="text-xs text-gray-400">
            Showing {total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1} to{" "}
            {Math.min(page * PAGE_SIZE, total)} of {total.toLocaleString()} entries
          </p>
          <div className="flex items-center gap-1">
            <PageButton icon={ChevronLeft} onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} />
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .slice(0, 3)
              .map((p) => (
                <PageButton key={p} label={String(p)} active={p === page} onClick={() => setPage(p)} />
              ))}
            {totalPages > 3 && <span className="px-1 text-sm text-gray-400">...</span>}
            <PageButton
              icon={ChevronRight}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ label, value, icon: Icon, footnote, footnoteColor, tone }) {
  const danger = tone === "danger";
  return (
    <div
      className={`rounded-2xl border p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)] ${
        danger ? "border-red-100 bg-red-50/60" : "border-[#eceff4] bg-white"
      }`}
    >
      <div className="flex items-start justify-between">
        <p className={`text-[11px] font-bold tracking-wide ${danger ? "text-red-500" : "text-gray-400"}`}>
          {label}
        </p>
        <Icon size={16} strokeWidth={2.2} className={danger ? "text-red-500" : "text-gray-400"} />
      </div>
      <p className={`mt-3 text-[32px] font-extrabold leading-none ${danger ? "text-gray-900 animate-pulse" : "text-gray-900"}`}>
        {value}
      </p>
      <p className={`mt-2 text-xs font-medium ${footnoteColor}`}>{footnote}</p>
    </div>
  );
}

function Dropdown({ value, options, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
      >
        {value}
        <ChevronDown size={14} strokeWidth={2.2} className="text-gray-400" />
      </button>
      {open && (
        <div className="absolute right-0 z-10 mt-1 w-44 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className="block w-full px-3 py-1.5 text-left text-sm text-gray-600 hover:bg-gray-50"
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function PageButton({ label, icon: Icon, active, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-semibold transition-colors disabled:opacity-40 ${
        active ? "bg-red-600 text-white" : "text-gray-500 hover:bg-gray-100"
      }`}
    >
      {Icon ? <Icon size={15} strokeWidth={2.2} /> : label}
    </button>
  );
}