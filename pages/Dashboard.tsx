
import React, { useMemo } from 'react';
import { User, DailyEntry, Station, Alert, UserRole } from '../types';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Fuel, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  Clock
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { motion } from 'framer-motion';

interface DashboardProps {
  user: User;
  entries: DailyEntry[];
  stations: Station[];
  alerts: Alert[];
}

const Dashboard: React.FC<DashboardProps> = ({ user, entries, stations, alerts }) => {
  const filteredEntries = user.role === UserRole.STATION_MANAGER 
    ? entries.filter(e => e.stationId === user.stationId)
    : entries;

  const totalSales = filteredEntries.reduce((acc, curr) => acc + curr.totalPayments, 0);
  const totalQuantity = filteredEntries.reduce((acc, curr) => acc + curr.quantitySold, 0);
  const totalNet = filteredEntries.reduce((acc, curr) => acc + curr.netAmount, 0);
  const pendingReconciliations = filteredEntries.filter(e => e.status === 'PENDING').length;

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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-10"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Monitoring enterprise operations in real-time.</p>
        </div>
        <div className="flex gap-3">
           <button className="px-5 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
             Export Data
           </button>
           <button className="px-5 py-2.5 bg-blue-600 text-white rounded-2xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
             New Entry
           </button>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard 
          title="Total Revenue" 
          value={`₦${totalSales.toLocaleString()}`} 
          trend="+12.5%" 
          trendUp 
          icon={<DollarSign size={24} />} 
          colorClass="bg-emerald-500"
        />
        <KpiCard 
          title="Fuel Dispatched" 
          value={`${totalQuantity.toLocaleString()}L`} 
          trend="+8.2%" 
          trendUp 
          icon={<Fuel size={24} />} 
          colorClass="bg-blue-600"
        />
        <KpiCard 
          title="Net Profit" 
          value={`₦${totalNet.toLocaleString()}`} 
          trend="-2.4%" 
          trendUp={false} 
          icon={<TrendingUp size={24} />} 
          colorClass="bg-indigo-600"
        />
        <KpiCard 
          title="Awaiting Review" 
          value={pendingReconciliations} 
          icon={<Clock size={24} />} 
          colorClass="bg-amber-500"
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <motion.div variants={item} className="lg:col-span-2 rounded-[2.5rem] bg-white p-10 shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl -mr-32 -mt-32 -z-10" />
          <div className="mb-10 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">Financial Trajectory</h3>
              <p className="text-sm text-slate-400 mt-1">Daily revenue vs operating costs</p>
            </div>
            <div className="flex gap-2">
              <span className="flex items-center gap-2 text-xs font-bold text-slate-400 px-3 py-1.5 bg-slate-50 rounded-xl">
                <div className="h-2 w-2 rounded-full bg-blue-600" /> Revenue
              </span>
              <span className="flex items-center gap-2 text-xs font-bold text-slate-400 px-3 py-1.5 bg-slate-50 rounded-xl">
                <div className="h-2 w-2 rounded-full bg-rose-500" /> Expenses
              </span>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} 
                  dy={15} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} 
                  tickFormatter={(value) => `₦${value/1000}k`} 
                />
                <Tooltip 
                  cursor={{stroke: '#e2e8f0', strokeWidth: 2}}
                  contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)', padding: '16px'}}
                  itemStyle={{fontWeight: 'bold', fontSize: '13px'}}
                />
                <Area type="monotone" dataKey="sales" stroke="#2563eb" fillOpacity={1} fill="url(#colorSales)" strokeWidth={3} animationDuration={1500} />
                <Area type="monotone" dataKey="expenses" stroke="#f43f5e" fillOpacity={1} fill="url(#colorExp)" strokeWidth={3} strokeDasharray="5 5" animationDuration={1500} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div variants={item} className="rounded-[2.5rem] bg-white p-8 shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col">
          <div className="mb-8 flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Priority Alerts</h3>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 px-3 py-1 rounded-lg">Live</span>
          </div>
          <div className="flex-1 space-y-5 overflow-y-auto pr-2 custom-scrollbar">
            {alerts.filter(a => !a.resolved).slice(0, 5).map((alert) => (
              <div key={alert.id} className="group relative flex items-start gap-4 p-5 rounded-3xl bg-slate-50/50 border border-slate-100 hover:border-blue-200 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
                <div className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${alert.severity === 'error' ? 'bg-red-100 text-red-600 shadow-red-100' : 'bg-amber-100 text-amber-600 shadow-amber-100'} shadow-lg`}>
                  <AlertTriangle size={18} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{alert.stationName}</p>
                    <p className="text-[10px] text-slate-400 font-bold">{new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  <p className="text-sm font-bold text-slate-900 mt-1 line-clamp-2">{alert.message}</p>
                </div>
              </div>
            ))}
            {alerts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
                <CheckCircle2 size={48} className="text-emerald-500 mb-4" />
                <p className="text-sm font-bold text-slate-900 uppercase tracking-widest">Operational Perfection</p>
                <p className="text-xs text-slate-400 mt-2">No critical alerts detected.</p>
              </div>
            )}
          </div>
          <button className="mt-8 w-full group flex items-center justify-center gap-3 rounded-[1.25rem] bg-slate-900 py-4 text-xs font-black uppercase tracking-widest text-white hover:bg-blue-600 transition-all shadow-lg shadow-slate-200">
            View All Insights <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </button>
        </motion.div>
      </div>

      {(user.role === UserRole.ADMIN || user.role === UserRole.CEO) && (
        <motion.div variants={item} className="rounded-[2.5rem] bg-white p-10 shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-100">
          <div className="flex items-center justify-between mb-10">
             <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Regional Station Performance</h3>
             <div className="flex items-center gap-3">
               <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-xl">
                 <div className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" /> Global Stable
               </div>
             </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-black uppercase tracking-[0.15em] text-slate-400">
                  <th className="pb-6">Distribution Hub</th>
                  <th className="pb-6">Inventory Status</th>
                  <th className="pb-6 text-right">Daily Velocity</th>
                  <th className="pb-6 text-center">Protocol Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {stations.map((station) => {
                  const stockPercent = (station.currentStock / station.capacity) * 100;
                  const isLow = station.currentStock < station.lowStockThreshold;
                  return (
                    <tr key={station.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="py-8 pr-4">
                        <div className="flex items-center gap-5">
                          <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold group-hover:bg-white group-hover:shadow-lg transition-all">
                            {station.name.charAt(station.name.length - 1)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-lg leading-none">{station.name}</p>
                            <p className="text-xs text-slate-400 font-medium mt-1.5">{station.location}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-8 pr-4 min-w-[200px]">
                        <div className="w-full">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-black text-slate-900">{station.currentStock.toLocaleString()}L</span>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{Math.round(stockPercent)}% Capacity</span>
                          </div>
                          <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${stockPercent}%` }}
                              transition={{ duration: 1.5, ease: "easeOut" }}
                              className={`h-full rounded-full shadow-[0_0_12px_rgba(0,0,0,0.1)] ${isLow ? 'bg-gradient-to-r from-red-500 to-rose-400' : 'bg-gradient-to-r from-blue-600 to-indigo-500'}`} 
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-8 pr-4 text-right">
                        <p className="text-lg font-black text-slate-900">
                          ₦{entries.filter(e => e.stationId === station.id && e.date === new Date().toISOString().split('T')[0])
                            .reduce((acc, curr) => acc + curr.totalPayments, 0).toLocaleString()}
                        </p>
                        <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-1">Settled</p>
                      </td>
                      <td className="py-8 text-center">
                        <div className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-[10px] font-black uppercase tracking-[0.1em] ${isLow ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                          <div className={`h-2 w-2 rounded-full ${isLow ? 'bg-red-500 animate-ping' : 'bg-emerald-500'}`} />
                          {isLow ? 'Critically Low' : 'Operational'}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
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
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, trend, trendUp, icon, colorClass }) => (
  <motion.div 
    variants={{ hidden: { opacity: 0, scale: 0.95 }, show: { opacity: 1, scale: 1 } }}
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
    className="relative group rounded-[2.5rem] bg-white p-8 shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-100 overflow-hidden"
  >
    <div className="flex items-start justify-between">
      <div className={`rounded-2xl p-4 ${colorClass} text-white shadow-xl group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      {trend && (
        <span className={`flex items-center gap-1.5 text-xs font-black tracking-widest px-3 py-1.5 rounded-xl ${trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
          {trendUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {trend}
        </span>
      )}
    </div>
    <div className="mt-8">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{title}</p>
      <p className="mt-2 text-3xl font-black text-slate-900 tracking-tight">{value}</p>
    </div>
  </motion.div>
);

export default Dashboard;
