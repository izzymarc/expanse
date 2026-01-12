
import React, { useState } from 'react';
import { User, DailyEntry, EntryStatus, AuditLog } from '../types';
import { 
  CheckCircle, 
  XCircle, 
  MessageSquare, 
  Eye, 
  Filter,
  Search,
  ArrowUpRight,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

interface ApprovalsProps {
  user: User;
  entries: DailyEntry[];
  onUpdateEntry: (entry: DailyEntry) => void;
}

const Approvals: React.FC<ApprovalsProps> = ({ user, entries, onUpdateEntry }) => {
  const [selectedEntry, setSelectedEntry] = useState<DailyEntry | null>(null);
  const [comments, setComments] = useState('');
  const [filterStatus, setFilterStatus] = useState<EntryStatus | 'ALL'>('PENDING');

  const filteredEntries = entries.filter(e => filterStatus === 'ALL' || e.status === filterStatus);

  const handleAction = (status: EntryStatus) => {
    if (!selectedEntry) return;

    const audit: AuditLog = {
      timestamp: new Date().toISOString(),
      userId: user.id,
      userName: user.name,
      action: status === EntryStatus.APPROVED ? 'APPROVED' : 'REJECTED',
      details: comments || 'No comments provided'
    };

    const updated: DailyEntry = {
      ...selectedEntry,
      status,
      approverComments: comments,
      auditTrail: [...selectedEntry.auditTrail, audit]
    };

    onUpdateEntry(updated);
    setSelectedEntry(null);
    setComments('');
    alert(`Entry ${status.toLowerCase()} successfully.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reconciliation & Approvals</h1>
          <p className="text-gray-500">Review daily sales entries submitted by station managers.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white px-3 py-2 rounded-lg border flex items-center gap-2">
            <Filter size={16} className="text-gray-400" />
            <select 
              className="text-sm border-none bg-transparent p-0 focus:ring-0"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
            >
              <option value="ALL">All Entries</option>
              <option value="PENDING">Pending Approval</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* List View */}
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
          <div className="p-4 border-b">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search stations..." 
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border-gray-100 rounded-lg text-sm"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredEntries.length > 0 ? (
              filteredEntries.map(entry => (
                <button
                  key={entry.id}
                  onClick={() => setSelectedEntry(entry)}
                  className={`w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors border-b last:border-0 ${selectedEntry?.id === entry.id ? 'bg-blue-50/50' : ''}`}
                >
                  <div className="text-left">
                    <p className="font-bold text-gray-900 text-sm">{entry.stationName}</p>
                    <p className="text-xs text-gray-500">{new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 text-sm">₦{entry.totalPayments.toLocaleString()}</p>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      entry.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 
                      entry.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {entry.status}
                    </span>
                  </div>
                </button>
              ))
            ) : (
              <div className="p-8 text-center">
                <p className="text-gray-400 text-sm italic">No entries found for this filter.</p>
              </div>
            )}
          </div>
        </div>

        {/* Detail View */}
        <div className="lg:col-span-2 space-y-6">
          {selectedEntry ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-slate-900 px-8 py-6 text-white flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold">{selectedEntry.stationName}</h2>
                  <p className="text-slate-400 text-sm">Reviewing entry for {new Date(selectedEntry.date).toDateString()}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs text-slate-400 uppercase font-bold tracking-widest">Reconciliation</p>
                    <p className={`text-xl font-mono font-bold ${selectedEntry.reconciliationDelta === 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {selectedEntry.reconciliationDelta === 0 ? 'BALANCED' : `Δ ₦${selectedEntry.reconciliationDelta.toLocaleString()}`}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-8">
                {/* Data Grid */}
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b pb-2">Sales & Volume</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-3 rounded-xl">
                        <p className="text-[10px] text-gray-500 font-bold uppercase">Volume Sold</p>
                        <p className="text-lg font-bold text-gray-900">{selectedEntry.quantitySold.toLocaleString()}L</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-xl">
                        <p className="text-[10px] text-gray-500 font-bold uppercase">Calculated Value</p>
                        <p className="text-lg font-bold text-gray-900">₦{selectedEntry.amount.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b pb-2">Expenses Summary</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-3 rounded-xl">
                        <p className="text-[10px] text-gray-500 font-bold uppercase">Total Exp.</p>
                        <p className="text-lg font-bold text-red-600">₦{selectedEntry.totalExpenses.toLocaleString()}</p>
                      </div>
                      <div className="bg-emerald-50 p-3 rounded-xl">
                        <p className="text-[10px] text-emerald-600 font-bold uppercase">Net Remittance</p>
                        <p className="text-lg font-bold text-emerald-700">₦{selectedEntry.netAmount.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b pb-2">Payment Channels</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                    {Object.entries(selectedEntry.payments).map(([key, val]) => (
                      <div key={key} className="bg-white border p-3 rounded-xl text-center">
                        <p className="text-[10px] text-gray-400 font-bold uppercase truncate">{key}</p>
                        <p className="text-sm font-bold text-gray-900">₦{val.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Audit Trail */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b pb-2">History & Comments</h3>
                  <div className="space-y-3">
                    {selectedEntry.auditTrail.map((log, i) => (
                      <div key={i} className="flex gap-3 items-start">
                        <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-gray-900">
                            {log.userName} <span className="text-gray-400 font-normal">at {new Date(log.timestamp).toLocaleString()}</span>
                          </p>
                          <p className="text-xs text-gray-600 mt-1">{log.details}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Form (Only for Pending) */}
                {selectedEntry.status === EntryStatus.PENDING ? (
                  <div className="pt-8 border-t space-y-4">
                    <label className="block text-sm font-medium text-gray-700">Approver Comments</label>
                    <textarea 
                      className="w-full rounded-xl border-gray-200 focus:ring-blue-500 focus:border-blue-500 h-24 p-4 text-sm"
                      placeholder="Add any verification notes or reasons for rejection..."
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                    />
                    <div className="flex gap-4">
                      <button 
                        onClick={() => handleAction(EntryStatus.APPROVED)}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
                      >
                        <CheckCircle size={20} /> Approve Entry
                      </button>
                      <button 
                        onClick={() => handleAction(EntryStatus.REJECTED)}
                        className="flex-1 bg-white border-2 border-red-600 text-red-600 hover:bg-red-50 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
                      >
                        <XCircle size={20} /> Reject Entry
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className={`p-4 rounded-xl border ${selectedEntry.status === 'APPROVED' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-red-50 border-red-100 text-red-800'}`}>
                    <p className="text-sm font-bold flex items-center gap-2 uppercase tracking-wide">
                      {selectedEntry.status === 'APPROVED' ? <CheckCircle size={16}/> : <XCircle size={16}/>}
                      This entry has been {selectedEntry.status.toLowerCase()}
                    </p>
                    {selectedEntry.approverComments && (
                      <p className="text-xs mt-2 italic font-medium opacity-80">Comments: "{selectedEntry.approverComments}"</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
              <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
                <Eye size={40} />
              </div>
              <h3 className="text-lg font-bold text-gray-400">Select an entry to review</h3>
              <p className="text-sm text-gray-300 max-w-xs mt-2">Pick an item from the list on the left to view full reconciliation details and approve or reject it.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Approvals;
