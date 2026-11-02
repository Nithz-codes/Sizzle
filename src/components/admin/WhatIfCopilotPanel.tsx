import React, { useState } from 'react';
import {
  Sparkles,
  SlidersHorizontal,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Info,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Send,
  Loader2,
  HelpCircle,
  BarChart3,
  Lightbulb,
  Zap,
} from 'lucide-react';
import { intelligenceApi, WhatIfData } from '../../services/api';

const QUICK_PROMPTS = [
  'What if I give 10% discount on Chicken Biryani?',
  'What happens if order volume increases by 20%?',
  'What if I remove Veg Pasta from the menu?',
  'Which item should I promote this weekend?',
  'What if I give 15% discount on Margherita Pizza?',
];

export const WhatIfCopilotPanel: React.FC = () => {
  const [query, setQuery] = useState<string>('What if I give 10% discount on Chicken Biryani?');
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<WhatIfData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSimulate = async (customQuery?: string) => {
    const q = (customQuery || query).trim();
    if (!q) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await intelligenceApi.simulateWhatIf({ query: q });
      if (res.success && res.data) {
        setData(res.data);
      } else {
        setErrorMsg(res.message || 'Failed to simulate scenario.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not connect to Sizzle Intelligence service.');
    } finally {
      setLoading(false);
    }
  };

  const getScenarioTypeBadge = (type: string) => {
    switch (type) {
      case 'DISCOUNT':
        return (
          <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
            Price / Discount Model
          </span>
        );
      case 'VOLUME_INCREASE':
        return (
          <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            Volume Surge Model
          </span>
        );
      case 'MENU_REMOVAL':
        return (
          <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30">
            Menu Pruning Model
          </span>
        );
      case 'PROMOTION_RECOMMENDATION':
        return (
          <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/30">
            Campaign Promotion
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30">
            Scenario Simulation
          </span>
        );
    }
  };

  return (
    <div className="bg-[#1E293B] border border-[#374151] rounded-3xl p-5 sm:p-7 shadow-xl space-y-6 animate-fadeIn relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-[#F97316]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#374151]">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#EA580C] to-[#C2410C] text-white flex items-center justify-center shadow-lg shadow-[#EA580C]/25 shrink-0">
            <SlidersHorizontal className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-[#F97316]/20 text-[#F97316] px-2.5 py-0.5 rounded-full border border-[#F97316]/30">
                Sizzle Intelligence
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-500/15 text-indigo-400 px-2.5 py-0.5 rounded-full border border-indigo-500/30">
                Decision Support Simulator
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#F9FAFB] font-['Poppins'] tracking-tight">
              Restaurant What-If Copilot
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-[#9CA3AF] bg-[#0F172A]/60 px-3 py-1.5 rounded-xl border border-[#374151]">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Non-Destructive Simulation Only</span>
        </div>
      </div>

      {/* Simulation Prompt Input */}
      <div className="space-y-3">
        <label className="text-xs font-semibold text-[#D1D5DB] flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-[#F97316]" />
          <span>Ask any natural-language scenario or pricing question:</span>
        </label>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSimulate();
              }}
              placeholder="e.g. What if I give 10% discount on Chicken Biryani?"
              className="w-full bg-[#0F172A] border border-[#374151] rounded-2xl px-4 py-3 text-sm text-[#F9FAFB] placeholder-[#6B7280] focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] transition-all"
            />
          </div>
          <button
            onClick={() => handleSimulate()}
            disabled={loading || !query.trim()}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-[#F97316] to-[#EA580C] hover:from-[#EA580C] hover:to-[#C2410C] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#F97316]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer shrink-0"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Simulating...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>Simulate Scenario</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-2 flex-wrap pt-1">
          <span className="text-[11px] text-[#9CA3AF] font-medium">Quick Presets:</span>
          {QUICK_PROMPTS.map((promptText, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setQuery(promptText);
                handleSimulate(promptText);
              }}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-[#0F172A] hover:bg-[#374151] text-[#D1D5DB] border border-[#374151] hover:border-[#F97316]/50 transition-all cursor-pointer truncate max-w-xs"
            >
              {promptText}
            </button>
          ))}
        </div>
      </div>

      {/* Error Banner */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Simulation Result Display */}
      {data && (
        <div className="space-y-5 animate-fadeIn">
          {/* Simulation Header Banner */}
          <div className="p-4 rounded-2xl bg-[#0F172A] border border-[#374151] flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {getScenarioTypeBadge(data.scenarioType)}
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30">
                  {data.source === 'AI' ? 'AI-Verified Decision Model' : 'Deterministic Model'}
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#F9FAFB]">{data.scenario}</h3>
            </div>
            <div className="text-[11px] text-[#9CA3AF]">
              Simulated: {new Date(data.generatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>

          {/* 3-Column Comparative Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. Baseline Actuals */}
            <div className="p-4 rounded-2xl bg-[#0F172A]/80 border border-[#374151] space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF] flex items-center justify-between">
                <span>1. Baseline Actuals</span>
                <span className="text-[10px] font-medium text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                  Historical
                </span>
              </div>
              <div className="text-sm font-semibold text-[#F3F4F6] truncate">
                {data.currentState?.label || 'Current Baseline'}
              </div>
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#9CA3AF]">Order Volume:</span>
                  <span className="font-bold text-[#F9FAFB]">{data.currentState?.orders} orders</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#9CA3AF]">Gross Revenue:</span>
                  <span className="font-bold text-[#F9FAFB]">₹{Number(data.currentState?.revenue || 0).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#9CA3AF]">Avg Price / Ticket:</span>
                  <span className="font-bold text-[#F9FAFB]">₹{Number(data.currentState?.averagePrice || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* 2. Projected Scenario */}
            <div className="p-4 rounded-2xl bg-[#0F172A]/80 border border-[#F97316]/30 space-y-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#F97316]/5 rounded-full blur-xl pointer-events-none" />
              <div className="text-xs font-bold uppercase tracking-wider text-[#F97316] flex items-center justify-between">
                <span>2. Projected Scenario</span>
                <span className="text-[10px] font-medium text-[#F97316] bg-[#F97316]/10 px-2 py-0.5 rounded">
                  Simulated
                </span>
              </div>
              <div className="text-sm font-semibold text-[#F3F4F6] truncate">
                {data.projectedState?.label || 'Projected State'}
              </div>
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#9CA3AF]">Projected Orders:</span>
                  <span className="font-bold text-[#F9FAFB]">{data.projectedState?.orders} orders</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#9CA3AF]">Projected Revenue:</span>
                  <span className="font-bold text-[#F9FAFB]">₹{Number(data.projectedState?.revenue || 0).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#9CA3AF]">Projected Avg Price:</span>
                  <span className="font-bold text-[#F9FAFB]">₹{Number(data.projectedState?.averagePrice || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* 3. Net Impact */}
            <div className="p-4 rounded-2xl bg-[#0F172A]/80 border border-[#374151] space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF] flex items-center justify-between">
                <span>3. Net Impact</span>
                <span className="text-[10px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  Delta
                </span>
              </div>
              <div className="space-y-2 pt-1">
                <div className="p-2 rounded-xl bg-[#1E293B] border border-[#374151] flex items-center justify-between">
                  <span className="text-xs text-[#9CA3AF]">Revenue Impact:</span>
                  <span className="text-xs font-black text-emerald-400">
                    {data.impact?.revenue}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-[#1E293B] border border-[#374151] flex items-center justify-between">
                  <span className="text-xs text-[#9CA3AF]">Order Volume Lift:</span>
                  <span className="text-xs font-black text-blue-400">
                    {data.impact?.orders}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Stated Assumptions Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0F172A]/60 border border-[#374151] space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#9CA3AF]">
              <Info className="w-4 h-4 text-blue-400" />
              <span>Transparent Model Assumptions (Decision Support)</span>
            </div>
            <ul className="space-y-1.5 pl-1">
              {data.assumptions?.map((assumption, idx) => (
                <li key={idx} className="text-xs text-[#D1D5DB] flex items-start gap-2">
                  <span className="text-[#F97316] font-bold">•</span>
                  <span>{assumption}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Strategic Recommendation & Operational Risk */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Recommendation */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-[#F97316]/30 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#F97316] uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Copilot Strategic Recommendation</span>
              </div>
              <p className="text-xs sm:text-sm text-[#E5E7EB] leading-relaxed">
                {data.recommendation}
              </p>
            </div>

            {/* Operational Risk */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-amber-500/30 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" />
                <span>Operational & Margin Risk Assessment</span>
              </div>
              <p className="text-xs sm:text-sm text-[#E5E7EB] leading-relaxed">
                {data.impact?.risk}
              </p>
            </div>
          </div>

          {/* Disclaimer Footer */}
          <div className="text-[11px] text-[#6B7280] italic flex items-center gap-1.5 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>
              Disclaimer: Sizzle Intelligence What-If Copilot provides decision-support simulations only. Numerical projections are deterministic based on historical orders; live menu prices and inventory are never modified.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

