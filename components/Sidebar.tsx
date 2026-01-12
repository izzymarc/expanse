
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { User, UserRole } from '../types';
import { 
  LayoutDashboard, 
  FileEdit, 
  ClipboardCheck, 
  Fuel, 
  BarChart3, 
  History, 
  Settings,
  X,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { motion } from 'framer-motion';

interface SidebarProps {
  user: User;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, onClose }) => {
  const location = useLocation();

  const links = [
    { to: '/', label: 'Command Hub', icon: <LayoutDashboard size={20} />, roles: [UserRole.ADMIN, UserRole.CEO, UserRole.ACCOUNTANT, UserRole.STATION_MANAGER] },
    { to: '/entry', label: 'Telemetry Entry', icon: <FileEdit size={20} />, roles: [UserRole.STATION_MANAGER, UserRole.ADMIN] },
    { to: '/approvals', label: 'Reconciliation', icon: <ClipboardCheck size={20} />, roles: [UserRole.ACCOUNTANT, UserRole.ADMIN] },
    { to: '/stations', label: 'Network Nodes', icon: <Fuel size={20} />, roles: [UserRole.ADMIN] },
    { to: '/reports', label: 'Strategic Intel', icon: <BarChart3 size={20} />, roles: [UserRole.CEO, UserRole.ADMIN, UserRole.ACCOUNTANT, UserRole.STATION_MANAGER] },
    { to: '/audit', label: 'Secure Logs', icon: <History size={20} />, roles: [UserRole.ADMIN] },
  ];

  const filteredLinks = links.filter(link => link.roles.includes(user.role));

  return (
    <div className="flex h-full flex-col bg-slate-950 text-slate-400 border-r border-white/5">
      <div className="mb-10 flex h-24 items-center justify-between px-8 border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-[1rem] bg-blue-600 font-black text-white shadow-[0_0_30px_rgba(37,99,235,0.4)]">
            E
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter text-white">EXPANSE</h1>
            <div className="flex items-center gap-1.5">
               <span className="h-1 w-1 rounded-full bg-blue-500 animate-pulse" />
               <p className="text-[9px] uppercase font-black tracking-[0.3em] text-blue-500/80 leading-none">Aurora Core</p>
            </div>
          </div>
        </div>
        <button className="text-slate-500 hover:text-white lg:hidden transition-colors" onClick={onClose}>
          <X size={24} />
        </button>
      </div>

      <nav className="flex-1 space-y-2 px-6">
        {filteredLinks.map((link) => {
          const isActive = location.pathname === link.to;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => { if (window.innerWidth < 1024) onClose(); }}
              className={`
                relative flex items-center justify-between rounded-2xl px-5 py-4 text-sm font-black transition-all group
                ${isActive 
                  ? 'bg-blue-600 text-white shadow-2xl shadow-blue-600/20 translate-x-1' 
                  : 'text-slate-500 hover:bg-white/5 hover:text-white'}
              `}
            >
              <div className="flex items-center gap-4">
                <span className={`transition-colors ${isActive ? 'text-white' : 'text-slate-600 group-hover:text-blue-500'}`}>
                  {link.icon}
                </span>
                <span className="tracking-tight">{link.label}</span>
              </div>
              {isActive && (
                 <motion.div layoutId="activeInd" className="h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_8px_white]" />
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-6">
        <div className="rounded-[2rem] bg-white/5 p-6 border border-white/5 backdrop-blur-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">System Secure</p>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
               <ShieldCheck size={14} className="text-blue-500" />
               <p className="text-xs font-black text-slate-300">v3.0.0</p>
            </div>
            <Settings size={14} className="text-slate-600 cursor-pointer hover:text-white transition-colors" />
          </div>
        </div>
        <p className="text-center text-[9px] font-black text-slate-700 uppercase tracking-[0.4em] mt-6">&copy; 2026 EXPANSE GLOBAL</p>
      </div>
    </div>
  );
};

export default Sidebar;
