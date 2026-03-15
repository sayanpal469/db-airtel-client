import React, { useState, useMemo } from 'react';
import { Save, User, Phone, Calendar, Package, UserCheck, Store, Calculator } from 'lucide-react';
import { cn } from '../utils/cn';
import { SearchableSelect } from '../components/SearchableSelect';
import { DUMMY_ENGINEERS, DUMMY_RETAILERS, DEFAULT_COMMISSION_SETTINGS } from '../data/dummyData';

const PACKAGES = [
  '40 Mbps + TV + OTT – ₹589 – 76 Days',
  '30 Mbps + TV + OTT – ₹707 – 65 Days',
  '100 Mbps + TV + OTT – ₹943 – 48 Days (Popular)',
  '100 Mbps + TV + OTT – ₹1061 – 43 Days',
  '499 Only WiFi'
];

export const AddConnection = () => {
  const [connectionType, setConnectionType] = useState<'Direct Customer' | 'Retailer'>('Direct Customer');
  const [formData, setFormData] = useState({
    orderId: '',
    customerName: '',
    customerPhone: '',
    installationDate: '',
    installerName: '',
    package: PACKAGES[0],
    retailerId: '',
  });

  const engineerOptions = useMemo(() => 
    DUMMY_ENGINEERS.map(eng => ({ value: eng.name, label: eng.name, sublabel: eng.area })),
  []);

  const retailerOptions = useMemo(() => 
    DUMMY_RETAILERS.map(ret => ({ value: ret.id, label: ret.shopName, sublabel: ret.name })),
  []);

  // Auto Calculations
  const calculations = useMemo(() => {
    const isWiFiOnly = formData.package === '499 Only WiFi';
    const engComm = DEFAULT_COMMISSION_SETTINGS.engineerInstallCharge;
    const retComm = connectionType === 'Retailer' 
      ? (isWiFiOnly ? DEFAULT_COMMISSION_SETTINGS.retailerCommissionWiFiOnly : DEFAULT_COMMISSION_SETTINGS.retailerCommissionNormal)
      : 0;
    const profit = DEFAULT_COMMISSION_SETTINGS.companyCost - engComm - retComm;

    return { engComm, retComm, profit };
  }, [formData.package, connectionType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Submitted:', { 
      ...formData, 
      connectionType,
      ...calculations 
    });
    alert('Connection added successfully! (Calculated Profit: ₹' + calculations.profit + ')');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Add New Connection</h1>
        <p className="text-slate-500">Fill in the details to register a new AirFiber installation.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
        <div className="p-8 space-y-8">
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
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all outline-none"
                onChange={handleChange}
              />
            </div>
            
            <SearchableSelect
              label="Select Engineer"
              icon={UserCheck}
              options={engineerOptions}
              value={formData.installerName}
              onChange={(val) => setFormData({ ...formData, installerName: val })}
              placeholder="Search engineer..."
            />

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-500 flex items-center gap-2 uppercase tracking-wider">
                <Package size={16} className="text-slate-400" /> Select Package
              </label>
              <select 
                name="package"
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
            className="flex items-center gap-2 px-8 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 shadow-lg shadow-red-600/10 transition-all active:scale-95"
          >
            <Save size={20} /> Submit Connection
          </button>
        </div>
      </form>
    </div>
  );
};
