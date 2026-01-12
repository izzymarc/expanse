
import React, { useState } from 'react';
import { INITIAL_USERS } from '../constants';
import { ShieldCheck, ArrowRight, Fuel, Sparkles, ChevronRight, Globe, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface LoginPageProps {
  onLogin: (email: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('admin@expanse.com');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-slate-950">
      {/* Background Cinematic Image - High Performance Logistics Theme */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2000&auto=format&fit=crop" 
          alt="Expanse Operations" 
          className="w-full h-full object-cover opacity-20 grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 via-slate-950/40 to-slate-950" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]" />

      <div className="w-full max-w-xl relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <div className="inline-flex relative h-28 w-28 items-center justify-center rounded-[2.5rem] bg-slate-900 border border-white/10 shadow-[0_0_60px_rgba(37,99,235,0.2)] mb-8">
            <Fuel size={48} className="text-blue-500" />
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-[2.5rem] border border-blue-500/30 border-dashed"
            />
          </div>
          <h1 className="text-6xl font-black text-white tracking-tighter mb-2">
            EXPANSE
          </h1>
          <div className="flex items-center justify-center gap-3">
             <div className="h-px w-8 bg-blue-500/50" />
             <p className="text-blue-400 text-xs font-black uppercase tracking-[0.6em]">Core Intelligence</p>
             <div className="h-px w-8 bg-blue-500/50" />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass rounded-[3.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.6)] overflow-hidden border border-white/10 backdrop-blur-2xl"
        >
          <div className="p-12">
            <div className="mb-10 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Access Terminal</h2>
                <p className="text-sm text-slate-500 mt-1 font-medium">Verify credentials for Station Network</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <Globe size={20} className="text-slate-400" />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-3">
                {INITIAL_USERS.map((u) => (
                  <motion.label 
                    key={u.id}
                    whileHover={{ x: 5, backgroundColor: 'rgba(255,255,255,0.8)' }}
                    className={`group flex items-center justify-between p-5 rounded-[1.75rem] border-2 cursor-pointer transition-all ${
                      email === u.email 
                        ? 'border-blue-600 bg-white shadow-xl shadow-blue-500/10' 
                        : 'border-slate-50 bg-slate-50/50 hover:border-slate-200'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="role" 
                      className="hidden" 
                      checked={email === u.email}
                      onChange={() => setEmail(u.email)}
                    />
                    <div className="flex items-center gap-4">
                      <div className={`h-12 w-12 rounded-2xl flex items-center justify-center font-black text-sm transition-all duration-300 ${
                        email === u.email ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white text-slate-400 border border-slate-100'
                      }`}>
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p className={`text-sm font-black transition-colors ${email === u.email ? 'text-slate-900' : 'text-slate-600'}`}>{u.name}</p>
                        <p className={`text-[9px] uppercase font-black tracking-widest transition-colors ${email === u.email ? 'text-blue-600' : 'text-slate-400'}`}>{u.role.replace('_', ' ')}</p>
                      </div>
                    </div>
                    {email === u.email && (
                      <motion.div layoutId="check" className="h-6 w-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <Zap size={12} className="text-white fill-current" />
                      </motion.div>
                    )}
                  </motion.label>
                ))}
              </div>

              <button 
                type="submit"
                className="group relative w-full mt-8 py-6 bg-slate-900 text-white rounded-[1.75rem] font-black text-sm uppercase tracking-[0.25em] flex items-center justify-center gap-3 shadow-2xl overflow-hidden transition-all active:scale-[0.98]"
              >
                <div className="relative z-10 flex items-center gap-3">
                  Initialize Session <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </form>
          </div>
          
          <div className="bg-slate-900/5 px-12 py-8 border-t border-slate-100 flex items-center justify-between">
             <div className="flex items-center gap-3 text-slate-400 text-[10px] font-black uppercase tracking-widest">
               <ShieldCheck size={18} className="text-emerald-500" />
               SECURE-CORE ACTIVATED
             </div>
             <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">v3.0.0 "AURORA"</p>
             </div>
          </div>
        </motion.div>
        
        <div className="mt-12 flex flex-col items-center gap-4">
           <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.5em] opacity-60">
             &copy; 2026 Expanse Global Logistics
           </p>
           <div className="flex gap-6 opacity-30 grayscale">
              {/* Mock Partner Logos */}
              <div className="h-4 w-12 bg-white rounded-sm" />
              <div className="h-4 w-12 bg-white rounded-sm" />
              <div className="h-4 w-12 bg-white rounded-sm" />
           </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
