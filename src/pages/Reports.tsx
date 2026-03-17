import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  TrendingUp, 
  Users,
  Award,
  Star,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { dashboardApi, ReportsData } from '../api/dashboardApi';

const ReportCard = ({ title, subtitle, value, icon: Icon, color }: any) => (
  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-6 hover:border-red-600/20 transition-all">
    <div className={`w-14 h-14 shrink-0 rounded-2xl ${color} flex items-center justify-center text-white shadow-lg`}>
      <Icon size={28} />
    </div>
    <div>
      <h4 className="text-slate-500 text-sm font-medium uppercase tracking-wider">{title}</h4>
      <p className="text-2xl font-black text-slate-800 mt-1">{value}</p>
      <p className="text-xs font-medium text-slate-400 mt-1">{subtitle}</p>
    </div>
  </div>
);

export const Reports = () => {
  const [data, setData] = useState<ReportsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      setIsLoading(true);
      try {
        const response = await dashboardApi.getReports();
        if (response.success) {
          setData(response.data);
        } else {
          setError(response.message || 'Failed to fetch reports');
        }
      } catch (err: any) {
        setError(err.message || 'Error loading reports');
      } finally {
        setIsLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-red-600" />
        <p className="text-slate-500 font-medium animate-pulse">Loading analytical reports...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600">
        <AlertCircle size={18} />
        <span>{error}</span>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Analytical Reports</h1>
        <p className="text-slate-500 mt-1">Deep dive into performance metrics and financial trends.</p>
      </div>

      {/* Top Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ReportCard 
          title="Total Engineer Commission" 
          value={`₹${data.totals.engineerCommission.toLocaleString()}`} 
          subtitle={`Payout for ${data.totals.totalInstallations} installations`}
          icon={Trophy} 
          color="bg-red-600" 
        />
        <ReportCard 
          title="Total Retailer Commission" 
          value={`₹${data.totals.retailerCommission.toLocaleString()}`} 
          subtitle={`Payout to ${data.totals.activeRetailers} active retailers`}
          icon={Award} 
          color="bg-red-700" 
        />
        <ReportCard 
          title="Total Deshbondhu Profit" 
          value={`₹${data.totals.profit.toLocaleString()}`} 
          subtitle="Net profit after all payouts"
          icon={Star} 
          color="bg-red-800" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profit Chart */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
              <TrendingUp size={20} />
            </div>
            <h3 className="font-bold text-slate-800 text-xl">Profit Per Month</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.monthlyProfit}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Profit']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontWeight: 600, color: '#dc2626' }}
                />
                <Bar dataKey="profit" fill="#dc2626" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Installer Performance Chart */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Users size={20} />
            </div>
            <h3 className="font-bold text-slate-800 text-xl">Top Engineers by Installations</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {data.topEngineers.length > 0 ? (
                <BarChart data={data.topEngineers} layout="vertical" margin={{ left: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    formatter={(value: number) => [value, 'Installations']}
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ fontWeight: 600 }}
                  />
                  <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={24}>
                    {data.topEngineers.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || '#dc2626'} />
                    ))}
                  </Bar>
                </BarChart>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400 font-medium">
                  No installations found.
                </div>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
