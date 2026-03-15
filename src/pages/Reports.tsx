import React from 'react';
import { 
  Trophy, 
  TrendingUp, 
  Package, 
  Users,
  Award,
  Star
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
import { MONTHLY_GROWTH_DATA } from '../data/dummyData';

const TOP_INSTALLERS = [
  { name: 'Amit Sharma', count: 45, color: '#3b82f6' },
  { name: 'Rahul Verma', count: 38, color: '#10b981' },
  { name: 'Sanjay Gupta', count: 32, color: '#f59e0b' },
  { name: 'Vikram Singh', count: 28, color: '#ef4444' },
  { name: 'Deepak Kumar', count: 25, color: '#8b5cf6' },
];

const ReportCard = ({ title, subtitle, value, icon: Icon, color }: any) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-6">
    <div className={`w-14 h-14 shrink-0 rounded-2xl ${color} flex items-center justify-center text-white shadow-lg`}>
      <Icon size={28} />
    </div>
    <div>
      <h4 className="text-slate-500 text-sm font-medium uppercase tracking-wider">{title}</h4>
      <p className="text-xl font-bold text-slate-800">{value}</p>
      <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
    </div>
  </div>
);

export const Reports = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Analytical Reports</h1>
        <p className="text-slate-500">Deep dive into performance metrics and trends.</p>
      </div>

      {/* Top Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ReportCard 
          title="Total Engineer Commission" 
          value="₹49,360" 
          subtitle="Payout for 124 installations"
          icon={Trophy} 
          color="bg-red-600" 
        />
        <ReportCard 
          title="Total Retailer Commission" 
          value="₹32,450" 
          subtitle="Payout to 42 active retailers"
          icon={Award} 
          color="bg-red-700" 
        />
        <ReportCard 
          title="Total Deshbondhu Profit" 
          value="₹1,42,800" 
          subtitle="Net profit after all payouts"
          icon={Star} 
          color="bg-red-800" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profit Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-wider text-sm">
            <TrendingUp size={20} className="text-red-500" /> Profit Per Month
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY_GROWTH_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #f1f5f9', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.05)' }}
                />
                <Bar dataKey="profit" fill="#dc2626" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Installer Performance Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-wider text-sm">
            <Users size={20} className="text-red-500" /> Top Engineer by Installations
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={TOP_INSTALLERS} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #f1f5f9', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.05)' }}
                />
                <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={20}>
                  {TOP_INSTALLERS.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#dc2626' : index === 1 ? '#b91c1c' : index === 2 ? '#991b1b' : '#7f1d1d'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
