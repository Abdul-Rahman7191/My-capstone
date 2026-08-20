import { useState } from 'react';
import { Shield, HardHat, FileDown, Cpu, Wrench } from 'lucide-react';

export const MaintenanceGuideSection = ({
  equipmentId,
  predictedIssue,
}) => {
  const [downloading, setDownloading] = useState(false);

  const triggerPDFDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      alert(`SOP document "SOP-${equipmentId}-HYD-SEAL.pdf" has been generated and downloaded to your workstation.`);
    }, 1200);
  };

  const isEX = equipmentId === 'EX-203';
  const isDT = equipmentId === 'DT-845';

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6" id="maintenance-guide-section">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <HardHat className="w-5 h-5 text-indigo-600" />
            <h3 className="font-display font-bold text-slate-800 text-sm uppercase tracking-wider">
              Recommended Maintenance Procedure
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {predictedIssue
              ? `Recommended response for ${predictedIssue}, tailored to ${equipmentId}'s telemetry signature.`
              : `Predictive-customized step-by-step procedures tailored to ${equipmentId}'s telemetry signature.`}
          </p>
        </div>

        <button
          onClick={triggerPDFDownload}
          disabled={downloading}
          className="flex items-center gap-2 px-3.5 py-1.5 border border-slate-200 hover:border-slate-300 rounded-lg text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer disabled:opacity-50"
          id="btn-export-sop"
        >
          <FileDown className="w-3.5 h-3.5 text-slate-500" />
          <span>{downloading ? 'Compiling PDF...' : 'Export Work SOP'}</span>
        </button>
      </div>

      {isEX && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="sop-details-ex">
          {/* Left Column: Requirements (PPE, Tools, Parts) */}
          <div className="space-y-6 lg:border-r lg:border-slate-100 lg:pr-6">
            {/* Required PPE */}
            <div className="space-y-2">
              <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Required PPE</span>
              <div className="flex flex-wrap gap-1.5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold">
                  <Shield className="w-3 h-3 text-slate-500" /> Safety Glasses
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold">
                  <Shield className="w-3 h-3 text-slate-500" /> Nitrile Gloves
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold">
                  <Shield className="w-3 h-3 text-slate-500" /> Steel Toe Boots
                </span>
              </div>
            </div>

            {/* Required Tools */}
            <div className="space-y-2">
  <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Required Tools</span>
  <ul className="text-xs font-sans space-y-2">
    <li className="flex items-center gap-2">
      <Wrench className="w-3.5 h-3.5 text-slate-500 shrink-0" />
      <span className="font-semibold text-slate-800">36mm Socket Wrench</span>
    </li>
    <li className="flex items-center gap-2">
      <Wrench className="w-3.5 h-3.5 text-slate-500 shrink-0" />
      <span className="font-semibold text-slate-800">Hydraulic Seal Pick Set</span>
    </li>
    <li className="flex items-center gap-2">
      <Wrench className="w-3.5 h-3.5 text-slate-500 shrink-0" />
      <span className="font-semibold text-slate-800">Calibrated Torque Wrench (200Nm)</span>
    </li>
  </ul>
</div>

            {/* Spare Parts List */}
            <div className="space-y-2">
              <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Spare Parts List</span>
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 space-y-2">
                <div className="flex justify-between items-center text-xs pb-1.5 border-b border-slate-200/60">
                  <span className="font-semibold text-slate-800">Seal Kit O-Ring (High Temp)</span>
                  <span className="font-mono text-slate-500">Qty: 1</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-800">Hydraulic Fluid (ISO 46 Premium)</span>
                  <span className="font-mono text-slate-500">Qty: 5L</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Standard Operating Procedures (Steps) */}
          <div className="lg:col-span-2 space-y-5" id="sop-steps-ex">
            <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">SOP Procedures</span>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                    1
                  </div>
                  <div className="w-0.5 h-full bg-slate-100" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-tight">Depressurize System (Critical Safety Step)</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Set excavator in maintenance position with bucket fully extended on ground. Shut off engine and bleed residual pressure from hydraulic accumulator by cycling control joysticks 10 times.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                    2
                  </div>
                  <div className="w-0.5 h-full bg-slate-100" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-tight">Remove Cylinder Cap</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Use a 36mm socket wrench to unbolt the end cap. Warning: Residual fluid may spill. Position catch basin beneath assembly before loosening thread.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                    3
                  </div>
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-tight">Extract and Inspect Seals</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Carefully remove old O-rings using brass picks to avoid scoring the cylinder wall. Inspect for scoring or deep gouges on the metal gland surface.
                  </p>
                </div>
              </div>
            </div>

            {/* AI Assistant Note card */}
            <div className="bg-violet-50/50 rounded-lg p-3.5 border border-violet-100 flex items-start gap-3 mt-4">
              <Cpu className="w-4 h-4 text-violet-600 mt-0.5 shrink-0" />
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono text-violet-600 font-bold uppercase block">Technical Note</span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Based on current micro-cavitation data, pay special attention to the inner gland seal. If pitted, the entire rod assembly may need alignment checks or total replacement.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {isDT && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="sop-details-dt">
          {/* Left Column: Requirements (PPE, Tools, Parts) */}
          <div className="space-y-6 lg:border-r lg:border-slate-100 lg:pr-6">
            {/* Required PPE */}
            <div className="space-y-2">
              <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Required PPE</span>
              <div className="flex flex-wrap gap-1.5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold">
                  <Shield className="w-3 h-3 text-slate-500" /> Safety Glasses
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold">
                  <Shield className="w-3 h-3 text-slate-500" /> Nitrile Gloves
                </span>
              </div>
            </div>

            {/* Required Tools */}
            <div className="space-y-2">
              <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Required Tools</span>
              <div className="flex flex-wrap gap-1.5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold">
                  <Wrench className="w-3 h-3 text-slate-500" /> 36mm Socket Wrench
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold">
                  <Wrench className="w-3 h-3 text-slate-500" /> Hydraulic Seal Pick Set
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold">
                  <Wrench className="w-3 h-3 text-slate-500" /> Calibrated Torque Wrench (200Nm)
                </span>
              </div>
            </div>

            {/* Spare Parts List */}
            <div className="space-y-2">
              <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Spare Parts List</span>
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 space-y-2">
                <div className="flex justify-between items-center text-xs pb-1.5 border-b border-slate-200/60">
                  <span className="font-semibold text-slate-800">Transmission Internal Filter Element</span>
                  <span className="font-mono text-slate-500">Qty: 1</span>
                </div>
                <div className="flex justify-between items-center text-xs pb-1.5 border-b border-slate-200/60">
                  <span className="font-semibold text-slate-800">CAT TO-4 SAE 30 Transmission Oil</span>
                  <span className="font-mono text-slate-500">Qty: 25L</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-800">Drain Plug Crush Washer</span>
                  <span className="font-mono text-slate-500">Qty: 1</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Standard Operating Procedures (Steps) */}
          <div className="lg:col-span-2 space-y-5" id="sop-steps-dt">
            <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">SOP Procedures</span>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                    1
                  </div>
                  <div className="w-0.5 h-full bg-slate-100" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-tight">Drain Transmission Fluid</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Locate the transmission sump drain plug. With fluid warm from operation, place dynamic drain pan and remove plug. Safely decant 25 liters of fluid.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                    2
                  </div>
                  <div className="w-0.5 h-full bg-slate-100" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-tight">Replace internal filter element</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Unscrew the spin-on canister filter using a filter wrench. Clean the mount mating surface, grease the seal of the new filter with clean fluid, and hand-tighten plus 3/4 turn.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                    3
                  </div>
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-tight">Refill & Clutch Solenoid Calibration</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Add 25 liters of premium CAT TO-4 SAE 30 oil. Start engine, run until oil hits 80°C, and connect the digital diagnostic tool to perform clutch solenoid calibration sequence.
                  </p>
                </div>
              </div>
            </div>

            {/* AI Assistant Note card */}
            <div className="bg-violet-50/50 rounded-lg p-3.5 border border-violet-100 flex items-start gap-3 mt-4">
              <Cpu className="w-4 h-4 text-violet-600 mt-0.5 shrink-0" />
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono text-violet-600 font-bold uppercase block">AI ASSISTANT SPECIFIC NOTE</span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Historical telemetry flags that thermal shearing was exacerbated by operators lugging third gear on the quarry high ramp. Recommend operator feedback session to optimize gear selections on steep climbs.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {!isEX && !isDT && (
        <div className="p-8 text-center text-slate-400 text-xs italic" id="sop-details-cl">
          Wheel Loader CL-102 is currently operating in flawless condition. No corrective SOP guides have been generated. Standard Caterpillar factory maintenance schedule applies.
        </div>
      )}
    </div>
  );
};
