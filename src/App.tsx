import React, { useState, useMemo, useEffect } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AdminProvider, useAdmin } from './context/AdminContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CategorySidebar } from './components/CategorySidebar';
import { FoodCard } from './components/FoodCard';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { ReceiptModal } from './components/ReceiptModal';
import { OrderHistoryModal } from './components/OrderHistoryModal';
import { AuthModal } from './components/AuthModal';
import { ProfileModal } from './components/ProfileModal';
import { StickyCartBar } from './components/StickyCartBar';
import { Toast } from './components/Toast';

// Admin Components
import { AdminDashboard } from './components/admin/AdminDashboard';
import { CustomerManagement } from './components/admin/CustomerManagement';
import { OrderManagement } from './components/admin/OrderManagement';
import { ReservationManagement } from './components/admin/ReservationManagement';
import { ReportExport } from './components/admin/ReportExport';
import { AdminSettings } from './components/admin/AdminSettings';
import { AdminNotificationToast } from './components/admin/AdminNotificationToast';

import { MENU_ITEMS, CATEGORIES } from './data/menuData';
import { Flame, Utensils, Search, Sparkles, FilterX, Filter, Tag, X, RotateCcw } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const {
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    dietaryFilter,
    setDietaryFilter,
    categoryFilter,
    setCategoryFilter,
    priceFilter,
    setPriceFilter,
    resetFilters,
  } = useCart();

  const {
    user,
    isAuthenticated,
    isAdmin,
    isInitializing,
    isProfileModalOpen,
    closeProfileModal,
    openProfileModal,
    openAuthModal,
    logout,
  } = useAuth();

  const { activeTab, settings } = useAdmin();

  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

  // Attach global items reference for search components
  useEffect(() => {
    (window as any).sizzleMenuItems = MENU_ITEMS;
  }, []);

  // Handle direct URL path access (e.g., http://localhost:3000/profile)
  useEffect(() => {
    if (isInitializing) return;

    const path = window.location.pathname.toLowerCase();

    if (path === '/profile' || path === '/profile/') {
      if (isAuthenticated) {
        openProfileModal();
      } else {
        openAuthModal('customer-login');
      }
    } else if (path === '/admin' || path === '/admin/' || path === '/dashboard' || path === '/dashboard/') {
      if (!isAuthenticated) {
        openAuthModal('admin-login');
      } else if (isAdmin) {
        openProfileModal();
      } else {
        openAuthModal('admin-login');
      }
    } else if (path === '/login' || path === '/login/') {
      if (!isAuthenticated) {
        openAuthModal('customer-login');
      }
    } else if (path === '/orders' || path === '/orders/') {
      if (isAuthenticated) {
        setIsHistoryOpen(true);
      } else {
        openAuthModal('customer-login');
      }
    }
  }, [isInitializing, isAuthenticated, isAdmin]);

  // Filter food items dynamically using Dual Filter System
  const filteredMenuItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return MENU_ITEMS.filter((item) => {
      // Group 1: Category Filter
      if (categoryFilter !== 'All') {
        if ((categoryFilter === 'Burgers' || categoryFilter === 'Burger') && item.category !== 'Burger' && !item.name.toLowerCase().includes('burger')) return false;
        if (categoryFilter === 'Pizza' && item.category !== 'Pizza' && !item.name.toLowerCase().includes('pizza')) return false;
        if (categoryFilter === 'Pasta' && item.category !== 'Pasta' && !item.name.toLowerCase().includes('pasta')) return false;
        if (categoryFilter === 'Biryani' && item.category !== 'Biryani' && !item.name.toLowerCase().includes('biryani')) return false;
        if (categoryFilter === 'Indian Curry' && item.category !== 'Indian Curry' && !item.name.toLowerCase().includes('curry')) return false;
        if (categoryFilter === 'Grills & Tandoor' || categoryFilter === 'Grill') {
          if (item.category !== 'Grill') return false;
        }
        if (categoryFilter === 'Veg' && !item.isVeg) return false;
        if (categoryFilter === 'Non-Veg' && item.isVeg) return false;
      }

      // Group 2: Price Range Filter
      if (priceFilter !== 'All Prices' && priceFilter !== 'All') {
        if (priceFilter === 'Under ₹200' && item.price >= 200) return false;
        if (priceFilter === '₹200–₹300' && (item.price < 200 || item.price > 300)) return false;
        if (priceFilter === '₹300–₹500' && (item.price < 300 || item.price > 500)) return false;
        if (priceFilter === 'Above ₹500' && item.price <= 500) return false;
      }

      // Search query filter
      if (query !== '') {
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesCat = item.category.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesId = item.id.toString() === query;
        const matchesTags = item.tags?.some((tag) => tag.toLowerCase().includes(query));

        if (!matchesName && !matchesCat && !matchesDesc && !matchesId && !matchesTags) {
          return false;
        }
      } else {
        // Category Sidebar filter (ignoring pseudo-categories Veg, Non-Veg)
        if (
          activeCategory !== 'All' &&
          activeCategory !== 'Veg' &&
          activeCategory !== 'Non-Veg'
        ) {
          if (item.category !== activeCategory && !(activeCategory === 'Burgers' && item.category === 'Burger')) {
            return false;
          }
        }
      }

      // Dietary filter from sidebar
      if (dietaryFilter === 'Veg' && !item.isVeg) return false;
      if (dietaryFilter === 'Non-Veg' && item.isVeg) return false;

      return true;
    });
  }, [activeCategory, searchQuery, dietaryFilter, categoryFilter, priceFilter]);

  // Find category metadata description
  const activeCategoryMeta = CATEGORIES.find((c) => c.name === activeCategory);

  return (
    <div className={isAdmin ? "min-h-screen bg-[#111827] text-[#F9FAFB] flex flex-col justify-between font-['Plus_Jakarta_Sans'] transition-colors duration-500" : "min-h-screen bg-[#FFFDF8] text-[#1E1E1E] flex flex-col justify-between font-['Plus_Jakarta_Sans'] transition-colors duration-500"}>
      
      {/* Admin Top Command Banner (Only shown in Admin Mode) */}
      {isAdmin && (
        <div className="bg-[#1F2937] text-[#F97316] border-b border-[#374151] px-4 py-2 text-xs font-semibold flex items-center justify-between shadow-lg sticky top-0 z-50">
          <div className="flex items-center gap-3 max-w-7xl mx-auto w-full justify-between">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F97316] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#F97316]" />
              </span>
              <span className="font-extrabold tracking-wider uppercase text-[11px] text-[#F97316] font-['Poppins']">ADMIN COMMAND CENTER</span>
              <span className="text-[#374151] hidden sm:inline">•</span>
              <span className="text-[#D1D5DB] hidden sm:inline">Logged in: <strong className="text-white">{user?.name}</strong> ({user?.email})</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-block bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/30 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wide">
                MySQL 8.0 Connected
              </span>
              <button
                onClick={logout}
                className="text-xs bg-[#EF4444]/20 hover:bg-[#EF4444]/30 text-[#EF4444] border border-[#EF4444]/40 px-3 py-1 rounded-lg transition-all cursor-pointer font-bold"
              >
                Sign Out Admin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Bar Header */}
      <Header onOpenHistory={() => setIsHistoryOpen(true)} />

      {/* ADMIN PORTAL VIEWS */}
      {isAdmin && activeTab !== 'menu' ? (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
          {activeTab === 'dashboard' && <AdminDashboard />}
          {activeTab === 'orders' && <OrderManagement />}
          {activeTab === 'reservations' && <ReservationManagement />}
          {activeTab === 'customers' && <CustomerManagement />}
          {activeTab === 'reports' && <ReportExport />}
          {activeTab === 'settings' && <AdminSettings />}
        </main>
      ) : (
        <>
          {/* Hero Banner Section */}
          <Hero />

          {/* Main Content Area: Category Sidebar + Food Grid */}
          <main id="menu-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Category & Dietary Sidebar */}
              <aside className="lg:col-span-3 lg:sticky lg:top-24 space-y-6">
                <CategorySidebar />
              </aside>

              {/* Right Column: Food Grid & Explorer */}
              <section className="lg:col-span-9 space-y-6">
                
                {/* Header Title for Current Category */}
                <div className={isAdmin ? "bg-[#1E293B] border border-[#374151] rounded-2xl p-5 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" : "bg-[#FFFFFF] border border-[#ECECEC] rounded-2xl p-5 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"}>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className={isAdmin ? "text-xl sm:text-2xl font-bold font-['Poppins'] text-[#F9FAFB]" : "text-xl sm:text-2xl font-bold font-['Poppins'] text-[#1E1E1E]"}>
                        {activeCategory === 'All' ? 'All Menu Items' : activeCategoryMeta?.displayName || activeCategory}
                      </h2>
                      <span className={isAdmin ? "bg-[#F97316]/10 text-[#F97316] text-xs font-bold px-2.5 py-0.5 rounded-full border border-[#F97316]/30" : "bg-[#E85D04]/10 text-[#E85D04] text-xs font-bold px-2.5 py-0.5 rounded-full border border-[#E85D04]/20"}>
                        {filteredMenuItems.length} {filteredMenuItems.length === 1 ? 'item' : 'items'}
                      </span>
                    </div>
                    <p className={isAdmin ? "text-xs text-[#9CA3AF] mt-1" : "text-xs text-[#6B7280] mt-1"}>
                      {activeCategory === 'All'
                        ? 'Explore our complete menu of 52 dishes prepared fresh to order'
                        : activeCategoryMeta?.description || 'Handcrafted items available for ordering'}
                    </p>
                  </div>

                  {/* Reset Filters button if any active */}
                  {(activeCategory !== 'All' || dietaryFilter !== 'All' || searchQuery !== '' || categoryFilter !== 'All' || (priceFilter !== 'All Prices' && priceFilter !== 'All')) && (
                    <button
                      onClick={resetFilters}
                      className={isAdmin ? "flex items-center gap-1.5 text-xs text-[#F97316] hover:text-[#EA580C] bg-[#F97316]/10 hover:bg-[#F97316]/20 px-3 py-1.5 rounded-xl border border-[#F97316]/30 transition-all cursor-pointer shrink-0 font-bold" : "flex items-center gap-1.5 text-xs text-[#E85D04] hover:text-[#C94B00] bg-[#E85D04]/5 hover:bg-[#E85D04]/10 px-3 py-1.5 rounded-xl border border-[#E85D04]/20 transition-all cursor-pointer shrink-0"}
                    >
                      <FilterX className="w-3.5 h-3.5" />
                      <span>Reset Filters</span>
                    </button>
                  )}
                </div>

                {/* Active Filters Section */}
                {(searchQuery.trim() !== '' || (categoryFilter !== 'All' || activeCategory !== 'All') || (priceFilter !== 'All Prices' && priceFilter !== 'All') || dietaryFilter !== 'All') && (
                  <div className={isAdmin ? "bg-[#1E293B] border border-[#374151] rounded-2xl p-3.5 shadow-md flex flex-wrap items-center justify-between gap-3 animate-in fade-in duration-200" : "bg-[#FFFFFF] border border-[#ECECEC] rounded-2xl p-3.5 shadow-2xs flex flex-wrap items-center justify-between gap-3 animate-in fade-in duration-200"}>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className={isAdmin ? "font-bold text-[#F9FAFB] uppercase tracking-wider text-[11px] font-['Poppins'] mr-1 flex items-center gap-1" : "font-bold text-[#1E1E1E] uppercase tracking-wider text-[11px] font-['Poppins'] mr-1 flex items-center gap-1"}>
                        <Filter className={isAdmin ? "w-3.5 h-3.5 text-[#F97316]" : "w-3.5 h-3.5 text-[#E85D04]"} />
                        Active Filters:
                      </span>

                      {/* Search Filter Chip */}
                      {searchQuery.trim() !== '' && (
                        <span className={isAdmin ? "inline-flex items-center gap-1.5 bg-[#111827] border border-[#374151] text-[#F9FAFB] font-semibold px-2.5 py-1 rounded-xl shadow-xs" : "inline-flex items-center gap-1.5 bg-[#FFFDF8] border border-[#ECECEC] text-[#1E1E1E] font-semibold px-2.5 py-1 rounded-xl shadow-2xs"}>
                          <Search className={isAdmin ? "w-3.5 h-3.5 text-[#F97316]" : "w-3.5 h-3.5 text-[#E85D04]"} />
                          <span>🔍 "{searchQuery}"</span>
                          <button
                            onClick={() => setSearchQuery('')}
                            className="hover:bg-[#1F2937] text-[#9CA3AF] hover:text-[#F9FAFB] rounded-full p-0.5 transition-colors cursor-pointer"
                            aria-label="Remove search filter"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}

                      {/* Category Filter Chip */}
                      {(categoryFilter !== 'All' || activeCategory !== 'All') && (
                        <span className={isAdmin ? "inline-flex items-center gap-1.5 bg-[#F97316]/10 border border-[#F97316]/30 text-[#F97316] font-semibold px-2.5 py-1 rounded-xl shadow-xs" : "inline-flex items-center gap-1.5 bg-[#E85D04]/10 border border-[#E85D04]/30 text-[#E85D04] font-semibold px-2.5 py-1 rounded-xl shadow-2xs"}>
                          <Sparkles className={isAdmin ? "w-3.5 h-3.5 text-[#F97316]" : "w-3.5 h-3.5 text-[#E85D04]"} />
                          <span>Category: {categoryFilter !== 'All' ? categoryFilter : activeCategory}</span>
                          <button
                            onClick={() => {
                              setCategoryFilter('All');
                              setActiveCategory('All');
                            }}
                            className="hover:bg-[#F97316]/20 text-[#F97316] rounded-full p-0.5 transition-colors cursor-pointer"
                            aria-label="Remove category filter"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}

                      {/* Price Filter Chip */}
                      {priceFilter !== 'All Prices' && priceFilter !== 'All' && (
                        <span className={isAdmin ? "inline-flex items-center gap-1.5 bg-[#F97316] text-white font-semibold px-2.5 py-1 rounded-xl shadow-xs" : "inline-flex items-center gap-1.5 bg-[#1E1E1E] border border-[#1E1E1E] text-white font-semibold px-2.5 py-1 rounded-xl shadow-2xs"}>
                          <Tag className="w-3.5 h-3.5 text-white" />
                          <span>💰 {priceFilter}</span>
                          <button
                            onClick={() => setPriceFilter('All Prices')}
                            className="hover:bg-white/20 text-white rounded-full p-0.5 transition-colors cursor-pointer"
                            aria-label="Remove price filter"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}

                      {/* Dietary Filter Chip */}
                      {dietaryFilter !== 'All' && (
                        <span
                          className={`inline-flex items-center gap-1.5 font-semibold px-2.5 py-1 rounded-xl shadow-2xs ${
                            dietaryFilter === 'Veg'
                              ? 'bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E]'
                              : 'bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444]'
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              dietaryFilter === 'Veg' ? 'bg-[#22C55E]' : 'bg-[#EF4444]'
                            }`}
                          />
                          <span>{dietaryFilter} Only</span>
                          <button
                            onClick={() => setDietaryFilter('All')}
                            className="hover:bg-black/10 rounded-full p-0.5 transition-colors cursor-pointer"
                            aria-label="Remove dietary filter"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}
                    </div>

                    <button
                      onClick={resetFilters}
                      className={isAdmin ? "text-xs text-[#9CA3AF] hover:text-[#F9FAFB] font-semibold underline cursor-pointer" : "text-xs text-[#6B7280] hover:text-[#1E1E1E] font-semibold underline cursor-pointer"}
                    >
                      Clear all
                    </button>
                  </div>
                )}

                {/* Food Cards Grid */}
                {filteredMenuItems.length === 0 ? (
                  <div className="bg-[#FFFFFF] border border-[#ECECEC] rounded-3xl p-12 text-center text-[#6B7280] space-y-4 animate-in fade-in duration-200">
                    <div className="w-16 h-16 rounded-2xl bg-[#FFFDF8] border border-[#ECECEC] flex items-center justify-center mx-auto text-[#E85D04]">
                      <FilterX className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-[#1E1E1E] font-['Poppins']">
                      No dishes match your current filters.
                    </h3>
                    <p className="text-xs max-w-md mx-auto text-[#6B7280]">
                      Try adjusting your category selection, price range, or search query to explore our available handcrafted menu.
                    </p>
                    <button
                      onClick={resetFilters}
                      className="bg-[#E85D04] hover:bg-[#C94B00] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-[#E85D04]/20 cursor-pointer inline-flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Clear All Filters</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 transition-all duration-300">
                    {filteredMenuItems.map((item) => (
                      <FoodCard key={item.id} item={item} />
                    ))}
                  </div>
                )}

              </section>

            </div>
          </main>
        </>
      )}

      {/* Floating Sticky Cart Summary */}
      <StickyCartBar />

      {/* Drawers & Modals */}
      <CartDrawer />
      <CheckoutModal />
      <ReceiptModal />
      <OrderHistoryModal isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />
      <AuthModal />
      <ProfileModal isOpen={isProfileModalOpen} onClose={closeProfileModal} />
      <Toast />
      <AdminNotificationToast />

      {/* Footer */}
      <footer className={isAdmin ? "bg-[#1F2937] border-t border-[#374151] py-10 mt-16 text-xs text-[#9CA3AF]" : "bg-[#FFFFFF] border-t border-[#ECECEC] py-10 mt-16 text-xs text-[#6B7280]"}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-[#374151]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#F97316] text-white flex items-center justify-center font-bold">
                <Flame className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl text-[#F9FAFB] font-['Poppins']">
                {settings.restaurantName}
              </span>
              <span className="text-xs text-slate-400">
                • {settings.openingHours}
              </span>
            </div>

            <p className="text-center md:text-right text-xs text-slate-400">
              {settings.address} • {settings.contactNumber}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
            <p>© {new Date().getFullYear()} {settings.restaurantName}. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span>{settings.gstPercentage}% GST Billing</span>
              <span>•</span>
              <span>10% Discount on ₹1,000+</span>
              <span>•</span>
              <span>Cash / Card / UPI</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AdminProvider>
          <MainAppContent />
        </AdminProvider>
      </CartProvider>
    </AuthProvider>
  );
}
