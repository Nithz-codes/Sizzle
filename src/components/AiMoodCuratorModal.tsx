import React, { useState, useMemo, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { curateMoodFeast } from '../services/moodAiCurator';
import { generateGeminiMoodFeast, getStoredApiKey, saveStoredApiKey } from '../services/geminiAiService';
import { MoodOccasion, MoodFeastResponse } from '../types';
import { MODAL_THEMES } from './AiNutritionModal';
import { AiEngineToggle, AiEngineMode } from './AiEngineToggle';
import {
  X,
  Sparkles,
  CloudRain,
  Dumbbell,
  Film,
  Heart,
  Briefcase,
  PartyPopper,
  ShoppingBag,
  CheckCircle2,
  Send,
  Zap,
  ArrowLeft,
} from 'lucide-react';

interface AiMoodCuratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBackToHub?: () => void;
}

export const AiMoodCuratorModal: React.FC<AiMoodCuratorModalProps> = ({ isOpen, onClose, onBackToHub }) => {
  const { addItem, showToast } = useCart();
  const theme = MODAL_THEMES[MODAL_THEMES.active];

  const [selectedMood, setSelectedMood] = useState<MoodOccasion>('RAINY_DAY');
  const [customPromptInput, setCustomPromptInput] = useState<string>('');
  const [activeCustomPrompt, setActiveCustomPrompt] = useState<string>('');
  const [activeComboIndex, setActiveComboIndex] = useState<number>(0);
  const [addedToCart, setAddedToCart] = useState<boolean>(false);

  // Dual-Engine AI Mode State
  const [engineMode, setEngineMode] = useState<AiEngineMode>('LOCAL');
  const [apiKey, setApiKey] = useState<string>(getStoredApiKey());
  const [geminiMoodState, setGeminiMoodState] = useState<MoodFeastResponse | null>(null);

  // Compute live AI mood solution
  const localMoodResult = useMemo(() => {
    return curateMoodFeast(selectedMood, activeCustomPrompt);
  }, [selectedMood, activeCustomPrompt]);

  useEffect(() => {
    if (engineMode === 'GEMINI') {
      generateGeminiMoodFeast(selectedMood, activeCustomPrompt)
        .then((res) => setGeminiMoodState(res))
        .catch(() => setGeminiMoodState(null));
    } else {
      setGeminiMoodState(null);
    }
  }, [engineMode, selectedMood, activeCustomPrompt]);

  const moodResult = engineMode === 'GEMINI' && geminiMoodState ? geminiMoodState : localMoodResult;

  const currentCombo = useMemo(() => {
    if (moodResult.combos && moodResult.combos[activeComboIndex]) {
      return moodResult.combos[activeComboIndex];
    }
    return moodResult.combos[0];
  }, [moodResult, activeComboIndex]);

  if (!isOpen) return null;

  const handleSelectMoodCard = (m: MoodOccasion) => {
    setSelectedMood(m);
    setActiveCustomPrompt('');
    setCustomPromptInput('');
    setActiveComboIndex(0);
    setAddedToCart(false);
  };

  const handleCustomPromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPromptInput.trim()) return;
    setActiveCustomPrompt(customPromptInput.trim());
    setActiveComboIndex(0);
    setAddedToCart(false);
  };

  const handleAddFeastToCart = () => {
    currentCombo.items.forEach(({ foodItem, quantity }) => {
      addItem(foodItem, quantity);
    });
    setAddedToCart(true);
    showToast(`Added ${currentCombo.badge} to Cart!`);
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
      {/* Outer Modal Container with Overflow Hidden */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`rounded-3xl max-w-2xl w-full relative font-['Plus_Jakarta_Sans'] overflow-hidden my-auto ${theme.container}`}
      >
        {/* Inner Scrollable Area */}
        <div className="max-h-[85vh] overflow-y-auto overflow-x-hidden p-5 sm:p-6 space-y-5 custom-modal-scrollbar">
          {/* Glowing Ambient Accent */}
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
                <div className="p-1.5 bg-[#E85D04] text-white rounded-xl shadow-md shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="bg-[#E85D04]/20 text-[#E85D04] border border-[#E85D04]/40 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  AI Sensory Dining
                </span>
                <span className={`text-xs ${theme.subtitleText}`}>Sizzle Mood Curator</span>
              </div>
              <h2 className={`text-xl sm:text-2xl font-extrabold font-['Poppins'] ${theme.titleText}`}>
                AI Mood &amp; Occasion Menu Curator
              </h2>
            </div>
          </div>

          {/* Dual-Engine Mode Switcher Toggle */}
          <div className="relative z-10">
            <AiEngineToggle
              mode={engineMode}
              onModeChange={(m) => setEngineMode(m)}
              apiKey={apiKey}
              onSaveApiKey={(k) => {
                setApiKey(k);
                saveStoredApiKey(k);
                showToast('Gemini API Key Saved!');
              }}
            />
          </div>

          {/* 1. Mood Cards Selector */}
          <div className="space-y-3 relative z-10">
            <label className={`text-xs font-extrabold uppercase tracking-wider block ${theme.labelTitle}`}>
              1. Select How You Feel / Dining Occasion
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => handleSelectMoodCard('RAINY_DAY')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between h-22 ${
                  selectedMood === 'RAINY_DAY' && !activeCustomPrompt
                    ? theme.presetBtnActive
                    : theme.presetBtnInactive
                }`}
              >
                <div className="flex items-center justify-between">
                  <CloudRain className="w-5 h-5 text-[#3B82F6]" />
                  <span className="text-[10px] opacity-75 font-bold">Weather</span>
                </div>
                <div>
                  <div className="text-xs font-bold">Rainy Day Comfort</div>
                  <div className="text-[10px] opacity-80">Hot Steaming Dum</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectMoodCard('POST_WORKOUT')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between h-22 ${
                  selectedMood === 'POST_WORKOUT' && !activeCustomPrompt
                    ? theme.presetBtnActive
                    : theme.presetBtnInactive
                }`}
              >
                <div className="flex items-center justify-between">
                  <Dumbbell className="w-5 h-5 text-[#22C55E]" />
                  <span className="text-[10px] opacity-75 font-bold">Fitness</span>
                </div>
                <div>
                  <div className="text-xs font-bold">Post-Workout Fuel</div>
                  <div className="text-[10px] opacity-80">High-Protein Grills</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectMoodCard('LATE_NIGHT')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between h-22 ${
                  selectedMood === 'LATE_NIGHT' && !activeCustomPrompt
                    ? theme.presetBtnActive
                    : theme.presetBtnInactive
                }`}
              >
                <div className="flex items-center justify-between">
                  <Film className="w-5 h-5 text-[#A855F7]" />
                  <span className="text-[10px] opacity-75 font-bold">Midnight</span>
                </div>
                <div>
                  <div className="text-xs font-bold">Late Night Binge</div>
                  <div className="text-[10px] opacity-80">Cheesy Smash &amp; Wings</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectMoodCard('ROMANTIC_DATE')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between h-22 ${
                  selectedMood === 'ROMANTIC_DATE' && !activeCustomPrompt
                    ? theme.presetBtnActive
                    : theme.presetBtnInactive
                }`}
              >
                <div className="flex items-center justify-between">
                  <Heart className="w-5 h-5 text-[#EC4899]" />
                  <span className="text-[10px] opacity-75 font-bold">Date Night</span>
                </div>
                <div>
                  <div className="text-xs font-bold">Romantic Date</div>
                  <div className="text-[10px] opacity-80">Gourmet Pasta &amp; Cake</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectMoodCard('BUSY_WORKDAY')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between h-22 ${
                  selectedMood === 'BUSY_WORKDAY' && !activeCustomPrompt
                    ? theme.presetBtnActive
                    : theme.presetBtnInactive
                }`}
              >
                <div className="flex items-center justify-between">
                  <Briefcase className="w-5 h-5 text-[#F59E0B]" />
                  <span className="text-[10px] opacity-75 font-bold">Express</span>
                </div>
                <div>
                  <div className="text-xs font-bold">Busy Workday</div>
                  <div className="text-[10px] opacity-80">10-Min Fast Lunch</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectMoodCard('FESTIVE_PARTY')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between h-22 ${
                  selectedMood === 'FESTIVE_PARTY' && !activeCustomPrompt
                    ? theme.presetBtnActive
                    : theme.presetBtnInactive
                }`}
              >
                <div className="flex items-center justify-between">
                  <PartyPopper className="w-5 h-5 text-[#E85D04]" />
                  <span className="text-[10px] opacity-75 font-bold">Party</span>
                </div>
                <div>
                  <div className="text-xs font-bold">Festive Party</div>
                  <div className="text-[10px] opacity-80">Grand Celebration</div>
                </div>
              </button>
            </div>
          </div>

          {/* 2. Custom Free-Text Mood Box */}
          <form onSubmit={handleCustomPromptSubmit} className="space-y-2 relative z-10">
            <label className={`text-xs font-extrabold uppercase tracking-wider block ${theme.labelTitle}`}>
              Or Type Custom Natural Mood Prompt
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customPromptInput}
                onChange={(e) => setCustomPromptInput(e.target.value)}
                placeholder="e.g. Stressed after work, want hot cheesy pasta..."
                className={`flex-1 px-4 py-2.5 rounded-xl border text-xs outline-none transition-all ${theme.dishCardBg} ${theme.dishTitle} focus:border-[#E85D04]`}
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-[#E85D04] hover:bg-[#C94B00] text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Curate</span>
              </button>
            </div>
          </form>

          {/* 3. AI Curated Combos Header */}
          <div className="space-y-3 relative z-10">
            <div className="flex items-center justify-between">
              <label className={`text-xs font-extrabold uppercase tracking-wider block ${theme.labelTitle}`}>
                3. AI Curated Occasion Feasts ({moodResult.combos.length} Options)
              </label>
              <span className="text-[10px] text-[#22C55E] font-bold">100% Sensory Match</span>
            </div>

            {/* Option Tabs */}
            <div className="grid grid-cols-3 gap-2">
              {moodResult.combos.map((combo, idx) => (
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
                    <span className="font-extrabold">{combo.vibeTag}</span>
                    <span className="font-bold opacity-90">₹{combo.totalPrice}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Occasion Combo Card */}
          <div className={`rounded-2xl p-5 space-y-4 shadow-xl relative z-10 ${theme.selectedCardBg}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/40 font-extrabold text-[11px] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" />
                  98% Palate &amp; Mood Match
                </span>
                <span className="bg-[#E85D04]/20 text-[#E85D04] border border-[#E85D04]/40 font-bold text-[10px] px-2 py-0.5 rounded-full">
                  {currentCombo.vibeTag}
                </span>
              </div>
              <div className="text-right">
                <span className={`text-[10px] block uppercase font-bold ${theme.dishMutedText}`}>Feast Price</span>
                <span className="text-xl font-extrabold text-[#22C55E] font-['Poppins']">
                  ₹{currentCombo.totalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Chef Mario Comfort Quote */}
            <p className={`text-xs italic p-3 rounded-xl border ${theme.quoteBg}`}>
              &ldquo;{currentCombo.chefQuote}&rdquo;
            </p>

            {/* Dish Items List */}
            <div className={`space-y-2 pt-2 border-t ${theme.headerBorder}`}>
              <span className={`text-[11px] font-extrabold uppercase tracking-wider block ${theme.dishMutedText}`}>
                Dishes in this Mood Feast ({currentCombo.items.length}):
              </span>
              <div className="space-y-2">
                {currentCombo.items.map(({ foodItem, quantity }) => (
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
                          {foodItem.calories || 400} kcal | {foodItem.protein || 20}g Protein | {foodItem.category}
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
              onClick={handleAddFeastToCart}
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
                  <span>Added Mood Feast to Cart!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  <span>Add {currentCombo.badge.split(' ')[0]} Mood Feast (₹{currentCombo.totalPrice.toFixed(2)}) &rarr;</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
