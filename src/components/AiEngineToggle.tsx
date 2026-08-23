import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Zap, Sparkles, Key, Check, X, ShieldAlert } from 'lucide-react';

export type AiEngineMode = 'LOCAL' | 'GEMINI';

interface AiEngineToggleProps {
  mode: AiEngineMode;
  onModeChange: (mode: AiEngineMode) => void;
  apiKey: string;
  onSaveApiKey: (key: string) => void;
}

export const AiEngineToggle: React.FC<AiEngineToggleProps> = ({
  mode,
  onModeChange,
  apiKey,
  onSaveApiKey,
}) => {
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [tempKeyInput, setTempKeyInput] = useState(apiKey);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveApiKey(tempKeyInput.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsKeyModalOpen(false);
    }, 800);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-2xl bg-white/60 backdrop-blur-md border border-white/80 shadow-xs">
      {/* Mode Buttons */}
      <div className="flex items-center gap-1.5 bg-gray-200/70 p-1 rounded-xl">
        <button
          type="button"
          onClick={() => onModeChange('LOCAL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
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
          className={`px-3 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
            mode === 'GEMINI'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md scale-102'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-200 animate-spin" />
          <span>✨ Gemini 1.5 AI</span>
        </button>
      </div>

      {/* Key Config Button (Visible when Gemini mode selected) */}
      {mode === 'GEMINI' && (
        <button
          type="button"
          onClick={() => {
            setTempKeyInput(apiKey);
            setIsKeyModalOpen(true);
          }}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer border ${
            apiKey
              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
              : 'bg-amber-50 text-amber-700 border-amber-300 animate-pulse'
          }`}
        >
          <Key className="w-3 h-3" />
          <span>{apiKey ? 'Key Configured ✓' : '🔑 Set Gemini API Key'}</span>
        </button>
      )}

      {/* API Key Modal Popup - Rendered via Portal at document.body with z-[9999] */}
      {isKeyModalOpen &&
        createPortal(
          <div
            onClick={() => setIsKeyModalOpen(false)}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border-2 border-purple-500/40 relative font-['Plus_Jakarta_Sans'] my-auto"
            >
              <button
                type="button"
                onClick={() => setIsKeyModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-100 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-gradient-to-tr from-purple-600 to-indigo-600 text-white rounded-2xl shadow-md">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold font-['Poppins'] text-gray-900">
                    Google Gemini API Key Config
                  </h3>
                  <p className="text-xs text-gray-500">
                    Paste your Google AI Studio API key for Gemini 1.5 Pro / Flash.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Gemini API Key:
                  </label>
                  <input
                    type="password"
                    value={tempKeyInput}
                    onChange={(e) => setTempKeyInput(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full px-4 py-2.5 text-xs font-mono rounded-xl border border-gray-300 focus:border-purple-600 focus:outline-none bg-gray-50 text-gray-900"
                    autoFocus
                  />
                </div>

                <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-[11px] text-purple-900 space-y-1">
                  <div className="flex items-center gap-1 font-bold">
                    <ShieldAlert className="w-3.5 h-3.5 text-purple-600" />
                    <span>Secure Local Storage</span>
                  </div>
                  <p className="opacity-90">
                    Your key is stored safely in your browser&apos;s localStorage and never transmitted to third parties.
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsKeyModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-extrabold shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    {savedSuccess ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-300 animate-bounce" />
                        <span>Key Saved!</span>
                      </>
                    ) : (
                      <span>Save Key</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
