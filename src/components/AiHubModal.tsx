import React from 'react';
import { MODAL_THEMES } from './AiNutritionModal';
import {
  X,
  Sparkles,
  Zap,
  Gift,
  CloudRain,
  Dumbbell,
  ArrowRight,
  Flame,
  Camera,
} from 'lucide-react';

interface AiHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectUsual: () => void;
  onSelectSurprise: () => void;
  onSelectMood: () => void;
  onSelectNutrition: () => void;
  onSelectVision: () => void;
}

export const AiHubModal: React.FC<AiHubModalProps> = ({
  isOpen,
  onClose,
  onSelectUsual,
  onSelectSurprise,
  onSelectMood,
  onSelectNutrition,
  onSelectVision,
}) => {
  const theme = MODAL_THEMES[MODAL_THEMES.active];

  if (!isOpen) return null;

  const aiFeatures = [
    {
      id: 'vision',
      title: ' Sizzle Vision AI Scanner',
      subtitle: 'Multimodal Photo Inspector',
      description:
        'Upload or snap a photo of any meal to instantly detect calories, protein, macros & order matching Sizzle dishes!',
      icon: Camera,
      gradient: 'from-emerald-600 to-teal-600',
      badge: '📸 Photo Scanner',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      action: () => {
        onClose();
        onSelectVision();
      },
    },
    {
      id: 'usual',
      title: 'AI One-Tap "Usual Feast"',
      subtitle: 'Smart Reordering Engine',
      description:
        'Instantly reorders your favorite dishes based on your order history and habitual dining time.',
      icon: Zap,
      gradient: 'from-red-500 to-rose-600',
      badge: '⚡ 1-Tap Reorder',
      badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
      action: () => {
        onClose();
        onSelectUsual();
      },
    },
    {
      id: 'surprise',
      title: 'AI "Surprise Me" Mystery Box',
      subtitle: 'Taste Discovery Engine',
      description:
        'Unbox a 2-3 dish mystery meal bundle tailored to your budget and vibe with an instant 10% discount!',
      icon: Gift,
      gradient: 'from-emerald-500 to-teal-600',
      badge: '🎁 10% OFF Deal',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      action: () => {
        onClose();
        onSelectSurprise();
      },
    },
    {
      id: 'mood',
      title: 'AI Mood & Occasion Curator',
      subtitle: 'Sensory Flavor Vector Engine',
      description:
        'Curates meals matched to your current mood, weather, post-workout, or custom craving prompt.',
      icon: CloudRain,
      gradient: 'from-blue-600 to-cyan-600',
      badge: '🌧️ Mood Matching',
      badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
      action: () => {
        onClose();
        onSelectMood();
      },
    },
    {
      id: 'nutrition',
      title: 'AI Fitness & Macro Meal Builder',
      subtitle: 'Bounded Optimization Solver',
      description:
        'Builds meal combos matched to your exact target calories, protein, keto, or low-calorie goals.',
      icon: Dumbbell,
      gradient: 'from-purple-600 to-indigo-600',
      badge: '🏋️ Macro Solver',
      badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
      action: () => {
        onClose();
        onSelectNutrition();
      },
    },
  ];

  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 ${theme.backdrop} animate-in fade-in duration-200 overflow-y-auto overflow-x-hidden`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`rounded-3xl max-w-2xl w-full relative font-['Plus_Jakarta_Sans'] overflow-hidden my-auto ${theme.container}`}
      >
        <div className="max-h-[85vh] overflow-y-auto overflow-x-hidden p-5 sm:p-6 space-y-6 custom-modal-scrollbar">
          {/* Glowing Ambient Accent */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-[#E85D04]/15 rounded-full blur-3xl pointer-events-none" />

          {/* Modal Header */}
          <div className={`flex items-start justify-between pb-4 border-b ${theme.headerBorder} relative z-10`}>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-tr from-[#E85D04] to-[#D97706] text-white rounded-2xl shadow-lg animate-bounce">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-[#E85D04]/20 text-[#E85D04] border border-[#E85D04]/40 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Sizzle AI Suite
                  </span>
                  <span className={`text-xs ${theme.subtitleText}`}>Dual-Engine Powered</span>
                </div>
                <h2 className={`text-xl sm:text-2xl font-extrabold font-['Poppins'] mt-1 ${theme.titleText}`}>
                  ✨ Sizzle AI Dining Studio
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

          <p className="text-xs sm:text-sm text-gray-600 font-medium relative z-10">
            Select an AI feature below to curate your personalized gourmet dining experience:
          </p>

          {/* 2x2 Feature Selector Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
            {aiFeatures.map((feat) => {
              const IconComponent = feat.icon;
              return (
                <div
                  key={feat.id}
                  onClick={feat.action}
                  className="group relative p-4 rounded-2xl bg-white/70 backdrop-blur-md border border-white/80 hover:border-[#E85D04]/60 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`p-2.5 rounded-xl bg-gradient-to-r ${feat.gradient} text-white shadow-md group-hover:scale-110 transition-all`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${feat.badgeBg}`}>
                        {feat.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-extrabold text-gray-900 font-['Poppins'] group-hover:text-[#E85D04] transition-colors">
                        {feat.title}
                      </h3>
                      <p className="text-[11px] font-bold text-[#E85D04] mb-1">
                        {feat.subtitle}
                      </p>
                      <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                        {feat.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-gray-700 group-hover:text-[#E85D04]">
                    <span>Launch Tool</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
