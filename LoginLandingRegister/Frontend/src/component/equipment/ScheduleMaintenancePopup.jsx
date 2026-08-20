import React, { useState } from 'react';
import { X, Calendar, Wrench, AlertTriangle, ShieldCheck, User, Shield, Info, Clock, Check, Cpu, Lock } from 'lucide-react';

export const ScheduleMaintenancePopup = ({
  equipment,
  onClose,
  onConfirm,
  userRole,
}) => {
  const { id, name, predictedIssue, recommendedActionShort, failureWindow } = equipment;

  const isManager = userRole === 'manager';

  // Local form states
  const [mType, setMType] = useState('corrective');
  const [date, setDate] = useState('2026-07-15');
  const [time, setTime] = useState('08:00 AM');
  const [assignedTech, setAssignedTech] = useState('K. Salleh (Senior Hydraulic Tech)');
  const [priority, setPriority] = useState('CRITICAL');
  const [isApproved, setIsApproved] = useState(isManager);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onConfirm({
      mType,
      date,
      time,
      assignedTech,
      priority,
      isApproved: isManager ? isApproved : false, // Technicians cannot self-approve
    });
  };

  const techniciansList = [
    'K. Salleh (Senior Hydraulic Tech)',
    'A. Rahim (Powertrain Specialist)',
    'F. Rahman (General Systems Inspector)',
    'M. Hafiz (Telemetry Engineer)',
  ];

  return (
    <div
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn"
      id={`schedule-popup-${id}`}
    >
      <form
        onSubmit={handleFormSubmit}
        className="bg-white rounded-xl border border-slate-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col justify-between"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
          <div>
            <h2 className="font-display font-extrabold text-slate-900 text-lg tracking-tight" id="schedule-hdr">
              {isManager ? 'Schedule & Authorize Maintenance' : 'Submit Maintenance Recommendation'}
            </h2>
            <p className="text-xs text-slate-500 font-sans mt-0.5" id="schedule-hdr-sub">
              {id} — {name}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            id="schedule-close-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Diagnostic Banner */}
        <div className="px-6 py-3.5 bg-red-50/50 border-b border-red-100 space-y-1" id="schedule-warn-banner">
          <div className="flex items-center gap-2 text-rose-800 text-xs font-bold font-sans">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>Predicted Anomaly: {predictedIssue}</span>
          </div>
          <p className="text-xs text-slate-600 font-sans pl-6">
            Recommended Action: <span className="font-bold text-slate-800">{recommendedActionShort}</span>
          </p>
        </div>

        {/* Fields body */}
        <div className="p-6 space-y-6">
          {/* Role Guard Banner for Technicians */}
          {!isManager && (
            <div className="bg-amber-50 border border-amber-200 rounded-sm p-3.5 flex items-start gap-3">
              <Lock className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <div className="space-y-0.5 text-xs">
                <span className="font-bold text-amber-800 block">Technician Recommendation Mode</span>
                <p className="text-amber-700 leading-relaxed">
                  As a technician, you can propose target timelines and resource requirements below. Final schedule approval, priority enforcement, and dispatch authorization are restricted to Manager and Supervisor roles.
                </p>
              </div>
            </div>
          )}

          {/* STEP 1: MAINTENANCE TYPE */}
          <div className="space-y-2" id="step-1-type">
            <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block font-bold">
              1. Maintenance Type
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Preventive */}
              <div
                onClick={() => setMType('preventive')}
                className={`p-3.5 rounded-sm border-2 cursor-pointer transition-all ${
                  mType === 'preventive'
                    ? 'border-blue-500 bg-blue-50/20'
                    : 'border-slate-100 hover:bg-slate-50 bg-white'
                }`}
                id="type-preventive"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-sans font-bold text-xs text-slate-800">Preventive</span>
                  <Wrench className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <span className="text-[10px] text-slate-500 block leading-normal">
                  Routine schedules and general servicing checks.
                </span>
              </div>

              {/* Corrective (AI Suggested) */}
              <div
                onClick={() => setMType('corrective')}
                className={`relative p-3.5 rounded-sm border-2 cursor-pointer transition-all ${
                  mType === 'corrective'
                    ? 'border-rose-500 bg-rose-50/20'
                    : 'border-slate-100 hover:bg-slate-50 bg-white'
                }`}
                id="type-corrective"
              >
                <span className="absolute -top-2 right-2 bg-rose-600 text-white font-mono text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
                  Recommended
                </span>

                <div className="flex justify-between items-center mb-1">
                  <span className="font-sans font-bold text-xs text-slate-800">
                    Corrective
                  </span>
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                </div>

                <span className="text-[10px] text-slate-500 block leading-normal">
                  Recommended based on telemetry indicators and maintenance history.
                </span>
              </div>

              {/* Inspection */}
              <div
                onClick={() => setMType('inspection')}
                className={`p-3.5 rounded-sm border-2 cursor-pointer transition-all ${
                  mType === 'inspection'
                    ? 'border-blue-500 bg-blue-50/20'
                    : 'border-slate-100 hover:bg-slate-50 bg-white'
                }`}
                id="type-inspection"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-sans font-bold text-xs text-slate-800">Inspection</span>
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <span className="text-[10px] text-slate-500 block leading-normal">
                  Visual auditing and transmitter recalibrations.
                </span>
              </div>
            </div>
          </div>

          {/* STEP 2: SCHEDULE DETAILS */}
          <div className="space-y-2" id="step-2-details">
            <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block font-bold">
              2. Schedule Details
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-mono uppercase block">Target Date</label>
                <div className="relative">
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    disabled={!isManager}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-sm p-2.5 text-xs font-sans text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-mono uppercase block">Target Shift Time</label>
                <input
                  type="text"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="e.g. 08:00 AM"
                  disabled={!isManager}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-sm p-2.5 text-xs font-sans text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                />
              </div>
            </div>
            <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1 mt-1">
              <Clock className="w-3.5 h-3.5 text-blue-500" /> ESTIMATED DURATION: 2.5 HOURS ACTIVE LABOR
            </span>
          </div>

          {/* STEP 3: ASSIGNMENT & PRIORITY */}
          <div className="space-y-2" id="step-3-assignment">
            <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block font-bold">
              3. Assignment & Priority
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Technician Dropdown */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-mono uppercase block">Assign Technician</label>
                <select
                  value={assignedTech}
                  onChange={(e) => setAssignedTech(e.target.value)}
                  disabled={!isManager}
                  className="w-full bg-slate-50 border border-slate-200 rounded-sm p-2.5 text-xs font-sans text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                >
                  {techniciansList.map((tech) => (
                    <option key={tech} value={tech}>
                      {tech}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority Dropdown */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-mono uppercase block">Priority Level</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  disabled={!isManager}
                  className={`w-full bg-slate-50 border border-slate-200 rounded-sm p-2.5 text-xs font-sans text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors font-bold text-slate-900 ${
                    !isManager ? 'opacity-70 cursor-not-allowed bg-slate-100' : ''
                  }`}
                >
                  <option value="CRITICAL" className="text-red-600 font-bold">! CRITICAL (48h risk)</option>
                  <option value="HIGH" className="text-orange-600 font-bold">HIGH (PM-Cycle)</option>
                  <option value="MEDIUM" className="text-amber-600">MEDIUM (Routine)</option>
                  <option value="LOW" className="text-slate-500">LOW (Standard)</option>
                </select>
                {!isManager && (
                  <span className="text-[9px] text-slate-400 italic block mt-0.5">Scheduling and assignment are finalized by the maintenance manager.</span>
                )}
              </div>
            </div>

            {/* Manager Approval vs Technician Backlog Notice */}
            {isManager ? (
              <div className="bg-blue-50 border border-blue-100 rounded-sm p-3.5 flex items-center justify-between mt-3" id="manager-pre-approve">
                <div className="space-y-0.5">
                  <span className="text-[9px] font-mono text-blue-700 font-black uppercase block tracking-wider">
                    MANAGER EXECUTIVE APPROVAL
                  </span>
                  <p className="text-xs text-slate-600 leading-normal">
                    Authorize and dispatch this maintenance schedule directly to active operations.
                  </p>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="pre-approve-chk"
                    checked={isApproved}
                    onChange={(e) => setIsApproved(e.target.checked)}
                    className="w-4.5 h-4.5 text-blue-700 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
                  />
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 rounded-sm p-3.5 flex items-start gap-2.5 mt-3" id="tech-pre-approve-note">
                <Info className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  <span className="font-bold text-slate-700">Recommendation Dispatch Rule:</span> Submitting this form will log your recommendation into the supervisor review queue. Final approval and resource lock require manager sign-off.
                </p>
              </div>
            )}
          </div>

          {/* AI Predictive Insight Note */}
          <div className="bg-blue-50/60 rounded-sm p-4 border border-blue-100 flex items-start gap-3" id="schedule-risk-assessment">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />

            <div className="space-y-1">
              <span className="text-[10px] font-mono text-blue-700 font-bold uppercase tracking-wider block">
                Maintenance Risk Assessment
              </span>

              <p className="text-xs text-slate-600 leading-relaxed">
                Current telemetry indicators and maintenance history suggest an elevated risk of hydraulic cylinder wear if the equipment continues operating for another {failureWindow}. Scheduling maintenance promptly may reduce the likelihood of additional component damage and potential downtime costs.
              </p>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 shrink-0 flex justify-end gap-3 items-center">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 hover:border-slate-300 rounded-sm text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50 transition-all cursor-pointer"
            id="btn-cancel-schedule"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2 rounded-sm text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 transition-colors shadow-sm cursor-pointer"
            id="btn-confirm-schedule"
          >
            <Check className="w-4 h-4" />
            <span>{isManager ? 'Authorize & Schedule' : 'Submit Recommendation'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};