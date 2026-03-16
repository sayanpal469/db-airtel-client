import React, { useState } from 'react';
import { Box, Plus, TrendingUp, Package, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { DUMMY_CABLE_STOCK } from '../../data/dummyData';
import { cn } from '../../utils/cn';

export const CableStock = () => {
  const [stock, setStock] = useState(DUMMY_CABLE_STOCK);
  const [addAmount, setAddAmount] = useState('');

  const handleAddStock = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(addAmount);
    if (isNaN(amount) || amount <= 0) return;

    setStock(prev => ({
      ...prev,
      totalStock: prev.totalStock + amount,
      available: prev.available + amount
    }));
    setAddAmount('');
    alert(`${amount} meters of CAT6 cable added to stock.`);
  };

  const stats = [
    { label: 'Total Stock', value: `${stock.totalStock}m`, icon: Box, color: 'bg-blue-600' },
    { label: 'Allocated to Engineers', value: `${stock.allocated}m`, icon: Package, color: 'bg-orange-600' },
    { label: 'Available Stock', value: `${stock.available}m`, icon: TrendingUp, color: 'bg-emerald-600' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Cable Stock Management</h1>
          <p className="text-slate-500 mt-1">Monitor and manage CAT6 cable inventory.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:border-red-600/20 transition-all group">
            <div className="flex items-start justify-between">
              <div className={cn("p-3 rounded-2xl text-white shadow-lg", stat.color)}>
                <stat.icon size={24} />
              </div>
              <div className="flex items-center gap-1 text-xs font-bold px-2 py-1 bg-slate-50 text-slate-500 rounded-full">
                <ArrowUpRight size={14} />
                Live
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider">{stat.label}</h3>
              <p className="text-3xl font-black text-slate-900 mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Stock Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
                <Plus size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Add New Stock</h2>
            </div>

            <form onSubmit={handleAddStock} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500 uppercase tracking-wider ml-1">Cable Type</label>
                <input 
                  type="text" 
                  value="CAT6" 
                  disabled 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-400 font-bold outline-none cursor-not-allowed"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500 uppercase tracking-wider ml-1">Length (meters)</label>
                <input 
                  type="number" 
                  placeholder="e.g. 5000"
                  required
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-slate-800 focus:ring-2 focus:ring-red-600 outline-none transition-all"
                  value={addAmount}
                  onChange={(e) => setAddAmount(e.target.value)}
                />
              </div>
              <button 
                type="submit"
                className="w-full py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 shadow-lg shadow-red-100 transition-all active:scale-[0.98]"
              >
                Add to Inventory
              </button>
            </form>
          </div>
        </div>

        {/* Info Card */}
        <div className="lg:col-span-2">
          <div className="bg-slate-900 p-8 rounded-3xl text-white relative overflow-hidden h-full flex flex-col justify-center">
            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600 rounded-full text-[10px] font-bold uppercase tracking-widest">
                System Status
              </div>
              <h2 className="text-3xl font-bold">Inventory Tracking is Active</h2>
              <p className="text-slate-400 max-w-md">
                All cable consumption is automatically tracked and deducted from engineer stock upon successful installation.
              </p>
              <div className="flex items-center gap-6 pt-4">
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-white">15m</span>
                  <span className="text-xs text-slate-500 uppercase tracking-wider">Per Connection</span>
                </div>
                <div className="w-px h-10 bg-slate-800"></div>
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-white">50m</span>
                  <span className="text-xs text-slate-500 uppercase tracking-wider">Low Stock Alert</span>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-red-600/20 rounded-full -mr-10 -mb-10 blur-2xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
