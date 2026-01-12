
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
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

interface DashboardProps {
  user: User;
  entries: DailyEntry[];
  stations: Station[];
  alerts: Alert[];
}

const Dashboard: React.FC<DashboardProps> = ({ user, entries, stations, alerts }) => {
  // Aggregate data based on role
  const filteredEntries = user.role === UserRole.STATION_MANAGER 
    ? entries.filter(e => e.stationId === user.stationId)
    : entries;

  const totalSales = filteredEntries.reduce((acc, curr) => acc + curr.totalPayments, 0);
  const totalQuantity = filteredEntries.reduce((acc, curr) => acc + curr.quantitySold, 0);
  const totalNet = filteredEntries.reduce((acc, curr) => acc + curr.netAmount, 0);
  const pendingReconciliations = filteredEntries.filter(e => e.status === 'PENDING').length;

  // Chart data: daily sales over the last 7 days
  // Fixed: Added useMemo import
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
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user.name}
        </h1>
        <p className="text-gray-500">Here's what's happening across Expanse Limited today.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard 
          title="Total Revenue" 
          value={`₦${totalSales.toLocaleString()}`} 
          trend="+12.5%" 
          trendUp 
          icon={<DollarSign className="text-emerald-600" />} 
          bgColor="bg-emerald-50"
        />
        <KpiCard 
          title="Fuel Sold" 
          value={`${totalQuantity.toLocaleString()}L`} 
          trend="+8.2%" 
          trendUp 
          icon={<Fuel className="text-blue-600" />} 
          bgColor="bg-blue-50"
        />
        <KpiCard 
          title="Net Profit" 
          value={`₦${totalNet.toLocaleString()}`} 
          trend="-2.4%" 
          trendUp={false} 
          icon={<TrendingUp className="text-purple-600" />} 
          bgColor="bg-purple-50"
        />
        <KpiCard 
          title="Pending Reviews" 
          value={pendingReconciliations} 
          icon={<Clock className="text-amber-600" />} 
          bgColor="bg-amber-50"
          isCount
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Sales Chart */}
        <div className="lg:col-span-2 rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Revenue vs. Expenses (Last 7 Days)</h3>
            <select className="text-sm border-none bg-gray-100 rounded-lg px-3 py-1.5 focus:ring-0">
              <option>All Stations</option>
            </select>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(value) => `₦${value/1000}k`} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Area type="monotone" dataKey="sales" stroke="#2563eb" fillOpacity={1} fill="url(#colorSales)" strokeWidth={2} />
                <Area type="monotone" dataKey="expenses" stroke="#f43f5e" fillOpacity={0} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 flex flex-col">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Recent Alerts</h3>
            <button className="text-xs text-blue-600 font-medium hover:underline">Clear All</button>
          </div>
          <div className="flex-1 space-y-4 overflow-y-auto">
            {alerts.filter(a => !a.resolved).slice(0, 5).map((alert) => (
              <div key={alert.id} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-blue-200 transition-colors">
                <div className={`mt-0.5 rounded-full p-1.5 ${alert.severity === 'error' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                  <AlertTriangle size={14} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-gray-900">{alert.stationName}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{alert.message}</p>
                  <p className="text-[10px] text-gray-400 mt-1 font-medium">{new Date(alert.timestamp).toLocaleTimeString()}</p>
                </div>
              </div>
            ))}
            {alerts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle2 size={40} className="text-emerald-200 mb-2" />
                <p className="text-sm text-gray-500 font-medium">No active alerts. Systems normal.</p>
              </div>
            )}
          </div>
          <button className="mt-4 w-full flex items-center justify-center gap-2 rounded-lg bg-gray-100 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-200 transition-colors">
            View All Alerts <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Station Status (For Admin/CEO) */}
      {(user.role === UserRole.ADMIN || user.role === UserRole.CEO) && (
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-6">Station Performance Overview</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b text-xs font-bold uppercase tracking-wider text-gray-400">
                  <th className="pb-4">Station</th>
                  <th className="pb-4">Stock Level</th>
                  <th className="pb-4">Daily Sales</th>
                  <th className="pb-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {stations.map((station) => {
                  const stockPercent = (station.currentStock / station.capacity) * 100;
                  const isLow = station.currentStock < station.lowStockThreshold;
                  return (
                    <tr key={station.id} className="group hover:bg-gray-50 transition-colors">
                      <td className="py-4">
                        <p className="font-semibold text-gray-900">{station.name}</p>
                        <p className="text-xs text-gray-500">{station.location}</p>
                      </td>
                      <td className="py-4">
                        <div className="w-32">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-gray-700">{station.currentStock.toLocaleString()}L</span>
                            <span className="text-[10px] text-gray-400">{Math.round(stockPercent)}%</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-gray-100">
                            <div 
                              className={`h-full rounded-full ${isLow ? 'bg-red-500' : 'bg-emerald-500'}`} 
                              style={{ width: `${stockPercent}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-4 font-semibold text-gray-900">
                        ₦{entries.filter(e => e.stationId === station.id && e.date === new Date().toISOString().split('T')[0])
                          .reduce((acc, curr) => acc + curr.totalPayments, 0).toLocaleString()}
                      </td>
                      <td className="py-4">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${isLow ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                          {isLow ? <AlertTriangle size={10}/> : <CheckCircle2 size={10}/>}
                          {isLow ? 'Refill Needed' : 'Operational'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

interface KpiCardProps {
  title: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
  icon: React.ReactNode;
  bgColor: string;
  isCount?: boolean;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, trend, trendUp, icon, bgColor, isCount }) => (
  <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 flex flex-col justify-between group hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div className={`rounded-xl p-3 ${bgColor} group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      {trend && (
        <span className={`flex items-center gap-1 text-xs font-bold ${trendUp ? 'text-emerald-600' : 'text-red-600'}`}>
          {trendUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {trend}
        </span>
      )}
    </div>
    <div className="mt-4">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

export default Dashboard;