import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, LogIn } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin, openAuthModal } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
        <div className="p-4 rounded-2xl bg-orange-500/10 text-orange-500 border border-orange-500/20 mb-4">
          <LogIn className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Authentication Required</h2>
        <p className="text-sm text-zinc-400 max-w-md mb-6">
          Please log in to your account to access this page and manage your restaurant settings.
        </p>
        <button
          onClick={() => openAuthModal('customer-login')}
          className="px-6 py-3 font-semibold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-xl shadow-lg shadow-orange-500/25 transition-all"
        >
          Sign In Now
        </button>
      </div>
    );
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
        <div className="p-4 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20 mb-4">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Access Denied (403)</h2>
        <p className="text-sm text-zinc-400 max-w-md mb-6">
          You do not have Administrator permissions to access the Admin Dashboard. Please log in with an Admin account.
        </p>
        <button
          onClick={() => openAuthModal('admin-login')}
          className="px-6 py-3 font-semibold text-white bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl transition-all"
        >
          Sign In as Admin
        </button>
      </div>
    );
  }

  return <>{children}</>;
};
