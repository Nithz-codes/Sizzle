import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Users,
  IndianRupee,
  Clock,
  Flame,
  Check,
  ShoppingBag,
  ArrowRight,
  RotateCcw,
  AlertCircle,
  ChefHat,
  Tag,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { intelligenceApi, MealOptimizationData, MealOptimizationParams } from '../services/api';
import { FoodItem } from '../types';

interface BuildMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemsList: FoodItem[];
}

const CATEGORY_CHIPS = [
  { id: 'Biryani', label: 'Biryani' },
  { id: 'Pizza', label: 'Pizza' },
  { id: 'Burger', label: 'Burgers' },
  { id: 'Pasta', label: 'Pasta' },
  { id: 'Indian Curry', label: 'Curries' },
  { id: 'Grill', label: 'Grills & Tandoor' },
  { id: 'Starters', label: 'Starters' },
  { id: 'Dessert', label: 'Desserts' },
  { id: 'Beverage', label: 'Beverages' },
];

export const BuildMealModal: React.FC<BuildMealModalProps> = ({ isOpen, onClose, itemsList }) => {
  const { addItem, setIsCartOpen, showToast } = useCart();

  // Form State
  const [peopleCount, setPeopleCount] = useState<number>(2);
  const [budget, setBudget] = useState<number>(700);
  const [dietary, setDietary] = useState<'ANY' | 'VEG_ONLY' | 'NON_VEG' | 'MIXED_ONE_VEG'>('MIXED_ONE_VEG');
  const [spicy, setSpicy] = useState<'ANY' | 'MILD' | 'MEDIUM' | 'SPICY'>('ANY');
  const [maxPrep, setMaxPrep] = useState<number | undefined>(undefined);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [freeText, setFreeText] = useState<string>('');

  // Execution State
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<MealOptimizationData | null>(null);

  if (!isOpen) return null;

  const handleCategoryToggle = (catId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(catId) ? prev.filter((c) => c !== catId) : [...prev, catId]
    );
  };

  const handleOptimize = async () => {
    if (!budget || budget < 50) {
      setErrorMsg('Please enter a budget of at least ₹50');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    const params: MealOptimizationParams = {
      peopleCount,
      maxBudget: budget,
      dietaryPreference: dietary,
      spicyPreference: spicy,
      maxPrepTimeMinutes: maxPrep,
      preferredCategories: selectedCategories.length > 0 ? selectedCategories : undefined,
      freeTextRequest: freeText.trim() ? freeText.trim() : undefined,
    };

    try {
      const res = await intelligenceApi.optimizeMeal(params);
      if (res.success && res.data) {
        setResult(res.data);
      } else {
        setErrorMsg(res.message || 'Failed to optimize meal basket');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to connect to Sizzle Intelligence optimizer');
    } finally {
      setLoading(false);
    }
  };

  const handleAddBasketToCart = () => {
    if (!result || !result.items || result.items.length === 0) return;

    let addedCount = 0;
    result.items.forEach((item) => {
      const matchingFood = itemsList.find((f) => f.id === item.menuItemId);
      const foodItem: FoodItem = matchingFood || {
        id: item.menuItemId,
        name: item.name,
        category: item.category,
        price: item.price,
        description: item.reason || '',
        image: item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
        isVeg: item.isVeg,
        spicyLevel: item.spicyLevel,
      };

      addItem(foodItem, item.quantity);
      addedCount += item.quantity;
    });

    showToast(`Added ${result.items.length} dishes (${addedCount} items) to your order cart!`);
    onClose();
    setIsCartOpen(true);
  };

  const handleReset = () => {
    setResult(null);
    setErrorMsg(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#FFFDF8] border border-stone-200 rounded-3xl shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col">

        {/* Header */}
        <div className="px-5 py-4 sm:px-6 sm:py-5 bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white flex items-center justify-between shrink-0 border-b border-stone-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E85D04] flex items-center justify-center text-white shadow-md shadow-[#E85D04]/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[#E85D04]/20 text-[#FEB157] px-2 py-0.5 rounded-full border border-[#E85D04]/40">
                  Sizzle Intelligence
                </span>
                <span className="text-[11px] text-stone-400 hidden sm:inline">• Live Menu Optimizer</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold font-['Poppins'] tracking-tight">
                Build My Meal
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 custom-scrollbar">

          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* VIEW 1: RESULT VIEW */}
          {result && !loading ? (
            <div className="space-y-5 animate-fadeIn">

              {/* Summary Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50/40 border border-orange-200/80 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-xl bg-[#E85D04] text-white">
                      <Sparkles className="w-4 h-4" />
                    </span>
                    <span className="text-xs font-bold text-stone-800 tracking-tight">
                      Curated by Sizzle Intelligence
                    </span>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${result.confidence === 'HIGH'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                    }`}>
                    {result.confidence} Confidence
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-medium">
                  {result.summary}
                </p>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-orange-200/60 text-center">
                  <div className="p-2.5 rounded-xl bg-white/90 border border-orange-100 shadow-2xs">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Total Price</span>
                    <span className="text-base font-extrabold text-[#E85D04]">₹{result.totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/90 border border-orange-100 shadow-2xs">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Budget Left</span>
                    <span className="text-base font-bold text-emerald-600">₹{result.budgetRemaining.toFixed(2)}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/90 border border-orange-100 shadow-2xs">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Estimated Prep</span>
                    <span className="text-base font-bold text-stone-800">~{result.estimatedPreparationMinutes} min</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/90 border border-orange-100 shadow-2xs">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">For Party</span>
                    <span className="text-base font-bold text-stone-800">{result.peopleCount} {result.peopleCount === 1 ? 'person' : 'people'}</span>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 font-['Poppins']">
                  Recommended Basket Dishes ({result.items.length})
                </h3>

                {result.items.length === 0 ? (
                  <div className="p-6 text-center text-stone-500 bg-white rounded-2xl border border-stone-200">
                    <p className="text-sm">No dishes could fit your strict criteria.</p>
                    <button
                      onClick={handleReset}
                      className="mt-3 text-xs text-[#E85D04] font-bold underline cursor-pointer"
                    >
                      Adjust budget or filters
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {result.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 sm:p-4 rounded-2xl bg-white border border-stone-200/90 shadow-2xs hover:shadow-xs transition-all flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover shrink-0 border border-stone-200"
                            />
                          )}
                          <div className="min-w-0 space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-bold text-stone-900 truncate">
                                {item.name}
                              </span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-stone-100 text-stone-600">
                                {item.isVeg ? '🌱 Veg' : '🍗 Non-Veg'}
                              </span>
                              {item.spicyLevel !== undefined && item.spicyLevel > 1 && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-red-50 text-red-600">
                                  🔥 Spicy
                                </span>
                              )}
                            </div>
                            {item.reason && (
                              <p className="text-[11px] text-stone-500 line-clamp-1">
                                {item.reason}
                              </p>
                            )}
                            <div className="text-xs text-stone-400">
                              ₹{item.price.toFixed(2)} × {item.quantity}
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="font-extrabold text-stone-900 text-sm sm:text-base">
                            ₹{item.lineTotal.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAddBasketToCart}
                  disabled={result.items.length === 0}
                  className="flex-1 bg-[#E85D04] hover:bg-[#C94B00] text-white font-bold py-3.5 px-5 rounded-2xl shadow-md shadow-[#E85D04]/25 flex items-center justify-center gap-2 text-sm transition-all cursor-pointer active:scale-98 disabled:opacity-50"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add Recommended Basket to Cart (₹{result.totalPrice.toFixed(2)})</span>
                </button>

                <button
                  onClick={handleReset}
                  className="px-5 py-3.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Modify Criteria</span>
                </button>
              </div>

            </div>
          ) : (
            /* VIEW 2: INPUT FORM */
            <div className="space-y-6">

              {/* Number of People */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#E85D04]" />
                  <span>Number of People</span>
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setPeopleCount(num)}
                      className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${peopleCount === num
                        ? 'bg-[#1E1E1E] text-white shadow-xs'
                        : 'bg-white text-stone-700 border border-stone-200 hover:border-orange-300'
                        }`}
                    >
                      {num} {num === 1 ? 'Person' : 'People'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
                    <IndianRupee className="w-3.5 h-3.5 text-[#E85D04]" />
                    <span>Maximum Budget</span>
                  </label>
                  <span className="text-sm font-extrabold text-[#E85D04]">
                    ₹{budget}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={200}
                    max={2500}
                    step={50}
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full accent-[#E85D04] cursor-pointer"
                  />
                  <div className="w-28 relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-stone-400">₹</span>
                    <input
                      type="number"
                      min={50}
                      max={10000}
                      value={budget}
                      onChange={(e) => setBudget(Number(e.target.value))}
                      className="w-full pl-6 pr-2 py-1.5 rounded-xl border border-stone-300 text-xs font-bold text-stone-800 text-right focus:outline-none focus:border-[#E85D04]"
                    />
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[11px] text-stone-400">Presets:</span>
                  {[400, 700, 1000, 1500].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setBudget(preset)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${budget === preset
                        ? 'bg-orange-50 border-orange-400 text-[#E85D04] font-bold'
                        : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                        }`}
                    >
                      ₹{preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dietary Requirements */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-600">
                  Dietary Requirement
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'MIXED_ONE_VEG', label: '🥗 Mixed Dining', sub: 'At least 1 veg + non-veg' },
                    { id: 'VEG_ONLY', label: '🌱 100% Veg', sub: 'Strictly vegetarian' },
                    { id: 'NON_VEG', label: '🍗 Non-Veg', sub: 'Meat & poultry' },
                    { id: 'ANY', label: '✨ Flexible', sub: 'Chef recommendation' },
                  ].map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setDietary(option.id as any)}
                      className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${dietary === option.id
                        ? 'bg-orange-50/80 border-[#E85D04] text-stone-900 shadow-2xs'
                        : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
                        }`}
                    >
                      <div className="text-xs font-bold">{option.label}</div>
                      <div className="text-[10px] text-stone-400 mt-0.5">{option.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Spice Preference & Preparation Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Spice Level */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-red-500" />
                    <span>Spice Level</span>
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { id: 'ANY', label: 'Any' },
                      { id: 'MILD', label: 'Mild' },
                      { id: 'MEDIUM', label: 'Medium' },
                      { id: 'SPICY', label: 'Spicy 🔥' },
                    ].map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSpicy(s.id as any)}
                        className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${spicy === s.id
                          ? 'bg-[#1E1E1E] text-white shadow-2xs'
                          : 'bg-white text-stone-700 border border-stone-200 hover:border-stone-300'
                          }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Max Prep Time */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#E85D04]" />
                    <span>Max Kitchen Time</span>
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { val: undefined, label: 'Any' },
                      { val: 15, label: '15 min' },
                      { val: 20, label: '20 min' },
                      { val: 30, label: '30 min' },
                    ].map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setMaxPrep(p.val)}
                        className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${maxPrep === p.val
                          ? 'bg-[#1E1E1E] text-white shadow-2xs'
                          : 'bg-white text-stone-700 border border-stone-200 hover:border-stone-300'
                          }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Preferred Categories */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-stone-400" />
                  <span>Preferred Categories (Optional)</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORY_CHIPS.map((cat) => {
                    const isSelected = selectedCategories.includes(cat.id);
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleCategoryToggle(cat.id)}
                        className={`text-xs px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${isSelected
                          ? 'bg-[#E85D04] text-white border-[#E85D04] font-bold shadow-2xs'
                          : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'
                          }`}
                      >
                        {cat.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Free-text Request */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-600">
                  Custom Request or Preferences (Natural Language)
                </label>
                <textarea
                  rows={2}
                  value={freeText}
                  onChange={(e) => setFreeText(e.target.value)}
                  placeholder="e.g., Dinner for 3 under ₹900. One vegetarian, one wants spicy food, craving biryani and naan..."
                  className="w-full p-3 rounded-2xl border border-stone-300 bg-white text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#E85D04] transition-all"
                />
              </div>

              {/* Optimize Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleOptimize}
                  disabled={loading}
                  className="w-full bg-[#E85D04] hover:bg-[#C94B00] text-white font-extrabold py-4 px-6 rounded-2xl shadow-lg shadow-[#E85D04]/30 flex items-center justify-center gap-2 text-sm transition-all cursor-pointer active:scale-98 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <ChefHat className="w-5 h-5 animate-spin" />
                      <span>Sizzle Intelligence is analyzing menu &amp; kitchen workload...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 text-amber-200" />
                      <span>Optimize My Meal with Sizzle Intelligence</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};

