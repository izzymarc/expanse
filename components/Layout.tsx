
import React, { useState } from 'react';
import { User, UserRole, Alert } from '../types';
import Sidebar from './Sidebar';
import { Bell, LogOut, Search, User as UserIcon, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  user: User;
  alerts: Alert[];
  onLogout: () => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ user, alerts, onLogout, children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const unreadAlerts = alerts.filter(a => !a.resolved).length;

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <div className={`fixed inset-y-0 left-0 z-50 w-72 transform bg-slate-900 transition-transform duration-300 lg:static lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar user={user} onClose={() => setIsSidebarOpen(false)} />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b bg-white/80 px-6 lg:px-10 backdrop-blur-md">
          <div className="flex items-center gap-6">
            <button 
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div className="hidden sm:flex items-center gap-3 bg-slate-100/50 px-4 py-2.5 rounded-2xl border border-slate-200/50 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:bg-white transition-all">
              <Search size={18} className="text-slate-400" />
              <input 
                type="text" 
                placeholder="Search analytics..." 
                className="bg-transparent border-none outline-none text-sm w-48 md:w-80 font-medium text-slate-600"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative cursor-pointer group p-2.5 text-slate-500 hover:bg-slate-100 rounded-full transition-all">
              <Bell size={22} />
              {unreadAlerts > 0 && (
                <span className="absolute top-2 right-2 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-4 ring-white">
                  {unreadAlerts}
                </span>
              )}
            </div>

            <div className="h-8 w-px bg-slate-200" />

            <div className="flex items-center gap-4">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-bold text-slate-900 leading-none">{user.name}</p>
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1.5">{user.role.replace('_', ' ')}</p>
              </div>
              <div className="relative group">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200 transition-transform group-hover:scale-105 active:scale-95">
                  <UserIcon size={22} />
                </div>
              </div>
              <button 
                onClick={onLogout}
                className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                title="Logout"
              >
                <LogOut size={22} />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-slate-50/50 p-6 lg:p-10">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
