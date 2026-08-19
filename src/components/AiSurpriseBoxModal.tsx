import React, { useState, useMemo } from 'react';
import { useCart } from '../context/CartContext';
import { generateMysteryBox, rerollDish } from '../services/tasteDiscoveryEngine';
import { TasteBudget, TasteVibe, MysteryBoxResponse } from '../types';
import { MODAL_THEMES } from './AiNutritionModal';
import {
  X,
  Gift,
  Sparkles,
  Shuffle,
  ShoppingBag,
  CheckCircle2,
  Zap,
  Flame,
  UtensilsCrossed,
  Tag,
  Coins,
} from 'lucide-react';

interface AiSurpriseBoxModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiSurpriseBoxModal: React.FC<AiSurpriseBoxModalProps> = ({ isOpen, onClose }) => {
  const { addItem, showToast } = useCart();
  const theme = MODAL_THEMES[MODAL_THEMES.active];

  const [budgetPreset, setBudgetPreset] = useState<TasteBudget>('MID_RANGE');
  const [vibePreset, setVibePreset] = useState<TasteVibe>('WILD_SURPRISE');
  const [dietaryFilter, setDietaryFilter] = useState<'All' | 'Veg' | 'Non-Veg'>('All');
  const [isUnboxed, setIsUnboxed] = useState<boolean>(false);
  const [isUnboxingAnimation, setIsUnboxingAnimation] = useState<boolean>(false);
  const [addedToCart, setAddedToCart] = useState<boolean>(false);
  const [customBoxState, setCustomBoxState] = useState<MysteryBoxResponse | null>(null);

  // Generate initial box solution
  const generatedBox = useMemo(() => {
    return generateMysteryBox(budgetPreset, dietaryFilter, vibePreset);
  }, [budgetPreset, dietaryFilter, vibePreset]);

  // Current active box (either customized or generated)
  const activeBox = customBoxState || generatedBox;

  if (!isOpen) return null;

  const handleTriggerUnbox = () => {
    setIsUnboxingAnimation(true);
    setTimeout(() => {
      setIsUnboxingAnimation(false);
      setIsUnboxed(true);
      setCustomBoxState(null);
      setAddedToCart(false);
    }, 700);
  };

  const handleRerollDishItem = (idx: number) => {
    const updated = rerollDish(activeBox, idx);
    setCustomBoxState(updated);
    setAddedToCart(false);
    showToast(`Swapped Dish ${idx + 1}!`);
  };

  const handleAddBoxToCart = () => {
    activeBox.items.forEach(({ foodItem, quantity }) => {
      addItem(foodItem, quantity);
    });
    setAddedToCart(true);
    showToast(`Added ${activeBox.boxTitle} (10% OFF) to Cart!`);
    setTimeout(() => {
      onClose();
      setAddedToCart(false);
    }, 1200);
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
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Modal Header */}
          <div className={`flex items-start justify-between pb-4 border-b ${theme.headerBorder} relative z-10`}>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-tr from-amber-500 to-[#E85D04] text-white rounded-2xl shadow-lg animate-bounce">
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-amber-500/20 text-amber-700 border border-amber-500/40 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    10% OFF Mystery Deal
                  </span>
                  <span className={`text-xs ${theme.subtitleText}`}>Taste Discovery</span>
                </div>
                <h2 className={`text-lg sm:text-xl font-extrabold font-['Poppins'] mt-1 ${theme.titleText}`}>
                  AI &quot;Surprise Me&quot; Mystery Box
                </h2>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className={`p-2 rounded-xl border transition-all cursor-pointer shadow-md shrink-0 ${theme.closeBtn}`}
              title="Close Modal"
            >
              <X className="w-5 h-5 text-[#F97316]" />
            </button>
          </div>

          {/* 1. Discovery Preference Selectors */}
          <div className="space-y-4 relative z-10">
            {/* Budget Selector */}
            <div>
              <label className={`text-xs font-extrabold uppercase tracking-wider block mb-2 ${theme.labelTitle}`}>
                1. Select Target Budget
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setBudgetPreset('UNDER_250');
                    setIsUnboxed(false);
                    setCustomBoxState(null);
                  }}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer text-xs font-bold ${
                    budgetPreset === 'UNDER_250' ? theme.presetBtnActive : theme.presetBtnInactive
                  }`}
                >
                  🪙 Under ₹250
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setBudgetPreset('MID_RANGE');
                    setIsUnboxed(false);
                    setCustomBoxState(null);
                  }}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer text-xs font-bold ${
                    budgetPreset === 'MID_RANGE' ? theme.presetBtnActive : theme.presetBtnInactive
                  }`}
                >
                  💵 ₹250–₹500
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setBudgetPreset('PREMIUM');
                    setIsUnboxed(false);
                    setCustomBoxState(null);
                  }}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer text-xs font-bold ${
                    budgetPreset === 'PREMIUM' ? theme.presetBtnActive : theme.presetBtnInactive
                  }`}
                >
                  💎 ₹500+ Premium
                </button>
              </div>
            </div>

            {/* Vibe Selector */}
            <div>
              <label className={`text-xs font-extrabold uppercase tracking-wider block mb-2 ${theme.labelTitle}`}>
                2. Select Flavor Vibe
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setVibePreset('WILD_SURPRISE');
                    setIsUnboxed(false);
                    setCustomBoxState(null);
                  }}
                  className={`p-2 rounded-xl border text-center transition-all cursor-pointer text-xs font-bold ${
                    vibePreset === 'WILD_SURPRISE' ? theme.presetBtnActive : theme.presetBtnInactive
                  }`}
                >
                  🎲 Wild Surprise
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setVibePreset('FAST_FOOD');
                    setIsUnboxed(false);
                    setCustomBoxState(null);
                  }}
                  className={`p-2 rounded-xl border text-center transition-all cursor-pointer text-xs font-bold ${
                    vibePreset === 'FAST_FOOD' ? theme.presetBtnActive : theme.presetBtnInactive
                  }`}
                >
                  🍔 Fast-Food
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setVibePreset('ROYAL_INDIAN');
                    setIsUnboxed(false);
                    setCustomBoxState(null);
                  }}
                  className={`p-2 rounded-xl border text-center transition-all cursor-pointer text-xs font-bold ${
                    vibePreset === 'ROYAL_INDIAN' ? theme.presetBtnActive : theme.presetBtnInactive
                  }`}
                >
                  🍛 Royal Indian
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setVibePreset('ITALIAN_GOURMET');
                    setIsUnboxed(false);
                    setCustomBoxState(null);
                  }}
                  className={`p-2 rounded-xl border text-center transition-all cursor-pointer text-xs font-bold ${
                    vibePreset === 'ITALIAN_GOURMET' ? theme.presetBtnActive : theme.presetBtnInactive
                  }`}
                >
                  🍝 Italian Gourmet
                </button>
              </div>
            </div>

            {/* Dietary Filter */}
            <div className={`p-2.5 rounded-xl border flex items-center justify-between ${theme.filterBoxBg}`}>
              <span className={`text-xs font-bold ${theme.labelTitle}`}>Dietary Preference:</span>
              <div className="flex items-center gap-1.5">
                {(['All', 'Veg', 'Non-Veg'] as const).map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => {
                      setDietaryFilter(filter);
                      setIsUnboxed(false);
                      setCustomBoxState(null);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      dietaryFilter === filter
                        ? 'bg-[#E85D04] text-white shadow-sm'
                        : theme.filterBtnInactive
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 2. Interactive Unboxing Box Animation Stage */}
          {!isUnboxed ? (
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-4 relative z-10 border-2 border-dashed border-[#E85D04]/40 rounded-3xl bg-white/40 backdrop-blur-md">
              <div
                onClick={handleTriggerUnbox}
                className={`w-24 h-24 rounded-3xl bg-gradient-to-tr from-[#E85D04] via-amber-500 to-[#F97316] text-white flex items-center justify-center shadow-2xl transition-all duration-500 cursor-pointer ${
                  isUnboxingAnimation
                    ? 'scale-125 rotate-12 animate-pulse ring-4 ring-amber-400/60 shadow-amber-500/50'
                    : 'hover:scale-110 hover:-rotate-6 hover:shadow-amber-500/40 animate-bounce'
                }`}
                title="Click to Unbox Mystery Feast!"
              >
                <Gift className="w-12 h-12 drop-shadow-md" />
              </div>
              <div>
                <h3 className={`text-base font-extrabold font-['Poppins'] ${theme.titleText}`}>
                  {isUnboxingAnimation ? '✨ Unboxing Chef Surprise...' : 'Your AI Mystery Box is Ready!'}
                </h3>
                <p className={`text-xs mt-1 ${theme.subtitleText}`}>
                  Contains 2–3 surprise pairing dishes with a 10% instant discount!
                </p>
              </div>

              <button
                type="button"
                onClick={handleTriggerUnbox}
                disabled={isUnboxingAnimation}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#E85D04] to-[#F97316] hover:from-[#C94B00] hover:to-[#EA580C] text-white font-extrabold text-sm shadow-xl flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
              >
                <Sparkles className="w-4 h-4 text-amber-200 animate-spin" />
                <span>Unbox AI Mystery Feast 🎁</span>
              </button>
            </div>
          ) : (
            /* 3. Revealed Mystery Box Content */
            <div className={`rounded-2xl p-5 space-y-4 shadow-xl relative z-10 ${theme.selectedCardBg}`}>
              <div className="flex items-center justify-between pb-3 border-b border-[#E85D04]/20">
                <div className="flex items-center gap-2">
                  <span className="bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/40 font-extrabold text-[11px] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5" />
                    {activeBox.matchScore}% Taste Match
                  </span>
                  <span className="bg-[#E85D04] text-white font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {activeBox.boxBadge}
                  </span>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] block uppercase font-bold ${theme.dishMutedText}`}>
                    Original <del>₹{activeBox.originalPrice}</del>
                  </span>
                  <span className="text-xl font-extrabold text-[#22C55E] font-['Poppins']">
                    ₹{activeBox.discountedPrice.toFixed(2)}{' '}
                    <span className="text-xs text-[#E85D04] font-bold">(10% OFF)</span>
                  </span>
                </div>
              </div>

              <p className={`text-xs italic p-2.5 rounded-xl border ${theme.quoteBg}`}>
                &ldquo;{activeBox.mysteryDescription}&rdquo;
              </p>

              {/* Revealed Items List */}
              <div className="space-y-2.5">
                <span className={`text-[11px] font-extrabold uppercase tracking-wider block ${theme.dishMutedText}`}>
                  Mystery Dishes Included ({activeBox.items.length}):
                </span>
                {activeBox.items.map(({ foodItem, quantity }, idx) => (
                  <div
                    key={`${foodItem.id}-${idx}`}
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
                          {foodItem.name}
                        </h4>
                        <span className={`text-[10px] ${theme.dishMutedText}`}>
                          {foodItem.calories || 400} kcal | {foodItem.protein || 20}g Protein | ₹{foodItem.price}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRerollDishItem(idx)}
                      className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 border border-amber-500/30 text-[10px] font-extrabold flex items-center gap-1 transition-all cursor-pointer"
                      title="Swap this dish for another random item"
                    >
                      <Shuffle className="w-3 h-3" />
                      <span>Swap 🎲</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className={`px-5 py-3.5 rounded-2xl font-extrabold text-sm border transition-all cursor-pointer shadow-md ${theme.actionCloseBtn}`}
            >
              Close
            </button>

            {isUnboxed && (
              <button
                type="button"
                onClick={handleAddBoxToCart}
                disabled={addedToCart}
                className={`flex-1 py-3.5 rounded-2xl font-extrabold text-sm transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer ${
                  addedToCart
                    ? 'bg-[#22C55E] text-white shadow-emerald-500/20'
                    : 'bg-[#E85D04] hover:bg-[#C94B00] text-white shadow-[#E85D04]/30 hover:scale-102'
                }`}
              >
                {addedToCart ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 animate-bounce" />
                    <span>Added Mystery Box to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    <span>Add Mystery Box (₹{activeBox.discountedPrice.toFixed(2)}) &rarr;</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
