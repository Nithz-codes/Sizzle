import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Info,
  CheckCircle2,
  Calendar,
  RotateCcw,
  DollarSign,
  ShoppingBag,
  Clock,
  PackageAlert,
  ArrowUpRight,
  Flame,
  Award,
} from 'lucide-react';
import { intelligenceApi, RestaurantPulseData, PulseInsightData } from '../../services/api';

export const RestaurantPulsePanel: React.FC = () => {
  const [period, setPeriod] = useState<'today' | '7days' | '30days'>('7days');
  const [loading, setLoading] = useState<boolean>(true);
  const [pulse, setPulse] = useState<RestaurantPulseData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchPulse = async (selectedPeriod: 'today' | '7days' | '30days') => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await intelligenceApi.getRestaurantPulse(selectedPeriod);
      if (res.success && res.data) {
        setPulse(res.data);
      } else {
        setErrorMsg(res.message || 'Failed to load restaurant pulse analytics');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not connect to Sizzle Intelligence service');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPulse(period);
  }, [period]);

  const getSeverityBadge = (severity: 'POSITIVE' | 'WARNING' | 'INFO') => {
    switch (severity) {
      case 'POSITIVE':
        return (
          <span className="flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <TrendingUp className="w-3 h-3" />
            <span>Growth / Positive</span>
          </span>
        );
      case 'WARNING':
        return (
          <span className="flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <AlertTriangle className="w-3 h-3" />
            <span>Attention / Bottleneck</span>
          </span>
        );
      case 'INFO':
      default:
        return (
          <span className="flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30">
            <Info className="w-3 h-3" />
            <span>Operational Info</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-[#1E293B] border border-[#374151] rounded-3xl p-5 sm:p-7 shadow-xl space-y-6 animate-fadeIn relative overflow-hidden">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-[#F97316]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#374151]">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#F97316] to-[#EA580C] text-white flex items-center justify-center shadow-lg shadow-[#F97316]/25 shrink-0">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-[#F97316]/20 text-[#F97316] px-2.5 py-0.5 rounded-full border border-[#F97316]/30">
                Sizzle Intelligence
              </span>
              <span className="text-[11px] text-[#9CA3AF] hidden sm:inline">• Strategic Business Layer</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#F9FAFB] font-['Poppins'] tracking-tight">
              Restaurant Pulse Analytics
            </h2>
          </div>
        </div>

        {/* Date Period Controls & Refresh */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end">
          <div className="bg-[#111827] border border-[#374151] p-1 rounded-xl flex items-center gap-1 text-xs font-bold">
            {[
              { id: 'today', label: 'Today' },
              { id: '7days', label: 'Last 7 Days' },
              { id: '30days', label: 'Last 30 Days' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setPeriod(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  period === tab.id
                    ? 'bg-[#F97316] text-white shadow-xs'
                    : 'text-[#9CA3AF] hover:text-[#F9FAFB]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => fetchPulse(period)}
            disabled={loading}
            className="p-2.5 rounded-xl bg-[#111827] hover:bg-[#374151] text-[#9CA3AF] hover:text-[#F9FAFB] border border-[#374151] transition-all cursor-pointer disabled:opacity-50"
            title="Refresh Pulse Insights"
          >
            <RotateCcw className={`w-4 h-4 ${loading ? 'animate-spin text-[#F97316]' : ''}`} />
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>{errorMsg}</span>
          </div>
          <span className="text-[11px] text-[#9CA3AF]">Displaying baseline verified metrics</span>
        </div>
      )}

      {loading && !pulse ? (
        <div className="py-12 flex flex-col items-center justify-center space-y-3 text-center">
          <Sparkles className="w-8 h-8 text-[#F97316] animate-spin" />
          <p className="text-xs font-semibold text-[#D1D5DB]">
            Sizzle Intelligence is analyzing operational trends &amp; inventory telemetry...
          </p>
        </div>
      ) : pulse ? (
        <div className="space-y-6">

          {/* Core Verified Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="bg-[#111827]/80 border border-[#374151] p-3.5 rounded-2xl space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] block">
                Period Revenue
              </span>
              <span className="text-lg sm:text-xl font-extrabold text-[#F9FAFB]">
                ₹{pulse.totalRevenue.toFixed(2)}
              </span>
            </div>

            <div className="bg-[#111827]/80 border border-[#374151] p-3.5 rounded-2xl space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] block">
                Orders Completed
              </span>
              <span className="text-lg sm:text-xl font-extrabold text-[#F97316]">
                {pulse.totalOrders}
              </span>
            </div>

            <div className="bg-[#111827]/80 border border-[#374151] p-3.5 rounded-2xl space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] block">
                Avg Order Value
              </span>
              <span className="text-lg sm:text-xl font-extrabold text-emerald-400">
                ₹{pulse.averageOrderValue.toFixed(2)}
              </span>
            </div>

            <div className="bg-[#111827]/80 border border-[#374151] p-3.5 rounded-2xl space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] block">
                Peak Service
              </span>
              <span className="text-xs sm:text-sm font-bold text-[#F9FAFB] block mt-1">
                {pulse.peakHour}
              </span>
            </div>

            <div className="bg-[#111827]/80 border border-[#374151] p-3.5 rounded-2xl space-y-1 col-span-2 sm:col-span-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] block">
                Stock Alerts
              </span>
              <span className={`text-lg sm:text-xl font-extrabold ${pulse.lowStockItemsCount > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {pulse.lowStockItemsCount} items
              </span>
            </div>
          </div>

          {/* Section 1: Executive Summary */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#111827] via-[#1E293B] to-[#111827] border border-[#374151] space-y-2">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#F97316]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#D1D5DB] font-['Poppins']">
                Executive Pulse Summary
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[#F9FAFB] leading-relaxed font-medium">
              {pulse.summary}
            </p>
          </div>

          {/* Section 2: Key Operational Insights */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF] font-['Poppins']">
                Key Operational Insights
              </h3>
              <span className="text-[11px] text-[#6B7280]">
                Verified by Sizzle Data Layer
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {pulse.insights.map((insight, idx) => (
                <div
                  key={idx}
                  className="bg-[#111827]/60 border border-[#374151] hover:border-[#F97316]/40 p-4 rounded-2xl space-y-2.5 transition-all"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs sm:text-sm font-bold text-[#F9FAFB] font-['Poppins'] truncate">
                      {insight.title}
                    </h4>
                    {getSeverityBadge(insight.severity)}
                  </div>

                  <p className="text-xs text-[#D1D5DB] leading-relaxed">
                    {insight.description}
                  </p>

                  {insight.evidence && (
                    <div className="pt-2 border-t border-[#374151]/50 text-[11px] text-[#9CA3AF] flex items-center gap-1.5">
                      <span className="font-semibold text-[#F97316]">Evidence:</span>
                      <span className="italic">{insight.evidence}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Actionable Recommendations */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF] font-['Poppins']">
              Actionable Recommendations
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {pulse.recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className="bg-[#111827]/40 border border-[#374151] p-3.5 rounded-xl flex items-start gap-2.5"
                >
                  <span className="w-5 h-5 rounded-lg bg-[#F97316]/20 text-[#F97316] font-extrabold text-[11px] flex items-center justify-center shrink-0 mt-0.5 border border-[#F97316]/30">
                    {idx + 1}
                  </span>
                  <p className="text-xs text-[#E5E7EB] leading-snug">
                    {rec}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Telemetry Note */}
          <div className="pt-2 text-right">
            <span className="text-[10px] text-[#6B7280]">
              Analysis computed via {pulse.source === 'AI' ? 'Sizzle Intelligence Cloud AI' : 'Sizzle Deterministic Analytics Engine'} • Generated {new Date(pulse.generatedAt).toLocaleTimeString()}
            </span>
          </div>

        </div>
      ) : null}

    </div>
  );
};

