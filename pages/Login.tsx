
import React, { useState } from 'react';
import { INITIAL_USERS } from '../constants';
import { ShieldCheck, ArrowRight, Fuel, Sparkles, ChevronRight } from 'lucide-react';
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
    <div className="min-h-screen flex items-center justify-center p-6 mesh-gradient relative overflow-hidden">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-blue-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-indigo-600/10 blur-[120px] rounded-full" />

      <div className="w-full max-w-xl relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="inline-flex relative h-24 w-24 items-center justify-center rounded-[2.5rem] bg-gradient-to-br from-blue-500 to-indigo-700 shadow-[0_20px_50px_rgba(37,99,235,0.4)] mb-8">
            <Fuel size={44} className="text-white" />
            <div className="absolute -top-2 -right-2 bg-white rounded-full p-2 shadow-xl">
               <Sparkles size={16} className="text-blue-600" />
            </div>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter">
            EXPANSE
          </h1>
          <p className="text-slate-400 mt-3 text-sm font-bold uppercase tracking-[0.4em] opacity-80">Inventory & Settlement</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass rounded-[3rem] shadow-[0_40px_80px_rgba(0,0,0,0.3)] overflow-hidden border border-white/10"
        >
          <div className="p-12">
            <div className="mb-10">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">System Portal</h2>
              <p className="text-sm text-slate-500 mt-2 font-medium">Authentication required for enterprise access.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-3">
                {INITIAL_USERS.map((u) => (
                  <motion.label 
                    key={u.id}
                    whileHover={{ x: 5 }}
                    className={`group flex items-center justify-between p-5 rounded-[1.5rem] border-2 cursor-pointer transition-all ${
                      email === u.email 
                        ? 'border-blue-500 bg-blue-50/50 ring-4 ring-blue-500/10' 
                        : 'border-slate-100/50 bg-white/50 hover:bg-white hover:border-slate-200'
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
                      <div className={`h-10 w-10 rounded-2xl flex items-center justify-center font-bold text-sm ${
                        email === u.email ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
                      } transition-colors`}>
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p className={`text-sm font-black transition-colors ${email === u.email ? 'text-blue-900' : 'text-slate-700'}`}>{u.name}</p>
                        <p className={`text-[9px] uppercase font-black tracking-widest transition-colors ${email === u.email ? 'text-blue-500' : 'text-slate-400'}`}>{u.role.replace('_', ' ')}</p>
                      </div>
                    </div>
                    <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      email === u.email ? 'border-blue-600 bg-blue-600 scale-110' : 'border-slate-300'
                    }`}>
                      {email === u.email && <div className="h-2 w-2 rounded-full bg-white" />}
                    </div>
                  </motion.label>
                ))}
              </div>

              <motion.button 
                type="submit"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-6 py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-2xl hover:bg-blue-600 transition-all"
              >
                Establish Connection <ChevronRight size={18} />
              </motion.button>
            </form>
          </div>
          
          <div className="bg-slate-900/5 px-12 py-6 border-t border-white/10 flex items-center justify-between">
             <div className="flex items-center gap-3 text-slate-500 text-[10px] font-black uppercase tracking-widest">
               <ShieldCheck size={16} className="text-emerald-500" />
               End-to-end Encrypted
             </div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">v2.4.0</p>
          </div>
        </motion.div>
        
        <p className="text-center text-slate-500/60 text-[10px] font-black uppercase tracking-[0.3em] mt-12">
          &copy; 2024 Expanse Global Logistics
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
