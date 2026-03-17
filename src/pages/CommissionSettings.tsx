import React, { useState, useEffect } from 'react';
import { Save, DollarSign, Settings, Info, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { CommissionSettings } from '../types';
import { commissionApi } from '../api/commissionApi';

export const CommissionSettingsPage = () => {
  const [settings, setSettings] = useState<CommissionSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await commissionApi.getSettings();
        if (response.success) {
          setSettings(response.data);
        } else {
          setError(response.message || 'Failed to fetch settings');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch settings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (settings) {
      setSettings({ ...settings, [name]: parseFloat(value) || 0 });
    }
  };

  const handleSave = async () => {
    if (!settings) return;
    
    setError('');
    setSuccessMessage('');
    setIsSubmitting(true);
    
    try {
      const response = await commissionApi.updateSettings(settings);
      if (response.success) {
        setSettings(response.data);
        setSuccessMessage('Settings saved successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(response.message || 'Failed to update settings');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update settings');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
      </div>
    );
  }

  if (!settings && error) {
    return (
      <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 max-w-2xl mx-auto">
        <AlertCircle size={18} />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Commission Settings</h1>
        <p className="text-slate-500">Manage default pricing and commission values for profit calculations.</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm font-medium animate-shake">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3 text-emerald-600 text-sm font-medium">
          <CheckCircle2 size={18} />
          <span>{successMessage}</span>
        </div>
      )}

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
                  value={settings?.customerPrice || 0}
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
                  value={settings?.companyCost || 0}
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
                  value={settings?.engineerInstallCharge || 0}
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
                  value={settings?.retailerCommissionNormal || 0}
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
                  value={settings?.retailerCommissionWiFiOnly || 0}
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
          disabled={isSubmitting || !settings}
          className="flex items-center gap-2 px-8 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 shadow-lg shadow-red-100 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save size={20} />}
          <span>Save Settings</span>
        </button>
      </div>
    </div>
  );
};
