import React from 'react';
import {
  Utensils,
  Pizza,
  Flame,
  Soup,
  Wheat,
  Drumstick,
  Cookie,
  Cake,
  Coffee,
  Sparkles,
  Beef,
  CookingPot,
  Filter,
} from 'lucide-react';
import { CATEGORIES, MENU_ITEMS } from '../data/menuData';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const CategorySidebar: React.FC = () => {
  const {
    activeCategory,
    setActiveCategory,
    dietaryFilter,
    setDietaryFilter,
    searchQuery,
  } = useCart();

  const { isAdmin } = useAuth();

  // Helper to map icon string to Lucide component
  const renderCategoryIcon = (iconName: string, isSelected: boolean) => {
    const iconProps = {
      className: `w-4 h-4 transition-colors ${
        isSelected
          ? isAdmin
            ? 'text-[#F97316]'
            : 'text-[#E85D04]'
          : isAdmin
          ? 'text-[#9CA3AF]'
          : 'text-[#6B7280]'
      }`,
    };

    switch (iconName) {
      case 'Beef':
        return <Beef {...iconProps} />;
      case 'Pizza':
        return <Pizza {...iconProps} />;
      case 'UtensilsCrossed':
        return <Utensils {...iconProps} />;
      case 'Flame':
        return <Flame {...iconProps} />;
      case 'Soup':
        return <Soup {...iconProps} />;
      case 'Bowl':
        return <CookingPot {...iconProps} />;
      case 'Wheat':
        return <Wheat {...iconProps} />;
      case 'Drumstick':
        return <Drumstick {...iconProps} />;
      case 'Cookie':
        return <Cookie {...iconProps} />;
      case 'Cake':
        return <Cake {...iconProps} />;
      case 'Coffee':
        return <Coffee {...iconProps} />;
      default:
        return <Sparkles {...iconProps} />;
    }
  };

  const getCategoryCount = (catName: string) => {
    if (catName === 'All') return MENU_ITEMS.length;
    return MENU_ITEMS.filter((item) => item.category === catName).length;
  };

  return (
    <div className="space-y-6">
      
      {/* Dietary Filter Buttons */}
      <div
        className={
          isAdmin
            ? "bg-[#1E293B] p-3 rounded-2xl border border-[#374151] shadow-md"
            : "bg-[#FFFFFF] p-3 rounded-2xl border border-[#ECECEC] shadow-2xs"
        }
      >
        <div
          className={
            isAdmin
              ? "flex items-center gap-1.5 text-xs font-bold text-[#F9FAFB] mb-2 px-1 font-['Poppins']"
              : "flex items-center gap-1.5 text-xs font-bold text-[#1E1E1E] mb-2 px-1"
          }
        >
          <Filter className={isAdmin ? "w-3.5 h-3.5 text-[#F97316]" : "w-3.5 h-3.5 text-[#E85D04]"} />
          <span>Dietary Preference</span>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          <button
            onClick={() => setDietaryFilter('All')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              dietaryFilter === 'All'
                ? isAdmin
                  ? 'bg-[#F97316] text-white font-bold shadow-md'
                  : 'bg-[#1E1E1E] text-white shadow-xs'
                : isAdmin
                ? 'bg-[#111827] text-[#D1D5DB] hover:text-[#F9FAFB] border border-[#374151]'
                : 'bg-[#FFFDF8] text-[#6B7280] hover:text-[#1E1E1E] border border-[#ECECEC]'
            }`}
          >
            All
          </button>

          <button
            onClick={() => setDietaryFilter('Veg')}
            className={`flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              dietaryFilter === 'Veg'
                ? 'bg-[#22C55E] text-white shadow-xs font-bold'
                : isAdmin
                ? 'bg-[#111827] text-[#22C55E] border border-[#22C55E]/30 hover:bg-[#22C55E]/10'
                : 'bg-[#FFFDF8] text-[#2E7D32] border border-[#2E7D32]/30 hover:bg-[#2E7D32]/10'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#22C55E] outline-1 outline-white" />
            <span>Veg</span>
          </button>

          <button
            onClick={() => setDietaryFilter('Non-Veg')}
            className={`flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              dietaryFilter === 'Non-Veg'
                ? 'bg-[#EF4444] text-white shadow-xs font-bold'
                : isAdmin
                ? 'bg-[#111827] text-[#EF4444] border border-[#EF4444]/30 hover:bg-[#EF4444]/10'
                : 'bg-[#FFFDF8] text-[#D32F2F] border border-[#D32F2F]/30 hover:bg-[#D32F2F]/10'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#EF4444] outline-1 outline-white" />
            <span>Non-Veg</span>
          </button>
        </div>
      </div>

      {/* Category Sidebar Navigation */}
      <div
        className={
          isAdmin
            ? "bg-[#1E293B] p-3.5 rounded-2xl border border-[#374151] shadow-md space-y-2 sticky top-20 text-[#F9FAFB]"
            : "bg-[#FFFFFF] p-3.5 rounded-2xl border border-[#ECECEC] shadow-2xs space-y-2 sticky top-20"
        }
      >
        {/* Fixed Header */}
        <div
          className={
            isAdmin
              ? "flex items-center justify-between pb-2.5 px-2 border-b border-[#374151]"
              : "flex items-center justify-between pb-2.5 px-2 border-b border-[#ECECEC]"
          }
        >
          <span className={isAdmin ? "text-xs font-bold text-[#F9FAFB] uppercase tracking-wider font-['Poppins']" : "text-xs font-bold text-[#1E1E1E] uppercase tracking-wider font-['Poppins']"}>
            Categories (11)
          </span>
          {searchQuery && (
            <span className={isAdmin ? "text-[11px] text-[#F97316] font-medium" : "text-[11px] text-[#E85D04] font-medium"}>
              Filtered
            </span>
          )}
        </div>

        {/* Scrollable Container for Category List */}
        <div className="max-h-[calc(100vh-280px)] overflow-y-auto pr-1 space-y-1 custom-scrollbar">
          {/* All Items Option */}
          <button
            onClick={() => setActiveCategory('All')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeCategory === 'All'
                ? isAdmin
                  ? 'bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/30 font-bold'
                  : 'bg-[#E85D04]/10 text-[#E85D04] border border-[#E85D04]/30'
                : isAdmin
                ? 'text-[#D1D5DB] hover:bg-[#1F2937] hover:text-[#F9FAFB]'
                : 'text-[#1E1E1E] hover:bg-[#FFFDF8] hover:text-[#E85D04]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Sparkles
                className={`w-4 h-4 ${
                  activeCategory === 'All'
                    ? isAdmin
                      ? 'text-[#F97316]'
                      : 'text-[#E85D04]'
                    : isAdmin
                    ? 'text-[#9CA3AF]'
                    : 'text-[#6B7280]'
                }`}
              />
              <span>All Categories</span>
            </div>
            <span
              className={`text-xs px-2 py-0.5 rounded-md font-bold ${
                activeCategory === 'All'
                  ? isAdmin
                    ? 'bg-[#F97316] text-white'
                    : 'bg-[#E85D04] text-white'
                  : isAdmin
                  ? 'bg-[#111827] text-[#9CA3AF] border border-[#374151]'
                  : 'bg-[#ECECEC] text-[#6B7280]'
              }`}
            >
              {MENU_ITEMS.length}
            </span>
          </button>

          {/* Individual Categories */}
          <div className="space-y-1 pt-1">
            {CATEGORIES.map((cat) => {
              const isSelected = activeCategory === cat.name;
              const count = getCategoryCount(cat.name);

              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    isSelected
                      ? isAdmin
                        ? 'bg-[#F97316]/10 text-[#F97316] font-bold border border-[#F97316]/30'
                        : 'bg-[#E85D04]/10 text-[#E85D04] font-bold border border-[#E85D04]/30'
                      : isAdmin
                      ? 'text-[#D1D5DB] hover:bg-[#1F2937] hover:text-[#F9FAFB]'
                      : 'text-[#1E1E1E] hover:bg-[#FFFDF8] hover:text-[#E85D04]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate pr-2">
                    {renderCategoryIcon(cat.icon, isSelected)}
                    <span className="truncate">{cat.displayName}</span>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-md font-semibold shrink-0 ${
                      isSelected
                        ? isAdmin
                          ? 'bg-[#F97316] text-white'
                          : 'bg-[#E85D04] text-white'
                        : isAdmin
                        ? 'bg-[#111827] text-[#9CA3AF] border border-[#374151]'
                        : 'bg-[#FFFDF8] text-[#6B7280] border border-[#ECECEC]'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
