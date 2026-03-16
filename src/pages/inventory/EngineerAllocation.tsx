import React, { useState, useMemo } from 'react';
import { UserPlus, Search, Edit2, RefreshCw, AlertTriangle, UserCheck } from 'lucide-react';
import { DUMMY_ALLOCATIONS, DUMMY_ENGINEERS } from '../../data/dummyData';
import { Modal } from '../../components/Modal';
import { cn } from '../../utils/cn';

export const EngineerAllocation = () => {
  const [allocations, setAllocations] = useState(DUMMY_ALLOCATIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAllocation, setEditingAllocation] = useState<any>(null);
  const [formData, setFormData] = useState({
    engineerId: '',
    length: ''
  });

  const filteredAllocations = allocations.filter(a => 
    a.engineerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddOrEdit = (e: React.FormEvent) => {
    e.preventDefault();
    const length = parseInt(formData.length);
    if (isNaN(length) || length <= 0) return;

    if (editingAllocation) {
      setAllocations(prev => prev.map(a => 
        a.id === editingAllocation.id 
          ? { ...a, assignedCable: a.assignedCable + length, remainingCable: a.remainingCable + length }
          : a
      ));
    } else {
      const engineer = DUMMY_ENGINEERS.find(e => e.id === formData.engineerId);
      if (!engineer) return;

      const newAlloc = {
        id: `alloc-${Date.now()}`,
        engineerId: engineer.id,
        engineerName: engineer.name,
        assignedCable: length,
        remainingCable: length,
        totalUsedCable: 0
      };
      setAllocations(prev => [newAlloc, ...prev]);
    }

    setIsModalOpen(false);
    setEditingAllocation(null);
    setFormData({ engineerId: '', length: '' });
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
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200"
        >
          <UserPlus size={20} />
          <span>Assign Cable</span>
        </button>
      </div>

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
      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Engineer Name</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Assigned Cable</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Remaining Cable</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Total Used</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredAllocations.map((alloc) => (
                <tr key={alloc.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600 font-bold">
                        {alloc.engineerName.charAt(0)}
                      </div>
                      <span className="font-bold text-slate-800">{alloc.engineerName}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className="font-bold text-slate-700">{alloc.assignedCable}m</span>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className={cn(
                      "font-black text-lg",
                      alloc.remainingCable < 50 ? "text-red-600" : "text-slate-900"
                    )}>
                      {alloc.remainingCable}m
                    </span>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className="text-slate-500 font-medium">{alloc.totalUsedCable}m</span>
                  </td>
                  <td className="px-8 py-5">
                    {alloc.remainingCable < 50 ? (
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
                          setFormData({ engineerId: alloc.engineerId, length: '' });
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
            </tbody>
          </table>
        </div>
      </div>

      {/* Allocation Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingAllocation ? `Adjust Stock: ${editingAllocation.engineerName}` : "Assign Cable to Engineer"}
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
                {DUMMY_ENGINEERS.filter(eng => !allocations.find(a => a.engineerId === eng.id)).map(eng => (
                  <option key={eng.id} value={eng.id}>{eng.name}</option>
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
              className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-100"
            >
              {editingAllocation ? "Update Stock" : "Assign Cable"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
