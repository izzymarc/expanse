import React, { useState } from 'react';
import { User, Station, DailyEntry, EntryStatus, PaymentBreakdown, ExpenseBreakdown } from '../types';
import { 
  Fuel, 
  CreditCard, 
  Receipt, 
  Save, 
  AlertCircle,
  Scan,
  Camera,
  CheckCircle,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DailyEntryPageProps {
  user: User;
  stations: Station[];
  existingEntries: DailyEntry[];
  onAddEntry: (entry: DailyEntry) => void;
}

const DailyEntryPage: React.FC<DailyEntryPageProps> = ({ user, stations, existingEntries, onAddEntry }) => {
  const userStation = stations.find(s => s.id === user.stationId) || stations[0];
  const today = new Date().toISOString().split('T')[0];

  const [date, setDate] = useState(today);
  const [quantitySold, setQuantitySold] = useState<number>(0);
  const [rate, setRate] = useState<number>(650);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'success'>('idle');
  
  // Explicitly typing the state to help TypeScript with numeric calculations
  const [payments, setPayments] = useState<PaymentBreakdown>({
    cash: 0,
    pos: 0,
    transfers: 0,
    noneSales: 0,
    airRtt: 0
  });

  // Explicitly typing the state to help TypeScript with numeric calculations
  const [expenses, setExpenses] = useState<ExpenseBreakdown>({
    dieselCost: 0,
    posCharges: 0,
    operationalExpenses: 0
  });

  const totalCalculatedAmount = quantitySold * rate;
  // Fix: Cast Object.values to number[] to resolve "unknown" operator errors in reduction for payments
  const totalReceivedPayments = (Object.values(payments) as number[]).reduce((a, b) => a + b, 0);
  // Fix: Cast Object.values to number[] to resolve "unknown" operator errors in reduction for expenses
  const totalExpensesAmount = (Object.values(expenses) as number[]).reduce((a, b) => a + b, 0);
  const reconciliationDelta = totalCalculatedAmount - totalReceivedPayments;

  const handleScan = () => {
    setIsScanning(true);
    setScanStatus('scanning');
    
    // Simulate Gemini Vision processing
    setTimeout(() => {
      const mockResult = Math.floor(2500 + Math.random() * 1500);
      setQuantitySold(mockResult);
      setScanStatus('success');
      setTimeout(() => {
        setIsScanning(false);
        setScanStatus('idle');
      }, 1500);
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (quantitySold <= 0) {
      alert("Quantity sold must be greater than zero");
      return;
    }

    const newEntry: DailyEntry = {
      id: `e-${userStation.id}-${date}-${Date.now()}`,
      date,
      stationId: userStation.id,
      stationName: userStation.name,
      quantitySold,
      rate,
      amount: totalCalculatedAmount,
      payments,
      expenses,
      totalPayments: totalReceivedPayments,
      totalExpenses: totalExpensesAmount,
      netAmount: totalReceivedPayments - totalExpensesAmount,
      status: EntryStatus.PENDING,
      reconciliationDelta,
      auditTrail: [
        {
          timestamp: new Date().toISOString(),
          userId: user.id,
          userName: user.name,
          action: 'CREATED',
          details: 'Daily entry submitted for reconciliation'
        }
      ]
    };

    onAddEntry(newEntry);
    alert("Daily entry submitted successfully!");
    setQuantitySold(0);
    setPayments({ cash: 0, pos: 0, transfers: 0, noneSales: 0, airRtt: 0 });
    setExpenses({ dieselCost: 0, posCharges: 0, operationalExpenses: 0 });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Sales Entry</h1>
          <p className="text-slate-500 mt-2 font-medium">Capture daily performance for {userStation.name}</p>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
           <span className="text-xs font-black uppercase text-slate-400 tracking-widest">Processing Date</span>
           <input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)}
            className="border-none focus:ring-0 text-sm font-bold text-blue-600 bg-transparent p-0"
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Sales & Scan */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/20">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                    <Fuel size={24} />
                  </div>
                  <h2 className="font-black text-slate-900 tracking-tight">Fuel Metering</h2>
                </div>
                <button 
                  type="button"
                  onClick={handleScan}
                  disabled={isScanning}
                  className="p-3 bg-slate-900 text-white rounded-2xl hover:bg-blue-600 transition-all shadow-lg active:scale-95 disabled:opacity-50"
                >
                  <Scan size={20} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="relative">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Volume Dispatched (L)</label>
                  <input 
                    type="number" 
                    value={quantitySold || ''} 
                    onChange={(e) => setQuantitySold(parseFloat(e.target.value))}
                    className="w-full rounded-2xl border-slate-100 bg-slate-50/50 p-5 text-3xl font-black text-slate-900 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                    placeholder="0.00"
                    required
                  />
                  <AnimatePresence>
                    {isScanning && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-blue-600/90 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center text-white p-4 text-center"
                      >
                        {scanStatus === 'scanning' ? (
                          <>
                            <div className="relative h-12 w-12 mb-3">
                              <div className="absolute inset-0 border-4 border-white/20 rounded-full" />
                              <div className="absolute inset-0 border-4 border-white border-t-transparent rounded-full animate-spin" />
                            </div>
                            <p className="text-xs font-black uppercase tracking-widest">Gemini Vision OCR</p>
                            <p className="text-[10px] opacity-60 mt-1">Extracting meter digits...</p>
                          </>
                        ) : (
                          <>
                            <CheckCircle size={32} className="mb-2" />
                            <p className="text-xs font-black uppercase tracking-widest">Verification Success</p>
                          </>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Current Market Rate</label>
                  <div className="flex items-center gap-3 p-5 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-xl font-black text-slate-900">₦{rate}</span>
                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Price Fixed</span>
                  </div>
                </div>
                <div className="pt-6 border-t border-slate-100">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Projected Gross</p>
                  <p className="text-4xl font-black text-blue-600 tracking-tighter">₦{totalCalculatedAmount.toLocaleString()}</p>
                </div>
              </div>
           </div>
        </div>

        {/* Payments & Expenses */}
        <div className="lg:col-span-8 space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Payments Card */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/20">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                  <CreditCard size={24} />
                </div>
                <h2 className="font-black text-slate-900 tracking-tight">Settlement Channels</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { key: 'cash', label: 'Cash Flow' },
                  { key: 'pos', label: 'Terminal Payments' },
                  { key: 'transfers', label: 'Digital Transfer' },
                  { key: 'noneSales', label: 'Credit/None Sales' },
                  { key: 'airRtt', label: 'AIR / RTT' }
                ].map(({key, label}) => (
                  <div key={key}>
                    <label className="block text-[9px] font-black uppercase tracking-[0.15em] text-slate-400 mb-1.5">{label}</label>
                    <input 
                      type="number" 
                      value={(payments as any)[key] || ''} 
                      onChange={(e) => setPayments({...payments, [key as keyof PaymentBreakdown]: parseFloat(e.target.value) || 0})}
                      className="w-full rounded-xl border-slate-100 bg-slate-50/50 p-3 font-bold text-slate-900 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      placeholder="0.00"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-8 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Settled</p>
                  <p className="text-2xl font-black text-emerald-600">₦{totalReceivedPayments.toLocaleString()}</p>
                </div>
                <div className={`text-right ${reconciliationDelta === 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  <p className="text-[10px] font-black uppercase tracking-widest">Drift / Delta</p>
                  <p className="text-xl font-black">₦{reconciliationDelta.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Summary & Post */}
            <div className="flex flex-col gap-8">
               <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/20 flex-1">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl">
                      <Receipt size={24} />
                    </div>
                    <h2 className="font-black text-slate-900 tracking-tight">Operational Costs</h2>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-[0.15em] text-slate-400 mb-1.5">Energy & Diesel</label>
                      <input 
                        type="number" 
                        value={expenses.dieselCost || ''} 
                        onChange={(e) => setExpenses({...expenses, dieselCost: parseFloat(e.target.value) || 0})}
                        className="w-full rounded-xl border-slate-100 bg-slate-50/50 p-3 font-bold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-[0.15em] text-slate-400 mb-1.5">Maintenance & Sundry</label>
                      <input 
                        type="number" 
                        value={expenses.operationalExpenses || ''} 
                        onChange={(e) => setExpenses({...expenses, operationalExpenses: parseFloat(e.target.value) || 0})}
                        className="w-full rounded-xl border-slate-100 bg-slate-50/50 p-3 font-bold text-slate-900"
                      />
                    </div>
                  </div>
               </div>

               <button 
                type="submit"
                className="group relative w-full overflow-hidden rounded-[2.5rem] bg-slate-900 py-6 text-white shadow-2xl shadow-slate-300 transition-all hover:bg-blue-600 active:scale-[0.98]"
              >
                <div className="relative z-10 flex items-center justify-center gap-3">
                  <Save size={20} />
                  <span className="font-black text-sm uppercase tracking-[0.2em]">Transmit Daily Entry</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
          </div>

          {/* Verification Warning */}
          {reconciliationDelta !== 0 && (
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="p-6 rounded-[2rem] bg-rose-50 border border-rose-100 flex items-start gap-4"
            >
               <div className="bg-rose-500 p-3 rounded-2xl text-white shadow-lg shadow-rose-200">
                 <AlertCircle size={24} />
               </div>
               <div>
                 <h4 className="text-rose-900 font-black text-sm uppercase tracking-widest">Financial Discrepancy Detected</h4>
                 <p className="text-rose-600 text-sm font-medium mt-1">
                   There is a variance of ₦{Math.abs(reconciliationDelta).toLocaleString()} between digital calculations and physical settlement. You must provide a justification during the submission phase.
                 </p>
               </div>
            </motion.div>
          )}
        </div>
      </form>
    </div>
  );
};

export default DailyEntryPage;