
import React, { useState, useMemo } from 'react';
import { DailyEntry, Station } from '../types';
import { Download, FileText, Table as TableIcon, Calendar, Filter, ChevronDown, Printer } from 'lucide-react';

interface ReportsPageProps {
  entries: DailyEntry[];
  stations: Station[];
}

const ReportsPage: React.FC<ReportsPageProps> = ({ entries, stations }) => {
  const [dateRange, setDateRange] = useState('LAST_7');
  const [selectedStation, setSelectedStation] = useState('ALL');

  const filteredEntries = useMemo(() => {
    let result = entries;
    if (selectedStation !== 'ALL') {
      result = result.filter(e => e.stationId === selectedStation);
    }
    // Date filtering would go here based on range
    return result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [entries, selectedStation, dateRange]);

  const totals = useMemo(() => {
    return filteredEntries.reduce((acc, curr) => ({
      sales: acc.sales + curr.totalPayments,
      volume: acc.volume + curr.quantitySold,
      expenses: acc.expenses + curr.totalExpenses,
      profit: acc.profit + curr.netAmount
    }), { sales: 0, volume: 0, expenses: 0, profit: 0 });
  }, [filteredEntries]);

  const handleExport = (format: 'PDF' | 'EXCEL') => {
    alert(`Exporting ${format} report for ${selectedStation === 'ALL' ? 'All Stations' : selectedStation}...`);
    // Implementation would use libraries like jsPDF or SheetJS
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financial Reports</h1>
          <p className="text-gray-500">Analyze performance and export data for accounting.</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => handleExport('EXCEL')}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl font-bold border border-emerald-100 hover:bg-emerald-100 transition-colors"
          >
            <TableIcon size={18} /> Excel
          </button>
          <button 
            onClick={() => handleExport('PDF')}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-xl font-bold border border-red-100 hover:bg-red-100 transition-colors"
          >
            <FileText size={18} /> PDF
          </button>
          <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-xl transition-colors">
            <Printer size={20} />
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gray-100 rounded-lg text-gray-500">
            <Filter size={18} />
          </div>
          <select 
            className="bg-transparent border-none focus:ring-0 text-sm font-bold text-gray-700 pr-8"
            value={selectedStation}
            onChange={e => setSelectedStation(e.target.value)}
          >
            <option value="ALL">Consolidated View</option>
            {stations.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>

        <div className="h-6 w-px bg-gray-200 hidden sm:block" />

        <div className="flex items-center gap-2">
          <div className="p-2 bg-gray-100 rounded-lg text-gray-500">
            <Calendar size={18} />
          </div>
          <select 
            className="bg-transparent border-none focus:ring-0 text-sm font-bold text-gray-700 pr-8"
            value={dateRange}
            onChange={e => setDateRange(e.target.value)}
          >
            <option value="TODAY">Today</option>
            <option value="LAST_7">Last 7 Days</option>
            <option value="THIS_MONTH">This Month</option>
            <option value="LAST_MONTH">Last Month</option>
            <option value="CUSTOM">Custom Range</option>
          </select>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Revenue</p>
          <p className="text-2xl font-black text-gray-900">₦{totals.sales.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Expenses</p>
          <p className="text-2xl font-black text-red-600">₦{totals.expenses.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Volume</p>
          <p className="text-2xl font-black text-blue-600">{totals.volume.toLocaleString()}L</p>
        </div>
        <div className="bg-slate-900 p-6 rounded-2xl shadow-xl">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Net Profit</p>
          <p className="text-2xl font-black text-emerald-400">₦{totals.profit.toLocaleString()}</p>
        </div>
      </div>

      {/* Report Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-xs font-bold uppercase tracking-wider text-gray-500">
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Station</th>
                <th className="px-6 py-4">Volume (L)</th>
                <th className="px-6 py-4">Revenue (₦)</th>
                <th className="px-6 py-4">Expenses (₦)</th>
                <th className="px-6 py-4">Net (₦)</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {new Date(entry.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{entry.stationName}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-mono">{entry.quantitySold.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-bold">₦{entry.totalPayments.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-red-600">₦{entry.totalExpenses.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-emerald-600 font-bold">₦{entry.netAmount.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                      entry.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {entry.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
