
import React from 'react';
import { NavLink } from 'react-router-dom';
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

interface SidebarProps {
  user: User;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, onClose }) => {
  const links = [
    { to: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} />, roles: [UserRole.ADMIN, UserRole.CEO, UserRole.ACCOUNTANT, UserRole.STATION_MANAGER] },
    { to: '/entry', label: 'Daily Sales Entry', icon: <FileEdit size={20} />, roles: [UserRole.STATION_MANAGER, UserRole.ADMIN] },
    { to: '/approvals', label: 'Reconciliation', icon: <ClipboardCheck size={20} />, roles: [UserRole.ACCOUNTANT, UserRole.ADMIN] },
    { to: '/stations', label: 'Station Management', icon: <Fuel size={20} />, roles: [UserRole.ADMIN] },
    { to: '/reports', label: 'Financial Reports', icon: <BarChart3 size={20} />, roles: [UserRole.CEO, UserRole.ADMIN, UserRole.ACCOUNTANT, UserRole.STATION_MANAGER] },
    { to: '/audit', label: 'Audit Trail', icon: <History size={20} />, roles: [UserRole.ADMIN] },
  ];

  const filteredLinks = links.filter(link => link.roles.includes(user.role));

  return (
    <div className="flex h-full flex-col p-4">
      <div className="mb-8 flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-bold text-white shadow-lg shadow-blue-900/40">
            E
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">Expanse</h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-400">Limited</p>
          </div>
        </div>
        <button className="text-slate-400 hover:text-white lg:hidden" onClick={onClose}>
          <X size={24} />
        </button>
      </div>

      <nav className="flex-1 space-y-1.5">
        {filteredLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={() => { if (window.innerWidth < 1024) onClose(); }}
            className={({ isActive }) => `
              flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition-all group
              ${isActive 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'}
            `}
          >
            <div className="flex items-center gap-3">
              {link.icon}
              <span>{link.label}</span>
            </div>
            <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto rounded-xl bg-slate-800/50 p-4 border border-slate-700">
        <div className="flex items-center gap-3">
          <Settings size={18} className="text-slate-400" />
          <p className="text-sm font-medium text-slate-300">System v2.4.0</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
