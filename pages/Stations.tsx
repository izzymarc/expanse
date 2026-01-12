
import React, { useState } from 'react';
import { Station, UserRole, User } from '../types';
import { Fuel, MapPin, BarChart, Settings, Plus, Edit2, Trash2, AlertCircle } from 'lucide-react';

interface StationsPageProps {
  user: User;
  stations: Station[];
  setStations: (stations: Station[]) => void;
}

const StationsPage: React.FC<StationsPageProps> = ({ user, stations, setStations }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [newStation, setNewStation] = useState<Partial<Station>>({
    name: '',
    location: '',
    capacity: 50000,
    currentStock: 0,
    lowStockThreshold: 10000
  });

  if (user.role !== UserRole.ADMIN) {
    return (
      <div className="p-12 text-center">
        <h2 className="text-2xl font-bold text-red-500">Access Denied</h2>
        <p>You do not have permission to access station management.</p>
      </div>
    );
  }

  const handleAdd = () => {
    if (!newStation.name || !newStation.location) return;
    const station: Station = {
      id: `s${stations.length + 1}`,
      name: newStation.name!,
      location: newStation.location!,
      capacity: newStation.capacity || 50000,
      currentStock: newStation.currentStock || 0,
      lowStockThreshold: newStation.lowStockThreshold || 10000
    };
    setStations([...stations, station]);
    setShowAdd(false);
    setNewStation({ name: '', location: '', capacity: 50000, currentStock: 0, lowStockThreshold: 10000 });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Station Management</h1>
          <p className="text-gray-500">Configure and monitor all filling stations in the network.</p>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-200"
        >
          <Plus size={18} /> Add New Station
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {stations.map((station) => {
          const stockPercent = (station.currentStock / station.capacity) * 100;
          const isLow = station.currentStock < station.lowStockThreshold;

          return (
            <div key={station.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-300">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl ${isLow ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                      <Fuel size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{station.name}</h3>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <MapPin size={12} /> {station.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                      <Edit2 size={16} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-medium">Stock Level</span>
                    <span className={`font-bold ${isLow ? 'text-red-600' : 'text-emerald-600'}`}>
                      {station.currentStock.toLocaleString()} / {station.capacity.toLocaleString()}L
                    </span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-gray-100 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${isLow ? 'bg-red-500' : 'bg-blue-500'}`} 
                      style={{ width: `${stockPercent}%` }}
                    />
                  </div>
                  
                  {isLow && (
                    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-red-50 border border-red-100 text-red-700 text-xs font-bold animate-pulse">
                      <AlertCircle size={14} /> Refill Required: Below Threshold
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Capacity</p>
                      <p className="text-sm font-bold text-gray-900">{station.capacity.toLocaleString()}L</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Low Limit</p>
                      <p className="text-sm font-bold text-gray-900">{station.lowStockThreshold.toLocaleString()}L</p>
                    </div>
                  </div>
                </div>
              </div>
              <button className="w-full py-3 bg-gray-50 text-xs font-bold text-gray-500 hover:bg-gray-100 uppercase tracking-widest border-t transition-colors">
                View Detailed Analytics
              </button>
            </div>
          );
        })}
      </div>

      {/* Add Station Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold text-slate-900">Add New Station</h2>
              <button onClick={() => setShowAdd(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Station Name</label>
                <input 
                  type="text" 
                  className="w-full rounded-xl border-gray-200"
                  placeholder="Expanse Station - North"
                  value={newStation.name}
                  onChange={e => setNewStation({...newStation, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Location</label>
                <input 
                  type="text" 
                  className="w-full rounded-xl border-gray-200"
                  placeholder="City, State"
                  value={newStation.location}
                  onChange={e => setNewStation({...newStation, location: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Capacity (L)</label>
                  <input 
                    type="number" 
                    className="w-full rounded-xl border-gray-200"
                    value={newStation.capacity}
                    onChange={e => setNewStation({...newStation, capacity: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Low Threshold (L)</label>
                  <input 
                    type="number" 
                    className="w-full rounded-xl border-gray-200"
                    value={newStation.lowStockThreshold}
                    onChange={e => setNewStation({...newStation, lowStockThreshold: parseInt(e.target.value)})}
                  />
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-50 flex gap-3">
              <button 
                onClick={() => setShowAdd(false)}
                className="flex-1 py-3 border border-gray-200 rounded-xl font-bold text-gray-500 hover:bg-white transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleAdd}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-200 transition-all"
              >
                Create Station
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Internal icon for modal close
const X = ({size, className}: {size: number, className?: string}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export default StationsPage;
