import React, { useState } from 'react';
import {
  X,
  TrendingDown,
  Activity,
  Cpu,
  Coins,
  Clock,
  Radio,
  FileText,
  AlertTriangle,
} from 'lucide-react';

export const TelemetryPopup = ({
  equipment,
  onClose,
  userRole,
}) => {
  const {
    id,
    model,
    serialNumber,
    telemetry,
    predictedIssue,
    predictedDowntimeHours,
    predictedFinancialLoss,
    failureWindow,
    confidenceScore,
    maintenanceUrgency,
  } = equipment;

  const [activeMetric, setActiveMetric] = useState(telemetry[0]?.name || '');

  const formatRM = (val) => {
    return `RM ${val.toLocaleString()}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'critical':
      case 'below-normal':
        return 'text-red-500 border-red-200 bg-red-50/50';
      case 'elevated':
        return 'text-amber-500 border-amber-200 bg-amber-50/50';
      default:
        return 'text-emerald-500 border-emerald-100 bg-emerald-50/30';
    }
  };

  const currentMetricData = telemetry.find((m) => m.name === activeMetric) || telemetry[0];

  return (
    <div
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn"
      id={`telemetry-popup-${id}`}
    >
      <div className="bg-white rounded-xl border border-slate-200 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-700 rounded-sm">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-extrabold text-slate-900 text-lg tracking-tight" id="telemetry-hdr-id">
                  {id} TELEMETRY FEED
                </h2>
                <span className="text-[9px] font-mono font-bold bg-rose-100 text-rose-700 px-1.5 py-0.2 rounded animate-pulse">
                  LIVE FEED
                </span>
              </div>
              <p className="text-xs text-slate-500 font-sans mt-0.5" id="telemetry-hdr-details">
                {model} • {serialNumber}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            id="telemetry-close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Sidebar: Metric Selector Checkboxes/Status */}
            <div className="space-y-3 md:col-span-1" id="telemetry-metric-selector">
              <span className="text-[10px] text-slate-400 font-mono uppercase block tracking-wider mb-2">Sensor Array Channels</span>
              {telemetry.map((metric) => (
                <div
                  key={metric.name}
                  id={`telemetry-item-${metric.name.replace(/\s+/g, '-').toLowerCase()}`}
                  onClick={() => setActiveMetric(metric.name)}
                  className={`p-3 rounded-sm border cursor-pointer transition-all flex items-center justify-between ${
                    activeMetric === metric.name
                      ? 'border-blue-500 bg-blue-50/40 shadow-sm'
                      : 'border-slate-100 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="font-sans font-bold text-xs text-slate-800 block">
                      {metric.name}
                    </span>
                    <span className="font-mono text-[10px] text-slate-400 block">
                      Status: {metric.sensorStatus}
                    </span>
                  </div>
                  <div className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${getStatusColor(metric.status)}`}>
                    {metric.currentValue} {metric.unit}
                  </div>
                </div>
              ))}
            </div>

            {/* Central Metric Details and SVG Graph */}
            <div className="md:col-span-2 space-y-4" id="telemetry-graph-panel">
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 mb-4">
                  <div>
                    <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block">ACTIVE SENSOR TIMELINE</span>
                    <h3 className="font-display font-bold text-slate-800 text-sm" id="active-metric-title">
                      {currentMetricData.name} ({currentMetricData.unit})
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-mono text-slate-400 uppercase block">BASELINE EXPECTED</span>
                    <span className="font-mono text-xs text-slate-600 font-bold" id="active-metric-baseline">
                      {currentMetricData.baseline} {currentMetricData.unit}
                    </span>
                  </div>
                </div>

                {/* SVG Live Trend Graph */}
                <div className="relative h-44 w-full flex flex-col justify-between" id="active-metric-graph">
                  {/* Grid Lines */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                    <div className="border-b border-slate-400 w-full" />
                    <div className="border-b border-slate-400 w-full" />
                    <div className="border-b border-slate-400 w-full" />
                  </div>

                  {/* SVG Path drawing */}
                  <svg className="w-full h-full overflow-visible z-10" viewBox="0 0 400 120" preserveAspectRatio="none">
                    {/* Background Gradient Area */}
                    <defs>
                      <linearGradient id="gradient-area" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                      </linearGradient>
                    </defs>

                    {/* Area path */}
                    <path
                      d={`M 0,${120 - (currentMetricData.history24h[0].value / (currentMetricData.baseline * 1.5)) * 80} 
                          L 100,${120 - (currentMetricData.history24h[1].value / (currentMetricData.baseline * 1.5)) * 80} 
                          L 200,${120 - (currentMetricData.history24h[2].value / (currentMetricData.baseline * 1.5)) * 80} 
                          L 300,${120 - (currentMetricData.history24h[3].value / (currentMetricData.baseline * 1.5)) * 80} 
                          L 400,${120 - (currentMetricData.history24h[4].value / (currentMetricData.baseline * 1.5)) * 80} 
                          L 400,120 L 0,120 Z`}
                      fill="url(#gradient-area)"
                    />

                    {/* Baseline dashed line */}
                    <line
                      x1="0"
                      y1={120 - (currentMetricData.baseline / (currentMetricData.baseline * 1.5)) * 80}
                      x2="400"
                      y2={120 - (currentMetricData.baseline / (currentMetricData.baseline * 1.5)) * 80}
                      stroke="#94a3b8"
                      strokeWidth="1.5"
                      strokeDasharray="4,4"
                    />

                    {/* Live Line */}
                    <path
                      d={`M 0,${120 - (currentMetricData.history24h[0].value / (currentMetricData.baseline * 1.5)) * 80} 
                          C 50,${120 - (currentMetricData.history24h[0].value / (currentMetricData.baseline * 1.5)) * 80} 
                            50,${120 - (currentMetricData.history24h[1].value / (currentMetricData.baseline * 1.5)) * 80} 
                            100,${120 - (currentMetricData.history24h[1].value / (currentMetricData.baseline * 1.5)) * 80} 
                          C 150,${120 - (currentMetricData.history24h[1].value / (currentMetricData.baseline * 1.5)) * 80} 
                            150,${120 - (currentMetricData.history24h[2].value / (currentMetricData.baseline * 1.5)) * 80} 
                            200,${120 - (currentMetricData.history24h[2].value / (currentMetricData.baseline * 1.5)) * 80} 
                          C 250,${120 - (currentMetricData.history24h[2].value / (currentMetricData.baseline * 1.5)) * 80} 
                            250,${120 - (currentMetricData.history24h[3].value / (currentMetricData.baseline * 1.5)) * 80} 
                            300,${120 - (currentMetricData.history24h[3].value / (currentMetricData.baseline * 1.5)) * 80} 
                          C 350,${120 - (currentMetricData.history24h[3].value / (currentMetricData.baseline * 1.5)) * 80} 
                            350,${120 - (currentMetricData.history24h[4].value / (currentMetricData.baseline * 1.5)) * 80} 
                            400,${120 - (currentMetricData.history24h[4].value / (currentMetricData.baseline * 1.5)) * 80}`}
                      fill="none"
                      stroke="#1d4ed8"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />

                    {/* Data Points */}
                    {currentMetricData.history24h.map((pt, idx) => (
                      <circle
                        key={idx}
                        cx={idx * 100}
                        cy={120 - (pt.value / (currentMetricData.baseline * 1.5)) * 80}
                        r="4.5"
                        fill="#1d4ed8"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                      />
                    ))}
                  </svg>

                  {/* Horizontal Time Labels */}
                  <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-2">
                    {currentMetricData.history24h.map((pt, i) => (
                      <span key={i}>{pt.time} ({pt.value})</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 shrink-0 flex justify-between items-center">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-sm text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 transition-colors shadow-sm cursor-pointer ml-auto"
            id="telemetry-btn-close"
          >
            Acknowledge Feed & Close
          </button>
        </div>
      </div>
    </div>
  );
};
