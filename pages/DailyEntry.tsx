
import React, { useState } from 'react';
import { User, Station, DailyEntry, EntryStatus, FuelType, PaymentBreakdown, ExpenseBreakdown } from '../types';
import { Fuel, Save, Scan, Zap, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DailyEntryPageProps {
  user: User;
  stations: Station[];
  onAddEntry: (entry: DailyEntry) => void;
}

const DailyEntryPage: React.FC<DailyEntryPageProps> = ({ user, stations, onAddEntry }) => {
  const userStation = stations.find(s => s.id === user.stationId) || stations[0];
  const [selectedProduct, setSelectedProduct] = useState<FuelType>(FuelType.PMS);
  const [openingMeter, setOpeningMeter] = useState(0);
  const [closingMeter, setClosingMeter] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  
  const [payments, setPayments] = useState<PaymentBreakdown>({
    cash: 0, pos: 0, bankTransfer: 0, creditSales: 0
  });

  const [expenses, setExpenses] = useState<ExpenseBreakdown>({
    generatorDiesel: 0, generatorHours: 0, gridPowerCost: 0, securityLevy: 0, staffAllowances: 0
  });

  const quantitySold = closingMeter - openingMeter;
  const rate = userStation.inventory.find(i => i.type === selectedProduct)?.rate || 650;
  const totalAmount = quantitySold * rate;
  
  // Fixed: Cast Object.values to number[] to resolve type errors on reduce
  const totalReceived = (Object.values(payments) as number[]).reduce((a, b) => a + b, 0);
  const totalExpenses = (Object.values(expenses) as number[]).reduce((a, b) => a + b, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quantitySold <= 0) { alert("Invalid meter readings."); return; }

    const entry: DailyEntry = {
      id: `e-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      stationId: userStation.id,
      stationName: userStation.name,
      fuelType: selectedProduct,
      quantitySold,
      openingMeter,
      closingMeter,
      rate,
      amount: totalAmount,
      payments,
      expenses,
      totalPayments: totalReceived,
      totalExpenses,
      netAmount: totalReceived - totalExpenses,
      status: EntryStatus.PENDING,
      reconciliationDelta: totalAmount - totalReceived,
      auditTrail: [{ timestamp: new Date().toISOString(), userId: user.id, userName: user.name, action: 'SUBMITTED', details: `Daily record for ${selectedProduct}` }]
    };

    onAddEntry(entry);
    alert("Record transmitted to Aurora Cloud.");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Node Telemetry</h1>
          <p className="text-slate-500 font-bold mt-2">Submission for {userStation.name}</p>
        </div>
        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm">
           {Object.values(FuelType).map(type => (
             <button 
              key={type}
              onClick={() => setSelectedProduct(type)}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedProduct === type ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
             >
               {type}
             </button>
           ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Pump Readings */}
        <div className="lg:col-span-5 space-y-8">
           <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 relative overflow-hidden">
              <div className="flex items-center justify-between mb-10">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Fuel size={24} /></div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">Meter Readings</h2>
                 </div>
                 <button type="button" onClick={() => setIsScanning(true)} className="p-3 bg-slate-900 text-white rounded-2xl hover:bg-blue-600 transition-all"><Scan size={20} /></button>
              </div>

              <div className="space-y-6">
                 <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-2">Opening Discharge (L)</label>
                    <input 
                      type="number" 
                      className="w-full bg-slate-50 border-none rounded-2xl p-5 font-black text-2xl"
                      value={openingMeter || ''}
                      onChange={e => setOpeningMeter(parseFloat(e.target.value) || 0)}
                    />
                 </div>
                 <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-2">Closing Discharge (L)</label>
                    <input 
                      type="number" 
                      className="w-full bg-slate-50 border-none rounded-2xl p-5 font-black text-2xl"
                      value={closingMeter || ''}
                      onChange={e => setClosingMeter(parseFloat(e.target.value) || 0)}
                    />
                 </div>
                 <div className="pt-6 border-t border-slate-50">
                    <div className="flex justify-between items-end">
                       <div>
                          <p className="text-[10px] font-black uppercase text-slate-400">Total Volume</p>
                          <p className="text-4xl font-black text-blue-600 tracking-tighter">{quantitySold.toLocaleString()}L</p>
                       </div>
                       <div className="text-right">
                          <p className="text-[10px] font-black uppercase text-slate-400">Value @ ₦{rate}</p>
                          <p className="text-xl font-black text-slate-900">₦{totalAmount.toLocaleString()}</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Power & Maintenance (Gen-Set Tracking) */}
           <div className="bg-slate-900 p-10 rounded-[3rem] shadow-xl text-white">
              <div className="flex items-center gap-4 mb-8">
                 <div className="p-3 bg-white/10 text-blue-400 rounded-2xl"><Zap size={24} /></div>
                 <h2 className="text-xl font-black tracking-tight">Gen-Set Efficiency</h2>
              </div>
              <div className="grid grid-cols-2 gap-6">
                 <div>
                    <label className="text-[10px] font-black uppercase text-white/40 block mb-2">Gen Runtime (Hrs)</label>
                    <input 
                      type="number" 
                      className="w-full bg-white/5 border-white/10 rounded-2xl p-4 font-bold text-white outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={e => setExpenses({...expenses, generatorHours: parseFloat(e.target.value) || 0})}
                    />
                 </div>
                 <div>
                    <label className="text-[10px] font-black uppercase text-white/40 block mb-2">Gen Fuel (L)</label>
                    <input 
                      type="number" 
                      className="w-full bg-white/5 border-white/10 rounded-2xl p-4 font-bold text-white outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={e => setExpenses({...expenses, generatorDiesel: parseFloat(e.target.value) || 0})}
                    />
                 </div>
              </div>
           </div>
        </div>

        {/* Financials */}
        <div className="lg:col-span-7 space-y-8">
           <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
              <div className="flex items-center gap-4 mb-10">
                 <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><Activity size={24} /></div>
                 <h2 className="text-xl font-black text-slate-900 tracking-tight">Settlement Audit</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-8">
                 {[
                   { key: 'cash', label: 'Cash Remittance' },
                   { key: 'pos', label: 'POS Terminal Total' },
                   { key: 'bankTransfer', label: 'Direct Bank Transfers' },
                   { key: 'creditSales', label: 'Credit (Corporate)' }
                 ].map(field => (
                   <div key={field.key}>
                      <label className="text-[10px] font-black uppercase text-slate-400 block mb-2">{field.label}</label>
                      <input 
                        type="number" 
                        className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold"
                        placeholder="₦ 0.00"
                        onChange={e => setPayments({...payments, [field.key]: parseFloat(e.target.value) || 0})}
                      />
                   </div>
                 ))}
              </div>
              
              <div className="mt-10 p-8 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                 <div>
                    <p className="text-[10px] font-black uppercase text-slate-400">Total Accounted</p>
                    <p className="text-3xl font-black text-emerald-600">₦{totalReceived.toLocaleString()}</p>
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] font-black uppercase text-slate-400">Variance (Lapse)</p>
                    <p className={`text-2xl font-black ${totalAmount - totalReceived === 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                      ₦{(totalAmount - totalReceived).toLocaleString()}
                    </p>
                 </div>
              </div>

              <button type="submit" className="w-full mt-10 py-6 bg-slate-900 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.25em] shadow-2xl hover:bg-blue-600 transition-all flex items-center justify-center gap-3 active:scale-95">
                 <Save size={20} /> Transmit Record
              </button>
           </div>
        </div>
      </form>

      {/* Camera Modal Simulation */}
      <AnimatePresence>
        {isScanning && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl">
             <div className="w-full max-w-lg bg-white rounded-[3rem] overflow-hidden p-10 text-center">
                <div className="h-48 w-full bg-slate-100 rounded-[2rem] flex items-center justify-center mb-8 relative group cursor-pointer overflow-hidden border-2 border-dashed border-slate-200">
                   <div className="absolute inset-0 bg-blue-600/10 group-hover:bg-blue-600/20 transition-all" />
                   <div className="relative z-10 flex flex-col items-center">
                      <Zap size={48} className="text-blue-600 animate-pulse mb-3" />
                      <p className="text-xs font-black uppercase tracking-widest text-slate-400">Point at Discharge Meter</p>
                   </div>
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tighter">Gemini Vision OCR</h3>
                <p className="text-sm text-slate-500 mt-2 mb-8">Synchronizing lens with Expanse Cloud telemetry...</p>
                <button 
                  onClick={() => setIsScanning(false)}
                  className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-2xl"
                >
                  Abort Scan
                </button>
             </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DailyEntryPage;
