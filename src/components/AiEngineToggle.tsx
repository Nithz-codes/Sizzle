import React from 'react';
import { Zap, Sparkles } from 'lucide-react';

export type AiEngineMode = 'LOCAL' | 'GEMINI';

interface AiEngineToggleProps {
  mode: AiEngineMode;
  onModeChange: (mode: AiEngineMode) => void;
}

export const AiEngineToggle: React.FC<AiEngineToggleProps> = ({
  mode,
  onModeChange,
}) => {
  return (
    <div className="flex items-center justify-between gap-2 p-1.5 rounded-2xl bg-white/60 backdrop-blur-md border border-white/80 shadow-xs">
      {/* Mode Buttons */}
      <div className="flex items-center gap-1.5 bg-gray-200/70 p-1 rounded-xl w-full sm:w-auto">
        <button
          type="button"
          onClick={() => onModeChange('LOCAL')}
          className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            mode === 'LOCAL'
              ? 'bg-[#E85D04] text-white shadow-md scale-102'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Zap className="w-3.5 h-3.5 fill-current text-amber-200" />
          <span>⚡ Local Solver (0ms)</span>
        </button>

        <button
          type="button"
          onClick={() => onModeChange('GEMINI')}
          className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            mode === 'GEMINI'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md scale-102'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-200 animate-spin" />
          <span>✨ Gemini 1.5 AI</span>
        </button>
      </div>

      <div className="hidden sm:flex items-center gap-1 text-[11px] text-gray-500 font-medium pr-2">
        <span>{mode === 'GEMINI' ? 'Cloud AI Mode Active' : '0ms Instant Mode'}</span>
      </div>
    </div>
  );
};
