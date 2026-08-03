import React, { useState } from 'react';
import {
  ShoppingBag,
  History,
  Flame,
  Percent,
  User as UserIcon,
  LogIn,
  LogOut,
  ShieldCheck,
  LayoutDashboard,
  Calendar,
  Users,
  FileSpreadsheet,
  Settings,
  Utensils,
  Bell,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useAdmin, AdminTab } from '../context/AdminContext';

interface HeaderProps {
  onOpenHistory: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenHistory }) => {
  const { cartItems, subtotal, setIsCartOpen, pastReceipts } = useCart();
  const { user, isAuthenticated, isAdmin, openAuthModal, openProfileModal, logout } = useAuth();

  // Safely consume Admin Context
  let adminCtx: any = null;
  try {
    adminCtx = useAdmin();
  } catch (e) {
    adminCtx = null;
  }

  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const totalItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header
      className={
        isAdmin
          ? "sticky top-0 z-40 bg-[#111827]/95 backdrop-blur-md border-b border-[#374151] text-[#F9FAFB] shadow-xl transition-all duration-300"
          : "sticky top-0 z-40 bg-[#FFFDF8]/95 backdrop-blur-md border-b border-[#ECECEC] text-[#1E1E1E] transition-all duration-300"
      }
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Title */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div
            className={
              isAdmin
                ? "w-11 h-11 rounded-xl bg-gradient-to-br from-[#F97316] to-[#EA580C] flex items-center justify-center text-white shadow-md shadow-[#F97316]/20"
                : "w-11 h-11 rounded-xl bg-[#E85D04] flex items-center justify-center text-white shadow-md shadow-[#E85D04]/20"
            }
          >
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                className={
                  isAdmin
                    ? "font-extrabold text-2xl tracking-tight text-[#F9FAFB] font-['Poppins']"
                    : "font-extrabold text-2xl tracking-tight text-[#1E1E1E] font-['Poppins']"
                }
              >
                SIZZLE
              </span>
              <span
                className={
                  isAdmin
                    ? "hidden sm:inline-block text-[10px] font-extrabold uppercase tracking-wider bg-[#F97316]/10 text-[#F97316] px-2.5 py-0.5 rounded-full border border-[#F97316]/30"
                    : "hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider bg-[#E85D04]/10 text-[#E85D04] px-2 py-0.5 rounded-full border border-[#E85D04]/20"
                }
              >
                {isAdmin ? 'ENTERPRISE ADMIN' : 'Gourmet'}
              </span>
            </div>
            <p
              className={
                isAdmin
                  ? "text-xs text-[#9CA3AF] font-medium hidden sm:block"
                  : "text-xs text-[#6B7280] font-medium hidden sm:block"
              }
            >
              {isAdmin ? 'System Administration & Management' : 'Taste That Brings People Together'}
            </p>
          </div>
        </div>

        {/* Header Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Notification Bell Dropdown (Admin Mode) */}
          {isAdmin && adminCtx && (
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative p-2.5 rounded-xl bg-[#1F2937] hover:bg-[#374151] text-[#D1D5DB] hover:text-[#F9FAFB] border border-[#374151] transition-colors cursor-pointer"
                title="Admin Notifications"
              >
                <Bell className="w-4 h-4 text-[#F97316]" />
                {adminCtx.notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#F97316] text-white font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center border border-[#111827] shadow-xs">
                    {adminCtx.notifications.length}
                  </span>
                )}
              </button>

              {/* Activity Log Popover */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-[#1E293B] border border-[#374151] rounded-2xl shadow-2xl z-50 p-4 space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between pb-2 border-b border-[#374151]">
                    <span className="text-xs font-bold text-[#F9FAFB] font-['Poppins']">
                      Activity Logs
                    </span>
                    {adminCtx.notifications.length > 0 && (
                      <button
                        onClick={() => adminCtx.clearNotifications()}
                        className="text-[10px] text-[#9CA3AF] hover:text-[#EF4444] transition-colors cursor-pointer"
                      >
                        Clear log
                      </button>
                    )}
                  </div>

                  <div className="max-h-60 overflow-y-auto space-y-2 text-xs">
                    {adminCtx.notifications.length === 0 ? (
                      <p className="text-[#9CA3AF] text-center py-4">No recent activity logs</p>
                    ) : (
                      adminCtx.notifications.map((n: any) => (
                        <div
                          key={n.id}
                          className="bg-[#111827]/80 p-2.5 rounded-xl border border-[#374151] space-y-0.5"
                        >
                          <div className="flex items-center justify-between">
                            <strong className="text-[#F97316] text-[11px]">{n.title}</strong>
                            <span className="text-[9px] text-[#9CA3AF]">{n.timestamp}</span>
                          </div>
                          <p className="text-[#D1D5DB] text-[11px]">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Discount Banner (Customer Mode) */}
          {!isAdmin && (
            <div className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-[#2E7D32] bg-[#2E7D32]/10 px-3 py-2 rounded-xl border border-[#2E7D32]/20">
              <Percent className="w-3.5 h-3.5" />
              <span>10% OFF over ₹1,000</span>
            </div>
          )}

          {/* Past Orders Button (Customer Mode) */}
          {pastReceipts.length > 0 && !isAdmin && (
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

          {/* Cart Button (Customer Mode) */}
          {!isAdmin && (
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
          )}

          {/* User Profile / Auth Control */}
          {isAuthenticated && user ? (
            <div
              className={
                isAdmin
                  ? "flex items-center gap-2 bg-[#1F2937] border border-[#374151] p-1.5 pr-3 rounded-xl shadow-md"
                  : "flex items-center gap-2 bg-[#FFFFFF] border border-[#ECECEC] p-1.5 pr-3 rounded-xl shadow-xs"
              }
            >
              <button
                onClick={openProfileModal}
                className="flex items-center gap-2 text-left hover:opacity-85 transition-opacity cursor-pointer"
                title="View & Edit Profile"
              >
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className={
                      isAdmin
                        ? "w-8 h-8 rounded-lg object-cover border border-[#F97316]/50"
                        : "w-8 h-8 rounded-lg object-cover border border-[#E85D04]/30"
                    }
                  />
                ) : (
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                      isAdmin
                        ? 'bg-gradient-to-br from-[#F97316] to-[#EA580C] text-white'
                        : 'bg-[#E85D04] text-white'
                    }`}
                  >
                    {isAdmin ? <ShieldCheck className="w-4 h-4" /> : user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="hidden md:flex flex-col items-start leading-none pr-1">
                  <span
                    className={
                      isAdmin
                        ? "text-xs font-bold text-[#F9FAFB] max-w-[100px] truncate"
                        : "text-xs font-bold text-[#1E1E1E] max-w-[100px] truncate"
                    }
                  >
                    {user.name}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider ${
                      isAdmin ? 'text-[#F97316]' : 'text-[#E85D04]'
                    }`}
                  >
                    {user.role}
                  </span>
                </div>
              </button>
              <button
                onClick={logout}
                className={
                  isAdmin
                    ? "text-[#9CA3AF] hover:text-[#EF4444] p-1.5 hover:bg-[#EF4444]/10 rounded-lg transition-colors cursor-pointer ml-1"
                    : "text-[#6B7280] hover:text-[#D32F2F] p-1.5 hover:bg-[#D32F2F]/10 rounded-lg transition-colors cursor-pointer ml-1"
                }
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

      {/* Enterprise SaaS Admin Navigation Tab Bar */}
      {isAdmin && adminCtx && (
        <div className="bg-[#1F2937]/90 border-t border-[#374151] px-4 sm:px-8 py-2 overflow-x-auto">
          <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs font-semibold font-['Poppins']">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              {
                id: 'orders',
                label: 'Orders',
                icon: ShoppingBag,
                badge: adminCtx.orders.filter((o: any) => o.orderStatus === 'PENDING').length,
              },
              { id: 'reservations', label: 'Reservations', icon: Calendar, badge: adminCtx.reservations.length },
              { id: 'customers', label: 'Customer Management', icon: Users },
              { id: 'reports', label: 'Export Reports', icon: FileSpreadsheet },
              { id: 'settings', label: 'Admin Settings', icon: Settings },
              { id: 'menu', label: 'Menu Preview', icon: Utensils },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = adminCtx.activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => adminCtx.setActiveTab(tab.id as AdminTab)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-[#F97316] text-white shadow-md shadow-[#F97316]/20 font-bold'
                      : 'text-[#9CA3AF] hover:text-[#F9FAFB] hover:bg-[#374151]/60'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                        isActive
                          ? 'bg-white text-[#F97316]'
                          : 'bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/30'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
