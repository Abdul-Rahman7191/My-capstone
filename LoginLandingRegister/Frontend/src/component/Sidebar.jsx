import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  PanelLeftOpen, PanelLeftClose, Home, Tractor, 
  Wrench, FileText, MoreVertical, LogOut, 
  User as UserIcon, Settings 
} from 'lucide-react';
import logo from '../assets/transparent_logo.png';

export default function Sidebar({ currentUser, onLogout }) {
    const [isOpen, setIsOpen] = useState(true);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const profileMenuRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    const mainMenuItems = [
        { id: "dashboard", name: "Dashboard", icon: <Home size={20} /> },
        { id: "equipment", name: "Equipment", icon: <Tractor size={20} />},
        { id: "maintenance", name: "Maintenance", icon: <Wrench size={20} />},
        { id: "reports", name: "Reports", icon: <FileText size={20} /> },
    ];

    const activeUser = currentUser || { name: "Loading...", role: "", avatar: "" };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setIsProfileMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

  return (
    <div className={`bg-white border-r border-slate-200 h-screen shrink-0 transition-all duration-300 flex flex-col p-4 ${isOpen ? 'w-64' : 'w-20'}`}>

      <div className={`flex items-center mb-8 h-10 shrink-0 ${isOpen ? 'justify-between' : 'justify-center'}`}>
          {isOpen && (
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black shadow-sm">
                <img src={logo} alt="Ichiban Logo" className="h-5 w-5 object-contain" />
              </div>
              <div className="truncate">
                <h1 className="font-display font-bold text-[17px] tracking-tight text-slate-900 leading-none truncate">
                  repAIr <span className="text-red-600">by Ichiban</span>
                </h1>
              </div>
            </div>
          )}

          <button 
            onClick={() => {
                setIsOpen(!isOpen);
                setIsProfileMenuOpen(false);
            }}
            className="p-1.5 hover:bg-slate-100 rounded-md transition-colors text-slate-500 hover:text-slate-800 shrink-0 cursor-pointer"
            aria-label="Toggle Sidebar"
          >
            {isOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
          </button>
      </div>

      <nav className="flex-1 overflow-y-auto overflow-x-hidden space-y-8 no-scrollbar">
        <div>
            {isOpen && (
                <p className="px-3 mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Main Menu
                </p>
            )}
            <ul className="space-y-1">
                {mainMenuItems.map((item) => {
                    const isActive = location.pathname === `/${item.id}`;
                    return (
                        <li key={item.id}>
                            <button
                                onClick={() => navigate(`/${item.id}`)}
                                title={!isOpen ? item.name : ""}
                                className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl transition-all cursor-pointer
                                ${isActive
                                    ? 'bg-blue-600 text-white shadow-sm font-semibold' 
                                    : 'text-slate-600 hover:bg-slate-100 font-medium hover:text-slate-900'}`}
                            >
                                <div className="min-w-[20px] shrink-0">
                                    {item.icon}
                                </div>
                                <span className={`transition-opacity duration-200 whitespace-nowrap text-sm
                                ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none w-0 hidden'}`}>
                                    {item.name}
                                </span>
                            </button>
                        </li>
                    );
                })}
            </ul>
        </div>
      </nav>

      <div className="mt-auto shrink-0 pt-4 relative" ref={profileMenuRef}>

        {isProfileMenuOpen && (
          <div className={`absolute bottom-full mb-2 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden animate-fadeIn z-50 w-56 ${isOpen ? 'left-0' : 'left-0'}`}>
            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
              <span className="block text-sm font-bold text-slate-900 truncate">{activeUser.name}</span>
              <span className="block text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 mt-0.5 truncate">
                Role: {activeUser.role}
              </span>
            </div>

            <div className="p-1.5">
              <button className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-blue-700 rounded-lg transition-colors cursor-pointer">
                <UserIcon size={14} /> Profile
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-blue-700 rounded-lg transition-colors cursor-pointer">
                <Settings size={14} /> Preferences
              </button>
            </div>

            <div className="p-1.5 border-t border-slate-100">
              <button 
                onClick={onLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          </div>
        )}

        <button 
          onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
          title={!isOpen ? "Profile Settings" : ""}
          className={`w-full flex items-center p-2 rounded-xl border transition-all cursor-pointer border-transparent hover:bg-slate-100 ${
            isProfileMenuOpen ? 'bg-slate-100' : ''
          } ${isOpen ? 'justify-between' : 'justify-center'}`}
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <img 
              src={activeUser.avatar} 
              alt="Profile" 
              className="w-8 h-8 rounded-full border border-slate-200 shrink-0 shadow-sm object-cover"
            />
            {isOpen && (
              <div className="flex flex-col items-start truncate w-24">
                <span className="font-bold text-sm text-slate-900 truncate w-full text-left">{activeUser.name}</span>
              </div>
            )}
          </div>
          {isOpen && (
            <MoreVertical size={16} className="text-slate-400 shrink-0" />
          )}
        </button>
      </div>

    </div>
  );
}