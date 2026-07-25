import React, { useState, useEffect } from 'react';
import { Plus, Minus, Clock, ShoppingBag, Check, Star } from 'lucide-react';
import { FoodItem } from '../types';
import { useCart } from '../context/CartContext';

interface FoodCardProps {
  item: FoodItem;
}

export const FoodCard: React.FC<FoodCardProps> = ({ item }) => {
  const { addItem, cartItems, updateQuantity, highlightedItemId, setHighlightedItemId } = useCart();
  const [qty, setQty] = useState<number>(1);
  const [isAdding, setIsAdding] = useState<boolean>(false);

  const isHighlighted = highlightedItemId === item.id;

  // Clear highlight after 2.5 seconds
  useEffect(() => {
    if (isHighlighted) {
      const timer = setTimeout(() => {
        setHighlightedItemId(null);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isHighlighted, setHighlightedItemId, item.id]);

  // Check if this item is already in the cart
  const cartEntry = cartItems.find((c) => c.foodItem.id === item.id);
  const inCartQty = cartEntry ? cartEntry.quantity : 0;

  const handleAddToCart = () => {
    setIsAdding(true);
    addItem(item, qty);
    setQty(1); // Reset local counter after adding
    setTimeout(() => setIsAdding(false), 400);
  };

  return (
    <div
      id={`food-card-${item.id}`}
      className={`bg-[#FFFFFF] border rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between ${
        isHighlighted
          ? 'border-[#E85D04] ring-4 ring-[#E85D04]/30 scale-102 shadow-2xl'
          : 'border-[#ECECEC] hover:border-[#E85D04]/40'
      }`}
    >
      
      {/* Top Image Container */}
      <div className="relative h-48 sm:h-52 w-full bg-stone-100 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Veg / Non-Veg Emblem */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2 py-1 rounded-lg border border-white/50 shadow-xs flex items-center gap-1.5">
          <div
            className={`w-3.5 h-3.5 border-2 flex items-center justify-center p-0.5 rounded-2xs ${
              item.isVeg ? 'border-[#2E7D32]' : 'border-[#D32F2F]'
            }`}
          >
            <div
              className={`w-1.5 h-1.5 rounded-full ${
                item.isVeg ? 'bg-[#2E7D32]' : 'bg-[#D32F2F]'
              }`}
            />
          </div>
          <span className="text-[10px] font-bold tracking-wider text-[#1E1E1E]">
            {item.isVeg ? 'VEG' : 'NON-VEG'}
          </span>
        </div>

        {/* Rating Badge */}
        {item.rating && (
          <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md text-amber-400 text-[11px] font-bold px-2 py-0.5 rounded-lg border border-white/20 flex items-center gap-1 shadow-xs">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{item.rating}</span>
          </div>
        )}

        {/* Prep Time Tag */}
        {item.prepTime && (
          <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md text-white text-[11px] px-2 py-1 rounded-lg flex items-center gap-1 border border-white/10">
            <Clock className="w-3 h-3 text-[#E85D04]" />
            <span>{item.prepTime}</span>
          </div>
        )}

        {/* Popularity Tag */}
        {item.tags && item.tags.length > 0 && (
          <div className="absolute bottom-3 right-3 bg-[#E85D04] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-xs">
            {item.tags[0]}
          </div>
        )}
      </div>

      {/* Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-bold text-base text-[#1E1E1E] group-hover:text-[#E85D04] transition-colors line-clamp-1 font-['Poppins']">
              {item.name}
            </h3>
            <span className="text-[11px] text-[#6B7280] font-medium shrink-0 bg-[#FFFDF8] px-2 py-0.5 rounded-md border border-[#ECECEC]">
              {item.category}
            </span>
          </div>

          <p className="text-xs text-[#6B7280] line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Price & Cart Actions */}
        <div className="pt-3 border-t border-[#ECECEC] flex items-center justify-between gap-2">
          
          {/* Price */}
          <div>
            <span className="text-[10px] text-[#6B7280] block font-medium uppercase tracking-wider">Price</span>
            <span className="text-lg font-extrabold text-[#1E1E1E]">
              ₹{item.price.toFixed(2)}
            </span>
          </div>

          {/* Quantity Adjuster or Add Button */}
          <div className="flex items-center gap-2">
            
            {/* Quantity Stepper for new addition */}
            <div className="flex items-center bg-[#FFFDF8] border border-[#ECECEC] rounded-xl p-1">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-[#1E1E1E] hover:bg-[#ECECEC] transition-colors cursor-pointer"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-6 text-center text-xs font-bold text-[#1E1E1E]">
                {qty}
              </span>
              <button
                type="button"
                onClick={() => setQty((q) => q + 1)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-[#1E1E1E] hover:bg-[#ECECEC] transition-colors cursor-pointer"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Add Button */}
            <button
              onClick={handleAddToCart}
              className={`bg-[#E85D04] hover:bg-[#C94B00] text-white p-2.5 rounded-xl transition-all shadow-md shadow-[#E85D04]/20 active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 ${
                isAdding ? 'scale-110 bg-[#2E7D32]' : ''
              }`}
              title="Add to Cart"
            >
              {isAdding ? (
                <Check className="w-4 h-4 animate-bounce" />
              ) : (
                <ShoppingBag className="w-4 h-4" />
              )}
              <span className="text-xs font-bold hidden sm:inline">
                {isAdding ? 'Added' : 'Add'}
              </span>
            </button>
          </div>

        </div>

        {/* In-cart indicator banner */}
        {inCartQty > 0 && (
          <div className="bg-[#2E7D32]/10 border border-[#2E7D32]/20 rounded-xl px-2.5 py-1.5 flex items-center justify-between text-[11px] text-[#2E7D32] font-semibold">
            <div className="flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              <span>In Cart: {inCartQty}</span>
            </div>
            <button
              onClick={() => updateQuantity(item.id, inCartQty + 1)}
              className="hover:underline text-[11px] font-bold cursor-pointer"
            >
              + Add more
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
