import React, { useState, useMemo, useEffect } from 'react';
import { Save, User, Phone, Calendar, Package, UserCheck, Store, Calculator, Box, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../utils/cn';
import { SearchableSelect } from '../components/SearchableSelect';
import { engineerApi } from '../api/engineerApi';
import { retailerApi } from '../api/retailerApi';
import { connectionApi } from '../api/connectionApi';
import { commissionApi } from '../api/commissionApi';
import { CommissionSettings, Engineer, Retailer } from '../types';

const PACKAGES = [
  '40 Mbps + TV + OTT – ₹589 – 76 Days',
  '30 Mbps + TV + OTT – ₹707 – 65 Days',
  '100 Mbps + TV + OTT – ₹1043 – 48 Days (Popular)',
  '100 Mbps + TV + OTT – ₹1061 – 43 Days',
  '499 Only WiFi'
];

export const AddConnection = () => {
  const navigate = useNavigate();
  const [connectionType, setConnectionType] = useState<'Direct Customer' | 'Retailer'>('Direct Customer');
  const [formData, setFormData] = useState({
    orderId: '',
    customerName: '',
    customerPhone: '',
    installationDate: new Date().toISOString().split('T')[0],
    engineerId: '',
    package: PACKAGES[0],
    retailerId: '',
    cableUsed: '15',
  });

  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [settings, setSettings] = useState<CommissionSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [engRes, retRes, setRes] = await Promise.all([
          engineerApi.getAll({ limit: 100 }),
          retailerApi.getAll({ limit: 100 }),
          commissionApi.getSettings()
        ]);

        if (engRes.success) setEngineers(engRes.data.engineers || []);
        if (retRes.success) setRetailers(retRes.data.retailers || []);
        if (setRes.success) setSettings(setRes.data);
      } catch (err: any) {
        setError('Failed to load required data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const engineerOptions = useMemo(() => 
    engineers.map(eng => ({ 
      value: eng.id, 
      label: eng.name, 
      sublabel: eng.phone 
    })),
  [engineers]);

  const retailerOptions = useMemo(() => 
    retailers.map(ret => ({ 
      value: ret.id, 
      label: ret.shopName, 
      sublabel: ret.name 
    })),
  [retailers]);

  const calculations = useMemo(() => {
    if (!settings) return { engComm: 0, retComm: 0, profit: 0 };
    const isWiFiOnly = formData.package === '499 Only WiFi';
    const engComm = settings.engineerInstallCharge;
    const retComm = connectionType === 'Retailer' 
      ? (isWiFiOnly ? settings.retailerCommissionWiFiOnly : settings.retailerCommissionNormal)
      : 0;
    const profit = settings.companyCost - engComm - retComm;

    return { engComm, retComm, profit };
  }, [formData.package, connectionType, settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      const response = await connectionApi.create({
        ...formData,
        connectionType
      });

      if (response.success) {
        setSuccess('Connection added successfully!');
        setTimeout(() => navigate('/connections'), 2000);
      } else {
        setError(response.message || 'Failed to add connection');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while adding connection');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Add New Connection</h1>
        <p className="text-slate-500">Fill in the details to register a new AirFiber installation.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
        <div className="p-8 space-y-8">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm font-medium animate-shake">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3 text-emerald-600 text-sm font-medium">
              <CheckCircle2 size={18} />
              <span>{success}</span>
            </div>
          )}

          {/* Basic Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-500 flex items-center gap-2 uppercase tracking-wider">
                <Package size={16} className="text-slate-400" /> Order ID
              </label>
              <input 
                type="text" 
                name="orderId"
                required
                value={formData.orderId}
                placeholder="e.g. ORD-12345"
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all outline-none"
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-500 flex items-center gap-2 uppercase tracking-wider">
                <User size={16} className="text-slate-400" /> Customer Name
              </label>
              <input 
                type="text" 
                name="customerName"
                required
                value={formData.customerName}
                placeholder="Full Name"
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all outline-none"
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-500 flex items-center gap-2 uppercase tracking-wider">
                <Phone size={16} className="text-slate-400" /> Customer Phone Number
              </label>
              <input 
                type="tel" 
                name="customerPhone"
                required
                value={formData.customerPhone}
                placeholder="10-digit mobile number"
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all outline-none"
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-500 flex items-center gap-2 uppercase tracking-wider">
                <Calendar size={16} className="text-slate-400" /> Installation Date
              </label>
              <input 
                type="date" 
                name="installationDate"
                required
                value={formData.installationDate}
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all outline-none"
                onChange={handleChange}
              />
            </div>
            
            <SearchableSelect
              label="Select Engineer"
              icon={UserCheck}
              options={engineerOptions}
              value={formData.engineerId}
              onChange={(val) => setFormData({ ...formData, engineerId: val })}
              placeholder="Search engineer..."
            />

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-500 flex items-center gap-2 uppercase tracking-wider">
                <Box size={16} className="text-slate-400" /> Cable Used (meters)
              </label>
              <input 
                type="number" 
                name="cableUsed"
                required
                value={formData.cableUsed}
                placeholder="Default 15m"
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all outline-none"
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-500 flex items-center gap-2 uppercase tracking-wider">
                <Package size={16} className="text-slate-400" /> Select Package
              </label>
              <select 
                name="package"
                value={formData.package}
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all outline-none"
                onChange={handleChange}
              >
                {PACKAGES.map(pkg => <option key={pkg} value={pkg}>{pkg}</option>)}
              </select>
            </div>
          </div>

          {/* Connection Type Section */}
          <div className="space-y-4">
            <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Connection Type</label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="radio" 
                  name="connectionType" 
                  checked={connectionType === 'Direct Customer'}
                  onChange={() => setConnectionType('Direct Customer')}
                  className="w-4 h-4 text-red-600 focus:ring-red-600 border-slate-200 bg-white"
                />
                <span className="text-slate-600 group-hover:text-slate-900 transition-colors">Direct Customer</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="radio" 
                  name="connectionType" 
                  checked={connectionType === 'Retailer'}
                  onChange={() => setConnectionType('Retailer')}
                  className="w-4 h-4 text-red-600 focus:ring-red-600 border-slate-200 bg-white"
                />
                <span className="text-slate-600 group-hover:text-slate-900 transition-colors">Retailer</span>
              </label>
            </div>
          </div>

          {/* Conditional Retailer Fields */}
          {connectionType === 'Retailer' && (
            <div className="p-6 bg-red-50/30 rounded-2xl border border-red-100 animate-in fade-in slide-in-from-top-4 duration-300">
              <SearchableSelect
                label="Select Retailer"
                icon={Store}
                options={retailerOptions}
                value={formData.retailerId}
                onChange={(val) => setFormData({ ...formData, retailerId: val })}
                placeholder="Search retailer shop..."
              />
            </div>
          )}

          {/* Commission Summary */}
          <div className="p-6 bg-white rounded-2xl border border-slate-100 space-y-4">
            <h3 className="text-sm font-bold text-slate-500 flex items-center gap-2 uppercase tracking-wider">
              <Calculator size={16} className="text-red-600" /> Commission Summary
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Engineer Comm.</p>
                <p className="text-lg font-bold text-slate-800">₹{calculations.engComm}</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Retailer Comm.</p>
                <p className="text-lg font-bold text-slate-800">₹{calculations.retComm}</p>
              </div>
              <div className="bg-red-50/50 p-4 rounded-xl border border-red-100 shadow-sm">
                <p className="text-xs text-red-600 font-bold uppercase tracking-wider">Deshbondhu Profit</p>
                <p className="text-lg font-bold text-red-600">₹{calculations.profit}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 bg-white border-t border-slate-100 flex justify-end">
          <button 
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-8 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 shadow-lg shadow-red-600/10 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save size={20} />}
            <span>Submit Connection</span>
          </button>
        </div>
      </form>
    </div>
  );
};
