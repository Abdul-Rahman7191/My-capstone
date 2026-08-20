import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Wrench, 
  Clock, 
  AlertTriangle, 
  UserCheck,
  CheckCircle,
  User,
  Package,
  ShieldCheck,
  HardHat,
  FileText,
  Save,
  MessageSquare,
  X,
  PieChart,
  Info
} from 'lucide-react';

export default function MaintenanceControl({ userRole }) {
  // --- ROLE DETECTION FROM PROPS (Fallback to 'technician' if not provided) ---
  const normalizedRole = (userRole || 'technician').toLowerCase();
  const currentRole = normalizedRole === 'manager' ? 'Manager' : 'Technician';

  // --- SHIFT CAPACITY CONFIG (CMMS STANDARD) ---
  const SHIFT_CAPACITY_HOURS = 8.0;

  // --- CORE SYSTEM DATA STATE ---
  const [activeWorkOrders, setActiveWorkOrders] = useState([
    { id: 'WO-2941', title: 'Hydraulic Press Calibration', location: 'Line A / Sector 4', technician: 'Sarah Jenkins', timeLeft: '45m left', priority: 'URGENT', progress: 80, isOverdue: true, day: 'THU', date: 'Jul 16', completed: false, hours: 2.5 },
    { id: 'WO-2942', title: 'Conveyor Belt Bearing Swap', location: 'Packaging / Zone B', technician: 'Marcus King', timeLeft: '2h 15m left', priority: 'STANDARD', progress: 40, isOverdue: false, day: 'FRI', date: 'Jul 17', completed: false, hours: 3.0 },
    { id: 'WO-3102', title: 'HVAC Filter Swap', location: 'HVAC Unit 3', technician: 'Sarah Jenkins', timeLeft: '4h left', priority: 'HIGH', progress: 0, isOverdue: false, day: 'THU', date: 'Jul 16', completed: false, hours: 1.5 },
    { id: 'WO-3103', title: 'Hydraulic Seals Check', location: 'Press Line A', technician: 'Sarah Jenkins', timeLeft: '1d left', priority: 'URGENT', progress: 10, isOverdue: false, day: 'MON', date: 'Jul 20', completed: false, hours: 2.0 },
    { id: 'WO-3104', title: 'Safety Sensor Calibration', location: 'Assembly Robot 4', technician: 'Sarah Jenkins', timeLeft: 'Completed', priority: 'LOW', progress: 100, isOverdue: false, day: 'WED', date: 'Jul 22', completed: true, hours: 1.0 },
    { id: 'WO-3105', title: 'Pneumatic Line Audit', location: 'Packaging Zone C', technician: 'Sarah Jenkins', timeLeft: '3d left', priority: 'STANDARD', progress: 0, isOverdue: false, day: 'FRI', date: 'Jul 24', completed: false, hours: 2.0 }
  ]);

  const [techniciansList] = useState([
    { name: 'Sarah Jenkins', avatar: 'SJ' },
    { name: 'Marcus King', avatar: 'MK' },
    { name: 'Elena Perez', avatar: 'EP' }
  ]);

  const [queue, setQueue] = useState([
    { id: 'Q-101', task: 'Filter Replacement', asset: 'HVAC Unit 3', priority: 'HIGH', scheduled: 'Today, 14:00', estimatedHours: 2.0 },
    { id: 'Q-102', task: 'Motor Inspection', asset: 'Extruder B', priority: 'MED', scheduled: 'Tom., 08:00', estimatedHours: 1.5 },
    { id: 'Q-103', task: 'Lubrication Cycle', asset: 'Assembly Robot 12', priority: 'LOW', scheduled: 'Oct 24, 09:00', estimatedHours: 1.0 }
  ]);

  // --- WEEKLY MATERIAL PREPARATION STATE ---
  const [weeklyMaterials] = useState([
    { id: 'MAT-801', day: 'THU', date: 'Jul 16', task: 'Hydraulic Press Calibration', part: 'Calibration Sensor Kit v2', status: 'Ready', tech: 'Sarah Jenkins', woId: 'WO-2941' },
    { id: 'MAT-802', day: 'THU', date: 'Jul 16', task: 'HVAC Filter Swap', part: 'HEPA Filter Kit v3', status: 'Ready', tech: 'Sarah Jenkins', woId: 'WO-3102' },
    { id: 'MAT-803', day: 'FRI', date: 'Jul 17', task: 'Conveyor Bearing Swap', part: 'SKF Tapered Bearing x2', status: 'Ready', tech: 'Marcus King', woId: 'WO-2942' },
    { id: 'MAT-804', day: 'MON', date: 'Jul 20', task: 'Hydraulic Seals Check', part: 'O-Ring Pack (Nitrile)', status: 'Missing Parts', tech: 'Sarah Jenkins', woId: 'WO-3103' },
    { id: 'MAT-805', day: 'WED', date: 'Jul 22', task: 'Safety Sensor Calibration', part: 'Optic Alignment Gauge', status: 'Ready', tech: 'Sarah Jenkins', woId: 'WO-3104' },
    { id: 'MAT-806', day: 'FRI', date: 'Jul 24', task: 'Pneumatic Line Audit', part: 'Pressure Leak Meter', status: 'Pending Pickup', tech: 'Sarah Jenkins', woId: 'WO-3105' }
  ]);

  // --- HELPER FUNCTION: SHARP PRIORITY STYLING ---
  const getPriorityTheme = (priority, isCompleted = false) => {
    if (isCompleted) {
      return { label: 'DONE', bg: '#DCFCE7', color: '#15803D', border: '#22C55E' };
    }
    switch (priority) {
      case 'URGENT':
        return { label: 'URGENT', bg: '#FEE2E2', color: '#B91C1C', border: '#EF4444' };
      case 'HIGH':
        return { label: 'HIGH', bg: '#FEF3C7', color: '#B45309', border: '#F59E0B' };
      case 'STANDARD':
      case 'MED':
        return { label: 'STANDARD', bg: '#E0F2FE', color: '#0369A1', border: '#0284C7' };
      case 'LOW':
      default:
        return { label: 'LOW', bg: '#F1F5F9', color: '#475569', border: '#64748B' };
    }
  };

  // --- DYNAMIC CMMS LOAD CALCULATIONS ---
  const technicians = techniciansList.map(tech => {
    const activeTasks = activeWorkOrders.filter(
      wo => wo.technician === tech.name && !wo.completed
    );
    const totalActiveHours = activeTasks.reduce((sum, wo) => sum + (wo.hours || 0), 0);
    const loadPercentage = Math.min(100, Math.round((totalActiveHours / SHIFT_CAPACITY_HOURS) * 100));

    return {
      ...tech,
      load: loadPercentage,
      activeHours: totalActiveHours
    };
  });

  // --- POPUP WARNING MODAL STATES ---
  const [pendingCompletion, setPendingCompletion] = useState(null);
  const [highLoadWarning, setHighLoadWarning] = useState(null);

  // --- TECHNICIAN SHIFT NOTES & LOG HISTORY STATE ---
  const [shiftNotes, setShiftNotes] = useState('');
  const [savedNotesList, setSavedNotesList] = useState([
    {
      id: 1,
      text: 'Replaced secondary seal on Line A. Hydraulic press calibration is awaiting replacement pressure gauge from stock.',
      timestamp: 'Today, 09:30 AM'
    },
    {
      id: 2,
      text: 'Routine safety check completed on Assembly Robot 4. Optical sensors recalibrated successfully.',
      timestamp: 'Yesterday, 04:15 PM'
    }
  ]);

  // --- FORM STATE ---
  const [selectedQueueItem, setSelectedQueueItem] = useState('');
  const [selectedTech, setSelectedTech] = useState('');

  const handleAssignTask = (e) => {
    e.preventDefault();
    if (!selectedQueueItem || !selectedTech) return;

    const techObj = technicians.find(t => t.name === selectedTech);
    const queueItem = queue.find(q => q.id === selectedQueueItem);
    if (!queueItem) return;

    const prospectiveHours = (techObj?.activeHours || 0) + (queueItem.estimatedHours || 1.5);
    const prospectiveLoad = Math.min(100, Math.round((prospectiveHours / SHIFT_CAPACITY_HOURS) * 100));
    
    if (prospectiveLoad >= 75) {
      setHighLoadWarning({
        techName: techObj.name,
        currentLoad: techObj.load,
        prospectiveLoad,
        prospectiveHours,
        taskTitle: queueItem.task,
        queueId: selectedQueueItem
      });
      return;
    }

    executeTaskAssignment(selectedQueueItem, selectedTech);
  };

  const executeTaskAssignment = (queueId, techName) => {
    const queueItem = queue.find(q => q.id === queueId);
    if (!queueItem) return;

    const newWO = {
      id: `WO-${Math.floor(1000 + Math.random() * 9000)}`,
      title: queueItem.task,
      location: queueItem.asset,
      technician: techName,
      timeLeft: `${queueItem.estimatedHours || 1.5}h est`,
      priority: queueItem.priority === 'HIGH' ? 'HIGH' : 'STANDARD',
      progress: 0,
      isOverdue: false,
      day: 'TODAY',
      date: 'Jul 23',
      completed: false,
      hours: queueItem.estimatedHours || 1.5
    };

    setActiveWorkOrders(prev => [...prev, newWO]);
    setQueue(prev => prev.filter(q => q.id !== queueId));
    setSelectedQueueItem('');
    setSelectedTech('');
    setHighLoadWarning(null);
  };

  const handleInitiateCompleteTask = (id, techName) => {
    const materialItem = weeklyMaterials.find(m => m.woId === id);

    if (materialItem && materialItem.status !== 'Ready') {
      const wo = activeWorkOrders.find(w => w.id === id);
      setPendingCompletion({
        woId: id,
        techName: techName,
        woTitle: wo?.title || id,
        materialStatus: materialItem.status,
        partName: materialItem.part
      });
      return;
    }

    executeCompleteTask(id, techName);
  };

  const executeCompleteTask = (id, techName) => {
    setActiveWorkOrders(prev => prev.map(wo => {
      if (wo.id === id) {
        return { ...wo, progress: 100, completed: true, timeLeft: 'Completed' };
      }
      return wo;
    }));

    setPendingCompletion(null);
  };

  const handleSaveShiftNote = () => {
    if (!shiftNotes.trim()) return;

    const newNote = {
      id: Date.now(),
      text: shiftNotes.trim(),
      timestamp: 'Just now'
    };

    setSavedNotesList([newNote, ...savedNotesList]);
    setShiftNotes('');
  };

  const getLoadMeterColor = (load) => {
    if (load < 25) return '#16A34A'; 
    if (load <= 75) return '#D97706'; 
    return '#DC2626'; 
  };

  const currentTechUser = 'Sarah Jenkins';
  
  const displayedWorkOrders = currentRole === 'Technician' 
    ? activeWorkOrders.filter(wo => wo.technician === currentTechUser)
    : activeWorkOrders.filter(wo => !wo.completed);

  const displayedMaterials = currentRole === 'Technician'
    ? weeklyMaterials.filter(m => m.tech === currentTechUser)
    : weeklyMaterials;

  // --- DYNAMIC TECHNICIAN SHIFT METRICS ---
  const techWorkOrders = activeWorkOrders.filter(wo => wo.technician === currentTechUser);
  const totalTechTasks = techWorkOrders.length;
  const completedTechTasks = techWorkOrders.filter(wo => wo.completed).length;

  const totalLoggedHours = techWorkOrders
    .filter(wo => wo.completed)
    .reduce((acc, wo) => acc + (wo.hours || 1.5), 0);

  const onTimeTasks = techWorkOrders.filter(wo => wo.completed && !wo.isOverdue).length;
  const dynamicOnTimeRate = completedTechTasks > 0 
    ? Math.round((onTimeTasks / completedTechTasks) * 100) 
    : 100;

  // --- DOUGHNUT CHART SEGMENT CALCULATIONS FOR MANAGER VIEW ---
  const totalLoadSum = technicians.reduce((acc, t) => acc + t.load, 0) || 1;
  const avgLoad = Math.round(totalLoadSum / technicians.length);

  let accumulatedAngle = 0;
  const doughnutSegments = technicians.map((tech) => {
    const value = tech.load;
    const percentage = value / totalLoadSum;
    const strokeDasharray = `${percentage * 282.7} 282.7`;
    const strokeDashoffset = -accumulatedAngle * 282.7;
    accumulatedAngle += percentage;

    return {
      name: tech.name,
      load: tech.load,
      activeHours: tech.activeHours,
      color: getLoadMeterColor(tech.load),
      strokeDasharray,
      strokeDashoffset
    };
  });

  // --- ENHANCED HIGH-CONTRAST COLOR PALETTE ---
  const colors = {
    redAccent: '#D90000',
    background: '#F1F5F9',
    white: '#FFFFFF',
    textMain: '#0F172A',
    textMuted: '#475569',
    border: '#CBD5E1'
  };

  const shadows = {
    panel: '0 10px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.06)',
    card: '0 3px 10px -2px rgba(15, 23, 42, 0.08)',
    sidebar: '4px 0 24px 0 rgba(15, 23, 42, 0.05)'
  };

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      width: '100%', 
      backgroundColor: colors.background, 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', 
      color: colors.textMain,
      boxSizing: 'border-box',
      fontSize: '16px',
      textAlign: 'left',
      flexDirection: 'column',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      
      <style>{`
        *, *:before, *:after {
          box-sizing: border-box;
        }
        body, html, #root {
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
          min-height: 100vh !important;
          background-color: #F1F5F9 !important;
          overflow-y: auto !important;
        }
        select, input, button, textarea {
          text-align: left !important;
          font-family: inherit;
        }
        .custom-scroll::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: #E2E8F0;
          border-radius: 4px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: #94A3B8;
          border-radius: 4px;
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover {
          background: #64748B;
        }
      `}</style>

      {/* --- POPUP WARNING MODAL: HIGH LOAD OPERATOR --- */}
      {highLoadWarning && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '500px',
            padding: '28px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: `2px solid ${colors.border}`,
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ padding: '10px', borderRadius: '12px', backgroundColor: '#FEE2E2', color: '#DC2626' }}>
                  <AlertTriangle size={26} />
                </div>
                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '900', color: '#0F172A' }}>
                  CMMS Capacity Warning
                </h3>
              </div>
              <button 
                onClick={() => setHighLoadWarning(null)}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: colors.textMuted }}
              >
                <X size={24} />
              </button>
            </div>

            <div style={{ backgroundColor: '#FEF2F2', border: '2px solid #FECACA', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
              <span style={{ fontSize: '12px', fontWeight: '900', color: '#991B1B', textTransform: 'uppercase', letterSpacing: '0.6px', display: 'block', marginBottom: '6px' }}>
                Shift Workload Alert:
              </span>
              <div style={{ fontSize: '15px', fontWeight: '800', color: '#7F1D1D', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={18} />
                <span>
                  {highLoadWarning.techName} will reach <strong style={{ color: '#DC2626' }}>{highLoadWarning.prospectiveLoad}% Load</strong> ({highLoadWarning.prospectiveHours}h / 8.0h shift)
                </span>
              </div>
            </div>

            <p style={{ fontSize: '15px', color: '#1E293B', margin: '0 0 24px 0', lineHeight: '1.5', fontWeight: '500' }}>
              Assigning <strong>"{highLoadWarning.taskTitle}"</strong> exceeds the standard operational threshold of 75% shift capacity.
              <br /><br />
              <strong>Do you still wish to force-assign this task?</strong>
            </p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setHighLoadWarning(null)}
                style={{
                  padding: '12px 20px',
                  borderRadius: '10px',
                  border: `2px solid ${colors.border}`,
                  backgroundColor: '#F1F5F9',
                  color: '#334155',
                  fontWeight: '800',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => executeTaskAssignment(highLoadWarning.queueId, highLoadWarning.techName)}
                style={{
                  padding: '12px 20px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: colors.redAccent,
                  color: 'white',
                  fontWeight: '800',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Confirm & Deploy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- POPUP WARNING MODAL FOR UNREADY MATERIALS --- */}
      {pendingCompletion && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '500px',
            padding: '28px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: `2px solid ${colors.border}`,
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ padding: '10px', borderRadius: '12px', backgroundColor: '#FEF2F2', color: '#DC2626' }}>
                  <AlertTriangle size={26} />
                </div>
                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '900', color: '#0F172A' }}>
                  Material Prep Warning
                </h3>
              </div>
              <button 
                onClick={() => setPendingCompletion(null)}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: colors.textMuted }}
              >
                <X size={24} />
              </button>
            </div>

            <div style={{ backgroundColor: '#FFFBEB', border: '2px solid #FCD34D', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
              <span style={{ fontSize: '12px', fontWeight: '900', color: '#B45309', textTransform: 'uppercase', letterSpacing: '0.6px', display: 'block', marginBottom: '6px' }}>
                Material Prep Remarks:
              </span>
              <div style={{ fontSize: '15px', fontWeight: '800', color: '#78350F', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Package size={18} />
                <span>Kit: {pendingCompletion.partName}</span>
              </div>
              <div style={{ fontSize: '14px', fontWeight: '900', color: pendingCompletion.materialStatus === 'Missing Parts' ? '#DC2626' : '#D97706', marginTop: '6px' }}>
                Status: {pendingCompletion.materialStatus}
              </div>
            </div>

            <p style={{ fontSize: '15px', color: '#1E293B', margin: '0 0 24px 0', lineHeight: '1.5', fontWeight: '500' }}>
              Work order <strong>{pendingCompletion.woId}</strong> ({pendingCompletion.woTitle}) is flagged because its materials are not fully ready.
              <br /><br />
              <strong>Do you still wish to force-complete this task?</strong>
            </p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setPendingCompletion(null)}
                style={{
                  padding: '12px 20px',
                  borderRadius: '10px',
                  border: `2px solid ${colors.border}`,
                  backgroundColor: '#F1F5F9',
                  color: '#334155',
                  fontWeight: '800',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                No, Cancel
              </button>
              <button
                onClick={() => executeCompleteTask(pendingCompletion.woId, pendingCompletion.techName)}
                style={{
                  padding: '12px 20px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: colors.redAccent,
                  color: 'white',
                  fontWeight: '800',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Yes, Force Complete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MAIN PAGE LAYOUT --- */}
      <main style={{ 
        flex: 1, 
        width: '100%',
        maxWidth: '1600px',
        margin: '0 auto',
        padding: '24px 16px 80px 16px', 
        marginBottom: '40px',
        display: 'flex', 
        flexDirection: 'column',
        boxSizing: 'border-box'
      }}>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          

          {/* RESPONSIVE GRID LAYOUT (1 Column on Mobile/Tablet, 2 Columns on Desktop) */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
            gap: '20px', 
            width: '100%' 
          }}>
            
            {/* --- LEFT COLUMN CONTAINER --- */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
              
              {/* MANAGER VIEW: Equipment Maintenance Queue */}
              {currentRole === 'Manager' && (
                <section style={{ 
                  backgroundColor: colors.white, 
                  borderRadius: '20px', 
                  padding: '20px', 
                  border: `2px solid ${colors.border}`, 
                  boxShadow: shadows.panel,
                  width: '100%'
                }}>
                  <h3 style={{ margin: '0 0 16px 0', fontWeight: '900', fontSize: '18px', color: '#0F172A' }}>
                    Equipment Maintenance Queue
                  </h3>
                  
                  <div style={{ backgroundColor: '#F8FAFC', borderRadius: '14px', padding: '16px', border: `2px solid ${colors.border}`, boxShadow: shadows.card, width: '100%' }}>
                    <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', width: '100%', flexWrap: 'wrap' }}>
                      <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '13px', fontWeight: '800', color: '#334155' }}>Select queue task</label>
                        <select 
                          value={selectedQueueItem} 
                          onChange={(e) => setSelectedQueueItem(e.target.value)} 
                          style={{ padding: '10px', borderRadius: '8px', border: `2px solid ${colors.border}`, backgroundColor: 'white', fontSize: '14px', fontWeight: '700', color: '#0F172A', width: '100%' }}
                        >
                          <option value="">-- Choose pending task --</option>
                          {queue.map(q => <option key={q.id} value={q.id}>{q.task} ({q.asset}) - {q.estimatedHours}h - [{q.priority}]</option>)}
                        </select>
                      </div>
                      <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '13px', fontWeight: '800', color: '#334155' }}>Assign technician</label>
                        <select 
                          value={selectedTech} 
                          onChange={(e) => setSelectedTech(e.target.value)} 
                          style={{ padding: '10px', borderRadius: '8px', border: `2px solid ${colors.border}`, backgroundColor: 'white', fontSize: '14px', fontWeight: '700', color: '#0F172A', width: '100%' }}
                        >
                          <option value="">-- Choose operator --</option>
                          {technicians.map((t, idx) => (
                            <option key={idx} value={t.name}>
                              {t.name} ({t.load}% Load / {t.activeHours}h)
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <button 
                      onClick={handleAssignTask} 
                      style={{ padding: '10px 20px', backgroundColor: colors.redAccent, color: 'white', border: 'none', borderRadius: '8px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', width: '100%', justifyContent: 'center' }}
                    >
                      <UserCheck size={18} /> Assign Technician
                    </button>
                  </div>
                </section>
              )}

              {/* MANAGER VIEW: Active Work Orders */}
              {currentRole === 'Manager' && (
                <section style={{ 
                  backgroundColor: colors.white, 
                  borderRadius: '20px', 
                  padding: '20px', 
                  border: `2px solid ${colors.border}`, 
                  boxShadow: shadows.panel,
                  width: '100%'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                    <h3 style={{ margin: 0, fontWeight: '900', fontSize: '18px', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: colors.redAccent }}>⊙</span> Active Work Orders ({displayedWorkOrders.length})
                    </h3>
                    <span style={{ fontSize: '13px', fontWeight: '900', color: '#B45309', backgroundColor: '#FEF3C7', border: '1px solid #FDE68A', padding: '4px 12px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <AlertTriangle size={15} /> {displayedWorkOrders.filter(w => w.isOverdue).length} overdue
                    </span>
                  </div>

                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px', 
                    backgroundColor: '#F8FAFC', 
                    border: `2px solid ${colors.border}`, 
                    padding: '10px 14px', 
                    borderRadius: '12px', 
                    marginBottom: '16px',
                    flexWrap: 'wrap'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '900', color: colors.textMuted, textTransform: 'uppercase' }}>
                      <Info size={16} style={{ color: colors.redAccent }} /> Target:
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', fontSize: '11px', fontWeight: '800' }}>
                      <span style={{ backgroundColor: '#FEE2E2', color: '#B91C1C', border: '1px solid #FECACA', padding: '2px 6px', borderRadius: '4px' }}>● URGENT: &lt;1h</span>
                      <span style={{ backgroundColor: '#FEF3C7', color: '#B45309', border: '1px solid #FDE68A', padding: '2px 6px', borderRadius: '4px' }}>● HIGH: 2–4h</span>
                      <span style={{ backgroundColor: '#E0F2FE', color: '#0369A1', border: '1px solid #BAE6FD', padding: '2px 6px', borderRadius: '4px' }}>● STANDARD: 24–48h</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' }}>
                    {displayedWorkOrders.map((wo) => {
                      const theme = getPriorityTheme(wo.priority, wo.completed);
                      return (
                        <div key={wo.id} style={{ 
                          border: `2px solid ${colors.border}`, 
                          borderRadius: '14px', 
                          padding: '16px', 
                          backgroundColor: '#F8FAFC', 
                          boxShadow: shadows.card,
                          display: 'flex', 
                          flexDirection: 'column', 
                          justifyContent: 'space-between',
                          position: 'relative',
                          width: '100%',
                          boxSizing: 'border-box'
                        }}>
                          <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '6px', borderRadius: '14px 0 0 14px', backgroundColor: theme.border }} />
                          
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
                              <span style={{ 
                                fontSize: '11px', 
                                fontWeight: '900', 
                                color: theme.color, 
                                backgroundColor: theme.bg,
                                border: `1px solid ${theme.border}`,
                                padding: '2px 8px',
                                borderRadius: '6px'
                              }}>
                                {theme.label} {wo.isOverdue ? '(OVERDUE)' : ''}
                              </span>
                              <span style={{ fontSize: '13px', color: colors.textMuted, fontFamily: 'monospace', fontWeight: '800' }}>{wo.id}</span>
                            </div>

                            <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '900', color: '#0F172A' }}>{wo.title}</h4>
                            <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: colors.textMuted, fontWeight: '600' }}>{wo.location}</p>
                          </div>

                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: `2px solid ${colors.border}`, flexWrap: 'wrap', gap: '8px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#0F172A', color: 'white', fontWeight: '900', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{wo.technician.charAt(0)}</div>
                                <span style={{ fontSize: '13px', fontWeight: '800', color: '#0F172A' }}>{wo.technician}</span>
                              </div>
                              <span style={{ fontSize: '12px', fontWeight: '800', color: theme.color, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Clock size={13} /> {wo.hours}h est
                              </span>
                            </div>
                            
                            <div style={{ backgroundColor: '#CBD5E1', height: '6px', marginTop: '10px', borderRadius: '4px', overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: `${wo.progress}%`, backgroundColor: theme.border }} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* TECHNICIAN VIEW: WORK ORDERS LIST */}
              {currentRole === 'Technician' && (
                <section style={{ 
                  backgroundColor: colors.white, 
                  borderRadius: '20px', 
                  padding: '20px', 
                  border: `2px solid ${colors.border}`, 
                  boxShadow: shadows.panel,
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Wrench size={20} style={{ color: colors.redAccent }} />
                      <h3 style={{ margin: 0, fontWeight: '900', fontSize: '18px', color: '#0F172A' }}>My Weekly Work Orders</h3>
                    </div>
                    <span style={{ 
                      padding: '4px 12px', 
                      fontSize: '13px', 
                      color: '#0F172A', 
                      fontWeight: '900', 
                      backgroundColor: '#E2E8F0', 
                      borderRadius: '8px'
                    }}>
                      {completedTechTasks} / {totalTechTasks} Completed
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#EFF6FF', border: '2px solid #BFDBFE', padding: '10px 14px', borderRadius: '12px', marginBottom: '16px' }}>
                    <ShieldCheck size={18} style={{ color: '#2563EB', flexShrink: 0 }} />
                    <span style={{ fontSize: '13px', color: '#1E40AF', fontWeight: '700' }}>
                      Review tasks assigned to your current schedule. Click complete once field checks are finished.
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
                    {displayedWorkOrders.map((item) => {
                      const theme = getPriorityTheme(item.priority, item.completed);
                      return (
                        <div 
                          key={item.id} 
                          style={{ 
                            display: 'flex', 
                            flexDirection: 'column',
                            gap: '12px', 
                            padding: '16px', 
                            backgroundColor: item.completed ? '#F8FAFC' : 'white', 
                            borderRadius: '12px',
                            border: `2px solid ${item.completed ? '#CBD5E1' : item.isOverdue ? '#FCA5A5' : colors.border}`,
                            boxShadow: item.completed ? 'none' : shadows.card,
                            opacity: item.completed ? 0.75 : 1
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', flexWrap: 'wrap' }}>
                            <span style={{ 
                              fontFamily: 'monospace', 
                              fontSize: '12px', 
                              fontWeight: '900', 
                              color: 'white', 
                              backgroundColor: item.completed ? '#475569' : '#0F172A', 
                              padding: '3px 8px', 
                              borderRadius: '6px' 
                            }}>
                              {item.id}
                            </span>
                            <span style={{ 
                              padding: '3px 8px', 
                              fontSize: '11px', 
                              fontWeight: '900', 
                              borderRadius: '6px',
                              backgroundColor: theme.bg,
                              color: theme.color,
                              border: `1px solid ${theme.border}`
                            }}>
                              {theme.label}
                            </span>
                          </div>

                          <div>
                            <span style={{ 
                              fontSize: '15px', 
                              fontWeight: '800', 
                              color: '#0F172A',
                              display: 'block',
                              textDecoration: item.completed ? 'line-through' : 'none'
                            }}>
                              {item.title}
                            </span>
                            <span style={{ fontSize: '12px', color: colors.textMuted, fontWeight: '600', marginTop: '2px', display: 'block' }}>
                              {item.location} • Scheduled: {item.day}, {item.date} ({item.hours}h)
                            </span>
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '8px', borderTop: `1px solid ${colors.border}` }}>
                            {item.completed ? (
                              <span style={{ 
                                padding: '6px 12px', 
                                color: '#15803D', 
                                fontWeight: '900', 
                                fontSize: '13px',
                                backgroundColor: '#DCFCE7',
                                borderRadius: '8px',
                                border: '1px solid #86EFAC',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                              }}>
                                <CheckCircle size={15} /> Done
                              </span>
                            ) : (
                              <button 
                                onClick={() => handleInitiateCompleteTask(item.id, item.technician)}
                                style={{ 
                                  padding: '8px 16px', 
                                  border: 'none', 
                                  backgroundColor: '#16A34A', 
                                  color: 'white', 
                                  borderRadius: '8px', 
                                  fontWeight: '900', 
                                  cursor: 'pointer', 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  gap: '6px', 
                                  fontSize: '13px',
                                  width: '100%',
                                  justifyContent: 'center'
                                }}
                              >
                                <CheckCircle size={15} /> Complete Task
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

            </div>

            {/* --- RIGHT COLUMN CONTAINER --- */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
              
              {/* MANAGER VIEW: LOAD MONITOR */}
              {currentRole === 'Manager' && (
                <section style={{ 
                  backgroundColor: colors.white, 
                  borderRadius: '20px', 
                  padding: '20px', 
                  border: `2px solid ${colors.border}`, 
                  boxShadow: shadows.panel,
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <h3 style={{ margin: 0, fontWeight: '900', fontSize: '18px', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <PieChart size={20} style={{ color: colors.redAccent }} /> Technician Load Monitor
                    </h3>

                    <div style={{ display: 'flex', gap: '6px', fontSize: '10px', fontWeight: '900' }}>
                      <span style={{ color: '#15803D', backgroundColor: '#DCFCE7', border: '1px solid #86EFAC', padding: '2px 6px', borderRadius: '4px' }}>&lt;25%</span>
                      <span style={{ color: '#B45309', backgroundColor: '#FEF3C7', border: '1px solid #FDE68A', padding: '2px 6px', borderRadius: '4px' }}>25-75%</span>
                      <span style={{ color: '#B91C1C', backgroundColor: '#FEE2E2', border: '1px solid #FECACA', padding: '2px 6px', borderRadius: '4px' }}>&gt;75%</span>
                    </div>
                  </div>

                  {/* CONTENT AREA: RESPONSIVE STACK ON MOBILE, ROW ON WIDER SCREENS */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
                    
                    {/* GAUGE */}
                    <div style={{ 
                      backgroundColor: '#F8FAFC', 
                      borderRadius: '16px', 
                      border: `2px solid ${colors.border}`, 
                      padding: '16px', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      width: '100%'
                    }}>
                      <div style={{ position: 'relative', width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
                          <circle cx="60" cy="60" r="46" fill="none" stroke="#CBD5E1" strokeWidth="16" />
                          {doughnutSegments.map((seg, idx) => (
                            <circle
                              key={idx}
                              cx="60"
                              cy="60"
                              r="46"
                              fill="none"
                              stroke={seg.color}
                              strokeWidth="16"
                              strokeDasharray={seg.strokeDasharray}
                              strokeDashoffset={seg.strokeDashoffset}
                              style={{ transition: 'all 0.5s ease' }}
                            />
                          ))}
                        </svg>
                        <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <span style={{ fontSize: '24px', fontWeight: '900', color: '#0F172A', lineHeight: '1' }}>{avgLoad}%</span>
                          <span style={{ fontSize: '10px', fontWeight: '900', color: colors.textMuted, marginTop: '2px', letterSpacing: '0.5px' }}>AVERAGE</span>
                        </div>
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: '800', color: '#0F172A', marginTop: '10px' }}>
                        Shift Capacity
                      </span>
                    </div>

                    {/* CARDS */}
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {technicians.map((tech, i) => {
                        const meterColor = getLoadMeterColor(tech.load);
                        return (
                          <div 
                            key={i} 
                            style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'space-between', 
                              padding: '12px 14px', 
                              backgroundColor: '#F8FAFC', 
                              borderRadius: '12px', 
                              border: `2px solid ${colors.border}`,
                              width: '100%'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: meterColor, flexShrink: 0 }} />
                              <div>
                                <span style={{ fontSize: '14px', fontWeight: '900', color: '#0F172A', display: 'block', lineHeight: '1.2' }}>{tech.name}</span>
                                <span style={{ fontSize: '12px', color: colors.textMuted, fontWeight: '700' }}>{tech.activeHours.toFixed(1)}h / 8.0h shift</span>
                              </div>
                            </div>

                            <span style={{ 
                              fontSize: '13px', 
                              fontWeight: '900', 
                              color: meterColor,
                              backgroundColor: `${meterColor}1A`,
                              border: `1px solid ${meterColor}40`,
                              padding: '3px 10px',
                              borderRadius: '8px'
                            }}>
                              {tech.load}%
                            </span>
                          </div>
                        );
                      })}
                    </div>

                  </div>
                </section>
              )}

              {/* TECHNICIAN VIEW: FIELD NOTES & SHIFT EXECUTION */}
              {currentRole === 'Technician' && (
                <section style={{ 
                  backgroundColor: colors.white, 
                  borderRadius: '20px', 
                  padding: '20px', 
                  border: `2px solid ${colors.border}`, 
                  boxShadow: shadows.panel,
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FileText size={18} style={{ color: colors.redAccent }} />
                      <h3 style={{ margin: 0, fontWeight: '900', fontSize: '18px', color: '#0F172A' }}>Shift Execution & Field Notes</h3>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#FEF2F2', padding: '4px 10px', borderRadius: '8px', border: '1px solid #FCA5A5' }}>
                      <HardHat size={15} style={{ color: colors.redAccent }} />
                      <span style={{ fontSize: '11px', fontWeight: '800', color: '#991B1B' }}>PPE Required</span>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                    <div style={{ backgroundColor: '#F8FAFC', padding: '8px 10px', borderRadius: '10px', border: `2px solid ${colors.border}` }}>
                      <span style={{ fontSize: '11px', color: colors.textMuted, fontWeight: '800', display: 'block' }}>Completed</span>
                      <span style={{ fontSize: '14px', fontWeight: '900', color: '#0F172A' }}>{completedTechTasks} / {totalTechTasks}</span>
                    </div>
                    <div style={{ backgroundColor: '#F8FAFC', padding: '8px 10px', borderRadius: '10px', border: `2px solid ${colors.border}` }}>
                      <span style={{ fontSize: '11px', color: colors.textMuted, fontWeight: '800', display: 'block' }}>Logged Hours</span>
                      <span style={{ fontSize: '14px', fontWeight: '900', color: '#0F172A' }}>{totalLoggedHours.toFixed(1)} hrs</span>
                    </div>
                    <div style={{ backgroundColor: '#F8FAFC', padding: '8px 10px', borderRadius: '10px', border: `2px solid ${colors.border}` }}>
                      <span style={{ fontSize: '11px', color: colors.textMuted, fontWeight: '800', display: 'block' }}>On-Time</span>
                      <span style={{ fontSize: '14px', fontWeight: '900', color: dynamicOnTimeRate >= 80 ? '#16A34A' : '#D97706' }}>{dynamicOnTimeRate}%</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
                    <textarea 
                      value={shiftNotes}
                      onChange={(e) => setShiftNotes(e.target.value)}
                      placeholder="Type shift handover notes..."
                      rows={2}
                      style={{ 
                        width: '100%',
                        padding: '10px', 
                        borderRadius: '10px', 
                        border: `2px solid ${colors.border}`, 
                        fontSize: '13px', 
                        fontWeight: '600',
                        color: '#0F172A', 
                        backgroundColor: '#F8FAFC',
                        resize: 'none',
                        fontFamily: 'inherit'
                      }}
                    />
                    <button 
                      onClick={handleSaveShiftNote}
                      disabled={!shiftNotes.trim()}
                      style={{ 
                        padding: '10px 16px', 
                        backgroundColor: shiftNotes.trim() ? colors.redAccent : '#94A3B8', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '10px', 
                        fontWeight: '800', 
                        fontSize: '13px', 
                        cursor: shiftNotes.trim() ? 'pointer' : 'not-allowed', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        gap: '6px',
                        width: '100%'
                      }}
                    >
                      <Save size={15} /> Save Note
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }} className="custom-scroll">
                    {savedNotesList.map((note) => (
                      <div key={note.id} style={{ padding: '10px 12px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: `2px solid ${colors.border}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '11px', fontWeight: '800', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <MessageSquare size={13} style={{ color: colors.redAccent }} /> Logged Note
                          </span>
                          <span style={{ fontSize: '10px', color: colors.textMuted, fontWeight: '700' }}>{note.timestamp}</span>
                        </div>
                        <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#334155', fontWeight: '600', lineHeight: '1.4' }}>{note.text}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* MATERIAL PREPARATION / SHORTAGE OVERVIEW */}
              <section style={{ 
                backgroundColor: '#0F172A', 
                borderRadius: '20px', 
                padding: '20px', 
                color: 'white', 
                width: '100%', 
                boxShadow: shadows.panel,
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Package size={18} style={{ color: '#F8FAFC' }} />
                    <h3 style={{ margin: 0, fontWeight: '900', fontSize: '18px', color: '#F8FAFC' }}>
                      {currentRole === 'Manager' ? 'Material Shortage Overview' : 'Weekly Material Prep'}
                    </h3>
                  </div>

                  <span style={{ 
                    fontSize: '11px', 
                    color: '#CBD5E1', 
                    fontWeight: '900', 
                    backgroundColor: '#1E293B', 
                    padding: '3px 10px',
                    borderRadius: '6px',
                    border: '1px solid #334155'
                  }}>
                    {currentRole === 'Manager' ? 'Live Inventory' : 'Pre-Job Checklist'}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
                  {displayedMaterials.map((item) => {
                    const isReady = item.status === 'Ready';
                    const isMissing = item.status === 'Missing Parts';
                    
                    return (
                      <div key={item.id} style={{ 
                        backgroundColor: '#1E293B', 
                        borderRadius: '12px', 
                        padding: '12px', 
                        border: `2px solid ${isMissing ? '#991B1B' : '#334155'}`,
                        display: 'flex',
                        gap: '12px',
                        alignItems: 'center',
                        flexWrap: 'wrap'
                      }}>
                        <div style={{ backgroundColor: isMissing ? '#7F1D1D' : '#334155', padding: '6px 10px', borderRadius: '8px', textAlign: 'center', minWidth: '44px' }}>
                          <span style={{ display: 'block', fontSize: '10px', fontWeight: '900', color: '#CBD5E1' }}>{item.day}</span>
                          <span style={{ display: 'block', fontSize: '12px', fontWeight: '900', color: 'white' }}>{item.date.split(' ')[1]}</span>
                        </div>

                        <div style={{ flex: 1, minWidth: '160px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                            <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#F8FAFC' }}>{item.task}</h4>
                            <span style={{ fontSize: '10px', fontFamily: 'monospace', fontWeight: '800', color: '#38BDF8', backgroundColor: '#0284C720', padding: '1px 6px', borderRadius: '4px', border: '1px solid #0284C740' }}>{item.woId}</span>
                          </div>
                          <span style={{ display: 'block', fontSize: '11px', color: '#94A3B8', marginTop: '2px', fontWeight: '600' }}>
                            Kit: {item.part}
                          </span>
                        </div>

                        <span style={{ 
                          padding: '4px 10px',
                          fontSize: '11px', 
                          fontWeight: '900', 
                          borderRadius: '6px',
                          backgroundColor: isReady ? '#05966925' : isMissing ? '#DC262625' : '#D9770625',
                          border: `1px solid ${isReady ? '#10B981' : isMissing ? '#EF4444' : '#F59E0B'}`,
                          color: isReady ? '#34D399' : isMissing ? '#F87171' : '#FBBF24',
                          textAlign: 'center',
                          marginLeft: 'auto'
                        }}>
                          {item.status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </section>

            </div>

          </div>
        </div>
      </main>
    </div>
  );
}