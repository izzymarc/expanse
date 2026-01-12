
import React, { useMemo } from 'react';
import { DailyEntry } from '../types';
import { History, User as UserIcon, Calendar, Info, ArrowRight } from 'lucide-react';

interface AuditLogsProps {
  entries: DailyEntry[];
}

const AuditLogs: React.FC<AuditLogsProps> = ({ entries }) => {
  // Collect all audit logs from all entries
  const allLogs = useMemo(() => {
    return entries.flatMap(e => e.auditTrail.map(log => ({
      ...log,
      stationName: e.stationName,
      dateOfRecord: e.date
    }))).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [entries]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-gray-900">Audit Trail</h1>
        <p className="text-gray-500">Chronological history of all system events and approvals.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b flex justify-between items-center">
          <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-widest">
            <History size={16} /> Activity History
          </div>
          <span className="text-xs text-slate-400 font-medium">{allLogs.length} events logged</span>
        </div>

        <div className="divide-y divide-gray-100">
          {allLogs.map((log, idx) => (
            <div key={idx} className="p-6 hover:bg-slate-50 transition-colors flex flex-col md:flex-row gap-6">
              <div className="md:w-48 shrink-0">
                <p className="text-xs font-bold text-slate-900 uppercase tracking-tight">
                  {new Date(log.timestamp).toLocaleDateString(undefined, { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </p>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </p>
              </div>

              <div className="flex-1 flex gap-4">
                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                  <UserIcon size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-slate-900">{log.userName}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border ${
                      log.action === 'APPROVED' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                      log.action === 'REJECTED' ? 'bg-red-50 border-red-100 text-red-600' :
                      'bg-blue-50 border-blue-100 text-blue-600'
                    }`}>
                      {log.action}
                    </span>
                    <span className="text-xs text-slate-400">on record for</span>
                    <span className="text-xs font-bold text-slate-600">{log.stationName} ({log.dateOfRecord})</span>
                  </div>
                  <p className="text-sm text-slate-500 mt-2 bg-slate-100 p-3 rounded-lg border border-slate-200">
                    <Info size={14} className="inline mr-2 text-slate-400" />
                    {log.details}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {allLogs.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-gray-400 italic">No activity has been logged yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;
