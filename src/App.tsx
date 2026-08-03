import React, { useState, useMemo, useEffect } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
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
import { useAuth } from './context/AuthContext';
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

  const { isProfileModalOpen, closeProfileModal } = useAuth();
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

  // Attach global items reference for search components
  useEffect(() => {
    (window as any).sizzleMenuItems = MENU_ITEMS;
  }, []);

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
    <div className="min-h-screen bg-[#FFFDF8] text-[#1E1E1E] flex flex-col justify-between font-['Plus_Jakarta_Sans']">
      
      {/* Top Bar Header */}
      <Header onOpenHistory={() => setIsHistoryOpen(true)} />

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
            <div className="bg-[#FFFFFF] border border-[#ECECEC] rounded-2xl p-5 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-bold font-['Poppins'] text-[#1E1E1E]">
                    {activeCategory === 'All' ? 'All Menu Items' : activeCategoryMeta?.displayName || activeCategory}
                  </h2>
                  <span className="bg-[#E85D04]/10 text-[#E85D04] text-xs font-bold px-2.5 py-0.5 rounded-full border border-[#E85D04]/20">
                    {filteredMenuItems.length} {filteredMenuItems.length === 1 ? 'item' : 'items'}
                  </span>
                </div>
                <p className="text-xs text-[#6B7280] mt-1">
                  {activeCategory === 'All'
                    ? 'Explore our complete menu of 52 dishes prepared fresh to order'
                    : activeCategoryMeta?.description || 'Handcrafted items available for ordering'}
                </p>
              </div>

              {/* Reset Filters button if any active */}
              {(activeCategory !== 'All' || dietaryFilter !== 'All' || searchQuery !== '' || categoryFilter !== 'All' || (priceFilter !== 'All Prices' && priceFilter !== 'All')) && (
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-1.5 text-xs text-[#E85D04] hover:text-[#C94B00] bg-[#E85D04]/5 hover:bg-[#E85D04]/10 px-3 py-1.5 rounded-xl border border-[#E85D04]/20 transition-all cursor-pointer shrink-0"
                >
                  <FilterX className="w-3.5 h-3.5" />
                  <span>Reset Filters</span>
                </button>
              )}
            </div>

            {/* Active Filters Section */}
            {(searchQuery.trim() !== '' || (categoryFilter !== 'All' || activeCategory !== 'All') || (priceFilter !== 'All Prices' && priceFilter !== 'All') || dietaryFilter !== 'All') && (
              <div className="bg-[#FFFFFF] border border-[#ECECEC] rounded-2xl p-3.5 shadow-2xs flex flex-wrap items-center justify-between gap-3 animate-in fade-in duration-200">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-bold text-[#1E1E1E] uppercase tracking-wider text-[11px] font-['Poppins'] mr-1 flex items-center gap-1">
                    <Filter className="w-3.5 h-3.5 text-[#E85D04]" />
                    Active Filters:
                  </span>

                  {/* Search Filter Chip */}
                  {searchQuery.trim() !== '' && (
                    <span className="inline-flex items-center gap-1.5 bg-[#FFFDF8] border border-[#ECECEC] text-[#1E1E1E] font-semibold px-2.5 py-1 rounded-xl shadow-2xs">
                      <Search className="w-3.5 h-3.5 text-[#E85D04]" />
                      <span>🔍 "{searchQuery}"</span>
                      <button
                        onClick={() => setSearchQuery('')}
                        className="hover:bg-[#ECECEC] text-[#6B7280] hover:text-[#1E1E1E] rounded-full p-0.5 transition-colors cursor-pointer"
                        aria-label="Remove search filter"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {/* Category Filter Chip */}
                  {(categoryFilter !== 'All' || activeCategory !== 'All') && (
                    <span className="inline-flex items-center gap-1.5 bg-[#E85D04]/10 border border-[#E85D04]/30 text-[#E85D04] font-semibold px-2.5 py-1 rounded-xl shadow-2xs">
                      <Sparkles className="w-3.5 h-3.5 text-[#E85D04]" />
                      <span>Category: {categoryFilter !== 'All' ? categoryFilter : activeCategory}</span>
                      <button
                        onClick={() => {
                          setCategoryFilter('All');
                          setActiveCategory('All');
                        }}
                        className="hover:bg-[#E85D04]/20 text-[#E85D04] rounded-full p-0.5 transition-colors cursor-pointer"
                        aria-label="Remove category filter"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {/* Price Filter Chip */}
                  {priceFilter !== 'All Prices' && priceFilter !== 'All' && (
                    <span className="inline-flex items-center gap-1.5 bg-[#1E1E1E] border border-[#1E1E1E] text-white font-semibold px-2.5 py-1 rounded-xl shadow-2xs">
                      <Tag className="w-3.5 h-3.5 text-[#E85D04]" />
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
                      className={`inline-flex items-center gap-1.5 font-semibold px-2.5 py-1 rounded-xl border shadow-2xs ${
                        dietaryFilter === 'Veg'
                          ? 'bg-[#2E7D32]/10 border-[#2E7D32]/30 text-[#2E7D32]'
                          : 'bg-[#D32F2F]/10 border-[#D32F2F]/30 text-[#D32F2F]'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${dietaryFilter === 'Veg' ? 'bg-[#2E7D32]' : 'bg-[#D32F2F]'}`} />
                      <span>{dietaryFilter} Only</span>
                      <button
                        onClick={() => setDietaryFilter('All')}
                        className="hover:opacity-75 rounded-full p-0.5 transition-colors cursor-pointer"
                        aria-label="Remove dietary filter"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>

                {/* Clear All Button */}
                <button
                  onClick={resetFilters}
                  className="text-xs font-bold text-[#E85D04] hover:text-[#C94B00] bg-[#E85D04]/10 hover:bg-[#E85D04]/20 px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 shrink-0 ml-auto"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear All</span>
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

      {/* Footer */}
      <footer className="bg-[#FFFFFF] border-t border-[#ECECEC] py-10 mt-16 text-xs text-[#6B7280]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-[#ECECEC]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#E85D04] text-white flex items-center justify-center font-bold">
                <Flame className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl text-[#1E1E1E] font-['Poppins']">
                SIZZLE
              </span>
              <span className="text-xs text-[#6B7280]">
                • Taste That Brings People Together
              </span>
            </div>

            <p className="text-center md:text-right text-xs">
              Handcrafted Gourmet Food Ordering System • Fast. Modern. Clean.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#6B7280]">
            <p>© {new Date().getFullYear()} SIZZLE. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span>5% GST Billing</span>
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
        <MainAppContent />
      </CartProvider>
    </AuthProvider>
  );
}
