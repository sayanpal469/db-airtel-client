import React, { useState, useEffect, useMemo } from 'react';
import { UserPlus, Search, RefreshCw, AlertTriangle, UserCheck, Loader2, AlertCircle } from 'lucide-react';
import { cableApi, CableAllocation } from '../../api/cableApi';
import { engineerApi } from '../../api/engineerApi';
import { Engineer } from '../../types';
import { Modal } from '../../components/Modal';
import { cn } from '../../utils/cn';

export const EngineerAllocation = () => {
  const [allocations, setAllocations] = useState<CableAllocation[]>([]);
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAllocation, setEditingAllocation] = useState<CableAllocation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    engineerId: '',
    length: ''
  });

  const fetchData = async () => {
    setIsLoading(true);
    setError('');
    try {
      const [invRes, engRes] = await Promise.all([
        cableApi.getStatus(),
        engineerApi.getAll({ limit: 100 })
      ]);
      
      if (invRes.success) {
        setAllocations(invRes.data.allocations);
      }
      if (engRes.success) {
        setEngineers(engRes.data.engineers || []);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch allocation data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredAllocations = allocations.filter(a => 
    a.engineer?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddOrEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    const length = parseInt(formData.length);
    if (isNaN(length) || length <= 0) return;

    setIsSubmitting(true);
    setError('');
    try {
      const response = await cableApi.allocateToEngineer(formData.engineerId, length);
      if (response.success) {
        setIsModalOpen(false);
        setEditingAllocation(null);
        setFormData({ engineerId: '', length: '' });
        fetchData();
      } else {
        setError(response.message || 'Failed to allocate cable');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to allocate cable');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Engineer Cable Allocation</h1>
          <p className="text-slate-500 mt-1">Assign and track cable stock for field engineers.</p>
        </div>

        <button 
          onClick={() => {
            setEditingAllocation(null);
            setFormData({ engineerId: '', length: '' });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200"
        >
          <UserPlus size={20} />
          <span>Assign Cable</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search engineer name..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:ring-2 focus:ring-red-600 outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Allocations Table */}
      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm relative min-h-[200px]">
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-10 transition-all">
            <Loader2 className="w-8 h-8 animate-spin text-red-600" />
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Engineer Name</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Total Allocated</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Remaining Cable</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Total Used</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredAllocations.map((alloc) => (
                <tr key={alloc._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600 font-bold">
                        {alloc.engineer?.name.charAt(0)}
                      </div>
                      <span className="font-bold text-slate-800">{alloc.engineer?.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className="font-bold text-slate-700">{alloc.allocatedLength}m</span>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className={cn(
                      "font-black text-lg",
                      alloc.remainingLength < 50 ? "text-red-600" : "text-slate-900"
                    )}>
                      {alloc.remainingLength}m
                    </span>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className="text-slate-500 font-medium">{alloc.usedLength}m</span>
                  </td>
                  <td className="px-8 py-5">
                    {alloc.remainingLength < 50 ? (
                      <span className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-full text-[10px] font-bold border border-red-100 uppercase tracking-wider w-fit">
                        <AlertTriangle size={12} />
                        Low Cable Stock
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold border border-emerald-100 uppercase tracking-wider w-fit">
                        <UserCheck size={12} />
                        Sufficient
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => {
                          setEditingAllocation(alloc);
                          setFormData({ engineerId: alloc.engineer?._id || '', length: '' });
                          setIsModalOpen(true);
                        }}
                        className="p-2 hover:bg-white border border-transparent hover:border-slate-200 text-slate-400 hover:text-red-600 rounded-xl transition-all"
                        title="Adjust Stock"
                      >
                        <RefreshCw size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!isLoading && filteredAllocations.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-12 text-center text-slate-400 italic">
                    No allocations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Allocation Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingAllocation ? `Adjust Stock: ${editingAllocation.engineer?.name}` : "Assign Cable to Engineer"}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleAddOrEdit} className="space-y-6">
          {!editingAllocation && (
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-500 uppercase tracking-wider ml-1">Select Engineer</label>
              <select 
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:ring-2 focus:ring-red-600 outline-none transition-all"
                value={formData.engineerId}
                onChange={(e) => setFormData({ ...formData, engineerId: e.target.value })}
              >
                <option value="">Choose an engineer...</option>
                {engineers.map(eng => (
                  <option key={eng._id} value={eng._id}>{eng.name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-500 uppercase tracking-wider ml-1">
              {editingAllocation ? "Add More Cable (meters)" : "Cable Length (meters)"}
            </label>
            <input 
              type="number" 
              placeholder="e.g. 300"
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:ring-2 focus:ring-red-600 outline-none transition-all"
              value={formData.length}
              onChange={(e) => setFormData({ ...formData, length: e.target.value })}
            />
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button 
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-100 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting && <Loader2 size={18} className="animate-spin" />}
              {editingAllocation ? (isSubmitting ? "Updating..." : "Update Stock") : (isSubmitting ? "Assigning..." : "Assign Cable")}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
