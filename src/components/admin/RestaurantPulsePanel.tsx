import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Info,
  RotateCcw,
  Flame,
  PieChart as PieChartIcon,
  BarChart3,
  Clock,
  Layers,
  Award,
  Zap,
} from 'lucide-react';
import { intelligenceApi, RestaurantPulseData } from '../../services/api';

export const RestaurantPulsePanel: React.FC = () => {
  const [period, setPeriod] = useState<'today' | '7days' | '30days'>('7days');
  const [loading, setLoading] = useState<boolean>(true);
  const [pulse, setPulse] = useState<RestaurantPulseData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infographicTab, setInfographicTab] = useState<'category' | 'hourly' | 'dishes' | 'revenue'>('category');

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

  // Find max values for progress/bar normalization
  const maxHourlyOrders = pulse?.hourlyDistribution
    ? Math.max(...pulse.hourlyDistribution.map((h) => h.orderCount), 1)
    : 1;

  const maxRevenue = pulse?.revenueTrends
    ? Math.max(...pulse.revenueTrends.map((d) => d.revenue), 1)
    : 1;

  const maxDishSold = pulse?.topPerformingDishes
    ? Math.max(...pulse.topPerformingDishes.map((d) => d.quantitySold), 1)
    : 1;

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
              Restaurant Pulse Analytics &amp; Infographics
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

          {/* ========================================================================= */}
          {/* SECTION 2: PULSE INFOGRAPHICS DASHBOARD */}
          {/* ========================================================================= */}
          <div className="bg-[#111827]/90 border border-[#374151] rounded-2xl p-4 sm:p-6 space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#374151]/70 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#F9FAFB] font-['Poppins'] flex items-center gap-2">
                    <span>Operational Infographics &amp; Visual Telemetry</span>
                    <span className="text-[10px] bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30 uppercase tracking-wider font-extrabold">
                      Live Charts
                    </span>
                  </h3>
                  <p className="text-xs text-[#9CA3AF]">
                    Interactive graphical charts derived from verified restaurant transactions
                  </p>
                </div>
              </div>

              {/* Infographic Tabs */}
              <div className="flex items-center gap-1 bg-[#1E293B] p-1 rounded-xl border border-[#374151] text-xs font-bold self-stretch sm:self-auto overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setInfographicTab('category')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                    infographicTab === 'category'
                      ? 'bg-[#F97316] text-white shadow-xs'
                      : 'text-[#9CA3AF] hover:text-[#F9FAFB]'
                  }`}
                >
                  <PieChartIcon className="w-3.5 h-3.5" />
                  <span>Category Mix</span>
                </button>

                <button
                  type="button"
                  onClick={() => setInfographicTab('hourly')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                    infographicTab === 'hourly'
                      ? 'bg-[#F97316] text-white shadow-xs'
                      : 'text-[#9CA3AF] hover:text-[#F9FAFB]'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Hourly Pace</span>
                </button>

                <button
                  type="button"
                  onClick={() => setInfographicTab('dishes')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                    infographicTab === 'dishes'
                      ? 'bg-[#F97316] text-white shadow-xs'
                      : 'text-[#9CA3AF] hover:text-[#F9FAFB]'
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Top Dishes</span>
                </button>

                <button
                  type="button"
                  onClick={() => setInfographicTab('revenue')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                    infographicTab === 'revenue'
                      ? 'bg-[#F97316] text-white shadow-xs'
                      : 'text-[#9CA3AF] hover:text-[#F9FAFB]'
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Revenue Trend</span>
                </button>
              </div>
            </div>

            {/* Tab 1: Category Share Breakdown */}
            {infographicTab === 'category' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#D1D5DB] font-semibold">
                    Demand share across culinary categories
                  </span>
                  <span className="text-[11px] text-[#F97316] font-bold">
                    {pulse.categoryBreakdown?.length || 0} active categories
                  </span>
                </div>

                {pulse.categoryBreakdown && pulse.categoryBreakdown.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Visual Progress Bars */}
                    <div className="space-y-3 bg-[#1E293B]/60 p-4 rounded-xl border border-[#374151]">
                      {pulse.categoryBreakdown.map((cat, idx) => {
                        const colors = [
                          'bg-gradient-to-r from-[#F97316] to-[#FB923C]',
                          'bg-gradient-to-r from-emerald-500 to-teal-400',
                          'bg-gradient-to-r from-blue-500 to-indigo-400',
                          'bg-gradient-to-r from-purple-500 to-pink-500',
                          'bg-gradient-to-r from-amber-500 to-yellow-400',
                        ];
                        const barColor = colors[idx % colors.length];

                        return (
                          <div key={idx} className="space-y-1.5">
                            <div className="flex justify-between items-center text-xs">
                              <span className="font-bold text-[#F9FAFB]">
                                {cat.categoryName}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="text-[#9CA3AF]">
                                  {cat.itemsSold} sold (₹{cat.totalRevenue.toFixed(0)})
                                </span>
                                <span className="font-extrabold text-[#F97316]">
                                  {cat.percentageShare}%
                                </span>
                              </div>
                            </div>
                            <div className="w-full bg-[#111827] h-2.5 rounded-full overflow-hidden border border-[#374151]/60">
                              <div
                                className={`${barColor} h-full rounded-full transition-all duration-700`}
                                style={{ width: `${Math.max(cat.percentageShare, 6)}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Stacked Proportional Color Bar & Insight Card */}
                    <div className="bg-[#1E293B]/60 p-4 rounded-xl border border-[#374151] flex flex-col justify-between space-y-4">
                      <div>
                        <h4 className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider mb-2">
                          Cumulative Portfolio Composition
                        </h4>
                        
                        {/* Segmented bar */}
                        <div className="w-full h-4 rounded-xl overflow-hidden flex bg-[#111827] border border-[#374151] p-0.5 gap-0.5">
                          {pulse.categoryBreakdown.map((cat, idx) => {
                            const segmentColors = ['bg-[#F97316]', 'bg-emerald-500', 'bg-blue-500', 'bg-purple-500', 'bg-amber-500'];
                            return (
                              <div
                                key={idx}
                                className={`${segmentColors[idx % segmentColors.length]} h-full rounded-xs transition-all`}
                                style={{ width: `${Math.max(cat.percentageShare, 4)}%` }}
                                title={`${cat.categoryName}: ${cat.percentageShare}%`}
                              />
                            );
                          })}
                        </div>

                        {/* Legend */}
                        <div className="flex flex-wrap gap-2.5 mt-3">
                          {pulse.categoryBreakdown.map((cat, idx) => {
                            const legendColors = ['bg-[#F97316]', 'bg-emerald-500', 'bg-blue-500', 'bg-purple-500', 'bg-amber-500'];
                            return (
                              <div key={idx} className="flex items-center gap-1.5 text-[11px] text-[#D1D5DB]">
                                <span className={`w-2.5 h-2.5 rounded-full ${legendColors[idx % legendColors.length]}`} />
                                <span>{cat.categoryName} ({cat.percentageShare}%)</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="p-3 bg-[#111827]/80 rounded-xl border border-[#374151] flex items-center gap-2.5">
                        <Zap className="w-4 h-4 text-[#F97316] shrink-0" />
                        <p className="text-xs text-[#D1D5DB] leading-snug">
                          <strong>Portfolio Health:</strong> Leading category represents{' '}
                          <span className="text-[#F97316] font-bold">
                            {pulse.categoryBreakdown[0]?.percentageShare || 0}%
                          </span>{' '}
                          of all ordered items. Cross-promote secondary categories to balance kitchen workstation loads.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-[#9CA3AF] italic text-center py-4">
                    No category distribution data available for this timeframe.
                  </p>
                )}
              </div>
            )}

            {/* Tab 2: Hourly Demand Distribution */}
            {infographicTab === 'hourly' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#D1D5DB] font-semibold">
                    24-Hour Dining Pace &amp; Kitchen Order Inflow
                  </span>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1 text-[#F97316] font-bold">
                      <span className="w-2 h-2 rounded-full bg-[#F97316]" />
                      Peak: {pulse.peakHour}
                    </span>
                    <span className="flex items-center gap-1 text-[#9CA3AF]">
                      <span className="w-2 h-2 rounded-full bg-[#4B5563]" />
                      Slow: {pulse.slowHour}
                    </span>
                  </div>
                </div>

                {pulse.hourlyDistribution && pulse.hourlyDistribution.length > 0 ? (
                  <div className="bg-[#1E293B]/60 p-4 rounded-xl border border-[#374151] space-y-3">
                    {/* Hourly Histogram Chart */}
                    <div className="h-32 flex items-end justify-between gap-1 pt-6 px-1 border-b border-[#374151]/80">
                      {pulse.hourlyDistribution.map((h) => {
                        const heightPct = Math.round((h.orderCount / maxHourlyOrders) * 100);
                        const isPeak = h.orderCount === maxHourlyOrders && h.orderCount > 0;
                        const hasOrders = h.orderCount > 0;

                        return (
                          <div
                            key={h.hour}
                            className="flex-1 flex flex-col items-center justify-end h-full group relative cursor-pointer"
                          >
                            {/* Hover Tooltip */}
                            <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-[#111827] text-white text-[10px] font-bold px-2 py-1 rounded-md border border-[#374151] whitespace-nowrap z-20 shadow-lg">
                              {h.hour}:00 — {h.orderCount} orders (₹{h.totalRevenue.toFixed(0)})
                            </div>

                            <div
                              className={`w-full rounded-t-sm transition-all duration-300 ${
                                isPeak
                                  ? 'bg-[#F97316] shadow-sm shadow-[#F97316]/40'
                                  : hasOrders
                                  ? 'bg-[#FB923C]/70 group-hover:bg-[#F97316]'
                                  : 'bg-[#374151]/40 group-hover:bg-[#4B5563]'
                              }`}
                              style={{ height: `${Math.max(heightPct, 6)}%` }}
                            />
                          </div>
                        );
                      })}
                    </div>

                    {/* Hour Labels */}
                    <div className="flex justify-between text-[9px] text-[#9CA3AF] font-bold px-0.5">
                      <span>00:00</span>
                      <span>04:00</span>
                      <span>08:00</span>
                      <span>12:00</span>
                      <span>16:00</span>
                      <span>20:00</span>
                      <span>23:00</span>
                    </div>

                    <div className="p-3 bg-[#111827]/80 rounded-xl border border-[#374151] flex items-center justify-between text-xs">
                      <span className="text-[#9CA3AF]">
                        Operational Rush Window: <strong className="text-[#F9FAFB]">{pulse.peakHour}</strong>
                      </span>
                      <span className="text-[#F97316] font-extrabold">
                        Peak Ticket Volume: {maxHourlyOrders} orders/hr
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-[#9CA3AF] italic text-center py-4">
                    No hourly demand recorded in this window.
                  </p>
                )}
              </div>
            )}

            {/* Tab 3: Top Performing Dishes */}
            {infographicTab === 'dishes' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#D1D5DB] font-semibold">
                    Top Demand Drivers &amp; Revenue Anchors
                  </span>
                  <span className="text-[11px] text-[#9CA3AF]">
                    Ranked by verified unit sales
                  </span>
                </div>

                {pulse.topPerformingDishes && pulse.topPerformingDishes.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {pulse.topPerformingDishes.map((dish, idx) => {
                      const sharePct = Math.round((dish.quantitySold / maxDishSold) * 100);

                      return (
                        <div
                          key={dish.menuItemId || idx}
                          className="bg-[#1E293B]/80 border border-[#374151] hover:border-[#F97316]/50 p-3.5 rounded-2xl flex flex-col justify-between space-y-3 transition-all"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="space-y-0.5">
                              <span className="text-[10px] font-black uppercase tracking-wider text-[#F97316]">
                                #{idx + 1} Best Seller
                              </span>
                              <h4 className="text-sm font-bold text-[#F9FAFB] line-clamp-1">
                                {dish.dishName}
                              </h4>
                              <span className="text-[11px] text-[#9CA3AF]">
                                {dish.categoryName}
                              </span>
                            </div>

                            <span className="w-8 h-8 rounded-xl bg-[#F97316]/20 text-[#F97316] font-black text-xs flex items-center justify-center shrink-0 border border-[#F97316]/30">
                              {dish.quantitySold}x
                            </span>
                          </div>

                          <div className="space-y-1.5 pt-1">
                            <div className="flex justify-between items-center text-[11px]">
                              <span className="text-[#9CA3AF]">Volume Share</span>
                              <span className="font-extrabold text-[#F9FAFB]">
                                ₹{dish.totalRevenue.toFixed(0)}
                              </span>
                            </div>
                            <div className="w-full bg-[#111827] h-2 rounded-full overflow-hidden border border-[#374151]/60">
                              <div
                                className="bg-gradient-to-r from-[#F97316] to-[#EA580C] h-full rounded-full transition-all duration-500"
                                style={{ width: `${Math.max(sharePct, 8)}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-[#9CA3AF] italic text-center py-4">
                    No menu sales data recorded in this timeframe.
                  </p>
                )}
              </div>
            )}

            {/* Tab 4: Revenue Trend */}
            {infographicTab === 'revenue' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#D1D5DB] font-semibold">
                    Daily Financial Velocity &amp; Transaction Counts
                  </span>
                  <span className="text-[11px] text-emerald-400 font-bold">
                    Total: ₹{pulse.totalRevenue.toFixed(2)}
                  </span>
                </div>

                {pulse.revenueTrends && pulse.revenueTrends.length > 0 ? (
                  <div className="bg-[#1E293B]/60 p-4 rounded-xl border border-[#374151] space-y-4">
                    <div className="h-32 flex items-end justify-between gap-2 pt-6 px-2 border-b border-[#374151]/80">
                      {pulse.revenueTrends.map((trend, idx) => {
                        const heightPct = Math.round((trend.revenue / maxRevenue) * 100);

                        return (
                          <div
                            key={idx}
                            className="flex-1 flex flex-col items-center justify-end h-full group relative cursor-pointer"
                          >
                            <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-[#111827] text-white text-[10px] font-bold px-2 py-1 rounded-md border border-[#374151] whitespace-nowrap z-20 shadow-lg">
                              {trend.date}: ₹{trend.revenue.toFixed(0)} ({trend.orderCount} orders)
                            </div>

                            <div
                              className="w-full max-w-[40px] rounded-t-md bg-gradient-to-t from-[#10B981] to-[#34D399] transition-all duration-300 group-hover:from-[#F97316] group-hover:to-[#FB923C]"
                              style={{ height: `${Math.max(heightPct, 8)}%` }}
                            />
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex justify-between text-[10px] text-[#9CA3AF] font-bold px-1">
                      {pulse.revenueTrends.map((trend, idx) => (
                        <span key={idx} className="truncate max-w-[60px]">
                          {trend.date.slice(5)}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-[#9CA3AF] italic text-center py-4">
                    No daily revenue history recorded in this window.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Section 3: Key Operational Insights */}
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

          {/* Section 4: Actionable Recommendations */}
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
