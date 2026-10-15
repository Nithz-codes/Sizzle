import React, { useEffect } from 'react';
import {
  X,
  Filter,
  Sparkles,
  RotateCcw,
  ShoppingBag,
  Tag,
  Pizza,
  Utensils,
  Flame,
  Soup,
  CookingPot,
  Wheat,
  Drumstick,
  Cookie,
  Cake,
  Coffee,
  Check,
  Hamburger,
} from 'lucide-react';
import { CATEGORIES, MENU_ITEMS } from '../data/menuData';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface MobileCategoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAiHub?: () => void;
  onOpenHistory?: () => void;
}

export const MobileCategoryDrawer: React.FC<MobileCategoryDrawerProps> = ({
  isOpen,
  onClose,
  onOpenAiHub,
  onOpenHistory,
}) => {
  const {
    activeCategory,
    setActiveCategory,
    dietaryFilter,
    setDietaryFilter,
    priceFilter,
    setPriceFilter,
    categoryFilter,
    setCategoryFilter,
    searchQuery,
    resetFilters,
  } = useCart();

  const { isAdmin } = useAuth();

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const renderCategoryIcon = (iconName: string, isSelected: boolean) => {
    const baseColor = isSelected
      ? isAdmin
        ? 'text-[#F97316]'
        : 'text-[#E85D04]'
      : isAdmin
      ? 'text-[#9CA3AF] group-hover:text-[#F97316]'
      : 'text-[#6B7280] group-hover:text-[#E85D04]';

    const baseClass = `w-4 h-4 transition-transform duration-200 ease-out ${baseColor}`;

    let iconElement: React.ReactNode;

    switch (iconName) {
      case 'Hamburger':
      case 'Burger':
      case 'Beef':
        iconElement = (
          <Hamburger
            className={`${baseClass} group-hover:scale-110 group-hover:-translate-y-0.5`}
          />
        );
        break;
      case 'Pizza':
        iconElement = (
          <Pizza
            className={`${baseClass} group-hover:rotate-6 group-hover:scale-110 origin-center`}
          />
        );
        break;
      case 'UtensilsCrossed':
      case 'Pasta':
        iconElement = (
          <Utensils
            className={`${baseClass} group-hover:-rotate-6 group-hover:scale-110 origin-center`}
          />
        );
        break;
      case 'Flame':
      case 'Chinese':
        iconElement = (
          <Flame
            className={`${baseClass} group-hover:scale-110 group-hover:-translate-y-0.5`}
          />
        );
        break;
      case 'Soup':
      case 'Biryani':
        iconElement = (
          <Soup
            className={`${baseClass} group-hover:-translate-y-0.5 group-hover:scale-105`}
          />
        );
        break;
      case 'Bowl':
      case 'CookingPot':
      case 'Indian Curry':
        iconElement = (
          <CookingPot
            className={`${baseClass} group-hover:rotate-6 group-hover:scale-105 origin-bottom`}
          />
        );
        break;
      case 'Wheat':
      case 'Breads':
        iconElement = (
          <Wheat
            className={`${baseClass} group-hover:rotate-6 group-hover:scale-110 origin-bottom`}
          />
        );
        break;
      case 'Drumstick':
      case 'Grill':
        iconElement = (
          <Drumstick
            className={`${baseClass} group-hover:-rotate-6 group-hover:scale-110 origin-center`}
          />
        );
        break;
      case 'Cookie':
      case 'Starters':
        iconElement = (
          <Cookie
            className={`${baseClass} group-hover:scale-110 group-hover:rotate-6`}
          />
        );
        break;
      case 'Cake':
      case 'Dessert':
        iconElement = (
          <Cake
            className={`${baseClass} group-hover:-translate-y-0.5 group-hover:scale-110`}
          />
        );
        break;
      case 'Coffee':
      case 'Beverage':
        iconElement = (
          <Coffee
            className={`${baseClass} group-hover:rotate-6 group-hover:-translate-y-0.5 group-hover:scale-110`}
          />
        );
        break;
      default:
        iconElement = (
          <Sparkles
            className={`${baseClass} group-hover:rotate-12 group-hover:scale-110`}
          />
        );
        break;
    }

    return (
      <span className="w-5 h-5 flex items-center justify-center shrink-0">
        {iconElement}
      </span>
    );
  };

  const getCategoryCount = (catName: string) => {
    const currentList = (window as any).sizzleMenuItems || MENU_ITEMS;
    if (catName === 'All') return currentList.length;
    return currentList.filter((item: any) => {
      if (catName === 'Burger' || catName === 'Burgers')
        return item.category === 'Burger' || item.category === 'Burgers' || item.name.toLowerCase().includes('burger');
      if (catName === 'Grill' || catName === 'Grills & Tandoor')
        return item.category === 'Grill' || item.category === 'Grills & Tandoor';
      if (catName === 'Indian Curry')
        return item.category === 'Indian Curry' || item.category === 'Curry';
      return item.category === catName;
    }).length;
  };

  const priceFilterOptions = [
    { id: 'All Prices', label: 'All' },
    { id: 'Under ₹200', label: '< ₹200' },
    { id: '₹200–₹300', label: '₹200–300' },
    { id: '₹300–₹500', label: '₹300–500' },
    { id: 'Above ₹500', label: '> ₹500' },
  ];

  const hasActiveFilters =
    activeCategory !== 'All' ||
    dietaryFilter !== 'All' ||
    categoryFilter !== 'All' ||
    priceFilter !== 'All Prices' ||
    searchQuery.trim() !== '';

  const handleSelectCategory = (catName: string) => {
    setActiveCategory(catName);
    setCategoryFilter(catName);
    onClose();
    // Smooth scroll to menu
    const menuEl = document.getElementById('menu-section');
    if (menuEl) {
      menuEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden no-print">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-sm sm:max-w-md w-full bg-[#FFFFFF] shadow-2xl flex flex-col z-50 animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-[#ECECEC] flex items-center justify-between bg-[#FFFDF8]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E85D04] to-[#F97316] text-white flex items-center justify-center shadow-sm">
              <Filter className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base sm:text-lg text-[#1E1E1E] font-['Poppins']">
                Categories &amp; Filters
              </h2>
              <p className="text-[11px] text-[#6B7280]">
                Filter 52 handcrafted dishes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-xs text-[#E85D04] hover:text-[#C94B00] font-bold flex items-center gap-1 bg-[#E85D04]/10 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                title="Reset All Filters"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#6B7280] hover:text-[#1E1E1E] hover:bg-[#ECECEC] transition-colors cursor-pointer"
              aria-label="Close categories drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 custom-scrollbar">
          
          {/* Quick AI Studio Button */}
          {onOpenAiHub && (
            <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 flex items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#059669] text-white shadow-xs">
                  <Sparkles className="w-4 h-4 text-[#FEB157] fill-[#FEB157]" />
                </div>
                <div>
                  <h3 className="text-xs font-extrabold text-[#065F46] font-['Poppins']">
                    Sizzle AI Studio
                  </h3>
                  <p className="text-[10px] text-[#047857]">
                    Photo Scanner, Mood &amp; Mystery Box
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onOpenAiHub();
                }}
                className="px-3 py-1.5 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer transition-all shrink-0"
              >
                Launch
              </button>
            </div>
          )}

          {/* Section 1: Dietary Preference */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#1E1E1E] uppercase tracking-wider flex items-center gap-1.5 font-['Poppins']">
              <Sparkles className="w-3.5 h-3.5 text-[#E85D04]" />
              Dietary Preference
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setDietaryFilter('All')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  dietaryFilter === 'All'
                    ? 'bg-[#1E1E1E] text-white shadow-xs'
                    : 'bg-[#FFFDF8] text-[#6B7280] border border-[#ECECEC] hover:border-[#E85D04]/40'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setDietaryFilter('Veg')}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  dietaryFilter === 'Veg'
                    ? 'bg-[#22C55E] text-white shadow-xs'
                    : 'bg-[#FFFDF8] text-[#2E7D32] border border-[#2E7D32]/30 hover:bg-[#2E7D32]/10'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-[#22C55E] outline-1 outline-white" />
                <span>Veg</span>
              </button>
              <button
                onClick={() => setDietaryFilter('Non-Veg')}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  dietaryFilter === 'Non-Veg'
                    ? 'bg-[#EF4444] text-white shadow-xs'
                    : 'bg-[#FFFDF8] text-[#D32F2F] border border-[#D32F2F]/30 hover:bg-[#D32F2F]/10'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-[#EF4444] outline-1 outline-white" />
                <span>Non-Veg</span>
              </button>
            </div>
          </div>

          {/* Section 2: Price Range Filters */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#1E1E1E] uppercase tracking-wider flex items-center gap-1.5 font-['Poppins']">
              <Tag className="w-3.5 h-3.5 text-[#E85D04]" />
              Price Range
            </span>
            <div className="flex flex-wrap gap-1.5">
              {priceFilterOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setPriceFilter(opt.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    priceFilter === opt.id
                      ? 'bg-[#1E1E1E] text-white shadow-xs font-bold'
                      : 'bg-[#FFFDF8] text-[#6B7280] border border-[#ECECEC] hover:border-[#E85D04]/40'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: All 11 Menu Categories */}
          <div className="space-y-2 pt-2 border-t border-[#ECECEC]">
            <div className="flex items-center justify-between pb-1">
              <span className="text-xs font-bold text-[#1E1E1E] uppercase tracking-wider font-['Poppins']">
                All Categories (11)
              </span>
              <span className="text-[11px] font-bold text-[#E85D04]">
                {MENU_ITEMS.length} items
              </span>
            </div>

            <div className="space-y-1">
              {/* All Items Option */}
              <button
                onClick={() => handleSelectCategory('All')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer group ${
                  activeCategory === 'All'
                    ? 'bg-[#E85D04]/10 text-[#E85D04] border border-[#E85D04]/40 font-bold'
                    : 'text-[#1E1E1E] hover:bg-[#FFFDF8] hover:text-[#E85D04]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 flex items-center justify-center shrink-0">
                    <Sparkles
                      className={`w-4 h-4 transition-transform duration-200 ease-out group-hover:rotate-12 group-hover:scale-110 ${
                        activeCategory === 'All' ? 'text-[#E85D04]' : 'text-[#6B7280] group-hover:text-[#E85D04]'
                      }`}
                    />
                  </span>
                  <span>All Categories</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-md font-bold ${
                      activeCategory === 'All'
                        ? 'bg-[#E85D04] text-white'
                        : 'bg-[#ECECEC] text-[#6B7280]'
                    }`}
                  >
                    {MENU_ITEMS.length}
                  </span>
                  {activeCategory === 'All' && <Check className="w-4 h-4 text-[#E85D04]" />}
                </div>
              </button>

              {/* Individual Category Buttons */}
              {CATEGORIES.map((cat) => {
                const isSelected = activeCategory === cat.name;
                const count = getCategoryCount(cat.name);

                return (
                  <button
                    key={cat.id}
                    onClick={() => handleSelectCategory(cat.name)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer group ${
                      isSelected
                        ? 'bg-[#E85D04]/10 text-[#E85D04] font-bold border border-[#E85D04]/40'
                        : 'text-[#1E1E1E] hover:bg-[#FFFDF8] hover:text-[#E85D04]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate pr-2">
                      {renderCategoryIcon(cat.icon, isSelected)}
                      <span className="truncate">{cat.displayName}</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-md font-semibold ${
                          isSelected
                            ? 'bg-[#E85D04] text-white font-bold'
                            : 'bg-[#FFFDF8] text-[#6B7280] border border-[#ECECEC]'
                        }`}
                      >
                        {count}
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-[#E85D04]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Drawer Sticky Footer Action */}
        <div className="p-4 border-t border-[#ECECEC] bg-[#FFFDF8]">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-[#E85D04] hover:bg-[#C94B00] text-white font-bold text-sm shadow-md shadow-[#E85D04]/25 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
          >
            <span>View Filtered Dishes</span>
          </button>
        </div>
      </div>
    </div>
  );
};
