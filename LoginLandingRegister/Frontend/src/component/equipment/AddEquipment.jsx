import React, { useState } from 'react';
import { X, Save, PlusCircle } from 'lucide-react';

export const AddEquipmentModal = ({ isOpen, onClose, onAdd }) => {
  // Initialize form state
  const [formData, setFormData] = useState({
    id: '',
    type: '',
    model: '',
    manufacturer: '',
    location: '',
    purchaseDate: '',
    operatingHours: '',
    status: 'active', // Default status
    team: ''
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Pass the collected data back to the parent component
    onAdd(formData);
    
    // Reset form and close modal
    setFormData({
      id: '', type: '', model: '', manufacturer: '', location: '',
      purchaseDate: '', operatingHours: '', status: 'active', team: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-full">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="bg-blue-100 text-blue-700 p-1.5 rounded-lg">
              <PlusCircle size={18} />
            </div>
            <div>
              <h2 className="font-display font-bold text-slate-800 text-base">Register New Equipment</h2>
              <p className="text-[11px] text-slate-500 font-sans mt-0.5">Enter asset specifications to add it to the monitoring fleet.</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-lg transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body (Scrollable if screen is small) */}
        <div className="p-6 overflow-y-auto flex-1">
          <form id="add-equipment-form" onSubmit={handleSubmit} className="space-y-5">
            
            {/* Grid for compact fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Equipment ID (Required) */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold tracking-wide text-slate-600 uppercase">Equipment ID <span className="text-red-500">*</span></label>
                <input 
                  type="text" name="id" required value={formData.id} onChange={handleChange}
                  placeholder="e.g. EX-204" 
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                />
              </div>

              {/* Equipment Type (Required) */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold tracking-wide text-slate-600 uppercase">Equipment Type <span className="text-red-500">*</span></label>
                <input 
                  type="text" name="type" required value={formData.type} onChange={handleChange}
                  placeholder="e.g. Excavator" 
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                />
              </div>

              {/* Manufacturer (Required) */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold tracking-wide text-slate-600 uppercase">Manufacturer <span className="text-red-500">*</span></label>
                <input 
                  type="text" name="manufacturer" required value={formData.manufacturer} onChange={handleChange}
                  placeholder="e.g. Caterpillar" 
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                />
              </div>

              {/* Model (Required) */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold tracking-wide text-slate-600 uppercase">Model <span className="text-red-500">*</span></label>
                <input 
                  type="text" name="model" required value={formData.model} onChange={handleChange}
                  placeholder="e.g. CAT 336" 
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                />
              </div>

              {/* Site / Location (Required) */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[11px] font-bold tracking-wide text-slate-600 uppercase">Site / Location <span className="text-red-500">*</span></label>
                <input 
                  type="text" name="location" required value={formData.location} onChange={handleChange}
                  placeholder="e.g. Kuching Quarry Sector 4" 
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                />
              </div>

              {/* Status (Required) */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold tracking-wide text-slate-600 uppercase">Equipment Status <span className="text-red-500">*</span></label>
                <select 
                  name="status" required value={formData.status} onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all bg-white"
                >
                  <option value="active">Active (Optimal)</option>
                  <option value="warning">Warning (Maintenance Soon)</option>
                  <option value="critical">Critical (Immediate Attention)</option>
                </select>
              </div>

              {/* Assigned Team (Optional) */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-end">
                  <label className="text-[11px] font-bold tracking-wide text-slate-600 uppercase">Assigned Team</label>
                  <span className="text-[9px] text-slate-400 uppercase tracking-widest">Optional</span>
                </div>
                <input 
                  type="text" name="team" value={formData.team} onChange={handleChange}
                  placeholder="e.g. Primary Extraction Fleet" 
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                />
              </div>

              {/* Purchase Date (Optional) */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-end">
                  <label className="text-[11px] font-bold tracking-wide text-slate-600 uppercase">Purchase Date</label>
                  <span className="text-[9px] text-slate-400 uppercase tracking-widest">Optional</span>
                </div>
                <input 
                  type="date" name="purchaseDate" value={formData.purchaseDate} onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                />
              </div>

              {/* Operating Hours (Optional) */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-end">
                  <label className="text-[11px] font-bold tracking-wide text-slate-600 uppercase">Operating Hours</label>
                  <span className="text-[9px] text-slate-400 uppercase tracking-widest">Optional</span>
                </div>
                <div className="relative">
                  <input 
                    type="number" name="operatingHours" value={formData.operatingHours} onChange={handleChange}
                    placeholder="e.g. 8452" min="0"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 pr-10 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">hrs</span>
                </div>
              </div>

            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3 shrink-0">
          <button 
            type="button" 
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/50 rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="add-equipment-form"
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Save size={16} />
            Save Equipment
          </button>
        </div>

      </div>
    </div>
  );
};