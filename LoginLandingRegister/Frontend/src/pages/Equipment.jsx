import { useState } from 'react';
import { equipmentList } from '../data/equipmentData';
import { MaintenanceHistoryTab } from '../component/equipment/MaintenanceHistoryTab';
import { MaintenanceGuideSection } from '../component/equipment/MaintenanceGuideSection';
import { TelemetryPopup } from '../component/equipment/TelemetryPopup';
import { ScheduleMaintenancePopup } from '../component/equipment/ScheduleMaintenancePopup';
import { AddEquipmentModal } from '../component/equipment/AddEquipment';
import { 
  Calendar, Sparkles, Plus, ChevronDown, Search, CircleCheck, CircleAlert, CircleX, 
  MapPin, ClipboardList, User,
  Settings, Clock, Wrench, Cpu, Briefcase, Sliders, ChevronUp, Info, Activity, ShieldAlert, AlertTriangle
} from 'lucide-react';

// ------------------------------------------------------------------
// UNIFIED EQUIPMENT HEALTH VIEW COMPONENT
// ------------------------------------------------------------------
export default function Equipment({ userRole }) {
  const [selectedEquipId, setSelectedEquipId] = useState(equipmentList[0]?.id || '');
  
  // Modal & Popup States
  const [isTelemetryOpen, setIsTelemetryOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isAddEquipmentOpen, setIsAddEquipmentOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(null);

  // Expandable Section States
  const [showSpecs, setShowSpecs] = useState(false);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const [showDataAvailability, setShowDataAvailability] = useState(false);
  const [showMaintenanceHistory, setShowMaintenanceHistory] = useState(false);
  const [isEquipmentPickerOpen, setIsEquipmentPickerOpen] = useState(false);
  const [equipmentSearch, setEquipmentSearch] = useState('');

  const selectedEquipment = equipmentList.find((e) => e.id === selectedEquipId) || equipmentList[0];

  const handleConfirmSchedule = (scheduledDetails) => {
    setIsScheduleOpen(false);
    setShowNotification(`SUCCESS: Work order generated for ${selectedEquipment.id}. Dispatched to ${scheduledDetails.assignedTech} under priority level [${scheduledDetails.priority}].`);
    setTimeout(() => setShowNotification(null), 5000);
  };

  const handleAddEquipment = (newEquipmentData) => {
    setIsAddEquipmentOpen(false);
    setShowNotification(`SUCCESS: ${newEquipmentData.id} has been registered to the fleet.`);
    setTimeout(() => setShowNotification(null), 5000);
  };

  if (!selectedEquipment) return <div>No Equipment Found</div>;

  // Equipment metrics and diagnosis inputs are supplied by equipmentData.js.
  const {
    status = 'normal',
    utilizationRate,
    availabilityRate,
    operatingHours,
    lastMaintenanceDate,
    downtimeMTD,
    nextScheduledMaintenanceDate,
    healthScore,
    failureRisk,
    confidenceScore,
    failureWindow,
    predictedIssue,
    recommendedActionShort,
    predictedDowntimeHours,
    aiAnalysis = {},
    assetInfo,
    telemetry,
    maintenanceHistory = []
  } = selectedEquipment;

  const formatRM = (val) => `RM ${Math.round(val || 0).toLocaleString()}`;
  const metricValue = (value, suffix = '') => value == null ? '—' : `${value}${suffix}`;
  const acquisition = assetInfo?.acquisition;
  const lifecycle = assetInfo?.lifecycle;
  const maintenance = assetInfo?.maintenance;
  const repairDecision = assetInfo?.repairDecision;
  const downtimeEconomics = assetInfo?.downtimeEconomics;
  const decisionRationale = assetInfo?.decisionRationale;
  const diagnosisAvailable = Boolean(selectedEquipment.aiAnalysis);
  const hasActionableDiagnosis = diagnosisAvailable
    && status !== 'normal'
    && (Boolean(predictedIssue) || Boolean(aiAnalysis.primaryTrigger?.label));
  const diagnosticDataAvailability = [
    ['Root cause', Boolean(aiAnalysis.rootCauseAnalysis)],
    ['Primary indicator', Boolean(aiAnalysis.primaryTrigger?.label)],
    ['Secondary indicator', Boolean(aiAnalysis.secondaryEffect?.label)],
    ['Telemetry correlation', Boolean(aiAnalysis.sensorCorrelationInsights?.length)],
    ['BER threshold inputs', acquisition?.purchaseCost != null && repairDecision?.berThresholdPercent != null],
    ['Repair vs. replace', Boolean(repairDecision?.recommendation)],
    ['Remaining useful life', lifecycle?.remainingUsefulLifeYears != null],
    ['Downtime cost rate', downtimeEconomics?.downtimeCostPerHour != null],
    ['Cost avoidance', downtimeEconomics?.estimatedDowntimeAvoidedHours != null && downtimeEconomics?.downtimeCostPerHour != null],
  ];
  const relevantTelemetry = (telemetry || [])
    .filter((sensor) => sensor?.status && sensor.status !== 'normal')
    .slice(0, 4);
  const telemetrySummary = relevantTelemetry.length > 0 ? relevantTelemetry : (telemetry || []).slice(0, 4);
  const filteredEquipment = equipmentList.filter((equipment) => {
    const query = equipmentSearch.trim().toLowerCase();
    return !query || [equipment.id, equipment.name, equipment.location]
      .some((value) => value?.toLowerCase().includes(query));
  });
  const statusConfig = {
    critical: { label: 'Critical', Icon: CircleX, className: 'text-rose-600' },
    warning: { label: 'Warning', Icon: CircleAlert, className: 'text-amber-600' },
    normal: { label: 'Normal', Icon: CircleCheck, className: 'text-emerald-600' },
  };
  const currentStatus = statusConfig[status] || statusConfig.normal;
  const CurrentStatusIcon = currentStatus.Icon;
  const getRelativeDays = (dateString) => {
    if (!dateString) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(`${dateString}T00:00:00`);
    return Number.isNaN(date.getTime()) ? null : Math.round((date - today) / 86400000);
  };
  const nextMaintenanceDays = getRelativeDays(nextScheduledMaintenanceDate);
  const nextMaintenanceLabel = nextMaintenanceDays == null ? 'Not scheduled' : nextMaintenanceDays < 0 ? `Service overdue by ${Math.abs(nextMaintenanceDays)} day${Math.abs(nextMaintenanceDays) === 1 ? '' : 's'}` : nextMaintenanceDays === 0 ? 'Service due today' : `Service due in ${nextMaintenanceDays} day${nextMaintenanceDays === 1 ? '' : 's'}`;
  const lastServiceDays = getRelativeDays(lastMaintenanceDate);
  const lastServiceLabel = lastServiceDays == null ? 'Last service unavailable' : lastServiceDays <= 0 ? `Last serviced ${Math.abs(lastServiceDays)} day${Math.abs(lastServiceDays) === 1 ? '' : 's'} ago` : `Last service scheduled in ${lastServiceDays} days`;

  const selectEquipment = (equipmentId) => {
    setSelectedEquipId(equipmentId);
    setEquipmentSearch('');
    setIsEquipmentPickerOpen(false);
  };
  const berThreshold = acquisition?.purchaseCost != null && repairDecision?.berThresholdPercent != null
    ? acquisition.purchaseCost * (repairDecision.berThresholdPercent / 100)
    : null;
  const hasRepairComparison = repairDecision?.estimatedRepairCost != null && berThreshold != null;
  const repairShareOfThreshold = hasRepairComparison
    ? (repairDecision.estimatedRepairCost / berThreshold) * 100
    : null;
  const potentialDowntimeExposure = predictedDowntimeHours != null && downtimeEconomics?.downtimeCostPerHour != null
    ? predictedDowntimeHours * downtimeEconomics.downtimeCostPerHour
    : null;
  const estimatedCostAvoidance = downtimeEconomics?.estimatedDowntimeAvoidedHours != null && downtimeEconomics?.downtimeCostPerHour != null
    ? downtimeEconomics.estimatedDowntimeAvoidedHours * downtimeEconomics.downtimeCostPerHour
    : null;
  const calculatedRecommendation = hasRepairComparison
    ? (repairDecision.estimatedRepairCost < berThreshold ? 'repair' : 'replace')
    : repairDecision?.recommendation;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50">
      
      {/* Toast Notification */}
      {showNotification && (
        <div className="bg-emerald-600 text-white text-xs px-6 py-3 flex items-center gap-2 shrink-0 animate-fadeIn z-50 shadow-md">
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>{showNotification}</span>
        </div>
      )}

      {/* COMPACT HEADER & TOP-LEVEL SELECTOR */}
      <header className="bg-white border-b-2 border-slate-200 px-6 py-4 shrink-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto space-y-3">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Searchable fleet asset selector */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsEquipmentPickerOpen((open) => !open)}
                  aria-expanded={isEquipmentPickerOpen}
                  aria-haspopup="listbox"
                  className="min-w-[260px] w-full flex items-center justify-between gap-3 bg-slate-100 border-2 border-slate-300 text-slate-900 font-display font-black text-left py-2 pl-4 pr-3 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 cursor-pointer shadow-sm"
                >
                  <span className="truncate flex items-center gap-2"><CurrentStatusIcon className={`w-4 h-4 shrink-0 ${currentStatus.className}`} /> {selectedEquipment.id} — {selectedEquipment.name}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-500 shrink-0 transition-transform ${isEquipmentPickerOpen ? 'rotate-180' : ''}`} />
                </button>

                {isEquipmentPickerOpen && (
                  <div className="absolute left-0 top-full mt-2 z-30 w-full min-w-[320px] bg-white border-2 border-slate-200 rounded-xl shadow-xl overflow-hidden">
                    <div className="p-3 border-b border-slate-200">
                      <label className="sr-only" htmlFor="equipment-search">Search equipment</label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          id="equipment-search"
                          type="search"
                          value={equipmentSearch}
                          onChange={(event) => setEquipmentSearch(event.target.value)}
                          onKeyDown={(event) => event.key === 'Escape' && setIsEquipmentPickerOpen(false)}
                          autoFocus
                          placeholder="Search ID, name, or location"
                          className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm text-slate-800 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                        />
                      </div>
                    </div>
                    <div className="max-h-80 overflow-y-auto p-2" role="listbox" aria-label="Equipment">
                      {filteredEquipment.map((equipment) => {
                        const isSelected = equipment.id === selectedEquipId;
                        const equipmentStatus = statusConfig[equipment.status] || statusConfig.normal;
                        const EquipmentStatusIcon = equipmentStatus.Icon;
                        return (
                          <button
                            key={equipment.id}
                            type="button"
                            role="option"
                            aria-selected={isSelected}
                            onClick={() => selectEquipment(equipment.id)}
                            className={`w-full rounded-lg border p-3 text-left transition-colors ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-transparent hover:border-slate-200 hover:bg-slate-50'}`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="text-sm font-black text-slate-900 truncate flex items-center gap-1.5"><EquipmentStatusIcon className={`w-4 h-4 shrink-0 ${equipmentStatus.className}`} /> {equipment.id} <span className="font-semibold">— {equipment.name}</span></p>
                                <p className="mt-1 text-xs text-slate-500 truncate">{equipment.location || 'Location unavailable'}</p>
                              </div>
                              <span className={`shrink-0 text-xs font-mono font-black ${equipment.healthScore < 50 ? 'text-red-600' : equipment.healthScore < 75 ? 'text-amber-600' : 'text-emerald-600'}`}>{equipment.healthScore ?? '—'}% health</span>
                            </div>
                          </button>
                        );
                      })}
                      {filteredEquipment.length === 0 && <p className="p-4 text-center text-xs text-slate-500">No equipment matches “{equipmentSearch}”.</p>}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Status Badge */}
              <span className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider border-2 flex items-center gap-1.5 ${
                status === 'critical' ? 'bg-red-50 text-red-700 border-red-200' : 
                status === 'warning' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}>
                <span className={`w-2 h-2 rounded-full ${status === 'critical' ? 'bg-red-500 animate-ping' : status === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                {status}
              </span>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsAddEquipmentOpen(true)}
                className="hidden md:flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-600 bg-white border-2 border-dashed border-slate-300 rounded-lg hover:border-blue-400 hover:text-blue-700 transition-colors cursor-pointer"
              >
                <Plus size={14} /> Add Asset
              </button>
              <button 
                onClick={() => setIsScheduleOpen(true)} 
                className="flex items-center gap-1.5 px-5 py-2 rounded-lg text-xs font-bold text-white bg-blue-700 border-2 border-blue-700 hover:bg-blue-800 transition-colors cursor-pointer shadow-sm"
              >
                <Calendar className="w-4 h-4" /> <span>Dispatch Repair</span>
              </button>
            </div>
          </div>

          {/* COLLAPSIBLE EQUIPMENT SPECIFICATIONS BAR */}
          <div className="border-t-2 border-slate-100 pt-2">
            <button
              onClick={() => setShowSpecs(!showSpecs)}
              className="w-full flex items-center justify-between text-xs font-bold text-slate-600 hover:text-blue-700 py-1 cursor-pointer transition-colors"
            >
              <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
                <span className="font-black uppercase tracking-wider text-slate-700 flex items-center gap-1">
                  <Sliders size={13} className="text-blue-600" /> Asset Specs
                </span>
                <span className="text-slate-400">|</span>
                <span>{selectedEquipment.model} ({selectedEquipment.serialNumber})</span>
                <span className="text-slate-400 hidden sm:inline">|</span>
                <span className="hidden sm:inline">Location: {selectedEquipment.location}</span>
              </div>
              <span className="text-blue-600 font-bold flex items-center gap-1">
                {showSpecs ? 'Hide Details' : 'Expand Details'} {showSpecs ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </span>
            </button>

            {showSpecs && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 border-2 border-slate-200 p-4 rounded-xl mt-2 animate-fadeIn">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">Model & Serial</span>
                  <span className="font-mono text-xs font-bold text-slate-900 block">{selectedEquipment.model}</span>
                  <span className="text-[11px] text-slate-600 font-mono block">{selectedEquipment.serialNumber}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">Location & Fleet</span>
                  <span className="font-sans text-xs font-bold text-slate-900 block flex items-center gap-1">
                    <MapPin size={12} className="text-slate-400" /> {selectedEquipment.location}
                  </span>
                  <span className="text-[11px] text-slate-600 block">Fleet: {selectedEquipment.fleet}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">Current Operator</span>
                  <span className="font-sans text-xs font-bold text-slate-900 block flex items-center gap-1">
                    <User size={12} className="text-slate-400" /> {selectedEquipment.currentOperator || 'Unassigned'}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">Operating Hours</span>
                  <span className="font-mono text-xs font-bold text-slate-900 block">
                    {operatingHours.toLocaleString()} <span className="font-sans font-normal text-slate-500">hrs</span>
                  </span>
                </div>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* MAIN UNIFIED SCROLLABLE DASHBOARD CONTENT */}
      <main className="flex-1 overflow-y-auto w-full">
        <div className="max-w-7xl mx-auto p-4 space-y-6">
          
          {/* 1. CLEAR DATA-DRIVEN KPI CARDS */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            
            {/* Health Score */}
            <div className="bg-white border-2 border-slate-200 rounded-xl p-4 flex flex-col justify-between gap-2 shadow-sm">
              <div>
                <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                  <ShieldAlert className="w-4 h-4 text-emerald-600" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Health Score</span>
                </div>
                <span className="font-mono text-xl font-black text-slate-900 tracking-tight">
                  {metricValue(healthScore, '%')}
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                <div className={`h-1.5 rounded-full ${healthScore > 75 ? 'bg-emerald-500' : healthScore > 40 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${healthScore || 0}%` }}></div>
              </div>
            </div>

            {/* Failure Risk */}
            <div className="bg-white border-2 border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Failure Risk</span>
                </div>
                <span className={`font-mono text-sm font-black tracking-tight ${status === 'critical' ? 'text-red-600' : status === 'warning' ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {metricValue(failureRisk, '%')}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 mt-2 font-medium">Based on real-time anomaly models</span>
            </div>

            {/* Availability */}
            <div className="bg-white border-2 border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                  <Activity className="w-4 h-4 text-blue-600" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Availability</span>
                </div>
                <span className="font-mono text-xl font-black text-slate-900 tracking-tight">
                  {metricValue(availabilityRate, '%')}
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${availabilityRate || 0}%` }}></div>
              </div>
            </div>

            {/* Utilization */}
            <div className="bg-white border-2 border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Utilization</span>
                </div>
                <span className="font-mono text-xl font-black text-slate-900 tracking-tight">
                  {metricValue(utilizationRate, '%')}
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${utilizationRate || 0}%` }}></div>
              </div>
            </div>

            {/* Downtime (Actual vs Predicted) */}
            <div className="bg-white border-2 border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                  <Settings className="w-4 h-4 text-rose-500" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Downtime MTD</span>
                </div>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="font-mono text-lg font-black text-slate-900">{metricValue(downtimeMTD, 'h')}</span>
                  <span className="text-[10px] text-rose-600 font-bold">(Pred: {metricValue(predictedDowntimeHours, 'h')})</span>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 font-medium">Actual vs AI Forecast</span>
            </div>

            {/* Next Service */}
            <div className="bg-white border-2 border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                  <Wrench className="w-4 h-4 text-blue-600" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Next Maintenance</span>
                </div>
                <span className="font-mono text-sm font-black text-slate-900">
                  {nextMaintenanceLabel}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 leading-relaxed mt-1 block" title={recommendedActionShort}>
                {nextScheduledMaintenanceDate ? `${nextScheduledMaintenanceDate} · ${lastServiceLabel}` : (recommendedActionShort || 'No maintenance action scheduled')}
              </span>
            </div>

          </div>

          {/* 2. CORE TELEMETRY SUMMARY */}
          {telemetrySummary.length > 0 && (
            <div className="bg-white border-2 border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  <h3 className="font-display font-black text-slate-900 text-sm uppercase tracking-wider">Live Telemetry Summary</h3>
                </div>
                <button 
                  onClick={() => setIsTelemetryOpen(true)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                >
                  View Detailed Telemetry &rarr;
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {telemetrySummary.map((sensor, idx) => (
                  <div key={idx} className={`p-3.5 rounded-xl border-2 ${sensor.status !== 'normal' ? 'bg-amber-50 border-amber-300' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase text-slate-500 block truncate">{sensor.name}</span>
                      <span className={`w-2 h-2 rounded-full ${sensor.status !== 'normal' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                    </div>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className={`font-mono text-xl font-black ${sensor.status !== 'normal' ? 'text-amber-800' : 'text-slate-900'}`}>
                        {sensor.currentValue}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">{sensor.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. INLINE AI DIAGNOSTICS & ABNORMAL CONDITIONS */}
          {diagnosisAvailable && (
            <div className="bg-white border-2 border-indigo-200 rounded-xl p-6 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-indigo-600 text-white font-mono text-[10px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-widest">
                AI Diagnostics Active
              </div>

              <div className="flex items-center gap-2 mb-3">
                <Cpu className="w-5 h-5 text-indigo-600 animate-pulse" />
                <h3 className="font-display font-black text-slate-900 text-sm uppercase tracking-wider">
                  AI Diagnostic Insights & Recommended Action
                </h3>
              </div>
              
              <p className="font-sans text-sm text-slate-800 leading-relaxed font-medium mb-5 bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                {aiAnalysis.rootCauseAnalysis || 'The AI model has not supplied a root-cause narrative for this prediction yet.'}
              </p>

              {/* Key Indicators Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                <div className="bg-rose-50 border-2 border-rose-200 rounded-xl p-4">
                  <span className="text-[10px] font-mono font-black text-rose-700 uppercase block tracking-wider">
                    [Predicted Issue & Confidence]
                  </span>
                  <span className="font-sans font-bold text-sm text-slate-900 block mt-1">
                    {predictedIssue || aiAnalysis.primaryTrigger?.label || 'No failure mode identified'}
                  </span>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs font-mono font-bold bg-rose-200 text-rose-900 px-2 py-0.5 rounded">
                      Risk: {metricValue(failureRisk, '%')}
                    </span>
                    <span className="text-xs font-mono font-bold bg-slate-200 text-slate-800 px-2 py-0.5 rounded">
                      Confidence: {metricValue(confidenceScore, '%')}
                    </span>
                  </div>
                </div>

                <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
                  <span className="text-[10px] font-mono font-black text-amber-800 uppercase block tracking-wider">
                    [Primary Indicator]
                  </span>
                  <span className="font-sans font-bold text-sm text-slate-900 block mt-1">{aiAnalysis.primaryTrigger?.label || 'No primary indicator reported'}</span>
                  <p className="text-xs text-slate-600 mt-1">{aiAnalysis.primaryTrigger?.description || 'Awaiting supporting sensor evidence.'}</p>
                </div>

                <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
                  <span className="text-[10px] font-mono font-black text-amber-800 uppercase block tracking-wider">[Secondary Indicator]</span>
                  <span className="font-sans font-bold text-sm text-slate-900 block mt-1">{aiAnalysis.secondaryEffect?.label || 'No secondary indicator reported'}</span>
                  <p className="text-xs text-slate-600 mt-1">{aiAnalysis.secondaryEffect?.description || 'No secondary effect has been recorded.'}</p>
                </div>

                <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4">
                  <span className="text-[10px] font-mono font-black text-emerald-800 uppercase block tracking-wider">[Recommended Action]</span>
                  <span className="font-sans font-bold text-sm text-slate-900 block mt-1">{aiAnalysis.recommendedActionSOP || recommendedActionShort || 'Continue monitoring and follow the planned maintenance interval.'}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6 bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs">
                <div><span className="font-mono font-bold uppercase text-slate-400 block">Predicted window</span><span className="font-bold text-slate-800">{failureWindow || aiAnalysis.operationalImpact?.resolutionWindow?.label || 'Not available'}</span></div>
                <div><span className="font-mono font-bold uppercase text-slate-400 block">Predicted downtime</span><span className="font-bold text-slate-800">{metricValue(predictedDowntimeHours, ' hours')}</span></div>
                <div><span className="font-mono font-bold uppercase text-slate-400 block">Potential downtime exposure</span><span className="font-bold text-slate-800">{potentialDowntimeExposure == null ? 'Not available' : formatRM(potentialDowntimeExposure)}</span><p className="text-[10px] text-slate-500 mt-1">{potentialDowntimeExposure == null ? 'Requires downtime cost rate' : `${predictedDowntimeHours}h × ${formatRM(downtimeEconomics.downtimeCostPerHour)}/h`}</p></div>
                <div className="md:col-span-3 border-t border-slate-200 pt-3"><span className="font-mono font-bold uppercase text-slate-400 block">Operational impact</span><span className="font-bold text-slate-800">{aiAnalysis.operationalImpact?.risk?.label || 'Impact assessment pending'}</span><p className="text-slate-600 mt-1">{aiAnalysis.operationalImpact?.risk?.description || aiAnalysis.operationalImpact?.slaImpact?.description || 'No operational impact detail is available.'}</p></div>
              </div>

              <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50">
                <div className="flex items-center justify-between gap-3">
                  <button onClick={() => setShowDataAvailability((show) => !show)} className="w-full p-4 flex items-center justify-between gap-3 text-left cursor-pointer">
                    <div><h4 className="text-xs font-black uppercase tracking-wider text-slate-700">Data Availability</h4><p className="mt-1 text-xs text-slate-500">Optional detail on evidence and valuation inputs.</p></div>
                    <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-slate-500">{diagnosticDataAvailability.filter(([, available]) => available).length}/{diagnosticDataAvailability.length} available {showDataAvailability ? <ChevronUp size={14} /> : <ChevronDown size={14} />}</span>
                  </button>
                </div>
                {showDataAvailability && <div className="px-4 pb-4 animate-fadeIn"><div className="flex flex-wrap gap-2">{diagnosticDataAvailability.map(([label, available]) => <span key={label} className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${available ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-amber-200 bg-amber-50 text-amber-800'}`}>{available ? 'Available' : 'Missing'}: {label}</span>)}</div>{diagnosticDataAvailability.some(([, available]) => !available) && <p className="mt-3 text-xs text-amber-800">What’s missing: asset valuation inputs are needed to complete BER, repair-versus-replace, lifecycle, and cost-avoidance analysis.</p>}</div>}
              </div>

              {/* Technical Details Toggle */}
              <div className="border-t-2 border-slate-100 pt-3">
                <button
                  onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                >
                  <Sliders size={14} />
                  <span>{showTechnicalDetails ? 'Hide Advanced AI Analysis' : 'View Advanced AI Analysis'}</span>
                  {showTechnicalDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
                
                {showTechnicalDetails && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4 animate-fadeIn">
                    <div className="space-y-3">
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-tight">Key Contributing Factors</h4>
                      <div className="space-y-2.5">
                        {aiAnalysis.topPredictionFactors?.map((factor, i) => (
                          <div key={i} className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-sans font-bold text-slate-800">{factor.factor}</span>
                              <span className="font-mono font-black text-slate-900">+{factor.impact}% Impact</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-1.5">
                              <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${factor.impact}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-tight">Sensor Correlation Matrix</h4>
                      <div className="space-y-2">
                        {aiAnalysis.sensorCorrelationInsights?.map((insight, i) => (
                          <div key={i} className="flex items-start gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                            <Info className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                            <div>
                              <span className="font-black text-slate-900">{insight.sensors}</span> (r = {insight.correlation})
                              <p className="text-slate-600 mt-0.5">{insight.insight}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-tight">Recurring Failure Patterns</h4>
                      <div className="space-y-2">
                        {(aiAnalysis.recurringFailurePatterns || []).map((pattern, i) => (
                          <div key={i} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"><span className="font-black text-slate-900">{pattern.event}</span><span className="ml-2 text-slate-400">{pattern.date}</span><p className="text-slate-600 mt-0.5">{pattern.notes}</p></div>
                        ))}
                        {!(aiAnalysis.recurringFailurePatterns || []).length && <p className="text-xs text-slate-500">No recurring patterns reported.</p>}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 4. TECHNICIAN MAINTENANCE GUIDANCE — generated from the diagnosis above */}
          {hasActionableDiagnosis && (
            <div className="border-t-2 border-indigo-100 pt-6">
              <div className="flex items-center gap-2 mb-3 text-xs text-indigo-700 font-semibold">
                <Cpu className="w-4 h-4" />
                <span>Technician Action · AI-Guided Maintenance Procedure based on the detected issue and telemetry evidence above.</span>
              </div>
              <MaintenanceGuideSection
                equipmentId={selectedEquipment.id}
                predictedIssue={predictedIssue || aiAnalysis.primaryTrigger?.label}
              />
            </div>
          )}

          {/* 5. MANAGER DECISION SUPPORT (If Manager Role) */}
          {userRole === 'manager' && (
            <div className="bg-white text-slate-900 rounded-xl border-2 border-slate-300 shadow-md overflow-hidden">
              <div className="bg-slate-100 px-6 py-4 border-b-2 border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-display font-black text-slate-900 text-sm uppercase tracking-wider">
                    Manager Decision Support & Financial Rationale
                  </h3>
                </div>
                <span className="text-[10px] font-mono font-black bg-indigo-100 text-indigo-800 border border-indigo-300 px-2.5 py-1 rounded uppercase tracking-wide">
                  Repair vs. Replace
                </span>
              </div>

              <div className="p-6 space-y-5">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1 space-y-2">
                    <span className="text-[11px] text-slate-500 font-mono font-bold uppercase tracking-widest block">
                      Recommendation
                    </span>
                    <span className={`inline-block px-4 py-2 text-xs font-mono font-black uppercase rounded-lg border-2 ${
                      calculatedRecommendation === 'repair' ? 'bg-emerald-100 text-emerald-800 border-emerald-400' : calculatedRecommendation ? 'bg-rose-100 text-rose-800 border-rose-400' : 'bg-slate-100 text-slate-600 border-slate-300'
                    }`}>
                      {calculatedRecommendation === 'repair' ? 'Repair is Preferred' : calculatedRecommendation ? 'Evaluate Replacement' : 'Analysis unavailable'}
                    </span>
                  </div>
                  <div className="flex-[2] bg-slate-50 border-2 border-slate-200 p-4 rounded-xl">
                    <span className="text-[11px] text-slate-500 font-mono font-bold uppercase tracking-widest block mb-1">
                      Economic Analysis Rationale
                    </span>
                    <p className="font-sans text-sm text-slate-800 leading-relaxed font-medium">
                      {decisionRationale?.recommendationReason || 'Requires asset valuation data to assess repair versus replacement.'}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border-2 border-indigo-100 bg-indigo-50/50 p-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                      <span className="text-[11px] text-indigo-700 font-mono font-bold uppercase tracking-widest block">Repair-versus-replace calculation</span>
                      <p className="mt-1 text-xs text-slate-600">BER Threshold = Purchase Cost × BER %. Repair is preferred when Estimated Repair Cost is below the BER Threshold.</p>
                      {berThreshold != null && <p className="mt-1 text-xs font-mono text-indigo-800">{formatRM(acquisition.purchaseCost)} × {repairDecision.berThresholdPercent}% = {formatRM(berThreshold)}</p>}
                    </div>
                    <span className={`w-fit rounded-lg border px-3 py-1.5 text-xs font-mono font-black ${hasRepairComparison ? repairDecision.estimatedRepairCost < berThreshold ? 'border-emerald-300 bg-emerald-50 text-emerald-800' : 'border-rose-300 bg-rose-50 text-rose-800' : 'border-slate-300 bg-slate-100 text-slate-600'}`}>
                      {hasRepairComparison ? `${formatRM(repairDecision.estimatedRepairCost)} ÷ ${formatRM(berThreshold)} = ${repairShareOfThreshold.toFixed(1)}%` : 'Calculation unavailable'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 pt-1">
                  <div className="rounded-xl border border-rose-100 bg-rose-50/30 p-4 space-y-1">
                    <span className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-widest block">Estimated Repair Cost</span>
                    <span className="font-mono font-black text-lg text-slate-900 block">{repairDecision?.estimatedRepairCost == null ? 'Not available' : formatRM(repairDecision.estimatedRepairCost)}</span>
                    <p className="text-[11px] text-slate-500">Estimated cost of current repair</p>
                  </div>
                  <div className="rounded-xl border border-indigo-100 bg-indigo-50/30 p-4 space-y-1">
                    <span className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-widest block">BER Threshold</span>
                    <span className="font-mono font-black text-lg text-slate-900 block">{berThreshold == null ? 'Not available' : formatRM(berThreshold)}</span>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-indigo-100">
                      <div className={`h-full rounded-full ${hasRepairComparison && repairDecision.estimatedRepairCost >= berThreshold ? 'bg-rose-500' : 'bg-indigo-500'}`} style={{ width: `${repairShareOfThreshold == null ? 0 : Math.min(repairShareOfThreshold, 100)}%` }} />
                    </div>
                    <p className="text-[11px] text-slate-500">Replacement becomes more economical above this point ({repairDecision?.berThresholdPercent ?? '—'}% of purchase cost)</p>
                  </div>
                  <div className="rounded-xl border border-amber-100 bg-amber-50/30 p-4 space-y-1">
                    <span className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-widest block">Historical Maintenance Spend</span>
                    <span className="font-mono font-black text-lg text-slate-900 block">{maintenance?.maintenanceSpendToDate == null ? 'Not available' : formatRM(maintenance.maintenanceSpendToDate)}</span>
                    <p className="text-[11px] text-slate-500">Total spent since purchase; the timeline shows recent records only</p>
                  </div>
                  <div className="rounded-xl border border-emerald-100 bg-emerald-50/30 p-4 space-y-1">
                    <span className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-widest block">Cost Avoidance Savings</span>
                    <span className="font-mono font-black text-lg text-emerald-700 block">{estimatedCostAvoidance == null ? 'Not available' : formatRM(estimatedCostAvoidance)}</span>
                    <p className="text-[11px] text-slate-500">{estimatedCostAvoidance == null ? 'Requires downtime data' : `${downtimeEconomics.estimatedDowntimeAvoidedHours}h avoided × ${formatRM(downtimeEconomics.downtimeCostPerHour)}/h`}</p>
                  </div>
                  <div className="rounded-xl border border-blue-100 bg-blue-50/30 p-4 space-y-1">
                    <span className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-widest block">Remaining Useful Life</span>
                    <span className="font-mono font-black text-lg text-slate-900 block">{lifecycle?.remainingUsefulLifeYears == null ? 'Not available' : `${lifecycle.remainingUsefulLifeYears} yrs`}</span>
                    <p className="text-[11px] text-slate-500">Estimated productive service remaining</p>
                  </div>
                  <div className="rounded-xl border border-rose-100 bg-rose-50/30 p-4 space-y-1">
                    <span className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-widest block">Potential Financial Exposure</span>
                    <span className="font-mono font-black text-lg text-rose-700 block">{potentialDowntimeExposure == null ? 'Not available' : formatRM(potentialDowntimeExposure)}</span>
                    <p className="text-[11px] text-slate-500">{potentialDowntimeExposure == null ? 'Requires downtime data' : `${predictedDowntimeHours}h predicted downtime × ${formatRM(downtimeEconomics.downtimeCostPerHour)}/h`}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 6. EXPANDABLE MAINTENANCE HISTORY BLOCK */}
          <div className="bg-white border-2 border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <button
              onClick={() => setShowMaintenanceHistory(!showMaintenanceHistory)}
              className="w-full px-6 py-4 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-left transition-colors cursor-pointer border-b-2 border-slate-200"
            >
              <div className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-slate-600" />
                <div>
                  <h3 className="font-display font-black text-slate-900 text-sm uppercase tracking-wider">Maintenance History & Work Orders</h3>
                  <p className="text-xs text-slate-500 font-medium">{maintenanceHistory.length} past service records logged for this asset</p>
                </div>
              </div>
              <span className="text-xs font-bold text-blue-600 flex items-center gap-1">
                {showMaintenanceHistory ? 'Collapse History' : 'Expand History'} {showMaintenanceHistory ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </span>
            </button>

            {showMaintenanceHistory && (
              <div className="p-6 bg-white animate-fadeIn">
                <MaintenanceHistoryTab history={maintenanceHistory} />
              </div>
            )}
          </div>

        </div>
      </main>

      {/* Popups and Overlays */}
      {isTelemetryOpen && (
        <TelemetryPopup 
          equipment={selectedEquipment} 
          onClose={() => setIsTelemetryOpen(false)} 
          userRole={userRole} 
        />
      )}
      
      {isScheduleOpen && (
        <ScheduleMaintenancePopup 
          equipment={selectedEquipment} 
          onClose={() => setIsScheduleOpen(false)} 
          onConfirm={handleConfirmSchedule} 
          userRole={userRole} 
        />
      )}
      
      <AddEquipmentModal 
        isOpen={isAddEquipmentOpen} 
        onClose={() => setIsAddEquipmentOpen(false)} 
        onAdd={handleAddEquipment} 
      />
      
    </div>
  );
}
