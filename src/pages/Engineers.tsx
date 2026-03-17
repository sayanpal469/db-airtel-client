import React, { useState, useEffect } from 'react';
import { UserPlus, User, Phone, Edit2, Trash2, Save, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '../utils/cn';
import { Engineer } from '../types';
import { Modal } from '../components/Modal';
import { engineerApi } from '../api/engineerApi';

export const Engineers = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [editingEngineer, setEditingEngineer] = useState<Engineer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Pagination & Search State
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });
  const [search, setSearch] = useState('');

  const [newEngineer, setNewEngineer] = useState({
    name: '',
    phone: '',
    isActive: true
  });

  const fetchEngineers = async () => {
    setIsLoading(true);
    try {
      const response = await engineerApi.getAll({
        page: pagination.currentPage,
        limit: pagination.itemsPerPage,
        search: search
      });
      if (response.success) {
        setEngineers(response.data.engineers || []);
        if (response.data.pagination) {
          setPagination({
            ...pagination,
            totalPages: response.data.pagination.totalPages,
            totalItems: response.data.pagination.totalItems
          });
        }
      } else {
        setError(response.message || 'Failed to fetch engineers');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch engineers');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEngineers();
  }, [pagination.currentPage, search]);

  const handleToggleStatus = async (id: string) => {
    try {
      const response = await engineerApi.toggleStatus(id);
      if (response.success) {
        setEngineers(prev => prev.map(eng => 
          eng.id === id ? response.data : eng
        ));
      }
    } catch (err: any) {
      setError(err.message || 'Failed to toggle status');
    }
  };

  const handleAddEngineer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      const response = await engineerApi.create(newEngineer);
      if (response.success) {
        setSuccess('Engineer added successfully!');
        setNewEngineer({ name: '', phone: '', isActive: true });
        setShowAddForm(false);
        fetchEngineers();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.message || 'Failed to add engineer');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to add engineer');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateEngineer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEngineer) return;
    setIsSubmitting(true);
    setError('');
    try {
      const response = await engineerApi.update(editingEngineer.id, {
        name: editingEngineer.name,
        phone: editingEngineer.phone
      });
      if (response.success) {
        setSuccess('Engineer updated successfully!');
        setEditingEngineer(null);
        fetchEngineers();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.message || 'Failed to update engineer');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update engineer');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEngineer = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this engineer?')) {
      try {
        const response = await engineerApi.delete(id);
        if (response.success) {
          setSuccess('Engineer deleted successfully!');
          fetchEngineers();
          setTimeout(() => setSuccess(''), 3000);
        } else {
          setError(response.message || 'Failed to delete engineer');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to delete engineer');
      }
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

      {(error || success) && (
        <div className="flex flex-col gap-4">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 animate-shake">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3 text-emerald-600">
              <CheckCircle2 size={18} />
              <span>{success}</span>
            </div>
          )}
        </div>
      )}

      {/* Search Bar */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by name or phone..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-600 outline-none transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        </div>
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
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button 
              type="button"
              disabled={isSubmitting}
              onClick={() => setShowAddForm(false)}
              className="px-6 py-2 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="px-8 py-2 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-100 flex items-center gap-2"
            >
              {isSubmitting && <Loader2 size={18} className="animate-spin" />}
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
                disabled={isSubmitting}
                onClick={() => setEditingEngineer(null)}
                className="px-6 py-2 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="flex items-center gap-2 px-8 py-2 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-100"
              >
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                Update Changes
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Engineers Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-10">
            <Loader2 className="w-8 h-8 animate-spin text-red-600" />
          </div>
        )}
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
              {engineers.length > 0 ? (
                engineers.map((eng) => (
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
                        {eng.totalInstallations || 0}
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
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                    {isLoading ? 'Loading engineers...' : 'No engineers found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
