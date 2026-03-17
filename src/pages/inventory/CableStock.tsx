import React, { useState, useEffect } from 'react';
import { Box, Plus, TrendingUp, Package, ArrowUpRight, Loader2, AlertCircle } from 'lucide-react';
import { cableApi, InventoryStatus } from '../../api/cableApi';
import { cn } from '../../utils/cn';

export const CableStock = () => {
  const [status, setStatus] = useState<InventoryStatus | null>(null);
  const [addAmount, setAddAmount] = useState('');
  const [remarks, setRemarks] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchStatus = async () => {
    setIsLoading(true);
    try {
      const response = await cableApi.getStatus();
      if (response.success) {
        setStatus(response.data);
      } else {
        setError(response.message || 'Failed to fetch stock status');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch stock status');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleAddStock = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(addAmount);
    if (isNaN(amount) || amount <= 0) return;

    setIsSubmitting(true);
    setError('');
    try {
      const response = await cableApi.addStock(amount, remarks);
      if (response.success) {
        setAddAmount('');
        setRemarks('');
        fetchStatus();
      } else {
        setError(response.message || 'Failed to add stock');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to add stock');
    } finally {
      setIsSubmitting(false);
    }
  };

  const allocatedTotal = status?.allocations.reduce((sum, a) => sum + a.remainingLength, 0) || 0;

  const stats = [
    { label: 'Warehouse Stock', value: `${status?.totalStock || 0}m`, icon: Box, color: 'bg-blue-600' },
    { label: 'Allocated to Engineers', value: `${allocatedTotal}m`, icon: Package, color: 'bg-orange-600' },
    { label: 'Total Inventory', value: `${(status?.totalStock || 0) + allocatedTotal}m`, icon: TrendingUp, color: 'bg-emerald-600' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Cable Stock Management</h1>
          <p className="text-slate-500 mt-1">Monitor and manage CAT6 cable inventory.</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative min-h-[120px]">
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-10">
            <Loader2 className="animate-spin text-red-600" />
          </div>
        )}
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
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500 uppercase tracking-wider ml-1">Remarks</label>
                <input 
                  type="text" 
                  placeholder="e.g. New batch from supplier"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-slate-800 focus:ring-2 focus:ring-red-600 outline-none transition-all"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                />
              </div>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 shadow-lg shadow-red-100 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting && <Loader2 size={18} className="animate-spin" />}
                {isSubmitting ? 'Updating...' : 'Add to Inventory'}
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
