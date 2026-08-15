import React, { useState, useMemo } from 'react';
import { useCart } from '../context/CartContext';
import { buildMacroMeal, getItemMacros } from '../services/macroAiBuilder';
import { FitnessPreset, FoodItem } from '../types';
import { MENU_ITEMS } from '../data/menuData';
import {
  X,
  Sparkles,
  Flame,
  Dumbbell,
  Salad,
  Scale,
  ShoppingBag,
  CheckCircle2,
  Zap,
} from 'lucide-react';

// Theme presets for Sizzle Macro Engine (Easily switch between 'SIZZLE_WARM' and 'DARK' or revert!)
export type ModalThemeMode = 'SIZZLE_WARM' | 'DARK';

export const MODAL_THEMES = {
  // Current active mode (set to 'SIZZLE_WARM' for Sizzle webpage cream background, change to 'DARK' to revert)
  active: 'SIZZLE_WARM' as ModalThemeMode,

  SIZZLE_WARM: {
    backdrop: 'bg-black/35 backdrop-blur-md',
    container: 'bg-[#FFFDF8]/70 backdrop-blur-3xl border-2 border-[#E85D04]/60 text-[#1E1E1E] shadow-[0_16px_48px_0_rgba(232,93,4,0.18)] ring-1 ring-white/60',
    headerBorder: 'border-[#E85D04]/20',
    titleText: 'text-[#1E1E1E]',
    subtitleText: 'text-[#4B5563]',
    closeBtn: 'bg-white/70 backdrop-blur-md hover:bg-white text-[#4B5563] hover:text-[#111827] border-white/80 shadow-sm',
    labelTitle: 'text-[#1E1E1E]',
    presetBtnInactive: 'bg-white/65 backdrop-blur-md border-white/80 text-[#374151] hover:border-[#E85D04]/60 shadow-sm',
    presetBtnActive: 'bg-[#E85D04] border-[#E85D04] text-white shadow-lg scale-102 font-bold',
    filterBoxBg: 'bg-white/55 backdrop-blur-xl border border-white/70 shadow-sm',
    filterBtnInactive: 'text-[#6B7280]',
    sliderMutedText: 'text-[#4B5563]',
    comboTabInactive: 'bg-white/65 backdrop-blur-md border-white/80 text-[#4B5563] hover:text-[#111827] hover:border-[#E85D04]/50 shadow-sm',
    comboTabActive: 'bg-[#E85D04] border-[#E85D04] text-white shadow-md font-bold ring-2 ring-[#E85D04]/40',
    selectedCardBg: 'bg-gradient-to-br from-white/75 via-[#FFF9F2]/65 to-[#FFF4EC]/75 backdrop-blur-2xl border-2 border-[#E85D04]/60 shadow-xl',
    quoteBg: 'bg-white/80 backdrop-blur-md border-white/80 text-[#374151]',
    statBoxBg: 'bg-white/75 backdrop-blur-md border-white/80 shadow-sm',
    dishCardBg: 'bg-white/75 backdrop-blur-md border-white/80 shadow-sm',
    dishTitle: 'text-[#1E1E1E]',
    dishMutedText: 'text-[#6B7280]',
    actionCloseBtn: 'bg-white/70 backdrop-blur-md hover:bg-white text-[#374151] hover:text-[#111827] border-white/80 shadow-sm',
  },

  DARK: {
    backdrop: 'bg-black/75 backdrop-blur-md',
    container: 'bg-[#1E293B] border-2 border-[#E85D04]/60 text-[#F9FAFB] shadow-2xl',
    headerBorder: 'border-[#374151]',
    titleText: 'text-white',
    subtitleText: 'text-[#9CA3AF]',
    closeBtn: 'bg-[#111827] hover:bg-[#374151] text-[#9CA3AF] hover:text-white border-[#374151]',
    labelTitle: 'text-[#D1D5DB]',
    presetBtnInactive: 'bg-[#111827] border-[#374151] text-[#D1D5DB] hover:border-[#E85D04]/50',
    presetBtnActive: 'bg-[#E85D04] border-[#E85D04] text-white shadow-lg scale-102 font-bold',
    filterBoxBg: 'bg-[#111827]/80 border-[#374151]',
    filterBtnInactive: 'text-[#9CA3AF]',
    sliderMutedText: 'text-[#9CA3AF]',
    comboTabInactive: 'bg-[#111827] border-[#374151] text-[#9CA3AF] hover:text-white hover:border-[#E85D04]/40',
    comboTabActive: 'bg-[#E85D04] border-[#E85D04] text-white shadow-lg font-bold ring-2 ring-[#E85D04]/50',
    selectedCardBg: 'bg-gradient-to-br from-[#111827] to-[#1F2937] border-2 border-[#E85D04]/50 shadow-xl',
    quoteBg: 'bg-[#1E293B]/60 border-[#374151] text-[#D1D5DB]',
    statBoxBg: 'bg-[#1E293B] border-[#374151]',
    dishCardBg: 'bg-[#1E293B] border-[#374151]',
    dishTitle: 'text-white',
    dishMutedText: 'text-[#9CA3AF]',
    actionCloseBtn: 'bg-[#111827] hover:bg-[#374151] text-[#D1D5DB] hover:text-white border-[#374151]',
  },
};

interface AiNutritionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiNutritionModal: React.FC<AiNutritionModalProps> = ({ isOpen, onClose }) => {
  const { addItem, showToast } = useCart();
  const theme = MODAL_THEMES[MODAL_THEMES.active];

  const [preset, setPreset] = useState<FitnessPreset>('HIGH_PROTEIN');
  const [targetCalories, setTargetCalories] = useState<number>(650);
  const [minProtein, setMinProtein] = useState<number>(40);
  const [dietaryFilter, setDietaryFilter] = useState<'All' | 'Veg' | 'Non-Veg'>('All');
  const [activeComboIndex, setActiveComboIndex] = useState<number>(0);
  const [addedToCart, setAddedToCart] = useState<boolean>(false);

  const currentMenuItemsList: FoodItem[] = useMemo(() => {
    const windowList = (window as any).sizzleMenuItems || [];
    return windowList.length >= 20 ? windowList : MENU_ITEMS;
  }, [isOpen]);

  const generatedMeal = useMemo(() => {
    return buildMacroMeal(
      {
        targetCalories,
        minProtein,
        dietaryFilter,
        preset,
      },
      currentMenuItemsList
    );
  }, [targetCalories, minProtein, dietaryFilter, preset, currentMenuItemsList]);

  const currentCombo = useMemo(() => {
    if (generatedMeal.topCombos && generatedMeal.topCombos[activeComboIndex]) {
      return generatedMeal.topCombos[activeComboIndex];
    }
    return {
      id: 'combo-1',
      title: 'Option 1: AI Recommended Meal',
      badge: '🥇 AI Chef Choice',
      matchScore: generatedMeal.matchScore,
      totalCalories: generatedMeal.totalCalories,
      totalProtein: generatedMeal.totalProtein,
      totalCarbs: generatedMeal.totalCarbs,
      totalFat: generatedMeal.totalFat,
      totalPrice: generatedMeal.totalPrice,
      items: generatedMeal.items,
      explanation: generatedMeal.explanation,
    };
  }, [generatedMeal, activeComboIndex]);

  if (!isOpen) return null;

  const handleSelectPreset = (p: FitnessPreset) => {
    setPreset(p);
    setActiveComboIndex(0);
    setAddedToCart(false);
    if (p === 'HIGH_PROTEIN') {
      setTargetCalories(700);
      setMinProtein(48);
    } else if (p === 'KETO') {
      setTargetCalories(550);
      setMinProtein(38);
    } else if (p === 'LOW_CALORIE') {
      setTargetCalories(420);
      setMinProtein(24);
    } else {
      setTargetCalories(600);
      setMinProtein(32);
    }
  };

  const handleAddComboToCart = () => {
    currentCombo.items.forEach(({ foodItem, quantity }) => {
      addItem(foodItem, quantity);
    });
    setAddedToCart(true);
    showToast(`Added AI ${preset.replace('_', ' ')} Combo (${currentCombo.badge}) to Cart!`);
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
      <div
        onClick={(e) => e.stopPropagation()}
        className={`rounded-3xl max-w-2xl w-full relative font-['Plus_Jakarta_Sans'] overflow-hidden my-auto ${theme.container}`}
      >
        <div className="max-h-[85vh] overflow-y-auto overflow-x-hidden p-5 sm:p-6 space-y-5 custom-modal-scrollbar">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-[#E85D04]/15 rounded-full blur-3xl pointer-events-none" />

        <div className={`flex items-start justify-between pb-4 border-b ${theme.headerBorder} relative z-10`}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#E85D04] text-white rounded-2xl shadow-lg animate-bounce">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-[#E85D04]/20 text-[#E85D04] border border-[#E85D04]/40 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  AI Smart Dining
                </span>
                <span className={`text-xs ${theme.subtitleText}`}>Sizzle Macro Engine</span>
              </div>
              <h2 className={`text-lg sm:text-xl font-extrabold font-['Poppins'] mt-1 ${theme.titleText}`}>
                AI Nutrition &amp; Fitness Meal Builder
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

        <div className="space-y-3 relative z-10">
          <label className={`text-xs font-extrabold uppercase tracking-wider block ${theme.labelTitle}`}>
            1. Select Fitness Goal Preset
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <button
              type="button"
              onClick={() => handleSelectPreset('HIGH_PROTEIN')}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between h-24 ${
                preset === 'HIGH_PROTEIN' ? theme.presetBtnActive : theme.presetBtnInactive
              }`}
            >
              <Dumbbell className="w-5 h-5" />
              <div>
                <div className="text-xs font-bold">High Protein</div>
                <div className="text-[10px] opacity-80">&gt;45g Muscle Fuel</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleSelectPreset('KETO')}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between h-24 ${
                preset === 'KETO' ? theme.presetBtnActive : theme.presetBtnInactive
              }`}
            >
              <Flame className="w-5 h-5" />
              <div>
                <div className="text-xs font-bold">Keto Low-Carb</div>
                <div className="text-[10px] opacity-80">&lt;35g Net Carbs</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleSelectPreset('LOW_CALORIE')}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between h-24 ${
                preset === 'LOW_CALORIE' ? theme.presetBtnActive : theme.presetBtnInactive
              }`}
            >
              <Salad className="w-5 h-5" />
              <div>
                <div className="text-xs font-bold">Low Calorie</div>
                <div className="text-[10px] opacity-80">&lt;450 kcal Light</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleSelectPreset('BALANCED')}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between h-24 ${
                preset === 'BALANCED' ? theme.presetBtnActive : theme.presetBtnInactive
              }`}
            >
              <Scale className="w-5 h-5" />
              <div>
                <div className="text-xs font-bold">Balanced Meal</div>
                <div className="text-[10px] opacity-80">Optimal Ratio</div>
              </div>
            </button>
          </div>
        </div>

        <div className={`p-4 rounded-2xl space-y-4 relative z-10 ${theme.filterBoxBg}`}>
          <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 border-b ${theme.headerBorder} pb-3`}>
            <span className={`text-xs font-bold ${theme.labelTitle}`}>Dietary Preference:</span>
            <div className={`flex items-center gap-1.5 p-1 rounded-xl border text-xs font-bold ${theme.dishCardBg}`}>
              <button
                type="button"
                onClick={() => setDietaryFilter('All')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  dietaryFilter === 'All' ? 'bg-[#E85D04] text-white' : theme.filterBtnInactive
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setDietaryFilter('Veg')}
                className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${
                  dietaryFilter === 'Veg' ? 'bg-[#22C55E] text-white' : theme.filterBtnInactive
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                Veg Only
              </button>
              <button
                type="button"
                onClick={() => setDietaryFilter('Non-Veg')}
                className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${
                  dietaryFilter === 'Non-Veg' ? 'bg-[#EF4444] text-white' : theme.filterBtnInactive
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
                Non-Veg
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <div className="flex justify-between font-bold mb-1">
                <span className={theme.sliderMutedText}>Target Energy:</span>
                <span className="text-[#E85D04] font-extrabold">{targetCalories} kcal</span>
              </div>
              <input
                type="range"
                min={300}
                max={1200}
                step={25}
                value={targetCalories}
                onChange={(e) => {
                  setTargetCalories(Number(e.target.value));
                  setAddedToCart(false);
                }}
                className="w-full accent-[#E85D04] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between font-bold mb-1">
                <span className={theme.sliderMutedText}>Minimum Protein:</span>
                <span className="text-[#3B82F6] font-extrabold">{minProtein}g Protein</span>
              </div>
              <input
                type="range"
                min={10}
                max={80}
                step={5}
                value={minProtein}
                onChange={(e) => {
                  setMinProtein(Number(e.target.value));
                  setAddedToCart(false);
                }}
                className="w-full accent-[#3B82F6] cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="space-y-3 relative z-10">
          <div className="flex items-center justify-between">
            <label className={`text-xs font-extrabold uppercase tracking-wider block ${theme.labelTitle}`}>
              3. AI Suggested Gourmet Combos (Select Option)
            </label>
            <span className="text-[10px] text-[#22C55E] font-bold">
              {generatedMeal.topCombos.length} Distinct AI Options
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {generatedMeal.topCombos.map((combo, idx) => (
              <button
                key={combo.id}
                type="button"
                onClick={() => {
                  setActiveComboIndex(idx);
                  setAddedToCart(false);
                }}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  activeComboIndex === idx ? theme.comboTabActive : theme.comboTabInactive
                }`}
              >
                <div className="text-[10px] font-extrabold uppercase tracking-wider truncate">
                  {combo.badge}
                </div>
                <div className="mt-1 flex items-center justify-between text-xs">
                  <span className="font-extrabold">{combo.totalProtein}g Prot</span>
                  <span className="font-bold opacity-90">₹{combo.totalPrice}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className={`rounded-2xl p-5 space-y-4 shadow-xl relative z-10 ${theme.selectedCardBg}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/40 font-extrabold text-[11px] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" />
                {currentCombo.matchScore}% Palate &amp; Macro Match
              </span>
            </div>
            <div className="text-right">
              <span className={`text-[10px] block uppercase font-bold ${theme.dishMutedText}`}>Combo Price</span>
              <span className="text-xl font-extrabold text-[#22C55E] font-['Poppins']">
                ₹{currentCombo.totalPrice.toFixed(2)}
              </span>
            </div>
          </div>

          <p className={`text-xs italic p-2.5 rounded-xl border ${theme.quoteBg}`}>
            &ldquo;{currentCombo.explanation}&rdquo;
          </p>

          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className={`p-2 rounded-xl border ${theme.statBoxBg}`}>
              <span className={`block text-[10px] uppercase font-bold ${theme.dishMutedText}`}>Calories</span>
              <span className="font-extrabold text-[#E85D04] text-sm">{currentCombo.totalCalories} kcal</span>
            </div>
            <div className={`p-2 rounded-xl border ${theme.statBoxBg}`}>
              <span className={`block text-[10px] uppercase font-bold ${theme.dishMutedText}`}>Protein</span>
              <span className="font-extrabold text-[#3B82F6] text-sm">{currentCombo.totalProtein}g</span>
            </div>
            <div className={`p-2 rounded-xl border ${theme.statBoxBg}`}>
              <span className={`block text-[10px] uppercase font-bold ${theme.dishMutedText}`}>Carbs</span>
              <span className="font-extrabold text-[#F59E0B] text-sm">{currentCombo.totalCarbs}g</span>
            </div>
            <div className={`p-2 rounded-xl border ${theme.statBoxBg}`}>
              <span className={`block text-[10px] uppercase font-bold ${theme.dishMutedText}`}>Fat</span>
              <span className="font-extrabold text-[#EF4444] text-sm">{currentCombo.totalFat}g</span>
            </div>
          </div>

          <div className={`space-y-2 pt-2 border-t ${theme.headerBorder}`}>
            <span className={`text-[11px] font-extrabold uppercase tracking-wider block ${theme.dishMutedText}`}>
              Dishes in this AI Meal Combo ({currentCombo.items.length}):
            </span>
            <div className="space-y-2">
              {currentCombo.items.map(({ foodItem, quantity }) => {
                const itemMacroStats = getItemMacros(foodItem);
                return (
                  <div
                    key={foodItem.id}
                    className={`flex items-center justify-between p-2.5 rounded-xl border ${theme.dishCardBg}`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={foodItem.image}
                        alt={foodItem.name}
                        className="w-10 h-10 object-cover rounded-lg shrink-0"
                      />
                      <div>
                        <h4 className={`text-xs font-bold flex items-center gap-1.5 ${theme.dishTitle}`}>
                          <span className={`w-2 h-2 rounded-full ${foodItem.isVeg ? 'bg-emerald-500' : 'bg-red-500'}`} />
                          {foodItem.name} x{quantity}
                        </h4>
                        <span className={`text-[10px] ${theme.dishMutedText}`}>
                          {itemMacroStats.calories} kcal | {itemMacroStats.protein}g Protein | {foodItem.category}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-[#22C55E]">
                      ₹{(foodItem.price * quantity).toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

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
            onClick={handleAddComboToCart}
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
                <span>Added to Cart Successfully!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-5 h-5" />
                <span>Add {currentCombo.badge.split(' ')[0]} Combo to Cart (₹{currentCombo.totalPrice.toFixed(2)}) &rarr;</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  </div>
);
};
