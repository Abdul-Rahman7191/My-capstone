import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  Wrench,
  BrainCircuit,
  Zap,
  CloudSun
} from 'lucide-react';
import Logo from '../assets/transparent_logo.png';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col antialiased selection:bg-blue-600 selection:text-white">
      
      {/* --- NAVBAR --- */}
      <header className="bg-white border-b border-slate-200/85 px-6 lg:px-12 py-5 shrink-0 flex items-center justify-between sticky top-0 z-50 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold shadow-sm overflow-hidden p-1.5">
            <img src={Logo} alt="repAIr Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-xl text-slate-900 tracking-tight">repAIr</span>
            </div>
            <p className="text-xs text-slate-500 font-medium hidden sm:block">Equipment Maintenance Platform</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-sm cursor-pointer"
          >
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* --- HERO & AI FEATURES CONTAINER --- */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-14 lg:py-20 flex flex-col justify-center space-y-20">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-bold shadow-xs">
            <Sparkles className="w-4 h-4 text-blue-600 animate-spin" />
            <span>Next-Generation Predictive AI Platform</span>
          </div>
          
          <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-slate-950 tracking-tight leading-tight">
            Keep Your Equipment <span className="text-blue-600">Running.</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-slate-700 font-medium leading-relaxed max-w-2xl mx-auto">
            Harness advanced artificial intelligence to predict failures, neutralize environmental variables, and make smarter repair-or-replace decisions before downtime strikes.
          </p>

          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md cursor-pointer hover:shadow-lg"
            >
              <span>Launch Operations Console</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* --- AI FEATURES & WOW FACTOR SECTION --- */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 tracking-tight">
              The Intelligence Behind Zero Downtime
            </h2>
            <p className="text-slate-700 text-base sm:text-lg font-medium">
              Engineered with advanced cognitive capabilities designed specifically for high-stress industrial and quarry environments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-5 relative overflow-hidden group hover:border-blue-200 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="font-display font-bold text-lg text-slate-900">Autonomous Failure Foresight</h3>
                <p className="text-sm text-slate-700 font-medium leading-relaxed">
                  Deep learning models analyze millions of telemetry data points to autonomously forecast mechanical wear weeks before any physical symptoms surface.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-5 relative overflow-hidden group hover:border-blue-200 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <CloudSun className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="font-display font-bold text-lg text-slate-900">Environmental Variable Isolation</h3>
                <p className="text-sm text-slate-700 font-medium leading-relaxed">
                  Advanced multi-variable algorithms factor in ambient temperature, humidity, dust density, and load pressure to eliminate false alarms caused by harsh external conditions.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-5 relative overflow-hidden group hover:border-blue-200 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Zap className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="font-display font-bold text-lg text-slate-900">Prescriptive Decision Engine</h3>
                <p className="text-sm text-slate-700 font-medium leading-relaxed">
                  Goes beyond alerts by instantly calculating cost-benefit ratios for repairing versus replacing parts, optimizing your maintenance budget automatically.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* --- HOW THE AI WORKS (PROCESS) --- */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-8 lg:p-14 space-y-10 shadow-sm relative overflow-hidden">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-blue-600 font-mono text-xs sm:text-sm uppercase tracking-widest font-bold">Workflow Methodology</span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 tracking-tight">How the Predictive AI Works</h2>
            <p className="text-slate-700 text-sm sm:text-base font-medium">
              A continuous four-stage cognitive pipeline engineered to safeguard your entire fleet.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Step 1 */}
            <div className="bg-slate-50 border border-slate-200/80 p-6 rounded-2xl space-y-4 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 font-mono font-bold text-sm flex items-center justify-center border border-blue-100">
                01
              </div>
              <h4 className="font-display font-bold text-base text-slate-900">Identify Patterns</h4>
              <p className="text-sm text-slate-700 font-medium leading-relaxed">
                Continuously scans vibration, thermal, and fluid telemetry streams to establish normal operating baselines.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-50 border border-slate-200/80 p-6 rounded-2xl space-y-4 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 font-mono font-bold text-sm flex items-center justify-center border border-blue-100">
                02
              </div>
              <h4 className="font-display font-bold text-base text-slate-900">Anticipate Behaviors</h4>
              <p className="text-sm text-slate-700 font-medium leading-relaxed">
                Detects micro-deviations in machine performance caused by stress loads and variable operating conditions.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-50 border border-slate-200/80 p-6 rounded-2xl space-y-4 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 font-mono font-bold text-sm flex items-center justify-center border border-blue-100">
                03
              </div>
              <h4 className="font-display font-bold text-base text-slate-900">Forecast Upcoming Events</h4>
              <p className="text-sm text-slate-700 font-medium leading-relaxed">
                Projects exact failure timelines and component degradation rates with high statistical accuracy.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-slate-50 border border-slate-200/80 p-6 rounded-2xl space-y-4 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 font-mono font-bold text-sm flex items-center justify-center border border-blue-100">
                04
              </div>
              <h4 className="font-display font-bold text-base text-slate-900">Prescribe Solution</h4>
              <p className="text-sm text-slate-700 font-medium leading-relaxed">
                Delivers actionable repair steps, required parts list, and optimized scheduling windows directly to engineers.
              </p>
            </div>

          </div>

          {/* Environmental Factor Deep-Dive Note */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
              <CloudSun className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h4 className="font-display font-bold text-base sm:text-lg text-slate-900">Environmental Intelligence: How We Handle External Variables</h4>
              <p className="text-sm text-slate-700 font-medium leading-relaxed">
                Quarries and construction sites deal with extreme weather, heavy dust, and fluctuating temperatures that naturally alter sensor readings. repAIr’s AI cross-references real-time meteorological feeds and operational loads against historical sensor tolerances. By decoupling external environmental strain from actual internal component wear, the system filters out noise and delivers high-precision alerts you can actually trust.
              </p>
            </div>
          </div>

        </div>

      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-white border-t border-slate-200 py-5 px-6 shrink-0 text-center text-xs sm:text-sm text-slate-400 font-mono">
        Ichiban Group 2026
      </footer>

    </div>
  );
}