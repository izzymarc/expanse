
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
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

interface SidebarProps {
  user: User;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, onClose }) => {
  const location = useLocation();

  const links = [
    { to: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} />, roles: [UserRole.ADMIN, UserRole.CEO, UserRole.ACCOUNTANT, UserRole.STATION_MANAGER] },
    { to: '/entry', label: 'Sales Entry', icon: <FileEdit size={20} />, roles: [UserRole.STATION_MANAGER, UserRole.ADMIN] },
    { to: '/approvals', label: 'Reconciliation', icon: <ClipboardCheck size={20} />, roles: [UserRole.ACCOUNTANT, UserRole.ADMIN] },
    { to: '/stations', label: 'Stations', icon: <Fuel size={20} />, roles: [UserRole.ADMIN] },
    { to: '/reports', label: 'Financials', icon: <BarChart3 size={20} />, roles: [UserRole.CEO, UserRole.ADMIN, UserRole.ACCOUNTANT, UserRole.STATION_MANAGER] },
    { to: '/audit', label: 'Audit Trail', icon: <History size={20} />, roles: [UserRole.ADMIN] },
  ];

  const filteredLinks = links.filter(link => link.roles.includes(user.role));

  return (
    <div className="flex h-full flex-col bg-slate-900 text-slate-300">
      <div className="mb-10 flex h-20 items-center justify-between px-8 border-b border-slate-800/50">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 font-black text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]">
            X
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-white">EXPANSE</h1>
            <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-blue-500 leading-none">Limited</p>
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
                relative flex items-center justify-between rounded-2xl px-5 py-4 text-sm font-bold transition-all group
                ${isActive 
                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/40 translate-x-1' 
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'}
              `}
            >
              <div className="flex items-center gap-4">
                <span className={`transition-colors ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'}`}>
                  {link.icon}
                </span>
                <span>{link.label}</span>
              </div>
              {!isActive && (
                 <ChevronRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-6">
        <div className="rounded-3xl bg-slate-800/40 p-5 border border-slate-800 ring-1 ring-slate-700/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">System Secure</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-300">v2.4.0</p>
            <Settings size={14} className="text-slate-600 cursor-pointer hover:text-slate-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
