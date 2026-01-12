
import React, { useState } from 'react';
import { User, Station, DailyEntry, EntryStatus, UserRole } from '../types';
import { 
  Fuel, 
  CreditCard, 
  Wallet, 
  ArrowRightLeft, 
  Receipt, 
  Save, 
  X, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';

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
  
  // Payment methods
  const [payments, setPayments] = useState({
    cash: 0,
    pos: 0,
    transfers: 0,
    noneSales: 0,
    airRtt: 0
  });

  // Expenses
  const [expenses, setExpenses] = useState({
    dieselCost: 0,
    posCharges: 0,
    operationalExpenses: 0
  });

  const totalCalculatedAmount = quantitySold * rate;
  // Fixed: Cast to number[] to avoid 'unknown' type in reduce and arithmetic operations
  const totalReceivedPayments = (Object.values(payments) as number[]).reduce((a, b) => a + b, 0);
  // Fixed: Cast to number[] to avoid 'unknown' type in reduce and arithmetic operations
  const totalExpensesAmount = (Object.values(expenses) as number[]).reduce((a, b) => a + b, 0);
  const reconciliationDelta = totalCalculatedAmount - totalReceivedPayments;

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
    
    // Reset form
    setQuantitySold(0);
    setPayments({ cash: 0, pos: 0, transfers: 0, noneSales: 0, airRtt: 0 });
    setExpenses({ dieselCost: 0, posCharges: 0, operationalExpenses: 0 });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Daily Sales Entry</h1>
          <p className="text-gray-500">Record fuel sales and expenses for {userStation.name}</p>
        </div>
        <div className="bg-white p-2 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
          <input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)}
            className="border-none focus:ring-0 text-sm font-semibold text-gray-700"
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-2">
        {/* Core Sales Data */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b pb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Fuel size={20} />
            </div>
            <h2 className="font-bold text-gray-900">Fuel Sales</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity Sold (Litres)</label>
              <input 
                type="number" 
                value={quantitySold || ''} 
                onChange={(e) => setQuantitySold(parseFloat(e.target.value))}
                className="w-full rounded-xl border-gray-200 focus:ring-blue-500 focus:border-blue-500 p-3 text-lg font-bold"
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rate per Litre (₦)</label>
              <input 
                type="number" 
                value={rate} 
                onChange={(e) => setRate(parseFloat(e.target.value))}
                className="w-full rounded-xl border-gray-200 bg-gray-50 p-3"
                readOnly
              />
            </div>
            <div className="pt-4 border-t">
              <p className="text-sm text-gray-500">Total Calculated Amount</p>
              <p className="text-3xl font-extrabold text-blue-600">₦{totalCalculatedAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Payment Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b pb-4">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <CreditCard size={20} />
            </div>
            <h2 className="font-bold text-gray-900">Payment Breakdown</h2>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Cash</label>
              <input 
                type="number" 
                value={payments.cash || ''} 
                onChange={(e) => setPayments({...payments, cash: parseFloat(e.target.value) || 0})}
                className="w-full rounded-lg border-gray-200"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">POS</label>
              <input 
                type="number" 
                value={payments.pos || ''} 
                onChange={(e) => setPayments({...payments, pos: parseFloat(e.target.value) || 0})}
                className="w-full rounded-lg border-gray-200"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Transfers</label>
              <input 
                type="number" 
                value={payments.transfers || ''} 
                onChange={(e) => setPayments({...payments, transfers: parseFloat(e.target.value) || 0})}
                className="w-full rounded-lg border-gray-200"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">None Sales</label>
              <input 
                type="number" 
                value={payments.noneSales || ''} 
                onChange={(e) => setPayments({...payments, noneSales: parseFloat(e.target.value) || 0})}
                className="w-full rounded-lg border-gray-200"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">AIR/RTT</label>
              <input 
                type="number" 
                value={payments.airRtt || ''} 
                onChange={(e) => setPayments({...payments, airRtt: parseFloat(e.target.value) || 0})}
                className="w-full rounded-lg border-gray-200"
              />
            </div>
          </div>
          <div className="pt-4 border-t flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Total Payments</p>
              <p className="text-xl font-bold text-emerald-600">₦{totalReceivedPayments.toLocaleString()}</p>
            </div>
            <div className={`text-right ${reconciliationDelta === 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              <p className="text-[10px] uppercase font-bold tracking-wider">Delta</p>
              <p className="text-lg font-bold">₦{reconciliationDelta.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Expenses */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b pb-4">
            <div className="p-2 bg-red-50 text-red-600 rounded-lg">
              <Receipt size={20} />
            </div>
            <h2 className="font-bold text-gray-900">Expenses Logging</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Diesel Cost</label>
                <input 
                  type="number" 
                  value={expenses.dieselCost || ''} 
                  onChange={(e) => setExpenses({...expenses, dieselCost: parseFloat(e.target.value) || 0})}
                  className="w-full rounded-lg border-gray-200"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">POS Charges</label>
                <input 
                  type="number" 
                  value={expenses.posCharges || ''} 
                  onChange={(e) => setExpenses({...expenses, posCharges: parseFloat(e.target.value) || 0})}
                  className="w-full rounded-lg border-gray-200"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Operational Expenses (Repairs, etc.)</label>
              <input 
                type="number" 
                value={expenses.operationalExpenses || ''} 
                onChange={(e) => setExpenses({...expenses, operationalExpenses: parseFloat(e.target.value) || 0})}
                className="w-full rounded-lg border-gray-200"
              />
            </div>
          </div>
          <div className="pt-4 border-t">
            <p className="text-sm text-gray-500">Total Expenses</p>
            <p className="text-xl font-bold text-red-600">₦{totalExpensesAmount.toLocaleString()}</p>
          </div>
        </div>

        {/* Summary & Submit */}
        <div className="bg-slate-900 p-8 rounded-2xl text-white flex flex-col justify-between shadow-xl">
          <div>
            <h3 className="text-lg font-bold mb-6 text-slate-300">Final Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-slate-400">
                <span>Revenue</span>
                <span className="text-white font-mono">₦{totalReceivedPayments.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Expenses</span>
                <span className="text-white font-mono">₦{totalExpensesAmount.toLocaleString()}</span>
              </div>
              <div className="h-px bg-slate-800 my-2" />
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-blue-400">Net Profit</span>
                <span className="text-2xl font-bold">₦{(totalReceivedPayments - totalExpensesAmount).toLocaleString()}</span>
              </div>
            </div>

            {reconciliationDelta !== 0 && (
              <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex gap-3 items-start">
                <AlertCircle className="text-red-400 shrink-0" size={18} />
                <p className="text-xs text-red-200">Warning: There is a discrepancy of ₦{Math.abs(reconciliationDelta).toLocaleString()} between calculated sales and received payments.</p>
              </div>
            )}
          </div>

          <button 
            type="submit"
            className="mt-8 w-full py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Save size={20} />
            Submit for Approval
          </button>
        </div>
      </form>
    </div>
  );
};

export default DailyEntryPage;