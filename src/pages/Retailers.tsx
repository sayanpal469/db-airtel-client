import React, { useState } from 'react';
import { Store, User, Phone, MapPin, Edit2, Trash2, UserPlus, Save, X } from 'lucide-react';
import { DUMMY_RETAILERS } from '../data/dummyData';
import { cn } from '../utils/cn';
import { Retailer } from '../types';
import { Modal } from '../components/Modal';

export const Retailers = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [retailers, setRetailers] = useState<Retailer[]>(DUMMY_RETAILERS);
  const [editingRetailer, setEditingRetailer] = useState<Retailer | null>(null);

  const [newRetailer, setNewRetailer] = useState({
    name: '',
    shopName: '',
    phone: '',
    area: '',
    status: 'Active' as const
  });

  const handleToggleStatus = (id: string) => {
    setRetailers(prev => prev.map(ret => 
      ret.id === id 
        ? { ...ret, status: ret.status === 'Active' ? 'Inactive' : 'Active' } 
        : ret
    ));
  };

  const handleAddRetailer = (e: React.FormEvent) => {
    e.preventDefault();
    const retailer: Retailer = {
      id: Math.random().toString(36).substr(2, 9),
      ...newRetailer,
      totalConnections: 0
    };
    setRetailers([retailer, ...retailers]);
    setNewRetailer({ name: '', shopName: '', phone: '', area: '', status: 'Active' });
    setShowAddForm(false);
  };

  const handleUpdateRetailer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRetailer) return;
    setRetailers(prev => prev.map(ret => 
      ret.id === editingRetailer.id ? editingRetailer : ret
    ));
    setEditingRetailer(null);
  };

  const handleDeleteRetailer = (id: string) => {
    if (window.confirm('Are you sure you want to delete this retailer?')) {
      setRetailers(prev => prev.filter(ret => ret.id !== id));
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Retailer Management</h1>
          <p className="text-slate-500">Manage your partner network and track their performance.</p>
        </div>
        <button 
          onClick={() => {
            setShowAddForm(true);
            setEditingRetailer(null);
          }}
          className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-100"
        >
          <UserPlus size={18} /> Add New Retailer
        </button>
      </div>

      {/* Add Retailer Modal */}
      <Modal
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        title="Register New Retailer"
        maxWidth="max-w-3xl"
      >
        <form onSubmit={handleAddRetailer} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Retailer Name</label>
              <input 
                type="text" 
                required
                placeholder="Owner Name"
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-red-600 outline-none transition-all"
                value={newRetailer.name}
                onChange={e => setNewRetailer({ ...newRetailer, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Shop Name</label>
              <input 
                type="text" 
                required
                placeholder="Business Name"
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-red-600 outline-none transition-all"
                value={newRetailer.shopName}
                onChange={e => setNewRetailer({ ...newRetailer, shopName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Phone Number</label>
              <input 
                type="tel" 
                required
                placeholder="10-digit number"
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-red-600 outline-none transition-all"
                value={newRetailer.phone}
                onChange={e => setNewRetailer({ ...newRetailer, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Area</label>
              <input 
                type="text" 
                required
                placeholder="Shop Location Area"
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-red-600 outline-none transition-all"
                value={newRetailer.area}
                onChange={e => setNewRetailer({ ...newRetailer, area: e.target.value })}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Status</label>
              <select 
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-red-600 outline-none transition-all"
                value={newRetailer.status}
                onChange={e => setNewRetailer({ ...newRetailer, status: e.target.value as any })}
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
              Save Retailer
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Retailer Modal */}
      <Modal
        isOpen={!!editingRetailer}
        onClose={() => setEditingRetailer(null)}
        title={`Edit Retailer: ${editingRetailer?.shopName}`}
        maxWidth="max-w-3xl"
      >
        {editingRetailer && (
          <form onSubmit={handleUpdateRetailer} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Retailer Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-red-600 outline-none transition-all"
                  value={editingRetailer.name}
                  onChange={e => setEditingRetailer({ ...editingRetailer, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Shop Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-red-600 outline-none transition-all"
                  value={editingRetailer.shopName}
                  onChange={e => setEditingRetailer({ ...editingRetailer, shopName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Phone Number</label>
                <input 
                  type="tel" 
                  required
                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-red-600 outline-none transition-all"
                  value={editingRetailer.phone}
                  onChange={e => setEditingRetailer({ ...editingRetailer, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Area</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-red-600 outline-none transition-all"
                  value={editingRetailer.area}
                  onChange={e => setEditingRetailer({ ...editingRetailer, area: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button 
                type="button"
                onClick={() => setEditingRetailer(null)}
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

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-white border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Retailer / Shop</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Owner</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Area</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Connections</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {retailers.map((retailer) => (
                <tr key={retailer.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
                        <Store size={16} />
                      </div>
                      <span className="font-semibold text-slate-800">{retailer.shopName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    <div className="flex items-center gap-2">
                      <User size={14} className="text-slate-400" />
                      {retailer.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-slate-400" />
                      {retailer.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-slate-400" />
                      {retailer.area}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-3 py-1 bg-slate-50 rounded-full text-sm font-bold text-slate-600 border border-slate-200">
                      {retailer.totalConnections}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => handleToggleStatus(retailer.id)}
                      className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
                      style={{ backgroundColor: retailer.status === 'Active' ? '#10b981' : '#e2e8f0' }}
                    >
                      <span
                        className={cn(
                          "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                          retailer.status === 'Active' ? "translate-x-6" : "translate-x-1"
                        )}
                      />
                    </button>
                    <span className={cn(
                      "ml-2 text-xs font-bold",
                      retailer.status === 'Active' ? "text-emerald-600" : "text-slate-400"
                    )}>
                      {retailer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => {
                          setEditingRetailer(retailer);
                          setShowAddForm(false);
                        }}
                        className="p-2 hover:bg-slate-100 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteRetailer(retailer.id)}
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
