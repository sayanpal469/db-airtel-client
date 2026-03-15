import React, { useState, useMemo } from 'react';
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
  ArrowDownRight,
  IndianRupee
} from 'lucide-react';
import { DUMMY_CONNECTIONS } from '../data/dummyData';
import { getEngineerPayouts, getRetailerPayouts } from '../utils/finance';
import { format } from 'date-fns';
import { Payout } from '../types';

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const YEARS = [2024, 2025, 2026];

export const PaymentHistory = () => {
  const [selectedMonth, setSelectedMonth] = useState<number | 'all'>(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedType, setSelectedType] = useState<'all' | 'Engineer' | 'Retailer'>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'Paid' | 'Unpaid'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const allPayouts = useMemo(() => {
    const monthsToFetch = selectedMonth === 'all' ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] : [selectedMonth];
    
    let combined: Payout[] = [];
    
    monthsToFetch.forEach(m => {
      const eng = getEngineerPayouts(DUMMY_CONNECTIONS, m, selectedYear);
      const ret = getRetailerPayouts(DUMMY_CONNECTIONS, m, selectedYear);
      combined = [...combined, ...eng, ...ret];
    });

    return combined.sort((a, b) => {
      if (!a.paymentDate) return 1;
      if (!b.paymentDate) return -1;
      return new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime();
    });
  }, [selectedMonth, selectedYear]);

  const filteredPayouts = allPayouts.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || p.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || p.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const stats = useMemo(() => {
    return {
      totalPaid: filteredPayouts.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.commission, 0),
      totalPending: filteredPayouts.filter(p => p.status === 'Unpaid').reduce((sum, p) => sum + p.commission, 0),
      engineerTotal: filteredPayouts.filter(p => p.type === 'Engineer' && p.status === 'Paid').reduce((sum, p) => sum + p.commission, 0),
      retailerTotal: filteredPayouts.filter(p => p.type === 'Retailer' && p.status === 'Paid').reduce((sum, p) => sum + p.commission, 0),
    };
  }, [filteredPayouts]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Payment History</h1>
          <p className="text-slate-500 mt-1">Consolidated view of all financial payouts and their statuses.</p>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
          <Download size={18} />
          <span>Export History</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
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
                      <span className="font-bold text-slate-800">{payout.name}</span>
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
              {filteredPayouts.length === 0 && (
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

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
