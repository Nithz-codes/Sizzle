import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Sparkles,
  Camera,
  Upload,
  Flame,
  Dumbbell,
  CheckCircle2,
  ArrowLeft,
  ShoppingBag,
  Zap,
  Award,
  RefreshCw,
  Search,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { FoodItem, VisionScanResult } from '../types';
import { MODAL_THEMES } from './AiNutritionModal';
import { AiEngineToggle, AiEngineMode } from './AiEngineToggle';
import { getStoredApiKey, saveStoredApiKey } from '../services/geminiAiService';
import { analyzeFoodImage, SAMPLE_VISION_PHOTOS } from '../services/visionAiEngine';

interface AiVisionScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBackToHub?: () => void;
}

export const AiVisionScannerModal: React.FC<AiVisionScannerModalProps> = ({
  isOpen,
  onClose,
  onBackToHub,
}) => {
  const { addItem, showToast } = useCart();
  const theme = MODAL_THEMES[MODAL_THEMES.active];
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [engineMode, setEngineMode] = useState<AiEngineMode>('LOCAL');
  const [apiKey, setApiKey] = useState<string>(getStoredApiKey());

  const [selectedImage, setSelectedImage] = useState<string>(SAMPLE_VISION_PHOTOS[0].imageUrl);
  const [imageHint, setImageHint] = useState<string>(SAMPLE_VISION_PHOTOS[0].sampleDishName);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<VisionScanResult | null>(null);
  const [addedItemIds, setAddedItemIds] = useState<number[]>([]);

  // Trigger analysis whenever selected image changes
  const runAnalysis = async (imgUrl: string, hint: string) => {
    setIsScanning(true);
    setScanResult(null);

    try {
      const res = await analyzeFoodImage(imgUrl, engineMode, hint);
      setScanResult(res);
    } catch (err) {
      console.warn('Vision scan error:', err);
    } finally {
      setIsScanning(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      runAnalysis(selectedImage, imageHint);
    }
  }, [isOpen, selectedImage, engineMode]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setSelectedImage(base64);
        setImageHint(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectSample = (imageUrl: string, dishName: string) => {
    setSelectedImage(imageUrl);
    setImageHint(dishName);
  };

  const handleAddToCart = (item: FoodItem) => {
    addItem(item, 1);
    setAddedItemIds((prev) => [...prev, item.id]);
    showToast(`Added ${item.name} to Cart!`);
    setTimeout(() => {
      setAddedItemIds((prev) => prev.filter((id) => id !== item.id));
    }, 2000);
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
          {/* Ambient Glow Accent */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Modal Header (2-Row Standard Layout) */}
          <div className={`pb-4 border-b ${theme.headerBorder} relative z-10 space-y-3`}>
            {/* Row 1: Back Button (Left) & Close Button (Right) */}
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
                <div className="p-1.5 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-xl shadow-md shrink-0">
                  <Camera className="w-4 h-4" />
                </div>
                <span className="bg-emerald-500/20 text-emerald-700 border border-emerald-500/40 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Sizzle Vision AI
                </span>
                <span className={`text-xs ${theme.subtitleText}`}>Multimodal Plate Inspector</span>
              </div>
              <h2 className={`text-xl sm:text-2xl font-extrabold font-['Poppins'] ${theme.titleText}`}>
                📸 AI Food Plate Photo Scanner
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

          {/* Image Scanner & Upload Dropzone */}
          <div className={`p-4 rounded-2xl border relative z-10 space-y-4 ${theme.filterBoxBg}`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-emerald-700">
                <Upload className="w-3.5 h-3.5" />
                1. Upload Meal Photo or Choose Sample
              </span>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer hover:scale-105"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Upload Food Photo</span>
              </button>
            </div>

            {/* Photo Preview Container with Scanner Laser Beam */}
            <div className="relative rounded-2xl overflow-hidden h-48 sm:h-56 bg-slate-900 flex items-center justify-center border-2 border-emerald-500/40 shadow-inner">
              <img
                src={selectedImage}
                alt="Selected Food Plate"
                className="w-full h-full object-cover opacity-90"
              />
              {/* Scanning Beam Overlay */}
              {isScanning && (
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-400/30 to-transparent animate-pulse pointer-events-none flex items-center justify-center">
                  <div className="bg-emerald-600/90 text-white px-4 py-2 rounded-full font-extrabold text-xs shadow-xl backdrop-blur-md flex items-center gap-2 animate-bounce">
                    <Sparkles className="w-4 h-4 animate-spin text-amber-200" />
                    <span>Analyzing Plate &amp; Calculating Macros...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Demo Sample Selector */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                Or Try Sample Food Photos:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {SAMPLE_VISION_PHOTOS.map((sample) => (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => handleSelectSample(sample.imageUrl, sample.sampleDishName)}
                    className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                      selectedImage === sample.imageUrl
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-md scale-102 font-bold'
                        : 'bg-white/80 hover:bg-white text-gray-700 border-gray-200 shadow-xs'
                    }`}
                  >
                    <img
                      src={sample.imageUrl}
                      alt={sample.title}
                      className="w-8 h-8 rounded-lg object-cover shrink-0"
                    />
                    <span className="text-[11px] font-extrabold truncate">{sample.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Analysis Results Dashboard */}
          {scanResult && !isScanning && (
            <div className="space-y-4 relative z-10 animate-in fade-in duration-300">
              {/* Dish Recognized Banner */}
              <div className={`p-4 rounded-2xl border space-y-2 ${theme.selectedCardBg}`}>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      {scanResult.confidenceScore}% Confidence Match
                    </span>
                    <span className="bg-amber-500/20 text-amber-800 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {scanResult.healthGrade}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => runAnalysis(selectedImage, imageHint)}
                    className="text-xs text-emerald-700 font-extrabold flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Rescan
                  </button>
                </div>

                <h3 className="text-lg sm:text-xl font-black text-[#1E1E1E]">
                  🎯 Detected: {scanResult.recognizedDishName}
                </h3>
                <p className="text-xs text-gray-600">{scanResult.summary}</p>
                <p className="text-xs text-emerald-800 font-semibold italic bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-200/60">
                  {scanResult.chefInsights}
                </p>
              </div>

              {/* Macro Nutrition Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className={`p-3 rounded-2xl border text-center ${theme.statBoxBg}`}>
                  <span className="text-[10px] font-bold text-gray-500 uppercase flex items-center justify-center gap-1">
                    <Flame className="w-3 h-3 text-[#E85D04]" /> Calories
                  </span>
                  <p className="text-base sm:text-lg font-black text-[#E85D04] mt-0.5">
                    {scanResult.estimatedCalories} <span className="text-xs font-normal">kcal</span>
                  </p>
                </div>
                <div className={`p-3 rounded-2xl border text-center ${theme.statBoxBg}`}>
                  <span className="text-[10px] font-bold text-gray-500 uppercase flex items-center justify-center gap-1">
                    <Dumbbell className="w-3 h-3 text-emerald-600" /> Protein
                  </span>
                  <p className="text-base sm:text-lg font-black text-emerald-600 mt-0.5">
                    {scanResult.proteinGrams} <span className="text-xs font-normal">g</span>
                  </p>
                </div>
                <div className={`p-3 rounded-2xl border text-center ${theme.statBoxBg}`}>
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Carbs</span>
                  <p className="text-base sm:text-lg font-black text-blue-600 mt-0.5">
                    {scanResult.carbsGrams} <span className="text-xs font-normal">g</span>
                  </p>
                </div>
                <div className={`p-3 rounded-2xl border text-center ${theme.statBoxBg}`}>
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Healthy Fat</span>
                  <p className="text-base sm:text-lg font-black text-purple-600 mt-0.5">
                    {scanResult.fatGrams} <span className="text-xs font-normal">g</span>
                  </p>
                </div>
              </div>

              {/* Matched Sizzle Menu Items & 1-Tap Cart Order */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                  <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" />
                  Matched Sizzle Menu Items (Ready to Order):
                </h4>

                <div className="space-y-2">
                  {scanResult.matchedItems.map(({ foodItem, similarityScore, matchReason }) => {
                    const isAdded = addedItemIds.includes(foodItem.id);
                    return (
                      <div
                        key={foodItem.id}
                        className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition-all hover:shadow-md ${theme.dishCardBg}`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={foodItem.image}
                            alt={foodItem.name}
                            className="w-12 h-12 rounded-xl object-cover shrink-0 border border-gray-200"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-extrabold text-[#1E1E1E] truncate">
                                {foodItem.name}
                              </span>
                              <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.2 rounded-full shrink-0">
                                {similarityScore}% Match
                              </span>
                            </div>
                            <p className="text-[11px] text-gray-500 truncate">{matchReason}</p>
                            <div className="flex items-center gap-2 text-[11px] text-gray-600 mt-0.5">
                              <span className="font-extrabold text-emerald-700">₹{foodItem.price}</span>
                              <span>•</span>
                              <span>{foodItem.calories} kcal</span>
                              <span>•</span>
                              <span>{foodItem.protein}g protein</span>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleAddToCart(foodItem)}
                          className={`px-3 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-sm ${
                            isAdded
                              ? 'bg-emerald-700 text-white'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:scale-105'
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Added!</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>Add to Cart</span>
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
