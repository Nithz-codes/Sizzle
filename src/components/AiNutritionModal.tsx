import React, { useState, useMemo } from 'react';
import { useCart } from '../context/CartContext';
import { buildMacroMeal } from '../services/macroAiBuilder';
import { FitnessPreset, FoodItem } from '../types';
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

interface AiNutritionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiNutritionModal: React.FC<AiNutritionModalProps> = ({ isOpen, onClose }) => {
  const { addItem, showToast } = useCart();

  const [preset, setPreset] = useState<FitnessPreset>('HIGH_PROTEIN');
  const [targetCalories, setTargetCalories] = useState<number>(650);
  const [minProtein, setMinProtein] = useState<number>(40);
  const [dietaryFilter, setDietaryFilter] = useState<'All' | 'Veg' | 'Non-Veg'>('All');
  const [addedToCart, setAddedToCart] = useState<boolean>(false);

  // Available menu items array from global window or static backup
  const currentMenuItemsList: FoodItem[] = useMemo(() => {
    return (window as any).sizzleMenuItems || [];
  }, [isOpen]);

  // Compute live AI macro meal solution
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

  if (!isOpen) return null;

  const handleSelectPreset = (p: FitnessPreset) => {
    setPreset(p);
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
    generatedMeal.items.forEach(({ foodItem, quantity }) => {
      addItem(foodItem, quantity);
    });
    setAddedToCart(true);
    showToast(`Added AI ${preset.replace('_', ' ')} Macro Meal to Cart!`);
    setTimeout(() => {
      onClose();
      setAddedToCart(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#1E293B] border-2 border-[#E85D04]/60 rounded-3xl max-w-2xl w-full p-6 sm:p-8 text-[#F9FAFB] shadow-2xl space-y-6 relative overflow-hidden font-['Plus_Jakarta_Sans']">
        
        {/* Glowing Background Accent */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-[#E85D04]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#374151] relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#E85D04] text-white rounded-2xl shadow-lg animate-bounce">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-[#E85D04]/20 text-[#E85D04] border border-[#E85D04]/40 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  AI Smart Dining
                </span>
                <span className="text-xs text-[#9CA3AF]">Sizzle Macro Engine</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white font-['Poppins'] mt-1">
                AI Nutrition &amp; Fitness Meal Builder
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#9CA3AF] hover:text-white hover:bg-[#374151] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Fitness Goal Presets */}
        <div className="space-y-3 relative z-10">
          <label className="text-xs font-extrabold uppercase tracking-wider text-[#D1D5DB] block">
            1. Select Fitness Goal Preset
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <button
              type="button"
              onClick={() => handleSelectPreset('HIGH_PROTEIN')}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between h-24 ${
                preset === 'HIGH_PROTEIN'
                  ? 'bg-[#E85D04] border-[#E85D04] text-white shadow-lg scale-102 font-bold'
                  : 'bg-[#111827] border-[#374151] text-[#D1D5DB] hover:border-[#E85D04]/50'
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
                preset === 'KETO'
                  ? 'bg-[#E85D04] border-[#E85D04] text-white shadow-lg scale-102 font-bold'
                  : 'bg-[#111827] border-[#374151] text-[#D1D5DB] hover:border-[#E85D04]/50'
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
                preset === 'LOW_CALORIE'
                  ? 'bg-[#E85D04] border-[#E85D04] text-white shadow-lg scale-102 font-bold'
                  : 'bg-[#111827] border-[#374151] text-[#D1D5DB] hover:border-[#E85D04]/50'
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
                preset === 'BALANCED'
                  ? 'bg-[#E85D04] border-[#E85D04] text-white shadow-lg scale-102 font-bold'
                  : 'bg-[#111827] border-[#374151] text-[#D1D5DB] hover:border-[#E85D04]/50'
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

        {/* 2. Target Sliders &amp; Dietary Preference */}
        <div className="bg-[#111827] border border-[#374151] p-4 rounded-2xl space-y-4 relative z-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#374151] pb-3">
            <span className="text-xs font-bold text-[#D1D5DB]">Dietary Preference:</span>
            <div className="flex items-center gap-1.5 bg-[#1E293B] p-1 rounded-xl border border-[#374151] text-xs font-bold">
              <button
                type="button"
                onClick={() => setDietaryFilter('All')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  dietaryFilter === 'All' ? 'bg-[#E85D04] text-white' : 'text-[#9CA3AF]'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setDietaryFilter('Veg')}
                className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${
                  dietaryFilter === 'Veg' ? 'bg-[#22C55E] text-white' : 'text-[#9CA3AF]'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                Veg Only
              </button>
              <button
                type="button"
                onClick={() => setDietaryFilter('Non-Veg')}
                className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${
                  dietaryFilter === 'Non-Veg' ? 'bg-[#EF4444] text-white' : 'text-[#9CA3AF]'
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
                <span className="text-[#9CA3AF]">Target Energy:</span>
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
                <span className="text-[#9CA3AF]">Minimum Protein:</span>
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

        {/* 3. Generated AI Meal Solution Card */}
        <div className="bg-gradient-to-br from-[#111827] to-[#1F2937] border-2 border-[#E85D04]/50 rounded-2xl p-5 space-y-4 shadow-xl relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/40 font-extrabold text-[11px] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" />
                {generatedMeal.matchScore}% Palate &amp; Macro Match
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[#9CA3AF] block uppercase font-bold">Combo Price</span>
              <span className="text-xl font-extrabold text-[#22C55E] font-['Poppins']">
                ₹{generatedMeal.totalPrice.toFixed(2)}
              </span>
            </div>
          </div>

          <p className="text-xs text-[#D1D5DB] italic bg-[#1E293B]/60 p-2.5 rounded-xl border border-[#374151]">
            &ldquo;{generatedMeal.explanation}&rdquo;
          </p>

          {/* Macro Progress Stats */}
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="bg-[#1E293B] p-2 rounded-xl border border-[#374151]">
              <span className="block text-[10px] text-[#9CA3AF] uppercase font-bold">Calories</span>
              <span className="font-extrabold text-[#E85D04] text-sm">{generatedMeal.totalCalories} kcal</span>
            </div>
            <div className="bg-[#1E293B] p-2 rounded-xl border border-[#374151]">
              <span className="block text-[10px] text-[#9CA3AF] uppercase font-bold">Protein</span>
              <span className="font-extrabold text-[#3B82F6] text-sm">{generatedMeal.totalProtein}g</span>
            </div>
            <div className="bg-[#1E293B] p-2 rounded-xl border border-[#374151]">
              <span className="block text-[10px] text-[#9CA3AF] uppercase font-bold">Carbs</span>
              <span className="font-extrabold text-[#F59E0B] text-sm">{generatedMeal.totalCarbs}g</span>
            </div>
            <div className="bg-[#1E293B] p-2 rounded-xl border border-[#374151]">
              <span className="block text-[10px] text-[#9CA3AF] uppercase font-bold">Fat</span>
              <span className="font-extrabold text-[#EF4444] text-sm">{generatedMeal.totalFat}g</span>
            </div>
          </div>

          {/* Meal Items Preview */}
          <div className="space-y-2 pt-2 border-t border-[#374151]">
            <span className="text-[11px] font-extrabold uppercase text-[#9CA3AF] tracking-wider block">
              Dishes in this AI Meal Combo ({generatedMeal.items.length}):
            </span>
            <div className="space-y-2">
              {generatedMeal.items.map(({ foodItem, quantity }) => (
                <div
                  key={foodItem.id}
                  className="flex items-center justify-between bg-[#1E293B] p-2.5 rounded-xl border border-[#374151]"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={foodItem.image}
                      alt={foodItem.name}
                      className="w-10 h-10 object-cover rounded-lg shrink-0"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${foodItem.isVeg ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        {foodItem.name} x{quantity}
                      </h4>
                      <span className="text-[10px] text-[#9CA3AF]">
                        {foodItem.calories} kcal | {foodItem.protein}g Protein | {foodItem.category}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-[#22C55E]">
                    ₹{(foodItem.price * quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Action Button */}
        <button
          type="button"
          onClick={handleAddComboToCart}
          disabled={addedToCart}
          className={`w-full py-3.5 rounded-2xl font-extrabold text-sm transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer ${
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
              <span>Add AI Macro Meal to Cart (₹{generatedMeal.totalPrice.toFixed(2)}) &rarr;</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
