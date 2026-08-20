import { useState } from 'react';
import { ChevronDown, ChevronUp, BarChart2 } from 'lucide-react';

export const MaintenanceHistoryTab = ({ history = [] }) => {
  const [trendMetric, setTrendMetric] = useState('cost'); // 'cost' or 'downtime'
  const [expandedEvents, setExpandedEvents] = useState({});

  const toggleExpand = (eventId) => {
    setExpandedEvents((prev) => ({ ...prev, [eventId]: !prev[eventId] }));
  };

  const getEventBadge = (type) => {
    switch (type) {
      case 'corrective':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'preventive':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  // Sort history records chronologically or reverse-chronologically by date safely
  const sortedHistory = [...history].sort((a, b) => new Date(b.date) - new Date(a.date));

  // Calculations for KPIs & Trend Summary
  const totalEvents = sortedHistory.length;
  const correctiveCount = sortedHistory.filter(h => h.type === 'corrective').length;
  const preventiveCount = sortedHistory.filter(h => h.type === 'preventive').length;
  
  const totalDowntime = sortedHistory.reduce((acc, curr) => acc + (curr.downtimeHours || 0), 0);
  const totalCost = sortedHistory.reduce((acc, curr) => acc + (curr.cost || 0), 0);
  const lastServicedDate = sortedHistory.length > 0 ? sortedHistory[0].date : 'N/A';

  const formatRM = (val) => `RM ${val.toLocaleString()}`;

  return (
    <div className="space-y-6 animate-fadeIn" id="maintenance-history-tab">
      
      {/* 1. REVISED KPI STATS ROW */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4" id="history-kpis">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Maintenance Events</span>
          <div>
            <span className="font-display font-extrabold text-2xl text-slate-800 block mt-1" id="kpi-total-wo">
              {totalEvents} Total
            </span>
            <div className="text-xs text-slate-500 font-sans mt-0.5">
              <span className="font-bold text-rose-600">{correctiveCount} Corrective</span> 
              <span className="mx-1 text-slate-300">·</span> 
              <span className="font-bold text-blue-600">{preventiveCount} Preventive</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Total Downtime</span>
          <span className="font-display font-extrabold text-2xl text-amber-600 block mt-1" id="kpi-total-downtime">
            {totalDowntime} hrs
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Total Maintenance Cost</span>
          <span className="font-display font-extrabold text-2xl text-slate-800 block mt-1" id="kpi-total-cost">
            {formatRM(totalCost)}
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Last Serviced</span>
          <span className="font-display font-extrabold text-lg text-slate-800 block mt-1 truncate" id="kpi-last-serviced">
            {lastServicedDate}
          </span>
        </div>
      </div>

      {/* 2. MAINTENANCE TRENDS SECTION */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-display font-bold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-blue-600" />
              Maintenance Trends
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {totalEvents} maintenance events · {formatRM(totalCost)} total cost
            </p>
          </div>
          
          <div className="bg-slate-100 p-1 rounded-lg flex items-center text-xs font-semibold">
            <button
              onClick={() => setTrendMetric('cost')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                trendMetric === 'cost' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Cost
            </button>
            <button
              onClick={() => setTrendMetric('downtime')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                trendMetric === 'downtime' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Downtime
            </button>
          </div>
        </div>

        {/* Visual Trend Bars (Rendered chronologically left-to-right) */}
        <div className="pt-2">
          {sortedHistory.length > 0 ? (
            <div className="w-full flex items-end justify-between h-40 gap-4 px-2">
              {[...sortedHistory].reverse().map((event, i) => {
                const maxVal = trendMetric === 'cost'
                  ? Math.max(...sortedHistory.map(h => h.cost || 0), 1)
                  : Math.max(...sortedHistory.map(h => h.downtimeHours || 0), 1);

                const currentVal = trendMetric === 'cost'
                  ? (event.cost || 0)
                  : (event.downtimeHours || 0);

                const heightPercent = Math.max(
                  (currentVal / maxVal) * 100,
                  8
                );

                return (
                  <div
                    key={i}
                    className="flex-1 min-w-[60px] flex flex-col items-center gap-2 group relative"
                  >
                    {/* Tooltip */}
                    <div className="absolute -top-10 bg-slate-900 text-white text-[10px] font-mono px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                      {event.date}: {trendMetric === 'cost'
                        ? formatRM(currentVal)
                        : `${currentVal} hrs`}
                    </div>

                    {/* Bar Area */}
                    <div className="w-full h-32 flex items-end justify-center">
                      <div
                        className={`w-full rounded-t-md transition-all duration-500 ${
                          trendMetric === 'cost'
                            ? 'bg-amber-500 group-hover:bg-amber-400'
                            : 'bg-amber-500 group-hover:bg-amber-400'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>

                    {/* Date Label */}
                    <span className="text-[10px] font-mono text-slate-500 text-center leading-tight">
                      {event.date}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400 text-xs italic">
              No trend data available.
            </div>
          )}
        </div>
      </div>

      {/* 3. SIMPLIFIED TIMELINE STREAM */}
      <div className="pt-2 flex items-center justify-between">
        <h3 className="font-display font-extrabold text-slate-800 text-sm uppercase tracking-wider">
          Maintenance Records
        </h3>
        <span className="text-xs font-mono text-slate-400">
          Showing {sortedHistory.length} event(s)
        </span>
      </div>
      <div className="relative border-l-2 border-slate-200 pl-6 ml-20 space-y-6" id="timeline-stream">
        {sortedHistory.length > 0 ? (
          sortedHistory.map((event) => {
            const isExpanded = !!expandedEvents[event.id];
            const partsCount = event.partsReplaced ? event.partsReplaced.length : 0;

            return (
              <div key={event.id} className="relative" id={`timeline-event-${event.id}`}>
                <span
                  className={`absolute -left-[70px] top-1 flex items-center justify-center w-16 h-6 rounded-md border bg-white text-[9px] font-mono font-bold ${
                    event.type === 'corrective'
                      ? 'border-rose-500 text-rose-500'
                      : event.type === 'preventive'
                      ? 'border-blue-500 text-blue-500'
                      : 'border-slate-400 text-slate-500'
                  }`}
                >
                  {event.date}
                </span>

                <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200">
                  
                  {/* Header */}
                  <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-400">{event.id}</span>
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${getEventBadge(event.type)}`}>
                          {event.type}
                        </span>
                      </div>
                      <h3 className="font-sans font-bold text-base text-slate-800 mt-1">
                        {event.description}
                      </h3>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-slate-400 font-mono block uppercase">Maintenance Date</span>
                      <span className="font-mono font-bold text-slate-700 text-xs">{event.date}</span>
                    </div>
                  </div>

                  {/* Default View Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 text-xs">
                    <div>
                      <span className="text-slate-400 block font-mono text-[10px] uppercase">Labor Duration</span>
                      <span className="font-sans font-semibold text-slate-700">{event.durationHours || 0} hrs</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block font-mono text-[10px] uppercase">Technician</span>
                      <span className="font-sans font-semibold text-slate-700">{event.technician || 'Assigned Tech'}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block font-mono text-[10px] uppercase">Downtime</span>
                      <span className="font-sans font-semibold text-slate-700">{event.downtimeHours || 0} hrs</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block font-mono text-[10px] uppercase">Cost</span>
                      <span className="font-sans font-semibold text-slate-700">{formatRM(event.cost || 0)}</span>
                    </div>
                  </div>

                  {/* Expandable Details Section */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-slate-100 space-y-4 animate-fadeIn text-xs">
                      <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-100">
                        <span className="font-mono font-bold text-[10px] text-slate-400 uppercase block mb-1">Full Maintenance Notes / Work Log</span>
                        <p className="text-slate-600 leading-relaxed">{event.notes || 'No detailed logs provided.'}</p>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Detailed Parts Replaced</span>
                        <div className="flex flex-wrap gap-1.5">
                          {event.partsReplaced && event.partsReplaced.length > 0 ? (
                            event.partsReplaced.map((part, idx) => (
                              <span key={idx} className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-medium">
                                {part}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-500 italic">None</span>
                          )}
                        </div>
                      </div>

                    </div>
                  )}

                  {/* Toggle Button */}
                  <div className="mt-4 pt-3 border-t border-slate-50 flex justify-between items-center">
                    <span className="text-[10px] font-mono text-slate-400">
                      {isExpanded ? 'Showing full work order data' : 'Click to inspect parts, labor, and work logs'}
                    </span>
                    <button
                      onClick={() => toggleExpand(event.id)}
                      className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                    >
                      <span>{isExpanded ? 'Hide Details' : 'View Details'}</span>
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  </div>

                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center p-8 text-slate-400 text-xs italic bg-white rounded-xl border border-slate-200">
            No historical maintenance records found for this equipment.
          </div>
        )}
      </div>

    </div>
  );
};
