import React from 'react';
import { ShoppingBag, History, Flame, Percent, User as UserIcon, LogIn, LogOut, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  onOpenHistory: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenHistory }) => {
  const {
    cartItems,
    subtotal,
    setIsCartOpen,
    pastReceipts,
  } = useCart();

  const {
    user,
    isAuthenticated,
    isAdmin,
    openAuthModal,
    logout,
  } = useAuth();

  const totalItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-[#FFFDF8]/95 backdrop-blur-md border-b border-[#ECECEC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-11 h-11 rounded-xl bg-[#E85D04] flex items-center justify-center text-white shadow-md shadow-[#E85D04]/20">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-2xl tracking-tight text-[#1E1E1E] font-['Poppins']">
                SIZZLE
              </span>
              <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider bg-[#E85D04]/10 text-[#E85D04] px-2 py-0.5 rounded-full border border-[#E85D04]/20">
                Gourmet
              </span>
            </div>
            <p className="text-xs text-[#6B7280] font-medium hidden sm:block">
              Taste That Brings People Together
            </p>
          </div>
        </div>

        {/* Header Action Items */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Discount Tag Info */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-[#2E7D32] bg-[#2E7D32]/10 px-3 py-2 rounded-xl border border-[#2E7D32]/20">
            <Percent className="w-3.5 h-3.5" />
            <span>10% OFF over ₹1,000</span>
          </div>

          {/* Past Orders Button */}
          {pastReceipts.length > 0 && (
            <button
              onClick={onOpenHistory}
              className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#1E1E1E] bg-[#FFFFFF] border border-[#ECECEC] hover:bg-[#FFFDF8] hover:border-[#E85D04]/40 px-3.5 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer"
              title="View Past Receipts"
            >
              <History className="w-4 h-4 text-[#E85D04]" />
              <span className="hidden sm:inline">Orders</span>
              <span className="bg-[#E85D04]/10 text-[#E85D04] text-[11px] font-bold px-1.5 py-0.2 rounded-md">
                {pastReceipts.length}
              </span>
            </button>
          )}

          {/* Cart Trigger Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2.5 bg-[#E85D04] hover:bg-[#C94B00] text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-md shadow-[#E85D04]/20 active:scale-95 transition-all cursor-pointer"
            aria-label="Open Cart"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5" />
              {totalItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-[#E85D04] text-[11px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#E85D04] shadow-xs">
                  {totalItemCount}
                </span>
              )}
            </div>
            <div className="hidden sm:flex flex-col items-start leading-tight">
              <span className="text-[11px] text-white/80 font-normal">Cart</span>
              <span className="text-xs font-bold">₹{subtotal.toFixed(2)}</span>
            </div>
          </button>

          {/* User Auth Control */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2 bg-[#FFFFFF] border border-[#ECECEC] p-1.5 pr-3 rounded-xl shadow-xs">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold ${isAdmin ? 'bg-[#1E1E1E]' : 'bg-[#E85D04]'}`}>
                {isAdmin ? <ShieldCheck className="w-4 h-4" /> : user.name.charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:flex flex-col items-start leading-none pr-1">
                <span className="text-xs font-bold text-[#1E1E1E] max-w-[100px] truncate">{user.name}</span>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${isAdmin ? 'text-[#1E1E1E]' : 'text-[#E85D04]'}`}>
                  {user.role}
                </span>
              </div>
              <button
                onClick={logout}
                className="text-[#6B7280] hover:text-[#D32F2F] p-1.5 hover:bg-[#D32F2F]/10 rounded-lg transition-colors cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => openAuthModal('customer-login')}
              className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#1E1E1E] bg-[#FFFFFF] border border-[#ECECEC] hover:border-[#E85D04] px-3.5 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer"
            >
              <LogIn className="w-4 h-4 text-[#E85D04]" />
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )}

        </div>
      </div>
    </header>
  );
};


