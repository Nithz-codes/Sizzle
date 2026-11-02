import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Info,
  RotateCcw,
  Flame,
  PieChart as PieChartIcon,
  BarChart3,
  Clock,
  Award,
  Zap,
  Calendar,
  Layers,
  ChevronDown,
  CheckCircle2,
  Utensils,
  HelpCircle,
  SlidersHorizontal,
} from 'lucide-react';
import { intelligenceApi, RestaurantPulseData, PulseCategoryShare, PulseTopDish } from '../../services/api';

// Authoritative category colors for consistent data visualization across tabs
const CATEGORY_COLOR_MAP: Record<string, { bg: string; text: string; hex: string; barGrad: string }> = {
  Biryani: { bg: 'bg-orange-500/20', text: 'text-orange-400', hex: '#F97316', barGrad: 'from-orange-500 to-amber-500' },
  Breads: { bg: 'bg-amber-500/20', text: 'text-amber-400', hex: '#EAB308', barGrad: 'from-amber-500 to-yellow-400' },
  Dessert: { bg: 'bg-pink-500/20', text: 'text-pink-400', hex: '#EC4899', barGrad: 'from-pink-500 to-rose-400' },
  'Indian Curry': { bg: 'bg-red-500/20', text: 'text-red-400', hex: '#EF4444', barGrad: 'from-red-500 to-orange-500' },
  Curry: { bg: 'bg-red-500/20', text: 'text-red-400', hex: '#EF4444', barGrad: 'from-red-500 to-orange-500' },
  Pizza: { bg: 'bg-purple-500/20', text: 'text-purple-400', hex: '#8B5CF6', barGrad: 'from-purple-500 to-indigo-500' },
  Burger: { bg: 'bg-blue-500/20', text: 'text-blue-400', hex: '#3B82F6', barGrad: 'from-blue-500 to-cyan-400' },
  Starters: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', hex: '#10B981', barGrad: 'from-emerald-500 to-teal-400' },
  Beverages: { bg: 'bg-cyan-500/20', text: 'text-cyan-400', hex: '#06B6D4', barGrad: 'from-cyan-500 to-sky-400' },
  Chinese: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', hex: '#F59E0B', barGrad: 'from-yellow-500 to-amber-600' },
  Salads: { bg: 'bg-lime-500/20', text: 'text-lime-400', hex: '#84CC16', barGrad: 'from-lime-500 to-emerald-400' },
};

const DEFAULT_CATEGORY_COLOR = {
  bg: 'bg-slate-500/20',
  text: 'text-slate-300',
  hex: '#64748B',
  barGrad: 'from-slate-500 to-zinc-500',
};

export const RestaurantPulsePanel: React.FC = () => {
  // Navigation & Filter States
  const [period, setPeriod] = useState<'today' | '7days' | '30days' | 'all' | 'custom'>('7days');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');
  const [showCustomInputs, setShowCustomInputs] = useState<boolean>(false);

  // Tab & Sub-view States
  const [infographicTab, setInfographicTab] = useState<'category' | 'hourly' | 'dishes' | 'revenue'>('category');
  const [categoryMetric, setCategoryMetric] = useState<'revenue' | 'quantity'>('revenue');
  const [hourlyMetric, setHourlyMetric] = useState<'orders' | 'revenue'>('orders');
  const [dishTab, setDishTab] = useState<'top' | 'bottom'>('top');
  const [revenueTrendMetric, setRevenueTrendMetric] = useState<'revenue' | 'orders'>('revenue');

  // Network & Data States
  const [loading, setLoading] = useState<boolean>(true);
  const [pulse, setPulse] = useState<RestaurantPulseData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const cacheRef = React.useRef<Record<string, RestaurantPulseData>>({});

  const fetchPulse = async (
    selectedPeriod: 'today' | '7days' | '30days' | 'all' | 'custom',
    start?: string,
    end?: string,
    forceRefresh: boolean = false
  ) => {
    const cacheKey = `${selectedPeriod}_${start || ''}_${end || ''}`;
    if (!forceRefresh && cacheRef.current[cacheKey]) {
      setPulse(cacheRef.current[cacheKey]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await intelligenceApi.getRestaurantPulse(
        selectedPeriod,
        selectedPeriod === 'custom' ? start : undefined,
        selectedPeriod === 'custom' ? end : undefined
      );
      if (res.success && res.data) {
        cacheRef.current[cacheKey] = res.data;
        setPulse(res.data);
      } else {
        setErrorMsg(res.message || 'Failed to load restaurant pulse telemetry');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not connect to Sizzle Intelligence service');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (period !== 'custom') {
      fetchPulse(period);
    }
  }, [period]);

  const handleApplyCustomRange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customStartDate || !customEndDate) {
      setErrorMsg('Please select both a start date and an end date.');
      return;
    }
    fetchPulse('custom', customStartDate, customEndDate);
  };

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

  // Helper to retrieve category color theme
  const getCategoryColor = (categoryName: string) => {
    return CATEGORY_COLOR_MAP[categoryName] || DEFAULT_CATEGORY_COLOR;
  };

  // Memoized aggregations and calculations
  const totalVolumeSold = useMemo(() => {
    if (!pulse?.categoryBreakdown) return 0;
    return pulse.categoryBreakdown.reduce((sum, c) => sum + (c.itemsSold || c.quantitySold || 0), 0);
  }, [pulse?.categoryBreakdown]);

  const maxHourlyOrders = useMemo(() => {
    if (!pulse?.hourlyDistribution || pulse.hourlyDistribution.length === 0) return 1;
    return Math.max(...pulse.hourlyDistribution.map((h) => h.orderCount), 1);
  }, [pulse?.hourlyDistribution]);

  const maxHourlyRevenue = useMemo(() => {
    if (!pulse?.hourlyDistribution || pulse.hourlyDistribution.length === 0) return 1;
    return Math.max(...pulse.hourlyDistribution.map((h) => h.totalRevenue), 1);
  }, [pulse?.hourlyDistribution]);

  const maxDailyRevenue = useMemo(() => {
    if (!pulse?.revenueTrends || pulse.revenueTrends.length === 0) return 1;
    return Math.max(...pulse.revenueTrends.map((d) => d.revenue), 1);
  }, [pulse?.revenueTrends]);

  const maxDailyOrders = useMemo(() => {
    if (!pulse?.revenueTrends || pulse.revenueTrends.length === 0) return 1;
    return Math.max(...pulse.revenueTrends.map((d) => d.orderCount), 1);
  }, [pulse?.revenueTrends]);

  const maxDishSold = useMemo(() => {
    if (!pulse?.topPerformingDishes || pulse.topPerformingDishes.length === 0) return 1;
    return Math.max(...pulse.topPerformingDishes.map((d) => d.quantitySold), 1);
  }, [pulse?.topPerformingDishes]);

  // Hourly Daypart breakdown
  const daypartBreakdown = useMemo(() => {
    if (!pulse?.hourlyDistribution) return [];
    const shifts = [
      { name: 'Breakfast', hours: [6, 7, 8, 9, 10], time: '06:00 - 11:00' },
      { name: 'Lunch', hours: [11, 12, 13, 14], time: '11:00 - 15:00' },
      { name: 'Afternoon', hours: [15, 16, 17], time: '15:00 - 18:00' },
      { name: 'Dinner', hours: [18, 19, 20, 21], time: '18:00 - 22:00' },
      { name: 'Late Night', hours: [22, 23, 0, 1, 2, 3, 4, 5], time: '22:00 - 06:00' },
    ];

    return shifts.map((shift) => {
      let orders = 0;
      let revenue = 0;
      pulse.hourlyDistribution?.forEach((h) => {
        if (shift.hours.includes(h.hour)) {
          orders += h.orderCount;
          revenue += h.totalRevenue;
        }
      });
      return {
        ...shift,
        orders,
        revenue,
      };
    });
  }, [pulse?.hourlyDistribution]);

  return (
    <div className="bg-[#1E293B] border border-[#374151] rounded-3xl p-5 sm:p-7 shadow-xl space-y-6 animate-fadeIn relative overflow-hidden text-[#F9FAFB]">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-[#F97316]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-[#374151]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#F97316] to-[#EA580C] text-white flex items-center justify-center shadow-lg shadow-[#F97316]/25 shrink-0">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-[#F97316]/20 text-[#F97316] px-2.5 py-0.5 rounded-full border border-[#F97316]/30">
                Sizzle Intelligence
              </span>
              <span className="text-[11px] text-[#9CA3AF] hidden sm:inline">• Live Visual Telemetry</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#F9FAFB] font-['Poppins'] tracking-tight">
              Operational Infographics &amp; Visual Telemetry
            </h2>
          </div>
        </div>

        {/* Date Period Controls & Refresh */}
        <div className="flex flex-wrap items-center gap-2 self-stretch lg:self-auto justify-between lg:justify-end">
          <div className="bg-[#111827] border border-[#374151] p-1 rounded-xl flex items-center gap-1 text-xs font-bold overflow-x-auto">
            {[
              { id: 'today', label: 'Today' },
              { id: '7days', label: 'Last 7 Days' },
              { id: '30days', label: 'Last 30 Days' },
              { id: 'all', label: 'All Time' },
              { id: 'custom', label: 'Custom Range' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setPeriod(tab.id as any);
                  if (tab.id === 'custom') {
                    setShowCustomInputs(true);
                  } else {
                    setShowCustomInputs(false);
                  }
                }}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
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
            onClick={() => {
              if (period === 'custom') {
                fetchPulse('custom', customStartDate, customEndDate, true);
              } else {
                fetchPulse(period, undefined, undefined, true);
              }
            }}
            disabled={loading}
            className="p-2.5 rounded-xl bg-[#111827] hover:bg-[#374151] text-[#9CA3AF] hover:text-[#F9FAFB] border border-[#374151] transition-all cursor-pointer disabled:opacity-50"
            title="Refresh Pulse Insights"
          >
            <RotateCcw className={`w-4 h-4 ${loading ? 'animate-spin text-[#F97316]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Custom Date Range Picker Dropdown */}
      {showCustomInputs && (
        <form
          onSubmit={handleApplyCustomRange}
          className="p-4 rounded-2xl bg-[#111827] border border-[#F97316]/30 flex flex-wrap items-center gap-3 text-xs animate-fadeIn"
        >
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#F97316]" />
            <span className="font-bold text-[#E5E7EB]">Custom Filter:</span>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-[#9CA3AF]">Start:</label>
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              className="bg-[#1E293B] border border-[#374151] rounded-lg px-2.5 py-1 text-[#F9FAFB] focus:border-[#F97316] outline-none"
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-[#9CA3AF]">End:</label>
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              className="bg-[#1E293B] border border-[#374151] rounded-lg px-2.5 py-1 text-[#F9FAFB] focus:border-[#F97316] outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-[#F97316] hover:bg-[#EA580C] text-white px-4 py-1.5 rounded-lg font-bold transition-all cursor-pointer disabled:opacity-50"
          >
            Apply Filter
          </button>
        </form>
      )}

      {/* Error Banner */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>{errorMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => fetchPulse(period)}
            className="text-[11px] underline text-amber-400 hover:text-amber-300 font-bold"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && !pulse ? (
        <div className="py-16 flex flex-col items-center justify-center space-y-3 text-center">
          <Sparkles className="w-9 h-9 text-[#F97316] animate-spin" />
          <p className="text-xs font-semibold text-[#D1D5DB]">
            Sizzle Intelligence is analyzing operational trends &amp; inventory telemetry...
          </p>
          <span className="text-[11px] text-[#6B7280]">
            Validating database transaction logs and category shares
          </span>
        </div>
      ) : pulse ? (
        <div className="space-y-6">

          {/* ========================================================================= */}
          {/* SECTION 1: VERIFIED CORE KPI CARDS */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            
            {/* Total Orders Card */}
            <div className="bg-[#111827]/80 border border-[#374151] p-3.5 rounded-2xl space-y-1 relative group hover:border-[#F97316]/40 transition-all">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] block">
                Total Orders
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-xl sm:text-2xl font-black text-[#F97316]">
                  {pulse.totalOrders}
                </span>
                {pulse.ordersPercentageChange !== null && pulse.ordersPercentageChange !== undefined && (
                  <span
                    className={`text-[10px] font-black px-1.5 py-0.5 rounded-md flex items-center gap-0.5 ${
                      pulse.ordersPercentageChange >= 0
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-rose-500/20 text-rose-400'
                    }`}
                  >
                    {pulse.ordersPercentageChange >= 0 ? '+' : ''}
                    {pulse.ordersPercentageChange.toFixed(1)}%
                  </span>
                )}
              </div>
              <span className="text-[10px] text-[#6B7280] block truncate">
                {pulse.comparisonPeriodLabel || 'Verified completed orders'}
              </span>
            </div>

            {/* Total Revenue Card */}
            <div className="bg-[#111827]/80 border border-[#374151] p-3.5 rounded-2xl space-y-1 relative group hover:border-emerald-500/40 transition-all">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] block">
                Total Revenue
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-xl sm:text-2xl font-black text-emerald-400">
                  ₹{pulse.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                {pulse.revenuePercentageChange !== null && pulse.revenuePercentageChange !== undefined && (
                  <span
                    className={`text-[10px] font-black px-1.5 py-0.5 rounded-md flex items-center gap-0.5 ${
                      pulse.revenuePercentageChange >= 0
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-rose-500/20 text-rose-400'
                    }`}
                  >
                    {pulse.revenuePercentageChange >= 0 ? '+' : ''}
                    {pulse.revenuePercentageChange.toFixed(1)}%
                  </span>
                )}
              </div>
              <span className="text-[10px] text-[#6B7280] block truncate">
                {pulse.totalQuantitySold ? `${pulse.totalQuantitySold} items sold` : 'Net billed volume'}
              </span>
            </div>

            {/* Average Order Value (AOV) Card */}
            <div className="bg-[#111827]/80 border border-[#374151] p-3.5 rounded-2xl space-y-1 relative group hover:border-blue-500/40 transition-all">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] block">
                Avg Order Value
              </span>
              <span className="text-xl sm:text-2xl font-black text-[#F9FAFB] block">
                ₹{pulse.averageOrderValue.toFixed(2)}
              </span>
              <span className="text-[10px] text-[#6B7280] block">
                Per ticket average
              </span>
            </div>

            {/* Average Prep Time Card */}
            <div className="bg-[#111827]/80 border border-[#374151] p-3.5 rounded-2xl space-y-1 relative group hover:border-amber-500/40 transition-all">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] block">
                Avg Prep Time
              </span>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-xl sm:text-2xl font-black text-[#F9FAFB]">
                  {pulse.averagePrepTimeMinutes ? `${pulse.averagePrepTimeMinutes} min` : '12 min'}
                </span>
              </div>
              <span className="text-[10px] text-[#6B7280] block truncate">
                {pulse.prepTimeSubtitle || 'Menu Recipe Average'}
              </span>
            </div>

            {/* Peak Service Window Card */}
            <div className="bg-[#111827]/80 border border-[#374151] p-3.5 rounded-2xl space-y-1 col-span-2 sm:col-span-1 relative group hover:border-[#F97316]/40 transition-all">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] block">
                Peak Service
              </span>
              <span className="text-sm sm:text-base font-extrabold text-[#F9FAFB] block mt-0.5 truncate">
                {pulse.peakHour}
              </span>
              <span className="text-[10px] text-[#F97316] font-semibold block">
                Busiest operational window
              </span>
            </div>

          </div>

          {/* Executive Pulse Summary Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#111827] via-[#1E293B] to-[#111827] border border-[#374151] space-y-2.5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#F97316]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#D1D5DB] font-['Poppins']">
                  Executive Pulse Brief
                </h3>
              </div>
              <div className="flex items-center gap-2">
                {pulse.quantityShareLeader && (
                  <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full font-bold">
                    Volume Leader: {pulse.quantityShareLeader}
                  </span>
                )}
                {pulse.revenueShareLeader && (
                  <span className="text-[10px] bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20 px-2 py-0.5 rounded-full font-bold">
                    Revenue Leader: {pulse.revenueShareLeader}
                  </span>
                )}
              </div>
            </div>
            <p className="text-xs sm:text-sm text-[#F9FAFB] leading-relaxed font-medium">
              {pulse.summary}
            </p>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 2: OPERATIONAL INFOGRAPHICS & VISUAL TELEMETRY */}
          {/* ========================================================================= */}
          <div className="bg-[#111827]/90 border border-[#374151] rounded-2xl p-4 sm:p-6 space-y-5">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 border-b border-[#374151]/70 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#F9FAFB] font-['Poppins'] flex items-center gap-2">
                    <span>Operational Infographics &amp; Visual Telemetry</span>
                    <span className="text-[10px] bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30 uppercase tracking-wider font-extrabold">
                      Live Telemetry
                    </span>
                  </h3>
                  <p className="text-xs text-[#9CA3AF]">
                    Comprehensive metrics derived directly from verified database transactions
                  </p>
                </div>
              </div>

              {/* Four Core Navigation Tabs */}
              <div className="flex items-center gap-1 bg-[#1E293B] p-1 rounded-xl border border-[#374151] text-xs font-bold self-stretch lg:self-auto overflow-x-auto">
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

            {/* ----------------------------------------------------------------------- */}
            {/* TAB 1: CATEGORY MIX */}
            {/* ----------------------------------------------------------------------- */}
            {infographicTab === 'category' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs text-[#D1D5DB] font-semibold block">
                      Comparative breakdown across active culinary categories
                    </span>
                    <span className="text-[11px] text-[#9CA3AF]">
                      Clearly distinguishes Unit Quantity Share (%) vs Revenue Share (%)
                    </span>
                  </div>

                  {/* Toggle Metric View: Revenue Share vs Quantity Share */}
                  <div className="flex items-center gap-1 bg-[#1E293B] p-1 rounded-xl border border-[#374151] text-[11px] font-bold self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setCategoryMetric('revenue')}
                      className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                        categoryMetric === 'revenue'
                          ? 'bg-[#F97316] text-white'
                          : 'text-[#9CA3AF] hover:text-[#F9FAFB]'
                      }`}
                    >
                      Revenue Share (%)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCategoryMetric('quantity')}
                      className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                        categoryMetric === 'quantity'
                          ? 'bg-[#F97316] text-white'
                          : 'text-[#9CA3AF] hover:text-[#F9FAFB]'
                      }`}
                    >
                      Quantity Share (%)
                    </button>
                  </div>
                </div>

                {pulse.categoryBreakdown && pulse.categoryBreakdown.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Left Column: Horizontal Category Ranked Comparison */}
                    <div className="space-y-3 bg-[#1E293B]/60 p-4 rounded-xl border border-[#374151]">
                      <div className="flex items-center justify-between pb-1 border-b border-[#374151]/50 text-[11px] text-[#9CA3AF] font-bold">
                        <span>Rank &amp; Category</span>
                        <span>
                          {categoryMetric === 'revenue' ? 'Revenue & Contribution' : 'Units Sold & Volume Share'}
                        </span>
                      </div>

                      {pulse.categoryBreakdown.map((cat, idx) => {
                        const theme = getCategoryColor(cat.categoryName);
                        const displayedPct = categoryMetric === 'revenue' ? cat.revenueShare : cat.quantityShare;
                        const units = cat.itemsSold || cat.quantitySold || 0;

                        return (
                          <div key={idx} className="space-y-1.5 group">
                            <div className="flex justify-between items-center text-xs">
                              <div className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded-md bg-[#111827] text-[#9CA3AF] group-hover:text-[#F9FAFB] font-black text-[10px] flex items-center justify-center border border-[#374151]">
                                  #{idx + 1}
                                </span>
                                <span className="font-bold text-[#F9FAFB] group-hover:text-[#F97316] transition-colors">
                                  {cat.categoryName}
                                </span>
                              </div>

                              <div className="flex items-center gap-3">
                                <div className="text-right">
                                  <span className="text-[11px] text-[#9CA3AF] block">
                                    {units} sold • ₹{cat.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 0 })}
                                  </span>
                                </div>
                                <span className={`font-extrabold text-xs px-2 py-0.5 rounded-md ${theme.bg} ${theme.text} border border-white/5`}>
                                  {displayedPct.toFixed(1)}%
                                </span>
                              </div>
                            </div>

                            {/* Dual Metric Context Sub-bar */}
                            <div className="w-full bg-[#111827] h-2.5 rounded-full overflow-hidden border border-[#374151]/60 relative">
                              <div
                                className={`bg-gradient-to-r ${theme.barGrad} h-full rounded-full transition-all duration-700`}
                                style={{ width: `${Math.max(displayedPct, 5)}%` }}
                              />
                            </div>
                            <div className="flex justify-between text-[10px] text-[#6B7280] px-0.5">
                              <span>Revenue Share: <strong className="text-[#D1D5DB]">{cat.revenueShare.toFixed(1)}%</strong></span>
                              <span>Quantity Share: <strong className="text-[#D1D5DB]">{cat.quantityShare.toFixed(1)}%</strong></span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Right Column: Cumulative Portfolio Composition & Disparity Insight */}
                    <div className="bg-[#1E293B]/60 p-4 rounded-xl border border-[#374151] flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider">
                            Cumulative Portfolio Composition ({categoryMetric === 'revenue' ? 'Revenue' : 'Volume'})
                          </h4>
                          <span className="text-[11px] text-[#F97316] font-bold">
                            100% Total
                          </span>
                        </div>

                        {/* Segmented composition bar */}
                        <div className="w-full h-5 rounded-xl overflow-hidden flex bg-[#111827] border border-[#374151] p-0.5 gap-0.5">
                          {pulse.categoryBreakdown.map((cat, idx) => {
                            const theme = getCategoryColor(cat.categoryName);
                            const widthPct = categoryMetric === 'revenue' ? cat.revenueShare : cat.quantityShare;
                            if (widthPct <= 0) return null;

                            return (
                              <div
                                key={idx}
                                className="h-full rounded-xs transition-all relative group cursor-pointer"
                                style={{
                                  backgroundColor: theme.hex,
                                  width: `${Math.max(widthPct, 2)}%`,
                                }}
                                title={`${cat.categoryName}: ${widthPct.toFixed(1)}% (${categoryMetric === 'revenue' ? `₹${cat.totalRevenue.toFixed(0)}` : `${cat.itemsSold} sold`})`}
                              />
                            );
                          })}
                        </div>

                        {/* Color Legend with exact shares */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
                          {pulse.categoryBreakdown.map((cat, idx) => {
                            const theme = getCategoryColor(cat.categoryName);
                            const metricVal = categoryMetric === 'revenue' ? cat.revenueShare : cat.quantityShare;

                            return (
                              <div
                                key={idx}
                                className="flex items-center gap-1.5 p-1.5 rounded-lg bg-[#111827]/60 border border-[#374151]/50 text-[11px] text-[#D1D5DB]"
                              >
                                <span
                                  className="w-2.5 h-2.5 rounded-full shrink-0"
                                  style={{ backgroundColor: theme.hex }}
                                />
                                <span className="truncate font-semibold">{cat.categoryName}</span>
                                <span className="ml-auto text-[10px] text-[#9CA3AF] font-bold">
                                  {metricVal.toFixed(1)}%
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Financial vs Quantity Disparity Intelligence Card */}
                      <div className="p-3.5 bg-[#111827]/80 rounded-xl border border-[#374151] space-y-2">
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-[#F97316] shrink-0" />
                          <span className="text-xs font-bold text-[#F9FAFB]">
                            Portfolio Disparity &amp; Workload Intelligence
                          </span>
                        </div>
                        <p className="text-xs text-[#D1D5DB] leading-relaxed">
                          {pulse.categoryBreakdown[0] && (
                            <>
                              <strong>{pulse.categoryBreakdown[0].categoryName}</strong> leads revenue contribution at{' '}
                              <span className="text-[#F97316] font-bold">
                                {pulse.categoryBreakdown[0].revenueShare.toFixed(1)}%
                              </span>
                              , while high-volume accompaniments like Breads drive customer volume at{' '}
                              <span className="text-amber-400 font-bold">
                                {pulse.categoryBreakdown.find((c) => c.categoryName === 'Breads')?.quantityShare.toFixed(1) || '0.0'}%
                              </span>
                              . Bundle high-revenue entrees with popular sides to maximize kitchen ticket yields.
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10 bg-[#1E293B]/40 rounded-xl border border-[#374151]">
                    <p className="text-xs text-[#9CA3AF] italic">
                      No category distribution data available for this timeframe.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* ----------------------------------------------------------------------- */}
            {/* TAB 2: HOURLY PACE */}
            {/* ----------------------------------------------------------------------- */}
            {infographicTab === 'hourly' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs text-[#D1D5DB] font-semibold block">
                      24-Hour Dining Pace &amp; Kitchen Demand Patterns
                    </span>
                    <span className="text-[11px] text-[#9CA3AF]">
                      Hourly ticket inflow and revenue velocity across service hours
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Hourly Metric Switcher */}
                    <div className="flex items-center gap-1 bg-[#1E293B] p-1 rounded-xl border border-[#374151] text-[11px] font-bold">
                      <button
                        type="button"
                        onClick={() => setHourlyMetric('orders')}
                        className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                          hourlyMetric === 'orders'
                            ? 'bg-[#F97316] text-white'
                            : 'text-[#9CA3AF] hover:text-[#F9FAFB]'
                        }`}
                      >
                        Order Volume (Tickets)
                      </button>
                      <button
                        type="button"
                        onClick={() => setHourlyMetric('revenue')}
                        className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                          hourlyMetric === 'revenue'
                            ? 'bg-[#F97316] text-white'
                            : 'text-[#9CA3AF] hover:text-[#F9FAFB]'
                        }`}
                      >
                        Revenue (₹)
                      </button>
                    </div>

                    <div className="hidden sm:flex items-center gap-2 text-xs">
                      <span className="flex items-center gap-1 text-[#F97316] font-bold bg-[#F97316]/10 px-2.5 py-1 rounded-lg border border-[#F97316]/20">
                        <Flame className="w-3.5 h-3.5" />
                        Peak: {pulse.peakHour}
                      </span>
                    </div>
                  </div>
                </div>

                {pulse.hourlyDistribution && pulse.hourlyDistribution.length > 0 ? (
                  <div className="space-y-4">
                    {/* 24-Hour Histogram Bar Chart */}
                    <div className="bg-[#1E293B]/60 p-4 rounded-xl border border-[#374151] space-y-3">
                      <div className="flex items-center justify-between text-xs text-[#9CA3AF] pb-1">
                        <span>24-Hour Histogram ({hourlyMetric === 'orders' ? 'Order Volume' : 'Revenue Inflow'})</span>
                        <span className="text-[#F97316] font-bold">
                          {hourlyMetric === 'orders' ? `Max: ${maxHourlyOrders} tickets/hr` : `Max: ₹${maxHourlyRevenue.toFixed(0)}/hr`}
                        </span>
                      </div>

                      <div className="h-36 flex items-end justify-between gap-1 pt-6 px-1 border-b border-[#374151]/80">
                        {pulse.hourlyDistribution.map((h) => {
                          const metricVal = hourlyMetric === 'orders' ? h.orderCount : h.totalRevenue;
                          const maxVal = hourlyMetric === 'orders' ? maxHourlyOrders : maxHourlyRevenue;
                          const heightPct = Math.round((metricVal / maxVal) * 100);
                          const isPeak = h.orderCount === maxHourlyOrders && h.orderCount > 0;
                          const hasActivity = metricVal > 0;

                          return (
                            <div
                              key={h.hour}
                              className="flex-1 flex flex-col items-center justify-end h-full group relative cursor-pointer"
                            >
                              {/* Hover Tooltip */}
                              <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-[#111827] text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg border border-[#374151] whitespace-nowrap z-30 shadow-xl space-y-0.5">
                                <div className="text-[#F97316] font-extrabold">{h.hour}:00 - {(h.hour + 1) % 24}:00</div>
                                <div>{h.orderCount} orders • ₹{h.totalRevenue.toFixed(2)}</div>
                                {h.averageOrderValue ? (
                                  <div className="text-[#9CA3AF]">AOV: ₹{h.averageOrderValue.toFixed(2)}</div>
                                ) : null}
                              </div>

                              {/* Busiest hour marker icon */}
                              {isPeak && (
                                <div className="absolute -top-5 text-[#F97316] animate-bounce">
                                  <Flame className="w-3.5 h-3.5" />
                                </div>
                              )}

                              <div
                                className={`w-full rounded-t-sm transition-all duration-300 ${
                                  isPeak
                                    ? 'bg-gradient-to-t from-[#F97316] to-[#FB923C] shadow-md shadow-[#F97316]/50'
                                    : hasActivity
                                    ? 'bg-[#FB923C]/75 group-hover:bg-[#F97316]'
                                    : 'bg-[#374151]/30 group-hover:bg-[#4B5563]'
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
                        <span>03:00</span>
                        <span>06:00</span>
                        <span>09:00</span>
                        <span>12:00</span>
                        <span>15:00</span>
                        <span>18:00</span>
                        <span>21:00</span>
                        <span>23:00</span>
                      </div>
                    </div>

                    {/* Meal Shift Pace Breakdown Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                      {daypartBreakdown.map((shift, idx) => (
                        <div
                          key={idx}
                          className="bg-[#1E293B]/60 border border-[#374151] p-3 rounded-xl space-y-1 hover:border-[#F97316]/30 transition-all"
                        >
                          <div className="flex justify-between items-center text-[10px] text-[#9CA3AF] font-bold">
                            <span>{shift.name}</span>
                            <span className="text-[9px] text-[#6B7280]">{shift.time}</span>
                          </div>
                          <div className="flex justify-between items-baseline pt-1">
                            <span className="text-base font-extrabold text-[#F9FAFB]">
                              {shift.orders} orders
                            </span>
                            <span className="text-xs font-bold text-emerald-400">
                              ₹{shift.revenue.toLocaleString(undefined, { minimumFractionDigits: 0 })}
                            </span>
                          </div>
                          <div className="w-full bg-[#111827] h-1.5 rounded-full overflow-hidden border border-[#374151]/40">
                            <div
                              className="bg-[#F97316] h-full rounded-full transition-all"
                              style={{ width: `${Math.min((shift.orders / Math.max(pulse.totalOrders, 1)) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10 bg-[#1E293B]/40 rounded-xl border border-[#374151]">
                    <p className="text-xs text-[#9CA3AF] italic">
                      No hourly demand recorded in this window.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* ----------------------------------------------------------------------- */}
            {/* TAB 3: TOP & LOW-VELOCITY DISHES */}
            {/* ----------------------------------------------------------------------- */}
            {infographicTab === 'dishes' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs text-[#D1D5DB] font-semibold block">
                      Dishes Velocity &amp; Menu Demand Ranking
                    </span>
                    <span className="text-[11px] text-[#9CA3AF]">
                      Ranked by verified unit sales volume and generated revenue
                    </span>
                  </div>

                  {/* Toggle between Top 5 and Bottom 5 */}
                  <div className="flex items-center gap-1 bg-[#1E293B] p-1 rounded-xl border border-[#374151] text-[11px] font-bold self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setDishTab('top')}
                      className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                        dishTab === 'top'
                          ? 'bg-[#F97316] text-white'
                          : 'text-[#9CA3AF] hover:text-[#F9FAFB]'
                      }`}
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>Top 5 Best Sellers</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDishTab('bottom')}
                      className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                        dishTab === 'bottom'
                          ? 'bg-amber-500 text-white'
                          : 'text-[#9CA3AF] hover:text-[#F9FAFB]'
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Bottom 5 Low-Velocity</span>
                    </button>
                  </div>
                </div>

                {/* Display Top 5 Best Sellers */}
                {dishTab === 'top' && (
                  <div className="space-y-3">
                    {pulse.topPerformingDishes && pulse.topPerformingDishes.length > 0 ? (
                      <div className="space-y-2.5">
                        {pulse.topPerformingDishes.map((dish, idx) => {
                          const theme = getCategoryColor(dish.categoryName);
                          const sharePct = Math.round((dish.quantitySold / maxDishSold) * 100);

                          return (
                            <div
                              key={dish.menuItemId || idx}
                              className="bg-[#1E293B]/70 border border-[#374151] hover:border-[#F97316]/50 p-3.5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all group"
                            >
                              <div className="flex items-center gap-3">
                                <span className="w-8 h-8 rounded-xl bg-[#F97316]/15 text-[#F97316] font-black text-xs flex items-center justify-center shrink-0 border border-[#F97316]/30">
                                  #{idx + 1}
                                </span>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h4 className="text-sm font-bold text-[#F9FAFB] group-hover:text-[#F97316] transition-colors">
                                      {dish.dishName}
                                    </h4>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${theme.bg} ${theme.text}`}>
                                      {dish.categoryName}
                                    </span>
                                  </div>
                                  <span className="text-[11px] text-[#9CA3AF]">
                                    {dish.quantityShare ? `${dish.quantityShare.toFixed(1)}% of all items sold` : 'High customer demand'}
                                  </span>
                                </div>
                              </div>

                              {/* Metrics & Horizontal Bar */}
                              <div className="flex items-center gap-4 sm:w-64">
                                <div className="flex-1 space-y-1">
                                  <div className="flex justify-between items-center text-xs">
                                    <span className="font-extrabold text-[#F97316]">
                                      {dish.quantitySold} sold
                                    </span>
                                    <span className="font-bold text-emerald-400">
                                      ₹{dish.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 0 })}
                                    </span>
                                  </div>
                                  <div className="w-full bg-[#111827] h-2 rounded-full overflow-hidden border border-[#374151]/50">
                                    <div
                                      className={`bg-gradient-to-r ${theme.barGrad} h-full rounded-full transition-all duration-500`}
                                      style={{ width: `${Math.max(sharePct, 10)}%` }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-10 bg-[#1E293B]/40 rounded-xl border border-[#374151]">
                        <p className="text-xs text-[#9CA3AF] italic">
                          No menu sales data recorded in this timeframe.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Display Bottom 5 Low-Velocity Dishes */}
                {dishTab === 'bottom' && (
                  <div className="space-y-3">
                    {pulse.bottomPerformingDishes && pulse.bottomPerformingDishes.length > 0 ? (
                      <div className="space-y-2.5">
                        {pulse.bottomPerformingDishes.map((dish, idx) => {
                          const theme = getCategoryColor(dish.categoryName);

                          return (
                            <div
                              key={dish.menuItemId || idx}
                              className="bg-[#1E293B]/70 border border-[#374151] hover:border-amber-500/50 p-3.5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all"
                            >
                              <div className="flex items-center gap-3">
                                <span className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 font-black text-xs flex items-center justify-center shrink-0 border border-amber-500/30">
                                  #{idx + 1}
                                </span>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h4 className="text-sm font-bold text-[#F9FAFB]">
                                      {dish.dishName}
                                    </h4>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${theme.bg} ${theme.text}`}>
                                      {dish.categoryName}
                                    </span>
                                  </div>
                                  <span className="text-[11px] text-[#9CA3AF]">
                                    Low customer selection frequency in this period
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-4 text-xs font-bold">
                                <span className="text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                                  {dish.quantitySold} units sold
                                </span>
                                <span className="text-[#9CA3AF]">
                                  ₹{dish.totalRevenue.toFixed(0)} billed
                                </span>
                              </div>
                            </div>
                          );
                        })}

                        {/* Cost & Profitability Disclaimer */}
                        <div className="p-3 bg-[#111827]/80 rounded-xl border border-amber-500/30 flex items-start gap-2.5 text-xs text-[#D1D5DB]">
                          <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <p className="leading-relaxed">
                            <strong>Inventory &amp; Margin Note:</strong> Low sales velocity indicates lower order frequency during this timeframe, but does not necessarily prove unprofitability since wholesale ingredient costs and recipe margins vary. Review item positioning before menu retirement.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-10 bg-[#1E293B]/40 rounded-xl border border-[#374151]">
                        <p className="text-xs text-[#9CA3AF] italic">
                          No low-performing dishes to display for this timeframe.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ----------------------------------------------------------------------- */}
            {/* TAB 4: REVENUE TREND */}
            {/* ----------------------------------------------------------------------- */}
            {infographicTab === 'revenue' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs text-[#D1D5DB] font-semibold block">
                      Time-Series Financial Trajectory &amp; Ticket Volumes
                    </span>
                    <span className="text-[11px] text-[#9CA3AF]">
                      Daily financial performance and transaction trends
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Revenue Trend Metric Switcher */}
                    <div className="flex items-center gap-1 bg-[#1E293B] p-1 rounded-xl border border-[#374151] text-[11px] font-bold">
                      <button
                        type="button"
                        onClick={() => setRevenueTrendMetric('revenue')}
                        className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                          revenueTrendMetric === 'revenue'
                            ? 'bg-emerald-500 text-white'
                            : 'text-[#9CA3AF] hover:text-[#F9FAFB]'
                        }`}
                      >
                        Revenue (₹)
                      </button>
                      <button
                        type="button"
                        onClick={() => setRevenueTrendMetric('orders')}
                        className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                          revenueTrendMetric === 'orders'
                            ? 'bg-[#F97316] text-white'
                            : 'text-[#9CA3AF] hover:text-[#F9FAFB]'
                        }`}
                      >
                        Order Volume
                      </button>
                    </div>

                    <span className="text-xs text-emerald-400 font-extrabold bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                      Total: ₹{pulse.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {pulse.revenueTrends && pulse.revenueTrends.length > 0 ? (
                  <div className="bg-[#1E293B]/60 p-4 rounded-xl border border-[#374151] space-y-4">
                    {/* Time-Series Histogram Chart */}
                    <div className="h-36 flex items-end justify-between gap-2 pt-6 px-2 border-b border-[#374151]/80">
                      {pulse.revenueTrends.map((trend, idx) => {
                        const val = revenueTrendMetric === 'revenue' ? trend.revenue : trend.orderCount;
                        const maxVal = revenueTrendMetric === 'revenue' ? maxDailyRevenue : maxDailyOrders;
                        const heightPct = Math.round((val / maxVal) * 100);

                        return (
                          <div
                            key={idx}
                            className="flex-1 flex flex-col items-center justify-end h-full group relative cursor-pointer"
                          >
                            <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-[#111827] text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg border border-[#374151] whitespace-nowrap z-30 shadow-xl">
                              <div className="text-emerald-400 font-black">{trend.date}</div>
                              <div>₹{trend.revenue.toFixed(2)} • {trend.orderCount} orders</div>
                            </div>

                            <div
                              className={`w-full max-w-[50px] rounded-t-md transition-all duration-300 ${
                                revenueTrendMetric === 'revenue'
                                  ? 'bg-gradient-to-t from-emerald-600 to-teal-400 group-hover:from-emerald-500 group-hover:to-teal-300'
                                  : 'bg-gradient-to-t from-orange-600 to-amber-400 group-hover:from-orange-500 group-hover:to-amber-300'
                              }`}
                              style={{ height: `${Math.max(heightPct, 8)}%` }}
                            />
                          </div>
                        );
                      })}
                    </div>

                    {/* Date Labels below chart */}
                    <div className="flex justify-between text-[10px] text-[#9CA3AF] font-bold px-1">
                      {pulse.revenueTrends.map((trend, idx) => (
                        <span key={idx} className="truncate max-w-[70px]">
                          {trend.date}
                        </span>
                      ))}
                    </div>

                    {/* Comparative Performance Callout */}
                    <div className="p-3 bg-[#111827]/80 rounded-xl border border-[#374151] flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="text-[#D1D5DB]">
                          {pulse.revenuePercentageChange !== null && pulse.revenuePercentageChange !== undefined ? (
                            <>
                              Period performance shifted by{' '}
                              <strong className={pulse.revenuePercentageChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                                {pulse.revenuePercentageChange >= 0 ? '+' : ''}{pulse.revenuePercentageChange.toFixed(1)}%
                              </strong>{' '}
                              relative to the baseline comparison window.
                            </>
                          ) : (
                            'Baseline tracking established. Historical trend will track comparative revenue velocity.'
                          )}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#6B7280]">
                        {pulse.revenueTrends.length} distinct service days
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10 bg-[#1E293B]/40 rounded-xl border border-[#374151]">
                    <p className="text-xs text-[#9CA3AF] italic">
                      No daily revenue history recorded in this window.
                    </p>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* ========================================================================= */}
          {/* SECTION 3: KEY OPERATIONAL INTELLIGENCE INSIGHTS */}
          {/* ========================================================================= */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF] font-['Poppins']">
                  Key Operational Intelligence Insights
                </h3>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {pulse.source === 'AI' ? 'Gemini AI Insights' : 'Deterministic Analytics'}
                </span>
              </div>
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

          {/* ========================================================================= */}
          {/* SECTION 4: ACTIONABLE STRATEGIC RECOMMENDATIONS */}
          {/* ========================================================================= */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF] font-['Poppins']">
              Actionable Strategic Recommendations
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {pulse.recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className="bg-[#111827]/40 border border-[#374151] p-3.5 rounded-xl flex items-start gap-2.5 hover:border-[#F97316]/30 transition-all"
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
          <div className="pt-2 flex flex-col sm:flex-row justify-between items-center text-[10px] text-[#6B7280] gap-1">
            <span>
              Engine: {pulse.source === 'AI' ? 'Google Gemini AI via Sizzle Intelligence API' : 'Sizzle Deterministic Analytics Engine'}
            </span>
            <span>
              Generated {new Date(pulse.generatedAt).toLocaleTimeString()} • Source of Truth: SQL Database
            </span>
          </div>

        </div>
      ) : null}

    </div>
  );
};
