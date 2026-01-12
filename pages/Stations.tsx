
import React, { useState } from 'react';
import { Station, UserRole, User, StockPurchase } from '../types';
import { Fuel, MapPin, Plus, Edit2, Trash2, AlertCircle, ShoppingCart, Truck, X, Wand2, Sparkles, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI } from "@google/genai";

interface StationsPageProps {
  user: User;
  stations: Station[];
  setStations: (stations: Station[]) => void;
  onProcureStock: (purchase: StockPurchase) => void;
}

const StationsPage: React.FC<StationsPageProps> = ({ user, stations, setStations, onProcureStock }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [showProcure, setShowProcure] = useState<Station | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  
  const [newStation, setNewStation] = useState<Partial<Station>>({
    name: '',
    location: '',
    capacity: 50000,
    currentStock: 0,
    lowStockThreshold: 10000,
    imageUrl: 'https://images.unsplash.com/photo-1554672408-730436b60dde?q=80&w=800&auto=format&fit=crop'
  });

  const [procurement, setProcurement] = useState({
    quantity: 0,
    cost: 0,
    supplier: 'Expanse Refining Ltd'
  });

  const generateStationImage = async () => {
    setIsGeneratingImage(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: {
          parts: [{
            text: `A hyper-realistic, 8k cinematic architectural shot of a futuristic fueling hub for the brand EXPANSE. Metallic architecture, integrated LED lighting, ultra-modern pumps, pristine concrete, blue sky with wispy clouds, flagship enterprise style.`
          }]
        }
      });
      
      const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
      if (part?.inlineData?.data) {
        const imageUrl = `data:image/png;base64,${part.inlineData.data}`;
        setNewStation(prev => ({ ...prev, imageUrl }));
      }
    } catch (error) {
      console.error("Image generation failed:", error);
      alert("AI image generation temporarily unavailable.");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  if (user.role !== UserRole.ADMIN && user.role !== UserRole.CEO) {
    return (
      <div className="p-12 text-center bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50">
        <div className="h-24 w-24 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
          <AlertCircle size={48} />
        </div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Protocol Violation</h2>
        <p className="text-slate-500 font-bold mt-3">Access to Network Node management is restricted to executive oversight.</p>
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
      lowStockThreshold: newStation.lowStockThreshold || 10000,
      imageUrl: newStation.imageUrl
    };
    setStations([...stations, station]);
    setShowAdd(false);
    setNewStation({ name: '', location: '', capacity: 50000, currentStock: 0, lowStockThreshold: 10000, imageUrl: 'https://images.unsplash.com/photo-1554672408-730436b60dde?q=80&w=800&auto=format&fit=crop' });
  };

  const handleProcure = () => {
    if (!showProcure || procurement.quantity <= 0) return;
    
    const purchase: StockPurchase = {
      id: `p-${Date.now()}`,
      stationId: showProcure.id,
      stationName: showProcure.name,
      date: new Date().toISOString().split('T')[0],
      quantity: procurement.quantity,
      cost: procurement.cost,
      supplier: procurement.supplier
    };

    onProcureStock(purchase);
    setShowProcure(null);
    setProcurement({ quantity: 0, cost: 0, supplier: 'Expanse Refining Ltd' });
  };

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <div className="flex items-center gap-3 mb-3">
             <span className="h-1.5 w-16 bg-blue-600 rounded-full" />
             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600">Infrastructure Layer</p>
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight">Network Nodes</h1>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="bg-slate-900 hover:bg-blue-600 text-white px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] transition-all shadow-2xl flex items-center gap-4 group"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform" /> Register New Hub
        </button>
      </div>

      <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-3">
        {stations.map((station) => {
          const stockPercent = (station.currentStock / station.capacity) * 100;
          const isLow = station.currentStock < station.lowStockThreshold;
          // Mock health score calculation
          const healthScore = Math.min(100, Math.max(0, (stockPercent + 20) + (Math.random() * 20 - 10)));

          return (
            <motion.div 
              key={station.id} 
              layout
              className="bg-white rounded-[3.5rem] shadow-sm border border-slate-100 overflow-hidden group hover:shadow-[0_40px_80px_rgba(0,0,0,0.06)] transition-all duration-700 flex flex-col"
            >
              {/* Image Hero Section with Health Badge */}
              <div className="relative h-56 overflow-hidden">
                 <img 
                  src={station.imageUrl || 'https://images.unsplash.com/photo-1563906267088-b029e7101114?q=80&w=800&auto=format&fit=crop'} 
                  alt={station.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                 
                 {/* Floating Health Score Gauge */}
                 <div className="absolute top-6 right-6 h-16 w-16 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 flex items-center justify-center p-1">
                    <svg className="h-full w-full -rotate-90">
                       <circle cx="50%" cy="50%" r="45%" className="fill-none stroke-white/20 stroke-[4px]" />
                       <motion.circle 
                          cx="50%" cy="50%" r="45%" 
                          className={`fill-none stroke-[4px] ${healthScore > 70 ? 'stroke-emerald-400' : 'stroke-amber-400'}`}
                          strokeDasharray="100"
                          initial={{ strokeDashoffset: 100 }}
                          animate={{ strokeDashoffset: 100 - healthScore }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                       />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                       <span className="text-[10px] font-black text-white">{Math.round(healthScore)}%</span>
                    </div>
                 </div>

                 <div className="absolute bottom-6 left-8 flex flex-col gap-1 text-white">
                    <div className="flex items-center gap-2">
                       <MapPin size={14} className="text-blue-400" />
                       <span className="text-[10px] font-black uppercase tracking-widest">{station.location}</span>
                    </div>
                    <h3 className="font-black text-xl tracking-tight mt-1">{station.name}</h3>
                 </div>
              </div>

              <div className="p-10 flex-1 flex flex-col justify-between">
                <div className="space-y-8">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Live Inventory</p>
                      <div className="flex items-baseline gap-2">
                        <span className={`text-4xl font-black tracking-tighter ${isLow ? 'text-rose-600' : 'text-slate-900'}`}>
                          {station.currentStock.toLocaleString()}
                        </span>
                        <span className="text-xs font-black text-slate-400 uppercase">Litres</span>
                      </div>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                       <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${isLow ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-500'}`}>
                          {isLow ? 'Low Reserve' : 'Operational'}
                       </div>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden shadow-inner">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${stockPercent}%` }}
                        transition={{ duration: 1.5, ease: "circOut" }}
                        className={`h-full rounded-full shadow-lg ${isLow ? 'bg-rose-500' : 'bg-blue-600'}`} 
                      />
                    </div>
                    <div className="flex justify-between mt-3">
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">0% Empty</span>
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{station.capacity.toLocaleString()}L Capacity</span>
                    </div>
                  </div>
                </div>

                <div className="mt-10 flex gap-4">
                  <button 
                    onClick={() => setShowProcure(station)}
                    className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl hover:bg-blue-600"
                  >
                    <Truck size={16} /> Restock Node
                  </button>
                  <button className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100 transition-all group-hover:text-slate-900">
                    <Activity size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Procure Stock Modal remains enhanced */}
      <AnimatePresence>
        {showProcure && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[3.5rem] w-full max-w-xl shadow-[0_40px_100px_rgba(0,0,0,0.5)] overflow-hidden"
            >
              <div className="p-12 border-b border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-5">
                   <div className="h-16 w-16 bg-blue-600 text-white rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-blue-200">
                     <ShoppingCart size={32} />
                   </div>
                   <div>
                     <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Inventory Procurement</h2>
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Order for {showProcure.name}</p>
                   </div>
                </div>
                <button onClick={() => setShowProcure(null)} className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 transition-colors">
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-12 space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest">Transfer Quantity (L)</label>
                    <input 
                      type="number" 
                      className="w-full rounded-2xl border-slate-100 bg-slate-50 p-5 font-black text-2xl text-slate-900 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                      value={procurement.quantity || ''}
                      onChange={e => setProcurement({...procurement, quantity: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest">Total Transaction Cost (₦)</label>
                    <input 
                      type="number" 
                      className="w-full rounded-2xl border-slate-100 bg-slate-50 p-5 font-black text-2xl text-slate-900 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                      value={procurement.cost || ''}
                      onChange={e => setProcurement({...procurement, cost: parseInt(e.target.value) || 0})}
                    />
                  </div>
                </div>
                
                <div className="p-6 rounded-[2rem] bg-blue-50/50 border border-blue-100">
                   <div className="flex items-center gap-3 mb-4">
                      <Activity size={18} className="text-blue-600" />
                      <p className="text-[10px] font-black text-blue-900 uppercase tracking-widest">Procurement impact projection</p>
                   </div>
                   <div className="h-4 w-full bg-blue-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={false}
                        animate={{ width: `${Math.min(100, ((showProcure.currentStock + procurement.quantity) / showProcure.capacity) * 100)}%` }}
                        className="h-full bg-blue-600 rounded-full"
                      />
                   </div>
                   <div className="flex justify-between mt-3">
                      <span className="text-[10px] font-bold text-blue-600">Current: {Math.round((showProcure.currentStock/showProcure.capacity)*100)}%</span>
                      <span className="text-[10px] font-bold text-blue-900">After Order: {Math.min(100, Math.round(((showProcure.currentStock+procurement.quantity)/showProcure.capacity)*100))}%</span>
                   </div>
                </div>
              </div>
              
              <div className="p-12 bg-slate-50 flex gap-6">
                <button onClick={() => setShowProcure(null)} className="flex-1 py-6 bg-white border border-slate-200 rounded-[2rem] font-black text-xs uppercase tracking-widest text-slate-500 hover:bg-slate-100 transition-all">Abort</button>
                <button onClick={handleProcure} className="flex-1 py-6 bg-blue-600 hover:bg-blue-700 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-blue-500/30 transition-all">Finalize Dispatch</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Station Modal (Aurora v3 Enhanced) */}
      <AnimatePresence>
        {showAdd && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl">
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="bg-white rounded-[4rem] w-full max-w-4xl shadow-2xl overflow-hidden border border-white/20"
            >
              <div className="p-12 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-4">
                   <div className="h-12 w-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center">
                      <Fuel size={24} />
                   </div>
                   <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Infrastructure Expansion</h2>
                </div>
                <button onClick={() => setShowAdd(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <X size={32} />
                </button>
              </div>
              <div className="grid md:grid-cols-2">
                <div className="p-12 space-y-8 border-r border-slate-100">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest">Hub Designation</label>
                    <input 
                      type="text" 
                      className="w-full rounded-[1.5rem] border-slate-100 bg-slate-50 p-5 font-bold outline-none focus:ring-4 focus:ring-blue-500/10"
                      placeholder="e.g., North Delta Alpha"
                      value={newStation.name}
                      onChange={e => setNewStation({...newStation, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest">Geographical Sector</label>
                    <input 
                      type="text" 
                      className="w-full rounded-[1.5rem] border-slate-100 bg-slate-50 p-5 font-bold outline-none focus:ring-4 focus:ring-blue-500/10"
                      placeholder="Zone 7, Coastal Region"
                      value={newStation.location}
                      onChange={e => setNewStation({...newStation, location: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest">Limit (L)</label>
                      <input 
                        type="number" 
                        className="w-full rounded-[1.5rem] border-slate-100 bg-slate-50 p-5 font-bold"
                        value={newStation.capacity}
                        onChange={e => setNewStation({...newStation, capacity: parseInt(e.target.value)})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest">Safe Min (L)</label>
                      <input 
                        type="number" 
                        className="w-full rounded-[1.5rem] border-slate-100 bg-slate-50 p-5 font-bold"
                        value={newStation.lowStockThreshold}
                        onChange={e => setNewStation({...newStation, lowStockThreshold: parseInt(e.target.value)})}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="p-12 bg-slate-50 flex flex-col items-center justify-center text-center">
                   <div className="relative w-full aspect-video rounded-[2.5rem] overflow-hidden bg-slate-200 shadow-2xl mb-8 group">
                      {isGeneratingImage ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-blue-600/90 text-white p-8 backdrop-blur-md">
                           <motion.div 
                              animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 180, 270, 360] }}
                              transition={{ duration: 4, repeat: Infinity }}
                           >
                              <Sparkles size={64} className="mb-4" />
                           </motion.div>
                           <p className="text-sm font-black uppercase tracking-[0.3em]">Synthesizing Enterprise Visuals...</p>
                        </div>
                      ) : (
                        <>
                           <img src={newStation.imageUrl} alt="Concept" className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-1000" />
                           <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                        </>
                      )}
                   </div>
                   <button 
                    onClick={generateStationImage}
                    disabled={isGeneratingImage}
                    className="group flex items-center gap-3 px-10 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-600 transition-all disabled:opacity-50 shadow-2xl shadow-slate-300"
                   >
                     <Wand2 size={18} className="group-hover:rotate-45 transition-transform" /> 
                     Generate Concept Art
                   </button>
                   <p className="text-[10px] text-slate-400 mt-6 font-black uppercase tracking-[0.3em] opacity-40">EXPANSE IMAGINE™ CORE 3.0</p>
                </div>
              </div>
              <div className="p-12 bg-slate-950 flex gap-6">
                <button onClick={() => setShowAdd(false)} className="flex-1 py-6 bg-white/5 border border-white/10 rounded-[2.5rem] font-black text-xs uppercase tracking-widest text-slate-400 hover:text-white transition-all">Cancel Operation</button>
                <button onClick={handleAdd} className="flex-1 py-6 bg-blue-600 hover:bg-blue-700 text-white rounded-[2.5rem] font-black text-xs uppercase tracking-widest shadow-[0_0_40px_rgba(37,99,235,0.4)] transition-all">Initiate Station Core</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StationsPage;
