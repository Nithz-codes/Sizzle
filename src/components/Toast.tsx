import React from 'react';
import { CheckCircle, Undo2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const Toast: React.FC = () => {
  const { toastMessage, toastInfo, undoLastAction } = useCart();

  if (!toastInfo && !toastMessage) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-200 pointer-events-auto max-w-md w-[92%] sm:w-auto">
      {toastInfo ? (
        <div className="bg-[#1E1E1E] text-white p-3.5 sm:px-4 rounded-2xl shadow-2xl border border-stone-800 flex items-center justify-between gap-3 text-xs font-['Poppins']">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#2E7D32]/20 text-[#4CAF50] flex items-center justify-center shrink-0 border border-[#2E7D32]/30">
              <CheckCircle className="w-4.5 h-4.5 text-[#4CAF50]" />
            </div>
            <div>
              <p className="font-bold text-white text-xs">
                ✅ {toastInfo.itemName} added
              </p>
              <p className="text-[11px] text-stone-300 font-normal mt-0.5 flex items-center gap-2">
                <span>Qty: <strong className="text-white">{toastInfo.quantityAdded}</strong></span>
                <span>•</span>
                <span>Cart Total: <strong className="text-[#E85D04]">₹{toastInfo.cartTotal.toFixed(0)}</strong></span>
              </p>
            </div>
          </div>

          <button
            onClick={undoLastAction}
            className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-[#E85D04] hover:text-white font-bold text-xs border border-stone-700 transition-all cursor-pointer shrink-0 flex items-center gap-1 active:scale-95 ml-2"
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span>Undo</span>
          </button>
        </div>
      ) : (
        <div className="bg-[#1E1E1E] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-stone-800 text-xs font-semibold font-['Poppins']">
          <div className="w-6 h-6 rounded-full bg-[#2E7D32] flex items-center justify-center shrink-0">
            <CheckCircle className="w-3.5 h-3.5 text-white" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
