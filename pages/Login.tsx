
import React, { useState } from 'react';
import { INITIAL_USERS } from '../constants';
import { ShieldCheck, ArrowRight, Fuel } from 'lucide-react';

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
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-600 shadow-2xl shadow-blue-500/50 mb-6 group transition-transform hover:rotate-12">
            <Fuel size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Expanse Limited</h1>
          <p className="text-slate-400 mt-2 font-medium">Inventory & Reconciliation System</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden p-8">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-900">Sign In</h2>
            <p className="text-sm text-slate-500 mt-1">Select a demo role to enter the system</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              {INITIAL_USERS.map((u) => (
                <label 
                  key={u.id}
                  className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all hover:border-blue-200 ${email === u.email ? 'border-blue-600 bg-blue-50' : 'border-slate-100 bg-slate-50'}`}
                >
                  <input 
                    type="radio" 
                    name="role" 
                    className="hidden" 
                    checked={email === u.email}
                    onChange={() => setEmail(u.email)}
                  />
                  <div>
                    <p className="text-sm font-bold text-slate-900">{u.name}</p>
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-tighter opacity-70">{u.role.replace('_', ' ')}</p>
                  </div>
                  <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${email === u.email ? 'border-blue-600 bg-blue-600' : 'border-slate-300'}`}>
                    {email === u.email && <div className="h-2 w-2 rounded-full bg-white" />}
                  </div>
                </label>
              ))}
            </div>

            <button 
              type="submit"
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 shadow-xl shadow-blue-200 transition-all active:scale-95"
            >
              Access System <ArrowRight size={20} />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-slate-400 text-sm">
            <ShieldCheck size={16} />
            <span>Secure Cloud Access Enabled</span>
          </div>
        </div>
        
        <p className="text-center text-slate-500 text-xs mt-8">
          &copy; 2024 Expanse Limited. All Rights Reserved.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
