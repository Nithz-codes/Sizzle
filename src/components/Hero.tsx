import React, { useState, useRef } from 'react';
import {
  Search,
  Flame,
  Star,
  Clock,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Check,
  Tag,
  Filter,
  RotateCcw,
  Edit,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { MENU_ITEMS } from '../data/menuData';
import { LiveSearchDropdown } from './LiveSearchDropdown';
import { FoodItem } from '../types';
import { EditFoodModal } from './admin/EditFoodModal';

export const Hero: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    priceFilter,
    setPriceFilter,
    resetFilters,
    addItem,
  } = useCart();

  const { isAdmin } = useAuth();

  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
  const [addedItemMap, setAddedItemMap] = useState<{ [id: number]: boolean }>({});
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Filter featured items (rating >= 4.8 or Bestseller tags)
  const featuredDishes = MENU_ITEMS.filter(
    (item) => item.rating && item.rating >= 4.8
  ).slice(0, 8);

  const categoryFilterOptions = [
    { id: 'All', label: '✨ All' },
    { id: 'Burgers', label: '🍔 Burgers' },
    { id: 'Pizza', label: '🍕 Pizza' },
    { id: 'Pasta', label: '🍝 Pasta' },
    { id: 'Biryani', label: '🥘 Biryani' },
    { id: 'Indian Curry', label: '🍛 Indian Curry' },
    { id: 'Grills & Tandoor', label: '🔥 Grills & Tandoor' },
    { id: 'Veg', label: '🌱 Veg' },
    { id: 'Non-Veg', label: '🍖 Non-Veg' },
  ];

  const priceFilterOptions = [
    { id: 'All Prices', label: 'All Prices' },
    { id: 'Under ₹200', label: 'Under ₹200' },
    { id: '₹200–₹300', label: '₹200–₹300' },
    { id: '₹300–₹500', label: '₹300–₹500' },
    { id: 'Above ₹500', label: 'Above ₹500' },
  ];

  const handleAddFeaturedItem = (item: FoodItem) => {
    addItem(item, 1);
    setAddedItemMap((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedItemMap((prev) => ({ ...prev, [item.id]: false }));
    }, 1200);
  };

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className={isAdmin ? "bg-[#111827] border-b border-[#374151] text-[#F9FAFB] pt-6 pb-8 transition-all duration-300" : "bg-linear-to-b from-[#FFFDF8] via-[#FFFFFF] to-[#FFFDF8] border-b border-[#ECECEC] pt-6 pb-8 transition-all duration-300"}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Top Header / Branding Subtitle */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2">
          <div>
            <div className={isAdmin ? "inline-flex items-center gap-1.5 bg-[#F97316]/10 text-[#F97316] px-2.5 py-0.5 rounded-full text-xs font-bold border border-[#F97316]/30 mb-1" : "inline-flex items-center gap-1.5 bg-[#E85D04]/10 text-[#E85D04] px-2.5 py-0.5 rounded-full text-xs font-bold border border-[#E85D04]/20 mb-1"}>
              <Flame className={isAdmin ? "w-3.5 h-3.5 fill-[#F97316]" : "w-3.5 h-3.5 fill-[#E85D04]"} />
              <span>{isAdmin ? '🛡️ Admin System Management' : 'Gourmet Food Ordering'}</span>
            </div>
            <h1 className={isAdmin ? "text-2xl sm:text-3xl font-black text-[#F9FAFB] font-['Poppins'] tracking-tight" : "text-2xl sm:text-3xl font-black text-[#1E1E1E] font-['Poppins'] tracking-tight"}>
              {isAdmin ? 'System Administration & Food Inventory' : 'What are you craving today?'}
            </h1>
          </div>

          <p className={isAdmin ? "text-xs text-[#9CA3AF] font-medium max-w-xs text-left sm:text-right" : "text-xs text-[#6B7280] font-medium max-w-xs text-left sm:text-right"}>
            {isAdmin ? 'MySQL Persistence Active • Full Administrative Privileges' : '52 fresh handcrafted dishes • Express preparation • Instant checkout'}
          </p>
        </div>

        {/* Food-First Search Input Bar with Live Autocomplete */}
        <div className="relative max-w-3xl mx-auto w-full z-30">
          <div className={isAdmin ? "relative shadow-lg rounded-2xl overflow-hidden bg-[#1E293B] border-2 border-[#374151] focus-within:border-[#F97316] transition-all" : "relative shadow-lg shadow-[#E85D04]/5 rounded-2xl overflow-hidden bg-[#FFFFFF] border-2 border-[#ECECEC] focus-within:border-[#E85D04] transition-all"}>
            <Search className={isAdmin ? "w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#F97316]" : "w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#E85D04]"} />
            <input
              type="text"
              placeholder="Search dishes, burgers, biryanis, pizzas, or ingredients..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchFocused(true);
              }}
              onFocus={() => setIsSearchFocused(true)}
              className={isAdmin ? "w-full pl-12 pr-24 py-3.5 text-sm font-medium text-[#F9FAFB] placeholder:text-[#9CA3AF] focus:outline-none bg-transparent" : "w-full pl-12 pr-24 py-3.5 text-sm font-medium text-[#1E1E1E] placeholder:text-[#6B7280]/70 focus:outline-none bg-transparent"}
            />

            {searchQuery ? (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setIsSearchFocused(false);
                }}
                className={isAdmin ? "absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#F9FAFB] hover:text-white bg-[#1F2937] px-2.5 py-1 rounded-lg transition-colors cursor-pointer border border-[#374151]" : "absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#6B7280] hover:text-[#1E1E1E] bg-[#ECECEC] px-2.5 py-1 rounded-lg transition-colors cursor-pointer"}
              >
                Clear
              </button>
            ) : (
              <div className={isAdmin ? "absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 text-[11px] font-semibold text-[#D1D5DB] bg-[#1F2937] px-2.5 py-1 rounded-lg border border-[#374151]" : "absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 text-[11px] font-semibold text-[#6B7280] bg-[#FFFDF8] px-2.5 py-1 rounded-lg border border-[#ECECEC]"}>
                <Sparkles className={isAdmin ? "w-3.5 h-3.5 text-[#F97316]" : "w-3.5 h-3.5 text-[#E85D04]"} />
                <span>Live Menu Search</span>
              </div>
            )}
          </div>

          {/* Autocomplete Suggestions Dropdown */}
          {isSearchFocused && searchQuery.trim() !== '' && (
            <LiveSearchDropdown
              query={searchQuery}
              onSelectResult={() => setIsSearchFocused(false)}
              onClose={() => setIsSearchFocused(false)}
            />
          )}
        </div>

        {/* Featured Section: Today's Specials Carousel */}
        <div className="pt-2 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={isAdmin ? "w-8 h-8 rounded-xl bg-[#F97316]/10 text-[#F97316] flex items-center justify-center font-bold" : "w-8 h-8 rounded-xl bg-[#E85D04]/10 text-[#E85D04] flex items-center justify-center font-bold"}>
                <Flame className={isAdmin ? "w-4 h-4 fill-[#F97316]" : "w-4 h-4 fill-[#E85D04]"} />
              </div>
              <div>
                <h2 className={isAdmin ? "text-lg font-bold font-['Poppins'] text-[#F9FAFB] leading-tight" : "text-lg font-bold font-['Poppins'] text-[#1E1E1E] leading-tight"}>
                  Today's Specials & Chef's Recommendations
                </h2>
                <p className={isAdmin ? "text-[11px] text-[#9CA3AF]" : "text-[11px] text-[#6B7280]"}>
                  Handpicked customer favorites prepared fresh by our head chefs
                </p>
              </div>
            </div>

            {/* Carousel Nav Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollCarousel('left')}
                className={isAdmin ? "w-8 h-8 rounded-xl bg-[#1F2937] hover:bg-[#374151] text-[#F9FAFB] border border-[#374151] flex items-center justify-center transition-all cursor-pointer" : "w-8 h-8 rounded-xl bg-white hover:bg-[#ECECEC] text-[#1E1E1E] border border-[#ECECEC] flex items-center justify-center transition-all cursor-pointer shadow-2xs"}
                aria-label="Scroll Carousel Left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollCarousel('right')}
                className={isAdmin ? "w-8 h-8 rounded-xl bg-[#1F2937] hover:bg-[#374151] text-[#F9FAFB] border border-[#374151] flex items-center justify-center transition-all cursor-pointer" : "w-8 h-8 rounded-xl bg-white hover:bg-[#ECECEC] text-[#1E1E1E] border border-[#ECECEC] flex items-center justify-center transition-all cursor-pointer shadow-2xs"}
                aria-label="Scroll Carousel Right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Carousel Track */}
          <div
            ref={carouselRef}
            className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-none custom-scrollbar snap-x"
          >
            {featuredDishes.map((dish) => {
              const isJustAdded = addedItemMap[dish.id];

              return (
                <div
                  key={dish.id}
                  className={
                    isAdmin
                      ? "min-w-[260px] sm:min-w-[280px] max-w-[280px] bg-[#1E293B] border border-[#374151] rounded-2xl overflow-hidden shadow-md hover:border-[#F97316]/50 transition-all duration-300 snap-start flex flex-col justify-between group"
                      : "min-w-[260px] sm:min-w-[280px] max-w-[280px] bg-[#FFFFFF] border border-[#ECECEC] rounded-2xl overflow-hidden shadow-2xs hover:shadow-md hover:border-[#E85D04]/40 transition-all duration-300 snap-start flex flex-col justify-between group"
                  }
                >
                  {/* Top Image */}
                  <div className="relative h-36 w-full bg-stone-100 overflow-hidden">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                    />

                    <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/40 flex items-center gap-1 shadow-xs">
                      <div
                        className={`w-3 h-3 border-2 flex items-center justify-center p-0.5 rounded-2xs ${
                          dish.isVeg ? 'border-[#2E7D32]' : 'border-[#D32F2F]'
                        }`}
                      >
                        <div
                          className={`w-1 h-1 rounded-full ${
                            dish.isVeg ? 'bg-[#2E7D32]' : 'bg-[#D32F2F]'
                          }`}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-[#1E1E1E]">
                        {dish.isVeg ? 'VEG' : 'NON-VEG'}
                      </span>
                    </div>

                    {dish.rating && (
                      <div className="absolute top-2.5 right-2.5 bg-black/70 backdrop-blur-md text-amber-400 text-[11px] font-bold px-2 py-0.5 rounded-md border border-white/10 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{dish.rating}</span>
                      </div>
                    )}

                    <div className={isAdmin ? "absolute bottom-2.5 left-2.5 bg-[#F97316] text-white text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-xs" : "absolute bottom-2.5 left-2.5 bg-[#E85D04] text-white text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-xs"}>
                      {dish.tags?.[0] || 'Special'}
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <h3 className={isAdmin ? "font-bold text-sm text-[#F9FAFB] group-hover:text-[#F97316] transition-colors truncate font-['Poppins']" : "font-bold text-sm text-[#1E1E1E] group-hover:text-[#E85D04] transition-colors truncate font-['Poppins']"}>
                          {dish.name}
                        </h3>
                        {dish.prepTime && (
                          <span className={isAdmin ? "text-[10px] text-[#9CA3AF] flex items-center gap-0.5 shrink-0" : "text-[10px] text-[#6B7280] flex items-center gap-0.5 shrink-0"}>
                            <Clock className={isAdmin ? "w-3 h-3 text-[#F97316]" : "w-3 h-3 text-[#E85D04]"} />
                            {dish.prepTime}
                          </span>
                        )}
                      </div>

                      <p className={isAdmin ? "text-[11px] text-[#D1D5DB] line-clamp-2 leading-relaxed mt-1" : "text-[11px] text-[#6B7280] line-clamp-2 leading-relaxed mt-1"}>
                        {dish.description}
                      </p>
                    </div>

                    {/* Price & Action Button */}
                    <div className={isAdmin ? "pt-2 border-t border-[#374151] flex items-center justify-between gap-2" : "pt-2 border-t border-[#ECECEC] flex items-center justify-between gap-2"}>
                      <div>
                        <span className={isAdmin ? "text-base font-extrabold text-[#22C55E]" : "text-base font-extrabold text-[#1E1E1E]"}>
                          ₹{dish.price.toFixed(2)}
                        </span>
                      </div>

                      {isAdmin ? (
                        <button
                          onClick={() => setEditingItem(dish)}
                          className="bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs px-2.5 py-1.5 rounded-xl transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAddFeaturedItem(dish)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5 ${
                            isJustAdded
                              ? 'bg-[#2E7D32] text-white'
                              : 'bg-[#E85D04] hover:bg-[#C94B00] text-white active:scale-95'
                          }`}
                        >
                          {isJustAdded ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Added</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>Add</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dual Filter System - Group 1 (Food Category) & Group 2 (Price Ranges) */}
        <div className={isAdmin ? "pt-4 pb-1 border-t border-[#374151] space-y-3" : "pt-4 pb-1 border-t border-[#ECECEC]/60 space-y-3"}>
          {/* Header & Reset Button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className={isAdmin ? "w-4 h-4 text-[#F97316]" : "w-4 h-4 text-[#E85D04]"} />
              <span className={isAdmin ? "text-xs font-bold text-[#F9FAFB] uppercase tracking-wider font-['Poppins']" : "text-xs font-bold text-[#1E1E1E] uppercase tracking-wider font-['Poppins']"}>
                Quick Dual Filters
              </span>
            </div>
            {(categoryFilter !== 'All' || priceFilter !== 'All Prices') && (
              <button
                onClick={resetFilters}
                className={isAdmin ? "text-xs font-semibold text-[#F97316] hover:text-[#EA580C] flex items-center gap-1 bg-[#F97316]/10 hover:bg-[#F97316]/20 px-2.5 py-1 rounded-lg transition-all cursor-pointer border border-[#F97316]/30" : "text-xs font-semibold text-[#E85D04] hover:text-[#C94B00] flex items-center gap-1 bg-[#E85D04]/10 hover:bg-[#E85D04]/20 px-2.5 py-1 rounded-lg transition-all cursor-pointer"}
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

          {/* Group 1: Food Category Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
            <span className={isAdmin ? "text-xs font-bold text-[#9CA3AF] uppercase tracking-wider shrink-0 pr-1 flex items-center gap-1" : "text-xs font-bold text-[#6B7280] uppercase tracking-wider shrink-0 pr-1 flex items-center gap-1"}>
              Category:
            </span>
            {categoryFilterOptions.map((option) => {
              const isSelected = categoryFilter === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => setCategoryFilter(option.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
                    isSelected
                      ? isAdmin
                        ? 'bg-[#F97316] text-white shadow-md shadow-[#F97316]/20 ring-1 ring-[#F97316]'
                        : 'bg-[#E85D04] text-white shadow-xs shadow-[#E85D04]/25 scale-102 ring-1 ring-[#E85D04]'
                      : isAdmin
                      ? 'bg-[#1E293B] text-[#D1D5DB] border border-[#374151] hover:border-[#F97316]/50 hover:bg-[#1F2937] hover:text-[#F9FAFB]'
                      : 'bg-[#FFFFFF] text-[#1E1E1E] border border-[#ECECEC] hover:border-[#E85D04]/40 hover:bg-[#FFFDF8]'
                  }`}
                >
                  <span>{option.label}</span>
                </button>
              );
            })}
          </div>

          {/* Group 2: Price Range Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
            <span className={isAdmin ? "text-xs font-bold text-[#9CA3AF] uppercase tracking-wider shrink-0 pr-1 flex items-center gap-1" : "text-xs font-bold text-[#6B7280] uppercase tracking-wider shrink-0 pr-1 flex items-center gap-1"}>
              <Tag className={isAdmin ? "w-3 h-3 text-[#F97316]" : "w-3 h-3 text-[#E85D04]"} />
              Price:
            </span>
            {priceFilterOptions.map((option) => {
              const isSelected = priceFilter === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => setPriceFilter(option.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
                    isSelected
                      ? isAdmin
                        ? 'bg-[#F97316] text-white shadow-md shadow-[#F97316]/20 ring-1 ring-[#F97316]'
                        : 'bg-[#1E1E1E] text-white shadow-xs scale-102 ring-1 ring-[#1E1E1E]'
                      : isAdmin
                      ? 'bg-[#1E293B] text-[#D1D5DB] border border-[#374151] hover:border-[#F97316]/50 hover:bg-[#1F2937] hover:text-[#F9FAFB]'
                      : 'bg-[#FFFFFF] text-[#1E1E1E] border border-[#ECECEC] hover:border-[#1E1E1E]/40 hover:bg-[#FFFDF8]'
                  }`}
                >
                  <span>{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Admin Edit Modal for Featured Items */}
      {editingItem && (
        <EditFoodModal
          item={editingItem}
          isOpen={!!editingItem}
          onClose={() => setEditingItem(null)}
        />
      )}
    </section>
  );
};
