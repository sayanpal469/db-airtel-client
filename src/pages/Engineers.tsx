import React, { useState } from 'react';
import { UserPlus, User, Phone, MapPin, Edit2, Trash2, Save, X } from 'lucide-react';
import { DUMMY_ENGINEERS } from '../data/dummyData';
import { cn } from '../utils/cn';
import { Engineer } from '../types';
import { Modal } from '../components/Modal';

export const Engineers = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [engineers, setEngineers] = useState<Engineer[]>(DUMMY_ENGINEERS);
  const [editingEngineer, setEditingEngineer] = useState<Engineer | null>(null);

  const [newEngineer, setNewEngineer] = useState({
    name: '',
    phone: '',
    status: 'Active' as const
  });

  const handleToggleStatus = (id: string) => {
    setEngineers(prev => prev.map(eng => 
      eng.id === id 
        ? { ...eng, status: eng.status === 'Active' ? 'Inactive' : 'Active' } 
        : eng
    ));
  };

  const handleAddEngineer = (e: React.FormEvent) => {
    e.preventDefault();
    const engineer: Engineer = {
      id: Math.random().toString(36).substr(2, 9),
      ...newEngineer,
      area: 'Not Assigned', // Default since area field is removed
      totalInstallations: 0
    };
    setEngineers([engineer, ...engineers]);
    setNewEngineer({ name: '', phone: '', status: 'Active' });
    setShowAddForm(false);
  };

  const handleUpdateEngineer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEngineer) return;
    setEngineers(prev => prev.map(eng => 
      eng.id === editingEngineer.id ? editingEngineer : eng
    ));
    setEditingEngineer(null);
  };

  const handleDeleteEngineer = (id: string) => {
    if (window.confirm('Are you sure you want to delete this engineer?')) {
      setEngineers(prev => prev.filter(eng => eng.id !== id));
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Engineers Management</h1>
          <p className="text-slate-500">Manage your technical team and their installation performance.</p>
        </div>
        <button 
          onClick={() => {
            setShowAddForm(true);
            setEditingEngineer(null);
          }}
          className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-100"
        >
          <UserPlus size={18} /> Add New Engineer
        </button>
      </div>

      {/* Add Engineer Modal */}
      <Modal
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        title="Register New Engineer"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleAddEngineer} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Engineer Name</label>
              <input 
                type="text" 
                required
                placeholder="Full Name"
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-red-600 outline-none transition-all"
                value={newEngineer.name}
                onChange={e => setNewEngineer({ ...newEngineer, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Phone Number</label>
              <input 
                type="tel" 
                required
                placeholder="10-digit number"
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-red-600 outline-none transition-all"
                value={newEngineer.phone}
                onChange={e => setNewEngineer({ ...newEngineer, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Status</label>
              <select 
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-red-600 outline-none transition-all"
                value={newEngineer.status}
                onChange={e => setNewEngineer({ ...newEngineer, status: e.target.value as any })}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button 
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-6 py-2 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all"
            >
              Cancel
            </button>
            <button type="submit" className="px-8 py-2 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-100">
              Save Engineer
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Engineer Modal */}
      <Modal
        isOpen={!!editingEngineer}
        onClose={() => setEditingEngineer(null)}
        title={`Edit Engineer: ${editingEngineer?.name}`}
        maxWidth="max-w-2xl"
      >
        {editingEngineer && (
          <form onSubmit={handleUpdateEngineer} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Engineer Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-red-600 outline-none transition-all"
                  value={editingEngineer.name}
                  onChange={e => setEditingEngineer({ ...editingEngineer, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Phone Number</label>
                <input 
                  type="tel" 
                  required
                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-red-600 outline-none transition-all"
                  value={editingEngineer.phone}
                  onChange={e => setEditingEngineer({ ...editingEngineer, phone: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button 
                type="button"
                onClick={() => setEditingEngineer(null)}
                className="px-6 py-2 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
              <button type="submit" className="flex items-center gap-2 px-8 py-2 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-100">
                <Save size={18} /> Update Changes
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Engineers Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-white border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Engineer Name</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Installations</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {engineers.map((eng) => (
                <tr key={eng.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
                        <User size={16} />
                      </div>
                      <span className="font-semibold text-slate-800">{eng.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-slate-400" />
                      {eng.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-3 py-1 bg-slate-50 rounded-full text-sm font-bold text-slate-600 border border-slate-200">
                      {eng.totalInstallations}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => handleToggleStatus(eng.id)}
                      className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
                      style={{ backgroundColor: eng.status === 'Active' ? '#10b981' : '#e2e8f0' }}
                    >
                      <span
                        className={cn(
                          "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                          eng.status === 'Active' ? "translate-x-6" : "translate-x-1"
                        )}
                      />
                    </button>
                    <span className={cn(
                      "ml-2 text-xs font-bold",
                      eng.status === 'Active' ? "text-emerald-600" : "text-slate-400"
                    )}>
                      {eng.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => {
                          setEditingEngineer(eng);
                          setShowAddForm(false);
                        }}
                        className="p-2 hover:bg-slate-100 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteEngineer(eng.id)}
                        className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
