import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { FileText, TrendingUp, BarChart3, Clock, User } from 'lucide-react';
import { DUMMY_CABLE_USAGE, DUMMY_ALLOCATIONS } from '../../data/dummyData';
import { format } from 'date-fns';

export const CableUsageReport = () => {
  // Chart Data Preparation
  const engineerUsageData = DUMMY_ALLOCATIONS.map(a => ({
    name: a.engineerName.split(' ')[0],
    used: a.totalUsedCable,
    remaining: a.remainingCable
  }));

  const monthlyConsumptionData = [
    { month: 'Jan', consumption: 1200 },
    { month: 'Feb', consumption: 1450 },
    { month: 'Mar', consumption: 1100 },
    { month: 'Apr', consumption: 1800 },
    { month: 'May', consumption: 1650 },
    { month: 'Jun', consumption: 2100 },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Cable Usage Report</h1>
        <p className="text-slate-500 mt-1">Detailed analytics and logs for CAT6 cable consumption.</p>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Engineer Usage Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
              <BarChart3 size={20} />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Engineer Cable Usage (m)</h2>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={engineerUsageData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Legend iconType="circle" />
                <Bar dataKey="used" name="Used" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={30} />
                <Bar dataKey="remaining" name="Remaining" fill="#cbd5e1" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Consumption Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <TrendingUp size={20} />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Monthly Consumption Trend (m)</h2>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyConsumptionData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0(0 / 0.1)'}}
                />
                <Line 
                  type="monotone" 
                  dataKey="consumption" 
                  stroke="#10b981" 
                  strokeWidth={3} 
                  dot={{r: 6, fill: '#10b981', strokeWidth: 2, stroke: '#fff'}} 
                  activeDot={{r: 8}} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Usage Log Table */}
      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600">
              <FileText size={20} />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Cable Usage Log</h2>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Order ID</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Engineer Name</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Cable Used</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Date</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Remaining Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {DUMMY_CABLE_USAGE.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-5">
                    <span className="font-bold text-red-600">{log.orderId}</span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <User size={14} className="text-slate-400" />
                      <span className="font-medium text-slate-700">{log.engineerName}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-bold border border-red-100">
                      {log.cableUsed}m
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                      <Clock size={14} />
                      {format(new Date(log.date), 'dd MMM yyyy')}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <span className="font-bold text-slate-800">{log.remainingStock}m</span>
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
