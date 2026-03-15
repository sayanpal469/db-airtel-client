import React, { useState } from 'react';
import { Save, DollarSign, Settings, Info } from 'lucide-react';
import { DEFAULT_COMMISSION_SETTINGS } from '../data/dummyData';
import { CommissionSettings } from '../types';

export const CommissionSettingsPage = () => {
  const [settings, setSettings] = useState<CommissionSettings>(DEFAULT_COMMISSION_SETTINGS);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleSave = () => {
    alert('Settings saved successfully! (Dummy Action)');
    console.log('Saved Settings:', settings);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Commission Settings</h1>
        <p className="text-slate-500">Manage default pricing and commission values for profit calculations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Base Pricing */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-50 text-red-600 rounded-lg">
              <DollarSign size={20} />
            </div>
            <h3 className="font-bold text-slate-800">Base Pricing</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Customer Price (Default)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                <input
                  type="number"
                  name="customerPrice"
                  value={settings.customerPrice}
                  onChange={handleChange}
                  className="w-full pl-8 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-red-600 outline-none transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Company Cost (Default)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                <input
                  type="number"
                  name="companyCost"
                  value={settings.companyCost}
                  onChange={handleChange}
                  className="w-full pl-8 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-red-600 outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Commission Values */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-50 text-red-600 rounded-lg">
              <Settings size={20} />
            </div>
            <h3 className="font-bold text-slate-800">Commission Values</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Engineer Install Charge</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                <input
                  type="number"
                  name="engineerInstallCharge"
                  value={settings.engineerInstallCharge}
                  onChange={handleChange}
                  className="w-full pl-8 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-red-600 outline-none transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Retailer Commission (Normal)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                <input
                  type="number"
                  name="retailerCommissionNormal"
                  value={settings.retailerCommissionNormal}
                  onChange={handleChange}
                  className="w-full pl-8 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-red-600 outline-none transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Retailer Commission (WiFi Only)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                <input
                  type="number"
                  name="retailerCommissionWiFiOnly"
                  value={settings.retailerCommissionWiFiOnly}
                  onChange={handleChange}
                  className="w-full pl-8 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-red-600 outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-red-50 border border-red-100 p-6 rounded-2xl flex gap-4">
        <div className="p-2 bg-red-100 text-red-600 rounded-lg h-fit">
          <Info size={20} />
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-red-600">How Profit is Calculated</h4>
          <p className="text-sm text-slate-600 leading-relaxed">
            Profit = Company Cost - Engineer Install Charge - Retailer Commission (if applicable).
            <br />
            For WiFi Only packages, the "WiFi Only" commission rate is used automatically.
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-8 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 shadow-lg shadow-red-100 transition-all active:scale-95"
        >
          <Save size={20} /> Save Settings
        </button>
      </div>
    </div>
  );
};
