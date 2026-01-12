
import React, { useMemo, useState, useEffect } from 'react';
import { User, DailyEntry, Station, Alert, UserRole } from '../types';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Fuel, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  Clock,
  Sparkles,
  Zap,
  BarChart,
  Target,
  Waves,
  Activity
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
  Cell,
  LineChart,
  Line
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
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

  const filteredEntries = user.role === UserRole.STATION_MANAGER 
    ? entries.filter(e => e.stationId === user.stationId)
    : entries;

  const totalSales = filteredEntries.reduce((acc, curr) => acc + curr.totalPayments, 0);
  const totalQuantity = filteredEntries.reduce((acc, curr) => acc + curr.quantitySold, 0);
  const totalNet = filteredEntries.reduce((acc, curr) => acc + curr.netAmount, 0);
  const pendingReconciliations = filteredEntries.filter(e => e.status === 'PENDING').length;

  const generateAiInsight = async () => {
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const summary = `System: Expanse Core 3.0. 
                       Stations Capacity: ${stations.reduce((a,b) => a+b.capacity, 0)}L. 
                       Current Stock: ${stations.reduce((a,b) => a+b.currentStock, 0)}L. 
                       Revenue: ₦${totalSales}. 
                       Active Alerts: ${alerts.filter(a => !a.resolved).length}.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `As the Expanse 2026 Operations Strategist, provide a razor-sharp, high-level business brief (max 35 words) based on this data: ${summary}. Mention specific operational optimization or market positioning.`,
      });
      setAiInsight(response.text || "Operational sync confirmed. System optimal.");
    } catch (error) {
      setAiInsight("Telemetry link interrupted. Local protocols active.");
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    generateAiInsight();
  }, [stations.length, entries.length]);

  const forecastData = useMemo(() => {
    const base = [...Array(10)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (9 - i));
      const sales = 15000 + Math.random() * 5000;
      return {
        name: d.toISOString().split('T')[0].slice(8),
        actual: i < 7 ? sales : null,
        forecast: i >= 6 ? sales + (Math.random() * 2000 - 1000) : null,
        demand: 16000 + (Math.sin(i) * 3000)
      };
    });
    return base;
  }, []);

  const stationPerformanceData = useMemo(() => {
    return stations.map((s, idx) => {
      const stationEntries = entries.filter(e => e.stationId === s.id);
      return {
        name: s.name.split('-')[1]?.trim() || s.name,
        revenue: stationEntries.reduce((acc, curr) => acc + curr.totalPayments, 0),
        color: ['#3b82f6', '#818cf8', '#6366f1', '#4f46e5'][idx % 4]
      };
    }).sort((a, b) => b.revenue - a.revenue);
  }, [stations, entries]);

  const chartData = useMemo(() => {
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => {
      const dayEntries = filteredEntries.filter(e => e.date === date);
      return {
        name: date.split('-').slice(1).join('/'),
        sales: dayEntries.reduce((acc, curr) => acc + curr.totalPayments, 0),
        expenses: dayEntries.reduce((acc, curr) => acc + curr.totalExpenses, 0)
      };
    });
  }, [filteredEntries]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-10 pb-20"
    >
      {/* 2026 Aurora Header */}
      <div className="flex flex-col xl:flex-row gap-8 items-center justify-between">
        <div className="w-full xl:w-auto">
          <div className="flex items-center gap-3 mb-2">
            <span className="h-1.5 w-12 bg-blue-600 rounded-full" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600">Strategic Overview</p>
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight">
            Aurora Command
          </h1>
        </div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="xl:w-2/5 w-full glass rounded-[2.5rem] p-7 border border-blue-100 shadow-2xl shadow-blue-500/5 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <Activity size={64} className="text-blue-600" />
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-slate-900 p-3 rounded-2xl text-blue-400 shadow-xl">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="font-black text-xs uppercase tracking-widest text-slate-400 leading-none">AI Business Brief</h3>
              <p className="text-[10px] text-blue-600 font-bold mt-1">Live from Intelligence Hub</p>
            </div>
          </div>
          <p className="text-sm font-bold text-slate-700 leading-relaxed italic border-l-4 border-blue-500 pl-4 py-1">
            {isGenerating ? "Synthesizing global telemetry..." : aiInsight}
          </p>
        </motion.div>
      </div>

      {/* KPI Cards with Pulsing Effects */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard 
          title="Consolidated Revenue" 
          value={`₦${totalSales.toLocaleString()}`} 
          trend="+14.2%" 
          trendUp 
          icon={<DollarSign size={24} />} 
          colorClass="bg-blue-600"
          pulse
        />
        <KpiCard 
          title="Active Inventory" 
          value={`${stations.reduce((a,b) => a+b.currentStock, 0).toLocaleString()}L`} 
          icon={<Fuel size={24} />} 
          colorClass="bg-slate-900"
        />
        <KpiCard 
          title="Operational Alpha" 
          value={`₦${totalNet.toLocaleString()}`} 
          trend="-1.2%" 
          trendUp={false} 
          icon={<TrendingUp size={24} />} 
          colorClass="bg-indigo-600"
        />
        <KpiCard 
          title="Audit Backlog" 
          value={pendingReconciliations} 
          icon={<Clock size={24} />} 
          colorClass="bg-rose-500"
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Main Forecasting Area */}
        <div className="lg:col-span-8 space-y-8">
           <div className="rounded-[3rem] bg-white p-10 shadow-sm border border-slate-100">
              <div className="mb-10 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Supply vs Demand Forecast</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Predictive analysis for next 72 hours</p>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-blue-500" />
                    <span className="text-[10px] font-black uppercase text-slate-400">Actual</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-indigo-200" />
                    <span className="text-[10px] font-black uppercase text-slate-400">Projected</span>
                  </div>
                </div>
              </div>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={forecastData}>
                    <defs>
                      <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#818cf8" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} />
                    <Tooltip contentStyle={{borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                    <Area type="monotone" dataKey="actual" stroke="#3b82f6" fillOpacity={1} fill="url(#colorActual)" strokeWidth={4} />
                    <Area type="monotone" dataKey="forecast" stroke="#818cf8" strokeDasharray="5 5" fillOpacity={1} fill="url(#colorForecast)" strokeWidth={3} />
                    <Line type="monotone" dataKey="demand" stroke="#e11d48" strokeWidth={2} dot={false} strokeOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
           </div>
        </div>

        {/* Vertical performance ranking */}
        <div className="lg:col-span-4 rounded-[3rem] bg-slate-900 p-10 shadow-2xl shadow-blue-900/10 flex flex-col">
          <div className="mb-10 text-white">
            <h3 className="text-xl font-black tracking-tight">Hub Efficiency</h3>
            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">Relative performance ranking</p>
          </div>
          <div className="flex-1 space-y-6">
            {stationPerformanceData.map((station, i) => (
              <div key={station.name} className="relative">
                 <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-black text-white">{station.name}</span>
                    <span className="text-[10px] font-bold text-slate-400">₦{(station.revenue/1000000).toFixed(1)}M</span>
                 </div>
                 <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(station.revenue / stationPerformanceData[0].revenue) * 100}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className="h-full rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                    />
                 </div>
              </div>
            ))}
          </div>
          <div className="mt-10 p-5 bg-white/5 rounded-3xl border border-white/10">
             <div className="flex items-center gap-3">
                <Target size={20} className="text-blue-500" />
                <p className="text-[10px] font-black text-white uppercase tracking-widest">Global Sales Target</p>
             </div>
             <p className="text-2xl font-black text-white mt-2">84.2%</p>
             <div className="h-1 w-full bg-white/10 rounded-full mt-2">
                <div className="h-full w-[84%] bg-emerald-500 rounded-full" />
             </div>
          </div>
        </div>
      </div>

      {/* Lower Section: Inventory Grid & Incident Hub */}
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-[3rem] bg-white p-10 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Node Telemetry</h3>
            <button className="text-blue-600 font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
              View Map <ArrowRight size={14} />
            </button>
          </div>
          <div className="space-y-6">
            {stations.map(station => (
              <div key={station.id} className="group p-2 hover:bg-slate-50 rounded-[1.5rem] transition-all">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                      <img 
                        src={station.imageUrl || 'https://images.unsplash.com/photo-1563906267088-b029e7101114?q=80&w=100&auto=format&fit=crop'} 
                        alt={station.name}
                        className="w-full h-full object-cover transition-transform group-hover:scale-110"
                      />
                    </div>
                    <div>
                       <span className="font-black text-slate-900 block text-sm leading-none">{station.name}</span>
                       <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest mt-1.5 inline-block">{station.location}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-slate-900 block">{station.currentStock.toLocaleString()}L</span>
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${station.currentStock < station.lowStockThreshold ? 'text-rose-500' : 'text-emerald-500'}`}>
                      {station.currentStock < station.lowStockThreshold ? 'Critical' : 'Stable'}
                    </span>
                  </div>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(station.currentStock / station.capacity) * 100}%` }}
                    className={`h-full rounded-full transition-all duration-1000 ${station.currentStock < station.lowStockThreshold ? 'bg-rose-500' : 'bg-blue-600'}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[3rem] bg-white p-10 shadow-sm border border-slate-100 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Active Anomalies</h3>
            <div className="flex items-center gap-2 px-3 py-1 bg-rose-50 text-rose-600 rounded-full">
               <span className="h-1.5 w-1.5 bg-rose-500 rounded-full animate-ping" />
               <span className="text-[10px] font-black uppercase tracking-widest">Monitoring</span>
            </div>
          </div>
          <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {alerts.filter(a => !a.resolved).length > 0 ? (
              alerts.filter(a => !a.resolved).map(alert => (
                <div key={alert.id} className="flex items-center gap-5 p-5 rounded-[2rem] bg-slate-50 border border-slate-100 hover:border-blue-200 transition-all group">
                   <div className={`p-3 rounded-2xl shadow-lg ${alert.severity === 'error' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}`}>
                     <AlertTriangle size={20} />
                   </div>
                   <div className="flex-1">
                      <div className="flex justify-between">
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{alert.stationName}</p>
                        <p className="text-[9px] font-bold text-slate-400">{new Date(alert.timestamp).toLocaleTimeString()}</p>
                      </div>
                      <p className="text-sm font-black text-slate-900 mt-1">{alert.message}</p>
                   </div>
                   <button 
                    onClick={() => onResolveAlert(alert.id)}
                    className="p-3 bg-white text-blue-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-all shadow-sm hover:bg-blue-600 hover:text-white"
                   >
                     <CheckCircle2 size={18} />
                   </button>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center opacity-30">
                <CheckCircle2 size={48} className="text-emerald-500 mb-4" />
                <p className="text-sm font-black text-slate-900 uppercase tracking-widest">Network Clear</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

interface KpiCardProps {
  title: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
  icon: React.ReactNode;
  colorClass: string;
  pulse?: boolean;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, trend, trendUp, icon, colorClass, pulse }) => (
  <motion.div 
    whileHover={{ y: -8, scale: 1.02 }}
    className="rounded-[2.5rem] bg-white p-8 shadow-sm border border-slate-100 relative overflow-hidden group"
  >
    {pulse && (
      <div className="absolute top-4 right-4 h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
      </div>
    )}
    <div className="flex items-start justify-between">
      <div className={`rounded-2xl p-4 ${colorClass} text-white shadow-2xl transition-transform group-hover:rotate-6`}>
        {icon}
      </div>
      {trend && (
        <span className={`px-2.5 py-1.5 rounded-xl text-[10px] font-black ${trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
          {trend}
        </span>
      )}
    </div>
    <div className="mt-8">
      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">{title}</p>
      <p className="mt-2 text-3xl font-black text-slate-900 tracking-tighter">{value}</p>
    </div>
    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
  </motion.div>
);

export default Dashboard;
