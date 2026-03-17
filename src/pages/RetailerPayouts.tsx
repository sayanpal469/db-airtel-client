import React, { useState, useEffect } from 'react';
import { 
  Store, 
  Calendar, 
  Eye, 
  CheckCircle2, 
  Clock, 
  Search,
  Check,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { Modal } from '../components/Modal';
import { format } from 'date-fns';
import { payoutApi, PayoutResponse } from '../api/payoutApi';
import { cn } from '../utils/cn';

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const YEARS = [2024, 2025, 2026];

export const RetailerPayouts = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPayout, setSelectedPayout] = useState<PayoutResponse | null>(null);
  const [confirmPayout, setConfirmPayout] = useState<PayoutResponse | null>(null);
  const [payouts, setPayouts] = useState<PayoutResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchPayouts = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await payoutApi.getPayouts('Retailer', selectedMonth, selectedYear);
      if (response.success) {
        setPayouts(response.data);
      } else {
        setError(response.message || 'Failed to fetch payouts');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch payouts');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayouts();
  }, [selectedMonth, selectedYear]);

  const filteredPayouts = payouts.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMarkAsPaid = async () => {
    if (!confirmPayout) return;
    setIsSubmitting(true);
    try {
      const response = await payoutApi.updateStatus({
        recipientId: confirmPayout.recipientId,
        recipientType: 'Retailer',
        month: selectedMonth,
        year: selectedYear,
        amount: confirmPayout.commission,
        connectionCount: confirmPayout.count,
        status: 'Paid'
      });

      if (response.success) {
        setPayouts(prev => prev.map(p => 
          p.recipientId === confirmPayout.recipientId 
            ? { ...p, status: 'Paid', paymentDate: new Date().toISOString() } 
            : p
        ));
        setConfirmPayout(null);
      } else {
        setError(response.message || 'Failed to update payment status');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update payment status');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Retailer Payouts</h1>
          <p className="text-slate-500 mt-1">Manage and track monthly commission payouts for your partner network.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm">
            <Calendar size={18} className="text-slate-400" />
            <select 
              className="bg-transparent border-none text-sm font-semibold text-slate-700 focus:ring-0 outline-none cursor-pointer"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            >
              {MONTHS.map((month, i) => (
                <option key={month} value={i}>{month}</option>
              ))}
            </select>
            <div className="w-px h-4 bg-slate-200 mx-1"></div>
            <select 
              className="bg-transparent border-none text-sm font-semibold text-slate-700 focus:ring-0 outline-none cursor-pointer"
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            >
              {YEARS.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
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
            placeholder="Search shop name..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:ring-2 focus:ring-red-600 outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Payouts Table */}
      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm relative min-h-[200px]">
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-10 transition-all">
            <Loader2 className="w-8 h-8 animate-spin text-red-600" />
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Retailer Shop Name</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Total Connections</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Total Commission</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Payment Status</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Payment Date</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredPayouts.map((payout) => (
                <tr key={payout.recipientId} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600 font-bold">
                        <Store size={18} />
                      </div>
                      <span className="font-bold text-slate-800">{payout.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-sm font-bold border border-purple-100">
                      {payout.count}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className="text-lg font-black text-slate-900">₹{payout.commission.toLocaleString()}</span>
                  </td>
                  <td className="px-8 py-5">
                    <span className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border w-fit",
                      payout.status === 'Paid'
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                        : "bg-red-50 text-red-600 border-red-100"
                    )}>
                      {payout.status === 'Paid' ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                      {payout.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-sm text-slate-500 font-medium">
                      {payout.paymentDate ? format(new Date(payout.paymentDate), 'dd MMM yyyy') : '-'}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setSelectedPayout(payout)}
                        className="p-2 hover:bg-white border border-transparent hover:border-slate-200 text-slate-400 hover:text-red-600 rounded-xl transition-all"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={() => setConfirmPayout(payout)}
                        disabled={payout.status === 'Paid'}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all border",
                          payout.status === 'Paid'
                            ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed"
                            : "bg-white text-emerald-600 border-emerald-100 hover:bg-emerald-50"
                        )}
                      >
                        <Check size={16} />
                        <span>Mark as Paid</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!isLoading && filteredPayouts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-12 text-center text-slate-400 italic">
                    No payouts found for the selected criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      <Modal
        isOpen={!!selectedPayout}
        onClose={() => setSelectedPayout(null)}
        title={`Payout Details: ${selectedPayout?.name}`}
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Total Connections</span>
              <span className="text-2xl font-black text-slate-800">{selectedPayout?.count}</span>
            </div>
            <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
              <span className="text-xs font-bold text-red-600 uppercase tracking-widest block mb-1">Total Commission</span>
              <span className="text-2xl font-black text-red-600">₹{selectedPayout?.commission.toLocaleString()}</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Period</span>
              <span className="text-lg font-bold text-slate-800">{MONTHS[selectedMonth]} {selectedYear}</span>
            </div>
          </div>

          <div className="border rounded-2xl border-slate-100 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Order ID</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Customer</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Package</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Date</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Commission</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {selectedPayout?.connections.map((conn: any) => (
                  <tr key={conn._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-xs font-bold text-red-600">{conn.orderId}</td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-700">{conn.customerName}</td>
                    <td className="px-6 py-4 text-xs text-slate-500 max-w-[200px] truncate">{conn.package}</td>
                    <td className="px-6 py-4 text-xs text-slate-500">{format(new Date(conn.installationDate), 'dd MMM yyyy')}</td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-800 text-right">₹{conn.commission}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        isOpen={!!confirmPayout}
        onClose={() => setConfirmPayout(null)}
        title="Confirm Payment"
      >
        <div className="p-6 text-center space-y-6">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 size={40} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-900">Confirm Payment</h3>
            <p className="text-slate-500">
              Are you sure you want to mark this payout for <span className="font-bold text-slate-900">{confirmPayout?.name}</span> as paid?
            </p>
            <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-sm text-slate-500 block">Total Amount</span>
              <span className="text-2xl font-black text-slate-900">₹{confirmPayout?.commission.toLocaleString()}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-4">
            <button 
              onClick={() => setConfirmPayout(null)}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={handleMarkAsPaid}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2"
            >
              {isSubmitting && <Loader2 size={18} className="animate-spin" />}
              Confirm Payment
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
