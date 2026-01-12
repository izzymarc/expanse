
import React, { useMemo, useState, useEffect } from 'react';
import { User, DailyEntry, Station, Alert, UserRole, FuelType } from '../types';
import { 
  TrendingUp, 
  DollarSign, 
  Fuel, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Zap, 
  Activity,
  Droplets,
  Truck
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart as ReBarChart,
  Bar,
  Cell
} from 'recharts';
import { motion } from 'framer-motion';
import { GoogleGenAI } from "@google/genai";

interface DashboardProps {
  user: User;
  entries: DailyEntry[];
  stations: Station[];
  alerts: Alert[];
  onResolveAlert: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, entries, stations, alerts, onResolveAlert }) => {
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const totalPMS = stations.reduce((acc, s) => acc + (s.inventory.find(i => i.type === FuelType.PMS)?.currentStock || 0), 0);
  const totalAGO = stations.reduce((acc, s) => acc + (s.inventory.find(i => i.type === FuelType.AGO)?.currentStock || 0), 0);
  const totalRevenue = entries.reduce((acc, curr) => acc + curr.totalPayments, 0);

  const generateAiInsight = async () => {
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const marketContext = `PMS Rate: ₦650. AGO Rate: ₦1200. Total PMS Stock: ${totalPMS}L. AGO Stock: ${totalAGO}L. Alerts: ${alerts.filter(a => !a.resolved).length}.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `As the Expanse 2026 Energy Analyst in Lagos, provide a 1-sentence strategic advice for the CEO based on this Nigerian fuel market data: ${marketContext}. Mention stock-outs or price hedging.`,
      });
      setAiInsight(response.text || "Operations stable across all Nigerian hubs.");
    } catch (error) {
      setAiInsight("Telemetry link to Apapa Depot unstable. Using local cache.");
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    generateAiInsight();
  }, [stations.length, entries.length]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-20">
      {/* Aurora 3.0 Header */}
      <div className="flex flex-col xl:flex-row gap-6 items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="h-1.5 w-8 bg-emerald-500 rounded-full" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Nigeria Downstream Operations</p>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Aurora Command Hub</h1>
        </div>

        <motion.div className="xl:w-1/3 w-full bg-slate-900 rounded-[2rem] p-6 border border-white/5 relative overflow-hidden shadow-2xl">
          <div className="absolute top-[-20%] right-[-10%] opacity-5">
            <Activity size={120} className="text-blue-500" />
          </div>
          <div className="flex items-center gap-3 mb-3 relative z-10">
            <Sparkles size={18} className="text-blue-400" />
            <h3 className="font-black text-[10px] uppercase tracking-widest text-slate-400">Market Intelligence</h3>
          </div>
          <p className="text-sm font-bold text-white/90 italic leading-relaxed">
            {isGenerating ? "Analyzing Nigerian fuel volatility..." : aiInsight}
          </p>
        </motion.div>
      </div>

      {/* KPI Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Consolidated Revenue" value={`₦${(totalRevenue/1000000).toFixed(2)}M`} icon={<DollarSign size={22} />} color="bg-blue-600" />
        <KpiCard title="PMS Reserve (L)" value={totalPMS.toLocaleString()} icon={<Droplets size={22} />} color="bg-emerald-500" />
        <KpiCard title="AGO Reserve (L)" value={totalAGO.toLocaleString()} icon={<Fuel size={22} />} color="bg-amber-500" />
        <KpiCard title="Fleet En Route" value="4 Tankers" icon={<Truck size={22} />} color="bg-slate-800" />
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Inventory Distribution */}
        <div className="lg:col-span-8 rounded-[2.5rem] bg-white p-10 shadow-sm border border-slate-100">
           <div className="mb-8 flex justify-between items-center">
             <h3 className="text-xl font-black text-slate-900 tracking-tight">Regional Telemetry</h3>
             <div className="flex gap-2">
                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase rounded-lg">PMS</span>
                <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black uppercase rounded-lg">AGO</span>
             </div>
           </div>
           <div className="space-y-8">
              {stations.map(station => (
                <div key={station.id} className="group">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl overflow-hidden shadow-lg">
                        <img src={station.imageUrl} className="w-full h-full object-cover" alt={station.name} />
                      </div>
                      <div>
                        <p className="font-black text-slate-900 text-sm">{station.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{station.location}</p>
                      </div>
                    </div>
                    <div className="text-right">
                       <p className="text-xs font-black text-slate-900">Health: {station.healthScore}%</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     {station.inventory.map(inv => (
                       <div key={inv.type} className="space-y-1.5">
                          <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                            <span>{inv.type}</span>
                            <span>{Math.round((inv.currentStock/inv.capacity)*100)}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                             <div 
                               className={`h-full rounded-full ${inv.type === FuelType.PMS ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                               style={{ width: `${(inv.currentStock/inv.capacity)*100}%` }}
                             />
                          </div>
                       </div>
                     ))}
                  </div>
                </div>
              ))}
           </div>
        </div>

        {/* Operational Anomalies */}
        <div className="lg:col-span-4 rounded-[2.5rem] bg-white p-10 shadow-sm border border-slate-100 flex flex-col">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Live Anomalies</h3>
              <Zap size={20} className="text-amber-500 animate-pulse" />
           </div>
           <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {alerts.filter(a => !a.resolved).map(alert => (
                <div key={alert.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-all group">
                   <div className="flex justify-between mb-1">
                      <span className="text-[9px] font-black uppercase text-slate-400">{alert.stationName}</span>
                      <button onClick={() => onResolveAlert(alert.id)} className="opacity-0 group-hover:opacity-100 text-[9px] font-bold text-blue-600 uppercase">Dismiss</button>
                   </div>
                   <p className="text-xs font-bold text-slate-800 leading-tight">{alert.message}</p>
                </div>
              ))}
              {alerts.filter(a => !a.resolved).length === 0 && (
                <div className="h-full flex flex-col items-center justify-center opacity-20 text-center py-20">
                   <CheckCircle2 size={48} className="mb-4" />
                   <p className="font-black text-xs uppercase tracking-widest">System Balanced</p>
                </div>
              )}
           </div>
        </div>
      </div>
    </motion.div>
  );
};

const KpiCard = ({ title, value, icon, color }: any) => (
  <div className="bg-white p-7 rounded-[2rem] shadow-sm border border-slate-100 relative overflow-hidden group">
    <div className={`p-4 rounded-2xl ${color} text-white shadow-xl mb-6 inline-block transition-transform group-hover:scale-110`}>
      {icon}
    </div>
    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{title}</p>
    <p className="text-2xl font-black text-slate-900 mt-1 tracking-tight">{value}</p>
  </div>
);

export default Dashboard;
