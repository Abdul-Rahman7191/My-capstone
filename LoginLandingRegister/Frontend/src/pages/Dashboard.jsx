import React, { useState, useCallback } from "react";
import {
  Activity,
  Clock,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ShieldCheck,
  Wrench,
  BarChart3,
  ChevronRight,
  Download,
  Printer,
} from "lucide-react";
import { equipmentList } from '../data/equipmentData';
import {
  calculateFleetAvailability,
  getTotalDowntimeMTD,
  calculateMTTR,
  getTotalMaintenanceCost,
  getPerformanceTrend,
  getTopRiskAssets,
  getDowntimeByEquipment,
  getMaintenanceCostByEquipment,
  calculateMTTRByAsset,
  generateInsights,
  sumPreventiveCosts,
  sumCorrectiveCosts,
  getTotalUnplannedDowntimeEvents,
} from '../utils/fleetMetrics';

const STATUS_STYLES = {
  critical: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-500', label: 'Critical', bar: 'bg-red-500' },
  warning: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500', label: 'Warning', bar: 'bg-amber-500' },
  normal: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500', label: 'Normal', bar: 'bg-emerald-500' },
};

function DonutChart({ segments, size = 120, strokeWidth = 16 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const cx = size / 2;
  const cy = size / 2;
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;

  let cumulativeFraction = 0;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#e2e8f0" strokeWidth={strokeWidth} />
      {segments.map((s) => {
        const fraction = s.value / total;
        const dashArray = `${fraction * circumference} ${circumference}`;
        const dashOffset = -cumulativeFraction * circumference;
        cumulativeFraction += fraction;
        return (
          <circle
            key={s.key}
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke={s.color}
            strokeWidth={strokeWidth}
            strokeDasharray={dashArray}
            strokeDashoffset={dashOffset}
            strokeLinecap="butt"
            transform={`rotate(-90 ${cx} ${cy})`}
          />
        );
      })}
    </svg>
  );
}

function getHealthSegments(fleet) {
  const counts = fleet.reduce((acc, e) => {
    acc[e.status] = (acc[e.status] || 0) + 1;
    return acc;
  }, {});
  return ['critical', 'warning', 'normal']
    .filter(key => counts[key])
    .map(key => ({
      key,
      label: STATUS_STYLES[key].label,
      value: counts[key],
      color: key === 'critical' ? '#ef4444' : key === 'warning' ? '#f59e0b' : '#10b981',
      dot: STATUS_STYLES[key].dot,
      ...STATUS_STYLES[key],
    }));
}

function getOverallHealthScore(fleet) {
  if (fleet.length === 0) return 0;
  const total = fleet.reduce((sum, a) => sum + (a.healthScore || 0), 0);
  return Math.round(total / fleet.length);
}

function KpiCard({ title, value, unit, subtitle, trend, trendLabel, icon: Icon, trendUp }) {
  const isGood = trendUp === true || (trendUp === undefined && trend >= 0);
  const trendIsUp = trend > 0;
  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <p className="font-mono text-[14px] font-bold uppercase tracking-widest text-black">{title}</p>
        <div className={`flex h-8 w-8 items-center justify-center rounded-full border ${
          trendUp === true
            ? 'border-emerald-200 bg-emerald-50 text-emerald-600'
            : trendUp === false
            ? 'border-red-200 bg-red-50 text-red-600'
            : trendIsUp
            ? 'border-red-200 bg-red-50 text-red-600'
            : 'border-emerald-200 bg-emerald-50 text-emerald-600'
        }`}>
          <Icon size={15} strokeWidth={2.2} />
        </div>
      </div>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="font-mono text-2xl font-extrabold text-slate-900">{value}</span>
        {unit && <span className="font-mono text-xs text-slate-400">{unit}</span>}
      </div>
      <p className="mt-0.5 text-xs font-semibold text-slate-500">{subtitle}</p>
      <div className="mt-2 flex items-center gap-1">
        {trend !== 0 && (
          trendIsUp ? (
            <TrendingUp size={12} className={trendUp === true ? 'text-emerald-600' : 'text-red-600'} />
          ) : (
            <TrendingDown size={12} className={trendUp === false ? 'text-emerald-600' : 'text-red-600'} />
          )
        )}
        <span className={`font-mono text-xs font-semibold ${trend === 0 ? 'text-slate-400' : trendIsUp ? (trendUp === true ? 'text-emerald-600' : 'text-red-600') : (trendUp === false ? 'text-emerald-600' : 'text-red-600')}`}>
          {trendLabel || `0% vs previous period`}
        </span>
      </div>
    </div>
  );
}

function TrendChart({ data, metricLabel, unit, color }) {
  const [tooltip, setTooltip] = useState(null);
  const values = data.map(d => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const pad = { top: 20, right: 20, bottom: 40, left: 50 };
  const width = 700;
  const height = 280;
  const chartW = width - pad.left - pad.right;
  const chartH = height - pad.top - pad.bottom;

  const points = data.map((d, i) => ({
    ...d,
    x: pad.left + (i / (data.length - 1 || 1)) * chartW,
    y: pad.top + chartH - ((d.value - min) / range) * chartH,
  }));

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');

  const yTicks = 5;
  const yStep = range / (yTicks - 1);
  const yTicksArr = Array.from({ length: yTicks }, (_, i) => min + yStep * i);

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.15" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {yTicksArr.map((tick, i) => {
          const y = pad.top + chartH - ((tick - min) / range) * chartH;
          return (
            <g key={i}>
              <line x1={pad.left} y1={y} x2={width - pad.right} y2={y} stroke="#e2e8f0" strokeWidth="1" />
              <text x={pad.left - 8} y={y + 4} textAnchor="end" className="fill-slate-400 text-[10px] font-mono">
                {tick % 1 === 0 ? tick : tick.toFixed(1)}
              </text>
            </g>
          );
        })}

        <polygon points={`${points[0].x},${pad.top + chartH} ${points.map(p => `${p.x},${p.y}`).join(' ')} ${points[points.length - 1].x},${pad.top + chartH}`} fill="url(#trendFill)" />

        <path d={linePath} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="4"
            fill={color}
            stroke="#fff"
            strokeWidth="2"
            className="cursor-pointer"
            onMouseEnter={(e) => {
              const rect = e.target.closest('svg').getBoundingClientRect();
              setTooltip({ x: p.x * (rect.width / width), y: p.y * (rect.height / height), label: p.label, value: p.value });
            }}
            onMouseLeave={() => setTooltip(null)}
          />
        ))}

        {points.map((p, i) => (
          <text key={`label-${i}`} x={p.x} y={pad.top + chartH + 20} textAnchor="middle" className="fill-slate-400 text-[10px] font-mono">
            {p.label}
          </text>
        ))}

        <text x={15} y={height / 2} textAnchor="middle" transform={`rotate(-90, 15, ${height / 2})`} className="fill-slate-400 text-[10px] font-mono">
          {unit}
        </text>
      </svg>

      {tooltip && (
        <div
          className="pointer-events-none absolute z-50 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 shadow-lg"
          style={{ left: tooltip.x + 10, top: tooltip.y - 30 }}
        >
          <p className="font-semibold text-slate-900">{tooltip.label}</p>
          <p className="text-slate-600 font-mono">{tooltip.value} {unit}</p>
        </div>
      )}
    </div>
  );
}

function HorizontalBarChart({ data, unit, colorFn }) {
  const maxVal = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="flex flex-col gap-3">
      {data.map((d, i) => (
        <div key={i}>
          <div className="mb-1 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${d.dot || 'bg-slate-300'}`} />
              <span className="text-sm font-medium text-slate-700">{d.label}</span>
            </div>
            <span className="font-mono text-sm font-bold text-slate-900">{d.value}{unit}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full ${colorFn ? colorFn(d) : 'bg-blue-500'}`}
              style={{ width: `${(d.value / maxVal) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function StackedBarChart({ data, unit, colors }) {
  return (
    <div className="flex flex-col gap-4">
      {data.map((d, i) => {
        const prevWidth = d.total > 0 ? (d.preventive / d.total) * 100 : 0;
        const corrWidth = d.total > 0 ? (d.corrective / d.total) * 100 : 0;
        return (
          <div key={i}>
            <div className="mb-1 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${d.dot || 'bg-slate-300'}`} />
                <span className="text-sm font-medium text-slate-700">{d.label}</span>
              </div>
              <span className="font-mono text-sm font-bold text-slate-900">{unit}{d.total.toLocaleString()}</span>
            </div>
            <div className="h-4 w-full overflow-hidden rounded-full bg-slate-100">
              {d.total > 0 && (
                <>
                  <div
                    className="float-left h-full rounded-l-full"
                    style={{ width: `${prevWidth}%`, backgroundColor: colors?.preventive || '#10b981' }}
                  />
                  <div
                    className="float-left h-full"
                    style={{ width: `${corrWidth}%`, backgroundColor: colors?.corrective || '#ef4444' }}
                  />
                </>
              )}
            </div>
            <div className="mt-0.5 flex gap-4 text-[10px] font-mono text-slate-400">
              <span>Preventive: {unit}{d.preventive.toLocaleString()}</span>
              <span>Corrective: {unit}{d.corrective.toLocaleString()}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function escapeCsv(val) {
  const s = String(val ?? '');
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function exportCsv() {
  const fleet = equipmentList;
  const rows = [['Metric', 'Value', 'Unit']];
  rows.push(['Asset Availability', calculateFleetAvailability(fleet), '%']);
  rows.push(['Total Downtime', getTotalDowntimeMTD(fleet), 'hrs']);
  rows.push(['Downtime Events', getTotalUnplannedDowntimeEvents(fleet), '']);
  const mttrVal = calculateMTTR(fleet);
  rows.push(['MTTR', mttrVal !== null ? mttrVal : 'N/A', 'hrs']);
  rows.push(['Total Maintenance Cost', getTotalMaintenanceCost(fleet), 'RM']);
  rows.push([]);
  rows.push(['Asset Breakdown']);
  rows.push(['ID', 'Name', 'Status', 'Health Score', 'Failure Risk', 'Downtime (hrs)', 'Preventive Cost', 'Corrective Cost']);
  const costByEq = getMaintenanceCostByEquipment(fleet);
  const downtimeByEq = getDowntimeByEquipment(fleet);
  for (const asset of fleet) {
    const dc = downtimeByEq.find(d => d.id === asset.id);
    const cc = costByEq.find(c => c.id === asset.id);
    rows.push([
      asset.id, asset.name, asset.status, asset.healthScore, asset.failureRisk,
      dc?.downtimeHours ?? 0, cc?.preventive ?? 0, cc?.corrective ?? 0,
    ].map(escapeCsv));
  }
  const csv = rows.map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `repAIr_executive_dashboard_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function handlePrint() {
  window.print();
}

export default function Dashboard() {
  const [selectedMetric, setSelectedMetric] = useState('availabilityRate');

  const fleet = equipmentList;
  const healthSegments = getHealthSegments(fleet);
  const overallHealth = getOverallHealthScore(fleet);
  const criticalCount = fleet.filter(a => a.status === 'critical').length;
  const warningCount = fleet.filter(a => a.status === 'warning').length;
  const normalCount = fleet.filter(a => a.status === 'normal').length;

  const availability = calculateFleetAvailability(fleet);
  const totalDowntime = getTotalDowntimeMTD(fleet);
  const totalDowntimeEvents = getTotalUnplannedDowntimeEvents(fleet);
  const mttr = calculateMTTR(fleet);
  const totalMaintCost = getTotalMaintenanceCost(fleet);

  const trendData = getPerformanceTrend(fleet, selectedMetric);
  const topRiskAssets = getTopRiskAssets(fleet);
  const downtimeByEq = getDowntimeByEquipment(fleet);
  const costByEq = getMaintenanceCostByEquipment(fleet);
  const mttrByAsset = calculateMTTRByAsset(fleet);
  const insights = generateInsights(fleet);

  const trendConfig = {
    availabilityRate: { label: 'Availability', unit: '%', color: '#10b981' },
    downtimeHours: { label: 'Downtime', unit: 'hrs', color: '#ef4444' },
    downtimeEvents: { label: 'Events', unit: '', color: '#f59e0b' },
    mttrHours: { label: 'MTTR', unit: 'hrs', color: '#6366f1' },
    maintenanceCost: { label: 'Cost', unit: 'RM', color: '#f97316' },
  };

  const metricToggles = [
    { key: 'availabilityRate', label: 'Availability' },
    { key: 'downtimeHours', label: 'Downtime' },
    { key: 'downtimeEvents', label: 'Events' },
    { key: 'mttrHours', label: 'MTTR' },
    { key: 'maintenanceCost', label: 'Cost' },
  ];

  const topDowntimeAsset = downtimeByEq.length > 0 ? downtimeByEq[0] : null;

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50/50 px-6 py-6 lg:px-10 lg:py-8">
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 lg:text-3xl">
              Executive Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Real-time fleet reliability, downtime, and maintenance performance overview
            </p>
          </div>
          <div className="flex items-center gap-2 print:hidden">
            <button
              onClick={exportCsv}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all"
            >
              <Download size={14} />
              Export CSV
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all"
            >
              <Printer size={14} />
              Generate PDF
            </button>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <KpiCard
            title="Asset Availability"
            value={availability}
            unit="%"
            subtitle="Fleet-wide uptime / total scheduled time"
            trend={1.2}
            trendLabel="+1.2% vs prev month"
            icon={Activity}
            trendUp={true}
          />
          <KpiCard
            title="Downtime"
            value={totalDowntime}
            unit="hrs"
            subtitle="Total recorded downtime (MTD)"
            trend={-18}
            trendLabel="-18% vs prev month"
            icon={Clock}
            trendUp={false}
          />
          <KpiCard
            title="Downtime Events"
            value={totalDowntimeEvents}
            unit=""
            subtitle="Unplanned downtime incidents (MTD)"
            trend={-8}
            trendLabel="-8% vs prev month"
            icon={AlertTriangle}
            trendUp={false}
          />
          <KpiCard
            title="MTTR"
            value={mttr !== null ? mttr : 'N/A'}
            unit={mttr !== null ? "hrs" : ""}
            subtitle="Mean time to restore equipment"
            trend={-12}
            trendLabel="-12% vs prev month"
            icon={Wrench}
            trendUp={false}
          />
          <KpiCard
            title="Maintenance Cost"
            value={`RM ${totalMaintCost.toLocaleString()}`}
            unit=""
            subtitle="Total maintenance spending (YTD)"
            trend={5}
            trendLabel="+5% vs prev period"
            icon={DollarSign}
            trendUp={false}
          />
        </div>

        <div className="mb-8 rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Fleet Maintenance Performance — Last 6 Months</h2>
              <p className="text-xs text-slate-500">
                {trendConfig[selectedMetric]?.label} trend across the fleet
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {metricToggles.map(m => (
                <button
                  key={m.key}
                  onClick={() => setSelectedMetric(m.key)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-semibold font-mono transition-all ${
                    selectedMetric === m.key
                      ? 'border-blue-200 bg-blue-50 text-blue-700'
                      : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
          <TrendChart
            data={trendData}
            metricLabel={trendConfig[selectedMetric]?.label || ''}
            unit={trendConfig[selectedMetric]?.unit || ''}
            color={trendConfig[selectedMetric]?.color || '#6366f1'}
          />
        </div>

        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Fleet Reliability</h2>
                <p className="text-xs text-slate-500">{fleet.length} assets tracked</p>
              </div>
              <div className={`flex h-9 w-9 items-center justify-center rounded-full border ${
                criticalCount > 0 ? 'border-red-200 bg-red-50 text-red-600 animate-pulse' : 'border-emerald-200 bg-emerald-50 text-emerald-600'
              }`}>
                <ShieldCheck size={18} strokeWidth={2} />
              </div>
            </div>

            <div className="flex items-center gap-5">
              <div className="relative h-28 w-28 shrink-0">
                <DonutChart segments={healthSegments} size={112} strokeWidth={14} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-mono text-xl font-extrabold text-slate-900">{overallHealth}%</span>
                  <span className="font-mono text-[9px] uppercase tracking-widest text-slate-400">Health</span>
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-red-500" />
                    <span className="font-mono text-xs uppercase tracking-wide text-slate-600">Critical</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-900">{criticalCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                    <span className="font-mono text-xs uppercase tracking-wide text-slate-600">Warning</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-900">{warningCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="font-mono text-xs uppercase tracking-wide text-slate-600">Normal</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-900">{normalCount}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3 border-t border-slate-100 pt-4">
              <div className="text-center">
                <p className="font-mono text-lg font-extrabold text-slate-900">{availability}%</p>
                <p className="font-mono text-[10px] uppercase tracking-wider text-slate-400">Avail.</p>
              </div>
              <div className="text-center">
                <p className="font-mono text-lg font-extrabold text-red-600">{totalDowntime}h</p>
                <p className="font-mono text-[10px] uppercase tracking-wider text-slate-400">Downtime</p>
              </div>
              <div className="text-center">
                <p className="font-mono text-lg font-extrabold text-slate-900">{totalDowntimeEvents}</p>
                <p className="font-mono text-[10px] uppercase tracking-wider text-slate-400">Events</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Assets Requiring Attention</h2>
                <p className="text-xs text-slate-500">Highest-risk equipment based on predictive analysis</p>
              </div>
              <button className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-slate-300 hover:text-slate-800">
                View Equipment <ChevronRight size={12} />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-mono font-semibold uppercase tracking-widest text-slate-400">
                    <th className="pb-2 pr-3">Asset</th>
                    <th className="pb-2 pr-3">Status</th>
                    <th className="pb-2 pr-3">Health</th>
                    <th className="pb-2 pr-3">Risk</th>
                    <th className="hidden pb-2 pr-3 md:table-cell">Predicted Issue</th>
                    <th className="hidden pb-2 pr-3 md:table-cell">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {topRiskAssets.map((a) => {
                    const st = STATUS_STYLES[a.status] || STATUS_STYLES.normal;
                    return (
                      <tr key={a.id} className="border-b border-slate-100 last:border-0">
                        <td className="py-2.5 pr-3">
                          <p className="font-bold text-slate-900">{a.id}</p>
                          <p className="text-xs text-slate-500">{a.name}</p>
                        </td>
                        <td className="py-2.5 pr-3">
                          <span className={`inline-block rounded-md border px-2 py-0.5 text-[10px] font-mono font-semibold ${st.border} ${st.bg} ${st.text}`}>
                            {st.label}
                          </span>
                        </td>
                        <td className="py-2.5 pr-3">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-14 overflow-hidden rounded-full bg-slate-100">
                              <div className={`h-full rounded-full ${a.healthScore > 70 ? 'bg-emerald-500' : a.healthScore > 40 ? 'bg-amber-500' : 'bg-red-500'}`}
                                style={{ width: `${a.healthScore}%` }}
                              />
                            </div>
                            <span className="font-mono text-xs text-slate-600">{a.healthScore}%</span>
                          </div>
                        </td>
                        <td className="py-2.5 pr-3">
                          <span className={`font-mono text-xs font-bold ${a.failureRisk > 70 ? 'text-red-600' : a.failureRisk > 30 ? 'text-amber-600' : 'text-emerald-600'}`}>
                            {a.failureRisk}%
                          </span>
                        </td>
                        <td className="hidden py-2.5 pr-3 text-xs text-slate-500 md:table-cell">
                          {a.predictedIssue.length > 40 ? a.predictedIssue.slice(0, 40) + '...' : a.predictedIssue}
                        </td>
                        <td className="hidden py-2.5 md:table-cell">
                          <button className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1 text-[10px] font-semibold text-blue-700 hover:bg-blue-100">
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="mb-4">
              <h2 className="text-base font-bold text-slate-900">Downtime Analysis</h2>
              <p className="text-xs text-slate-500">Total downtime hours by equipment</p>
            </div>
            <HorizontalBarChart
              data={downtimeByEq.map(d => ({
                label: `${d.id} - ${d.name}`,
                value: d.downtimeHours,
                dot: d.status === 'critical' ? 'bg-red-500' : d.status === 'warning' ? 'bg-amber-500' : 'bg-emerald-500',
              }))}
              unit=" hrs"
              colorFn={(d) => d.value > 15 ? 'bg-red-500' : d.value > 5 ? 'bg-amber-500' : 'bg-emerald-500'}
            />
            {topDowntimeAsset && topDowntimeAsset.downtimeHours > 0 && (
              <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs text-slate-600">
                  <span className="font-bold text-slate-900">{topDowntimeAsset.id}</span> accounts for the highest downtime exposure in the current fleet at <span className="font-bold text-red-600">{topDowntimeAsset.downtimeHours} hours</span>.
                </p>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="mb-4">
              <h2 className="text-base font-bold text-slate-900">Maintenance Cost Analysis</h2>
              <p className="text-xs text-slate-500">Preventive vs corrective spending by equipment</p>
            </div>
            <StackedBarChart
              data={costByEq.map(d => ({
                label: `${d.id} - ${d.name}`,
                preventive: d.preventive,
                corrective: d.corrective,
                total: d.total,
                dot: d.status === 'critical' ? 'bg-red-500' : d.status === 'warning' ? 'bg-amber-500' : 'bg-emerald-500',
              }))}
              unit="RM "
              colors={{ preventive: '#10b981', corrective: '#ef4444' }}
            />
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="mb-4">
              <h2 className="text-base font-bold text-slate-900">MTTR (Mean Time to Repair)</h2>
              <p className="text-xs text-slate-500">Average time to restore equipment after corrective event</p>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div>
                  <p className="text-sm font-medium text-slate-700">Fleet MTTR</p>
                  <p className="text-xs text-slate-400">Corrective maintenance only</p>
                </div>
                <span className="font-mono text-2xl font-extrabold text-indigo-600">
                  {mttr !== null ? `${mttr} hrs` : 'N/A'}
                </span>
              </div>
              {fleet.map(a => {
                const assetMttr = mttrByAsset[a.id];
                return (
                  <div key={a.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${STATUS_STYLES[a.status]?.dot || 'bg-slate-300'}`} />
                      <span className="text-sm text-slate-600">{a.id} - {a.name}</span>
                    </div>
                    <span className={`font-mono text-sm font-semibold ${assetMttr !== null ? 'text-slate-900' : 'text-slate-400'}`}>
                      {assetMttr !== null ? `${assetMttr} hrs` : 'N/A'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="mb-4">
              <h2 className="text-base font-bold text-slate-900">Executive Insights</h2>
              <p className="text-xs text-slate-500">Key findings from fleet data analysis</p>
            </div>
            <div className="flex flex-col gap-3">
              {insights.length > 0 ? insights.map((insight, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                    <BarChart3 size={12} />
                  </div>
                  <p className="text-xs leading-relaxed text-slate-600">{insight}</p>
                </div>
              )) : (
                <p className="text-sm text-slate-400">No insights available. Add more data to generate analysis.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
