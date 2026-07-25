import React, { useEffect, useRef } from 'react';
import { Search, Sparkles, ChevronRight, Star, Clock } from 'lucide-react';
import { FoodItem } from '../types';
import { useCart } from '../context/CartContext';

interface LiveSearchDropdownProps {
  query: string;
  onSelectResult: (item: FoodItem) => void;
  onClose: () => void;
}

export const LiveSearchDropdown: React.FC<LiveSearchDropdownProps> = ({
  query,
  onSelectResult,
  onClose,
}) => {
  const { setActiveCategory, setCategoryFilter, setSearchQuery, setHighlightedItemId } = useCart();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter matching dishes
  const matchingItems = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    return (window as any).sizzleMenuItems
      ? (window as any).sizzleMenuItems.filter((item: FoodItem) => {
          const matchName = item.name.toLowerCase().includes(q);
          const matchCat = item.category.toLowerCase().includes(q);
          const matchDesc = item.description.toLowerCase().includes(q);
          const matchTags = item.tags?.some((t) => t.toLowerCase().includes(q));
          const matchId = String(item.id) === q;
          return matchName || matchCat || matchDesc || matchTags || matchId;
        })
      : [];
  }, [query]);

  // Click outside listener to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  if (!query.trim()) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute left-0 right-0 top-full mt-2 bg-[#FFFFFF] border border-[#ECECEC] rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[420px] flex flex-col"
    >
      <div className="p-3 bg-[#FFFDF8] border-b border-[#ECECEC] flex items-center justify-between text-xs text-[#6B7280]">
        <span className="font-semibold text-[#1E1E1E]">
          Search Results ({matchingItems.length})
        </span>
        <span className="text-[10px] text-[#6B7280]">Press dish to jump</span>
      </div>

      <div className="overflow-y-auto divide-y divide-[#ECECEC] flex-1">
        {matchingItems.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#FFFDF8] border border-[#ECECEC] flex items-center justify-center mx-auto text-[#6B7280]">
              <Search className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-[#1E1E1E]">No matching dishes found</p>
            <p className="text-[11px] text-[#6B7280]">
              Try searching for "burger", "biryani", "pizza", "momos", or "veg"
            </p>
          </div>
        ) : (
          matchingItems.slice(0, 7).map((item: FoodItem) => (
            <button
              key={item.id}
              onClick={() => {
                onSelectResult(item);
                setCategoryFilter('All');
                setActiveCategory('All');
                setSearchQuery(item.name);
                setHighlightedItemId(item.id);

                // Smooth scroll to food card
                setTimeout(() => {
                  const cardEl = document.getElementById(`food-card-${item.id}`);
                  if (cardEl) {
                    cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }, 100);

                onClose();
              }}
              className="w-full p-3 flex items-center gap-3 hover:bg-[#FFFDF8] transition-colors text-left group cursor-pointer"
            >
              {/* Thumbnail Image */}
              <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-[#ECECEC]">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>

              {/* Dish Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  {/* Veg / Non-Veg Indicator */}
                  <div
                    className={`w-3 h-3 border border-2 flex items-center justify-center rounded-2xs ${
                      item.isVeg ? 'border-[#2E7D32]' : 'border-[#D32F2F]'
                    }`}
                  >
                    <div
                      className={`w-1 h-1 rounded-full ${
                        item.isVeg ? 'bg-[#2E7D32]' : 'bg-[#D32F2F]'
                      }`}
                    />
                  </div>

                  <h4 className="text-xs font-bold text-[#1E1E1E] group-hover:text-[#E85D04] transition-colors truncate">
                    {item.name}
                  </h4>
                </div>

                <div className="flex items-center gap-2 text-[10px] text-[#6B7280] mt-1">
                  <span className="bg-[#ECECEC] px-1.5 py-0.2 rounded font-medium text-[#1E1E1E]">
                    {item.category}
                  </span>
                  {item.rating && (
                    <span className="flex items-center gap-0.5 text-amber-600 font-bold">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      {item.rating}
                    </span>
                  )}
                  {item.prepTime && (
                    <span className="hidden sm:flex items-center gap-0.5">
                      <Clock className="w-3 h-3 text-[#E85D04]" />
                      {item.prepTime}
                    </span>
                  )}
                </div>
              </div>

              {/* Price & Arrow */}
              <div className="text-right shrink-0">
                <span className="text-xs font-extrabold text-[#1E1E1E] block">
                  ₹{item.price.toFixed(2)}
                </span>
                <span className="text-[10px] text-[#E85D04] font-bold group-hover:translate-x-0.5 transition-transform inline-flex items-center">
                  View <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </button>
          ))
        )}
      </div>

      {matchingItems.length > 7 && (
        <div className="p-2.5 bg-[#FFFDF8] border-t border-[#ECECEC] text-center text-[11px] text-[#E85D04] font-bold">
          +{matchingItems.length - 7} more dishes match your search
        </div>
      )}
    </div>
  );
};
