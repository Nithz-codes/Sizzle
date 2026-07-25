import React, { useEffect, useState } from 'react';
import { ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const StickyCartBar: React.FC = () => {
  const { cartItems, grandTotal, setIsCartOpen } = useCart();
  const [bounced, setBounced] = useState<boolean>(false);

  const totalItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Trigger brief bounce microinteraction when totalItemCount changes
  useEffect(() => {
    if (totalItemCount > 0) {
      setBounced(true);
      const timer = setTimeout(() => setBounced(false), 300);
      return () => clearTimeout(timer);
    }
  }, [totalItemCount, grandTotal]);

  if (totalItemCount === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-40 max-w-md w-full no-print pointer-events-none">
      <div
        className={`pointer-events-auto bg-[#1E1E1E] text-white p-3.5 sm:p-4 rounded-2xl shadow-2xl border border-stone-800 flex items-center justify-between gap-3 transition-transform duration-200 ${
          bounced ? 'scale-105 shadow-[#E85D04]/30' : 'scale-100'
        }`}
      >
        {/* Left: Item count & total info */}
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl bg-[#E85D04] text-white flex items-center justify-center font-bold shadow-md shadow-[#E85D04]/30">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute -top-1.5 -right-1.5 bg-white text-[#E85D04] text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#1E1E1E]">
              {totalItemCount}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white/90">Your Order</span>
              <span className="bg-[#E85D04]/20 text-[#E85D04] text-[10px] font-extrabold px-1.5 py-0.2 rounded border border-[#E85D04]/30">
                {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'}
              </span>
            </div>
            <p className="text-sm font-black text-white font-['Poppins']">
              ₹{grandTotal.toFixed(2)}{' '}
              <span className="text-[10px] font-normal text-stone-400">incl. GST</span>
            </p>
          </div>
        </div>

        {/* Right: View Cart Button */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="bg-[#E85D04] hover:bg-[#C94B00] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-[#E85D04]/25 flex items-center gap-1.5 cursor-pointer active:scale-95 shrink-0"
        >
          <span>View Cart</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
