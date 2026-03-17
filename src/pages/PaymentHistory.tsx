import React, { useState, useEffect, useMemo } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  Download, 
  Calendar,
  User,
  Store,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  IndianRupee,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { payoutApi } from '../api/payoutApi';
import { cn } from '../utils/cn';

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const YEARS = [2024, 2025, 2026];

export const PaymentHistory = () => {
  const [selectedMonth, setSelectedMonth] = useState<number | 'all'>('all');
  const [selectedYear, setSelectedYear] = useState<number | 'all'>(new Date().getFullYear());
  const [selectedType, setSelectedType] = useState<'all' | 'Engineer' | 'Retailer'>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'Paid' | 'Unpaid'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [payouts, setPayouts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchHistory = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await payoutApi.getHistory({
        type: selectedType,
        status: selectedStatus,
        month: selectedMonth,
        year: selectedYear
      });
      if (response.success) {
        setPayouts(response.data);
      } else {
        setError(response.message || 'Failed to fetch history');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch history');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [selectedMonth, selectedYear, selectedStatus, selectedType]);

  const filteredPayouts = payouts.filter(p => 
    p.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = useMemo(() => {
    return {
      totalPaid: payouts.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.commission, 0),
      totalPending: payouts.filter(p => p.status === 'Unpaid').reduce((sum, p) => sum + p.commission, 0),
      engineerTotal: payouts.filter(p => p.type === 'Engineer' && p.status === 'Paid').reduce((sum, p) => sum + p.commission, 0),
      retailerTotal: payouts.filter(p => p.type === 'Retailer' && p.status === 'Paid').reduce((sum, p) => sum + p.commission, 0),
    };
  }, [payouts]);

  const handleExport = () => {
    alert("Exporting history...");
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Payment History</h1>
          <p className="text-slate-500 mt-1">Consolidated view of all financial payouts and their statuses.</p>
        </div>

        <button 
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
        >
          <Download size={18} />
          <span>Export History</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative min-h-[120px]">
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-10">
            <Loader2 className="animate-spin text-red-600" />
          </div>
        )}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
              <Clock size={24} />
            </div>
            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full uppercase tracking-wider">Pending</span>
          </div>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Pending Payouts</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">₹{stats.totalPending.toLocaleString()}</h3>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
              <CheckCircle2 size={24} />
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-wider">Completed</span>
          </div>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Total Paid</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">₹{stats.totalPaid.toLocaleString()}</h3>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
              <User size={24} />
            </div>
            <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
              <ArrowUpRight size={14} />
              <span>Paid</span>
            </div>
          </div>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Engineer Total</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">₹{stats.engineerTotal.toLocaleString()}</h3>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
              <Store size={24} />
            </div>
            <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
              <ArrowUpRight size={14} />
              <span>Paid</span>
            </div>
          </div>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Retailer Total</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">₹{stats.retailerTotal.toLocaleString()}</h3>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:ring-2 focus:ring-red-600 outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
            <Calendar size={18} className="text-slate-400" />
            <select 
              className="bg-transparent border-none text-sm font-semibold text-slate-700 focus:ring-0 outline-none cursor-pointer"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
            >
              <option value="all">All Months</option>
              {MONTHS.map((month, i) => (
                <option key={month} value={i}>{month}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
            <Filter size={18} className="text-slate-400" />
            <select 
              className="bg-transparent border-none text-sm font-semibold text-slate-700 focus:ring-0 outline-none cursor-pointer"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as any)}
            >
              <option value="all">All Types</option>
              <option value="Engineer">Engineers</option>
              <option value="Retailer">Retailers</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
            <CheckCircle2 size={18} className="text-slate-400" />
            <select 
              className="bg-transparent border-none text-sm font-semibold text-slate-700 focus:ring-0 outline-none cursor-pointer"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
            >
              <option value="all">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
            </select>
          </div>
        </div>
      </div>

      {/* History Table */}
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
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Recipient</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Type</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Period</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Amount</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Payment Date</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredPayouts.map((payout, idx) => (
                <tr key={`${payout.id}-${idx}`} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center font-bold",
                        payout.type === 'Engineer' ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"
                      )}>
                        {payout.type === 'Engineer' ? <User size={18} /> : <Store size={18} />}
                      </div>
                      <span className="font-bold text-slate-800">{payout.name || 'Unknown'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={cn(
                      "px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider",
                      payout.type === 'Engineer' ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"
                    )}>
                      {payout.type}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-sm text-slate-600 font-medium">
                      {MONTHS[payout.month]} {payout.year}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-1 text-slate-900 font-black">
                      <IndianRupee size={14} />
                      <span>{payout.commission.toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-sm text-slate-500 font-medium">
                      {payout.paymentDate ? format(new Date(payout.paymentDate), 'dd MMM yyyy') : '-'}
                    </span>
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
                </tr>
              ))}
              {!isLoading && filteredPayouts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-12 text-center text-slate-400 italic">
                    No payment history found for the selected criteria.
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
