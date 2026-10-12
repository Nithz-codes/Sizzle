import React, { useState, useMemo } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { getUsualFeast } from '../services/smartReorderEngine';

import { MODAL_THEMES } from './AiNutritionModal';
import { AiEngineToggle, AiEngineMode } from './AiEngineToggle';
import {
  X,
  Zap,
  Sparkles,
  ShoppingBag,
  CheckCircle2,
  Clock,
  RotateCcw,
  Flame,
  Award,
  ArrowLeft,
} from 'lucide-react';

interface AiUsualFeastModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBackToHub?: () => void;
}

export const AiUsualFeastModal: React.FC<AiUsualFeastModalProps> = ({ isOpen, onClose, onBackToHub }) => {
  const { addItem, showToast, pastReceipts, setIsCartOpen } = useCart();
  const { user } = useAuth();
  const theme = MODAL_THEMES[MODAL_THEMES.active];

  const [addedToCart, setAddedToCart] = useState<boolean>(false);
  const [engineMode, setEngineMode] = useState<AiEngineMode>('LOCAL');

  const customerName = user?.name || 'Gourmet Diner';

  const usualResponse = useMemo(() => {
    return getUsualFeast(pastReceipts, customerName);
  }, [pastReceipts, customerName]);

  if (!isOpen) return null;

  const handleReorderUsual = () => {
    usualResponse.items.forEach(({ foodItem, quantity }) => {
      addItem(foodItem, quantity);
    });
    setAddedToCart(true);
    showToast(`Added ${usualResponse.feastTitle} to Cart!`);
    setTimeout(() => {
      onClose();
      setIsCartOpen(true); // Open cart for 1-tap checkout!
      setAddedToCart(false);
    }, 1000);
  };

  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 ${theme.backdrop} animate-in fade-in duration-200 overflow-y-auto overflow-x-hidden`}
    >
      {/* Outer Modal Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`rounded-3xl max-w-xl w-full relative font-['Plus_Jakarta_Sans'] overflow-hidden my-auto ${theme.container}`}
      >
        {/* Inner Scrollable Area */}
        <div className="max-h-[85vh] overflow-y-auto overflow-x-hidden p-5 sm:p-6 space-y-5 custom-modal-scrollbar">
          {/* Glowing Ambient Background Accent */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-[#E85D04]/15 rounded-full blur-3xl pointer-events-none" />

          {/* Modal Header */}
          <div className={`pb-4 border-b ${theme.headerBorder} relative z-10 space-y-3`}>
            {/* Row 1: Back Button (Left) & Close Button (Right) on the same line */}
            <div className="flex items-center justify-between w-full">
              {onBackToHub ? (
                <button
                  type="button"
                  onClick={onBackToHub}
                  className="p-2 sm:px-3 sm:py-2 rounded-xl bg-white text-[#1E1E1E] hover:text-[#E85D04] border border-gray-200 hover:border-[#E85D04]/40 font-extrabold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md hover:scale-105"
                  title="Back to AI Studio Cards"
                >
                  <ArrowLeft className="w-4 h-4 text-[#E85D04]" />
                  <span>Back to AI Studio</span>
                </button>
              ) : (
                <div />
              )}
              <button
                type="button"
                onClick={onClose}
                className={`p-2 rounded-xl border transition-all cursor-pointer shadow-md shrink-0 ${theme.closeBtn}`}
                title="Close Modal"
              >
                <X className="w-5 h-5 text-[#F97316]" />
              </button>
            </div>

            {/* Row 2: Below Action Bar - Centered Heading & Badges */}
            <div className="flex flex-col items-center text-center justify-center space-y-1.5 px-2">
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <div className="p-1.5 bg-gradient-to-r from-[#E85D04] to-[#F97316] text-white rounded-xl shadow-md shrink-0">
                  <Zap className="w-4 h-4 fill-white" />
                </div>
                <span className="bg-[#E85D04]/20 text-[#E85D04] border border-[#E85D04]/40 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Smart AI Reorder
                </span>
                <span className={`text-xs ${theme.subtitleText}`}>{usualResponse.timeBadge}</span>
              </div>
              <h2 className={`text-xl sm:text-2xl font-extrabold font-['Poppins'] ${theme.titleText}`}>
                AI One-Tap &quot;Usual Feast&quot;
              </h2>
            </div>
          </div>

          {/* Dual-Engine Mode Switcher Toggle */}
          <div className="relative z-10">
            <AiEngineToggle
              mode={engineMode}
              onModeChange={(m) => setEngineMode(m)}
            />
          </div>

          {/* Personalization Banner */}
          <div className={`p-4 rounded-2xl border space-y-2 relative z-10 ${theme.quoteBg}`}>
            <div className="flex items-center justify-between">
              <span className="bg-[#E85D04] text-white font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                <Award className="w-3 h-3" />
                {usualResponse.isNewUser ? 'Bestseller Feast' : `Personalized (${usualResponse.totalOrdersCount} Past Orders)`}
              </span>
              <span className="text-[10px] font-bold text-[#E85D04] flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {usualResponse.timeBadge}
              </span>
            </div>
            <p className="text-xs font-medium leading-relaxed">
              &ldquo;{usualResponse.chefGreeting}&rdquo;
            </p>
          </div>

          {/* Itemized Usual Feast Card */}
          <div className={`rounded-2xl p-5 space-y-4 shadow-xl relative z-10 ${theme.selectedCardBg}`}>
            <div className="flex items-center justify-between pb-3 border-b border-[#E85D04]/20">
              <div>
                <h3 className={`text-sm font-extrabold font-['Poppins'] ${theme.titleText}`}>
                  {usualResponse.feastTitle}
                </h3>
                <span className={`text-[10px] ${theme.dishMutedText}`}>
                  {usualResponse.items.length} items bundled for instant 1-tap reordering
                </span>
              </div>
              <div className="text-right">
                <span className={`text-[10px] block uppercase font-bold ${theme.dishMutedText}`}>Total Feast</span>
                <span className="text-xl font-extrabold text-[#22C55E] font-['Poppins']">
                  ₹{usualResponse.totalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Items List */}
            <div className="space-y-2.5">
              {usualResponse.items.map(({ foodItem, quantity, timesOrdered }) => (
                <div
                  key={foodItem.id}
                  className={`flex items-center justify-between p-3 rounded-xl border ${theme.dishCardBg}`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={foodItem.image}
                      alt={foodItem.name}
                      className="w-11 h-11 object-cover rounded-lg shrink-0"
                    />
                    <div>
                      <h4 className={`text-xs font-bold flex items-center gap-1.5 ${theme.dishTitle}`}>
                        <span className={`w-2 h-2 rounded-full ${foodItem.isVeg ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        {foodItem.name} x{quantity}
                      </h4>
                      <span className={`text-[10px] ${theme.dishMutedText}`}>
                        {foodItem.calories || 400} kcal | {foodItem.protein || 20}g Protein
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-extrabold text-[#22C55E] block">
                      ₹{(foodItem.price * quantity).toFixed(2)}
                    </span>
                    {!usualResponse.isNewUser && (
                      <span className="bg-[#E85D04]/10 text-[#E85D04] border border-[#E85D04]/20 text-[9px] font-bold px-1.5 py-0.5 rounded-full inline-block mt-0.5">
                        Ordered {timesOrdered}x
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Macros Summary Bar */}
            <div className={`p-3 rounded-xl border flex items-center justify-around text-center ${theme.filterBoxBg}`}>
              <div>
                <span className={`text-[10px] block font-bold ${theme.dishMutedText}`}>Total Calories</span>
                <span className="text-xs font-extrabold text-[#E85D04]">{usualResponse.totalCalories} kcal</span>
              </div>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-700" />
              <div>
                <span className={`text-[10px] block font-bold ${theme.dishMutedText}`}>Total Protein</span>
                <span className="text-xs font-extrabold text-emerald-600">{usualResponse.totalProtein}g</span>
              </div>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-700" />
              <div>
                <span className={`text-[10px] block font-bold ${theme.dishMutedText}`}>Feast Price</span>
                <span className="text-xs font-extrabold text-[#22C55E]">₹{usualResponse.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className={`px-5 py-3.5 rounded-2xl font-extrabold text-sm border transition-all cursor-pointer shadow-md ${theme.actionCloseBtn}`}
            >
              Close
            </button>

            <button
              type="button"
              onClick={handleReorderUsual}
              disabled={addedToCart}
              className={`flex-1 py-3.5 rounded-2xl font-extrabold text-sm transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer ${
                addedToCart
                  ? 'bg-[#22C55E] text-white shadow-emerald-500/20'
                  : 'bg-gradient-to-r from-[#E85D04] to-[#F97316] hover:from-[#C94B00] hover:to-[#EA580C] text-white shadow-[#E85D04]/30 hover:scale-102'
              }`}
            >
              {addedToCart ? (
                <>
                  <CheckCircle2 className="w-5 h-5 animate-bounce" />
                  <span>Reordering Usual Feast...</span>
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 fill-white" />
                  <span>Reorder My Usual Feast ⚡ (₹{usualResponse.totalPrice.toFixed(2)}) &rarr;</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
