import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2, Lock, Loader2, Key } from 'lucide-react';
import { authApi } from '../api/authApi';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const response = await authApi.forgotPassword(email);
      if (response.success) {
        setStep('otp');
      } else {
        setError(response.message || 'Failed to send OTP');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const response = await authApi.verifyOtp(email, otp);
      if (response.success) {
        // Redirect to reset password with the token
        navigate('/reset-password', { state: { token: response.data.resetToken } });
      } else {
        setError(response.message || 'Invalid OTP');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid OTP');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-2xl text-white font-bold text-3xl shadow-xl shadow-red-100 mb-4">
            D
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Deshbondhu</h1>
          <p className="text-slate-500 font-medium uppercase tracking-widest text-xs mt-1">AirFiber Manager</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
          <Link to="/login" className="inline-flex items-center gap-2 text-slate-400 hover:text-red-600 text-sm font-bold mb-6 transition-colors">
            <ArrowLeft size={16} />
            <span>Back to Login</span>
          </Link>

          {step === 'email' ? (
            <>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Forgot Password</h2>
              <p className="text-slate-500 text-sm mb-6">Enter your email address and we'll send you an OTP to reset your password.</p>

              <form onSubmit={handleSendOtp} className="space-y-5">
                {error && <p className="text-red-600 text-sm font-medium">{error}</p>}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-500 uppercase tracking-wider ml-1">Email Address</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="admin@deshbondhu.com"
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:ring-2 focus:ring-red-600 outline-none transition-all"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 shadow-lg shadow-red-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : 'Send OTP'}
                </button>
              </form>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Verify OTP</h2>
              <p className="text-slate-500 text-sm mb-6">Enter the 6-digit code sent to your email.</p>

              <form onSubmit={handleVerifyOtp} className="space-y-5">
                {error && <p className="text-red-600 text-sm font-medium">{error}</p>}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-500 uppercase tracking-wider ml-1">OTP</label>
                  <div className="relative">
                    <Key size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="XXXXXX"
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:ring-2 focus:ring-red-600 outline-none transition-all tracking-[0.5em] font-mono text-center"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 shadow-lg shadow-red-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : 'Verify & Proceed'}
                </button>
                
                <button 
                  type="button" 
                  onClick={() => setStep('email')} 
                  className="w-full text-slate-400 text-sm font-bold hover:text-slate-600 transition-colors"
                >
                  Resend OTP
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
