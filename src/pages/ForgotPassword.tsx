import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
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

          <h2 className="text-2xl font-bold text-slate-800 mb-2">Forgot Password</h2>
          <p className="text-slate-500 text-sm mb-6">Enter your email address and we'll send you a link to reset your password.</p>

          {isSubmitted ? (
            <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-2xl text-center space-y-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={24} />
              </div>
              <p className="text-emerald-800 font-medium">
                If the email exists, a password reset link has been sent.
              </p>
              <Link to="/reset-password" title="Reset Password" className="block text-sm font-bold text-emerald-600 hover:underline">
                Demo: Go to Reset Password Page
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
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
                className="w-full py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 shadow-lg shadow-red-100 transition-all active:scale-[0.98]"
              >
                Send Reset Link
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
