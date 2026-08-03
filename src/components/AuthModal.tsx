import React, { useState } from 'react';
import { X, Flame, Mail, Lock, User as UserIcon, Phone, ShieldCheck, LogIn, UserPlus, Loader2, AlertCircle } from 'lucide-react';
import { useAuth, AuthTab } from '../context/AuthContext';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authTab,
    setAuthTab,
    login,
    register,
    isLoading,
    error,
    clearError,
  } = useAuth();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  if (!isAuthModalOpen) return null;

  const handleTabChange = (newTab: AuthTab) => {
    setAuthTab(newTab);
    clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authTab === 'customer-register' && password.length < 6) {
      // Immediate client-side validation feedback
      return;
    }
    try {
      if (authTab === 'customer-register') {
        await register({ name, email, password, phone, role: 'CUSTOMER' });
      } else if (authTab === 'admin-login') {
        await login({ email, password });
      } else {
        await login({ email, password });
      }
    } catch {
      // Error handled inside AuthContext
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-[#FFFDF8] border border-[#ECECEC] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 text-[#6B7280] hover:text-[#1E1E1E] bg-[#FFFFFF] border border-[#ECECEC] hover:bg-[#ECECEC]/50 p-2 rounded-full transition-all cursor-pointer shadow-xs"
          aria-label="Close Auth Modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#E85D04] text-white flex items-center justify-center mx-auto shadow-md shadow-[#E85D04]/30">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-2xl font-extrabold text-[#1E1E1E] font-['Poppins'] tracking-tight">
            {authTab === 'customer-register'
              ? 'Create Account'
              : authTab === 'admin-login'
              ? 'Admin Portal Login'
              : 'Welcome Back'}
          </h2>
          <p className="text-xs text-[#6B7280]">
            {authTab === 'customer-register'
              ? 'Join Sizzle for faster ordering & exclusive gourmet rewards'
              : authTab === 'admin-login'
              ? 'Restricted access for restaurant administration & kitchen staff'
              : 'Sign in to access your orders and saved profiles'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-3 gap-1 bg-[#F3F4F6] p-1 rounded-2xl border border-[#ECECEC] text-xs font-semibold">
          <button
            type="button"
            onClick={() => handleTabChange('customer-login')}
            className={`py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              authTab === 'customer-login'
                ? 'bg-white text-[#E85D04] shadow-xs font-bold'
                : 'text-[#6B7280] hover:text-[#1E1E1E]'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Login</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('customer-register')}
            className={`py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              authTab === 'customer-register'
                ? 'bg-white text-[#E85D04] shadow-xs font-bold'
                : 'text-[#6B7280] hover:text-[#1E1E1E]'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Register</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('admin-login')}
            className={`py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              authTab === 'admin-login'
                ? 'bg-[#1E1E1E] text-white shadow-xs font-bold'
                : 'text-[#6B7280] hover:text-[#1E1E1E]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-[#D32F2F]/10 border border-[#D32F2F]/30 text-[#D32F2F] text-xs rounded-2xl p-3.5 flex items-start gap-2.5 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Registration Name Field */}
          {authTab === 'customer-register' && (
            <div className="space-y-1.5">
              <label className="block font-semibold text-[#1E1E1E]">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-3 w-4 h-4 text-[#6B7280]" />
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#ECECEC] rounded-xl focus:outline-none focus:border-[#E85D04] text-[#1E1E1E] text-xs transition-all"
                />
              </div>
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="block font-semibold text-[#1E1E1E]">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-[#6B7280]" />
              <input
                type="email"
                required
                placeholder={authTab === 'admin-login' ? 'admin@sizzle.com' : 'you@example.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#ECECEC] rounded-xl focus:outline-none focus:border-[#E85D04] text-[#1E1E1E] text-xs transition-all"
              />
            </div>
          </div>

          {/* Phone Field for Registration */}
          {authTab === 'customer-register' && (
            <div className="space-y-1.5">
              <label className="block font-semibold text-[#1E1E1E]">Phone Number (Optional)</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3 w-4 h-4 text-[#6B7280]" />
                <input
                  type="tel"
                  placeholder="+1 555-0199"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#ECECEC] rounded-xl focus:outline-none focus:border-[#E85D04] text-[#1E1E1E] text-xs transition-all"
                />
              </div>
            </div>
          )}

          {/* Password Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block font-semibold text-[#1E1E1E]">Password</label>
              {authTab === 'customer-register' && (
                <span className="text-[10px] text-[#6B7280]">Min. 6 characters</span>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-[#6B7280]" />
              <input
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#ECECEC] rounded-xl focus:outline-none focus:border-[#E85D04] text-[#1E1E1E] text-xs transition-all"
              />
            </div>
          </div>

          {/* Preset Helper Text for Demo Testing */}
          <div className="bg-[#FFFDF8] border border-[#E85D04]/20 rounded-xl p-3 text-[11px] text-[#6B7280] space-y-1">
            <p className="font-semibold text-[#E85D04]">Quick Demo Accounts:</p>
            {authTab === 'admin-login' ? (
              <div className="space-y-0.5">
                <p>Primary: <code className="text-[#1E1E1E] bg-[#ECECEC]/50 px-1 py-0.5 rounded">admin@sizzle.com</code> / <code className="text-[#1E1E1E] bg-[#ECECEC]/50 px-1 py-0.5 rounded">Admin@123</code></p>
                <p>Secondary: <code className="text-[#1E1E1E] bg-[#ECECEC]/50 px-1 py-0.5 rounded">098@gmail.com</code> / <code className="text-[#1E1E1E] bg-[#ECECEC]/50 px-1 py-0.5 rounded">098765</code></p>
              </div>
            ) : (
              <p>Customer: <code className="text-[#1E1E1E] bg-[#ECECEC]/50 px-1 py-0.5 rounded">customer@sizzle.com</code> / <code className="text-[#1E1E1E] bg-[#ECECEC]/50 px-1 py-0.5 rounded">Customer@123</code></p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full font-bold text-sm py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 ${
              authTab === 'admin-login'
                ? 'bg-[#1E1E1E] hover:bg-black text-white shadow-black/20'
                : 'bg-[#E85D04] hover:bg-[#C94B00] text-white shadow-[#E85D04]/20'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : authTab === 'customer-register' ? (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Create Customer Account</span>
              </>
            ) : authTab === 'admin-login' ? (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Login as Administrator</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In to Sizzle</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
