import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Wallet, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Calendar,
  FileText,
  Table as TableIcon,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { payoutApi, MonthlySummary } from '../api/payoutApi';
import { cn } from '../utils/cn';

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const YEARS = [2024, 2025, 2026];

export const MonthlySettlements = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [summary, setSummary] = useState<MonthlySummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSummary = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await payoutApi.getMonthlySummary(selectedMonth, selectedYear);
      if (response.success) {
        setSummary(response.data);
      } else {
        setError(response.message || 'Failed to fetch summary');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch summary');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [selectedMonth, selectedYear]);

  const stats = useMemo(() => {
    if (!summary) return [];
    return [
      { 
        label: 'Total Connections', 
        value: summary.totalConnections, 
        icon: Users, 
        color: 'text-blue-600', 
        bg: 'bg-blue-50',
        description: 'New installations this month'
      },
      { 
        label: 'Total Revenue', 
        value: `₹${summary.totalRevenue.toLocaleString()}`, 
        icon: TrendingUp, 
        color: 'text-emerald-600', 
        bg: 'bg-emerald-50',
        description: 'Gross customer payments'
      },
      { 
        label: 'Company Cost', 
        value: `₹${summary.totalCompanyCost.toLocaleString()}`, 
        icon: Wallet, 
        color: 'text-amber-600', 
        bg: 'bg-amber-50',
        description: 'Fixed cost to company'
      },
      { 
        label: 'Engineer Comm.', 
        value: `₹${summary.totalEngineerCommission.toLocaleString()}`, 
        icon: DollarSign, 
        color: 'text-red-600', 
        bg: 'bg-red-50',
        description: 'Total installation charges'
      },
      { 
        label: 'Retailer Comm.', 
        value: `₹${summary.totalRetailerCommission.toLocaleString()}`, 
        icon: DollarSign, 
        color: 'text-purple-600', 
        bg: 'bg-purple-50',
        description: 'Total partner commissions'
      },
      { 
        label: 'Deshbondhu Profit', 
        value: `₹${summary.totalProfit.toLocaleString()}`, 
        icon: TrendingUp, 
        color: 'text-red-600', 
        bg: 'bg-red-50',
        description: 'Net profit after payouts',
        highlight: true
      },
    ];
  }, [summary]);

  const handleExport = (type: 'csv' | 'excel') => {
    alert(`Exporting ${type.toUpperCase()} for ${MONTHS[selectedMonth]} ${selectedYear}`);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Monthly Settlements</h1>
          <p className="text-slate-500 mt-1">Review financial performance and calculate payouts for {MONTHS[selectedMonth]} {selectedYear}.</p>
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

          <div className="flex items-center gap-2">
            <button 
              onClick={() => handleExport('csv')}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-50 transition-all shadow-sm"
            >
              <FileText size={16} /> CSV
            </button>
            <button 
              onClick={() => handleExport('excel')}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-50 transition-all shadow-sm"
            >
              <TableIcon size={16} /> Excel
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative min-h-[200px]">
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-10 transition-all">
            <Loader2 className="w-8 h-8 animate-spin text-red-600" />
          </div>
        )}
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              "p-6 rounded-3xl border shadow-sm transition-all hover:shadow-md",
              stat.highlight ? "bg-red-600 border-red-600 text-white" : "bg-white border-slate-100"
            )}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={cn(
                "p-3 rounded-2xl",
                stat.highlight ? "bg-white/20 text-white" : stat.bg + " " + stat.color
              )}>
                <stat.icon size={24} />
              </div>
              {stat.highlight && (
                <div className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  Net Profit
                </div>
              )}
            </div>
            <div className="space-y-1">
              <h3 className={cn(
                "text-sm font-bold uppercase tracking-wider",
                stat.highlight ? "text-white/70" : "text-slate-400"
              )}>
                {stat.label}
              </h3>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black tracking-tight">{stat.value}</span>
              </div>
              <p className={cn(
                "text-xs mt-2",
                stat.highlight ? "text-white/60" : "text-slate-500"
              )}>
                {stat.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Calculation Breakdown */}
      <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-red-50 text-red-600 rounded-xl">
            <TrendingUp size={20} />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Profit Calculation Breakdown</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Revenue</span>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-sm font-medium text-slate-600">Customer Price</span>
              <span className="font-bold text-slate-800">₹1,500</span>
            </div>
          </div>

          <div className="space-y-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Direct Costs</span>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-sm font-medium text-slate-600">Company Cost</span>
                <span className="font-bold text-slate-800">₹1,150</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Commissions</span>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-sm font-medium text-slate-600">Engineer Charge</span>
                <span className="font-bold text-slate-800">₹400</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-sm font-medium text-slate-600">Retailer (Avg)</span>
                <span className="font-bold text-slate-800">₹300</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Net Profit</span>
            <div className="flex flex-col items-center justify-center p-6 bg-red-50 rounded-2xl border border-red-100 h-[108px]">
              <span className="text-xs font-bold text-red-600 uppercase mb-1">Per Connection</span>
              <span className="text-2xl font-black text-red-600">₹400 - ₹500</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
