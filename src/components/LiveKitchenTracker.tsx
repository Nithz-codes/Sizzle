import React, { useState, useEffect, useMemo } from 'react';
import {
  Clock,
  Flame,
  ChefHat,
  CheckCircle2,
  Bell,
  Sparkles,
  RefreshCw,
  AlertCircle,
  UtensilsCrossed,
} from 'lucide-react';
import { ReceiptData } from '../types';
import { orderApi } from '../services/api';

interface LiveKitchenTrackerProps {
  receipt: ReceiptData;
  onStatusChange?: (newStatus: 'PENDING' | 'PREPARING' | 'READY' | 'DELIVERED') => void;
}

export const LiveKitchenTracker: React.FC<LiveKitchenTrackerProps> = ({ receipt, onStatusChange }) => {
  const [currentStatus, setCurrentStatus] = useState<'PENDING' | 'PREPARING' | 'READY' | 'DELIVERED'>(
    (receipt.orderStatus as any) || 'PENDING'
  );
  const [lastSyncTime, setLastSyncTime] = useState<Date>(new Date());
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Time & countdown calculations
  const totalEstimatedMins = receipt.estimatedMinutes || 20;
  const startedAt = receipt.preparationStartedAt || Date.now();
  const [secondsRemaining, setSecondsRemaining] = useState<number>(() => {
    const elapsedSecs = Math.max(0, Math.floor((Date.now() - startedAt) / 1000));
    return Math.max(0, totalEstimatedMins * 60 - elapsedSecs);
  });

  // Ticker for second-by-second countdown
  useEffect(() => {
    if (currentStatus === 'DELIVERED') {
      setSecondsRemaining(0);
      return;
    }
    const interval = setInterval(() => {
      const elapsedSecs = Math.max(0, Math.floor((Date.now() - startedAt) / 1000));
      const rem = Math.max(0, totalEstimatedMins * 60 - elapsedSecs);
      setSecondsRemaining(rem);
    }, 1000);
    return () => clearInterval(interval);
  }, [startedAt, totalEstimatedMins, currentStatus]);

  // Real-Time Server / Admin KDS Polling and Event Sync
  useEffect(() => {
    let isMounted = true;

    const syncStatus = async () => {
      const idOrNumber = receipt.id || receipt.orderNumber || receipt.billNumber;
      if (!idOrNumber) return;
      try {
        setIsSyncing(true);
        const res = await orderApi.getOrderByIdOrNumber(idOrNumber);
        if (isMounted && res.success && res.data) {
          const remoteStatus = (res.data.orderStatus as any) || 'PENDING';
          if (remoteStatus !== currentStatus) {
            setCurrentStatus(remoteStatus);
            onStatusChange?.(remoteStatus);
          }
          setLastSyncTime(new Date());
        }
      } catch (err) {
        // Silently tolerate if offline or unauthenticated
      } finally {
        if (isMounted) setIsSyncing(false);
      }
    };

    // Immediate sync
    syncStatus();

    // 3.5s background interval for live server sync
    const interval = setInterval(syncStatus, 3500);

    // Also listen to local window event broadcasted by Admin KDS
    const handleLocalBroadcast = (e: any) => {
      const detail = e.detail;
      if (!detail) return;
      if (
        detail.billNumber === receipt.billNumber ||
        (receipt.id && detail.orderId === receipt.id)
      ) {
        const nextStatus = detail.orderStatus || detail.status;
        if (nextStatus) {
          setCurrentStatus(nextStatus);
          onStatusChange?.(nextStatus);
          setLastSyncTime(new Date());
        }
      }
    };

    window.addEventListener('sizzle_order_status_updated', handleLocalBroadcast);

    return () => {
      isMounted = false;
      clearInterval(interval);
      window.removeEventListener('sizzle_order_status_updated', handleLocalBroadcast);
    };
  }, [receipt.id, receipt.orderNumber, receipt.billNumber, currentStatus, onStatusChange]);

  // Formatted counter string
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Progress percentage
  const progressPercent = useMemo(() => {
    if (currentStatus === 'DELIVERED') return 100;
    if (currentStatus === 'READY') return 95;
    const totalSecs = totalEstimatedMins * 60;
    const elapsed = Math.max(0, totalSecs - secondsRemaining);
    const pct = Math.min(90, Math.round((elapsed / totalSecs) * 100));
    return Math.max(10, pct);
  }, [secondsRemaining, totalEstimatedMins, currentStatus]);

  // Stepper definition
  const steps = [
    {
      id: 'PENDING',
      label: 'Order Placed',
      sublabel: 'In KDS Queue',
      icon: Clock,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10 border-amber-500/30',
    },
    {
      id: 'PREPARING',
      label: 'In Kitchen',
      sublabel: 'Cooking & Sizzling',
      icon: Flame,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10 border-orange-500/30',
    },
    {
      id: 'READY',
      label: 'Ready to Serve',
      sublabel: 'Hot at Pass',
      icon: Bell,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10 border-emerald-500/30',
    },
    {
      id: 'DELIVERED',
      label: 'Delivered',
      sublabel: 'Enjoy your meal!',
      icon: CheckCircle2,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10 border-blue-500/30',
    },
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 0;
      case 'PREPARING':
        return 1;
      case 'READY':
        return 2;
      case 'DELIVERED':
        return 3;
      default:
        return 0;
    }
  };

  const currentStepIdx = getStepIndex(currentStatus);

  // Dynamic AI Telemetry explanation
  const getAiExplanation = () => {
    switch (currentStatus) {
      case 'PENDING':
        return `Your order #${receipt.billNumber} has been received by the Kitchen Display System (KDS). Kitchen prep stations are prepping fresh ingredients. Estimated cooking begins shortly.`;
      case 'PREPARING':
        return `Your items are actively cooking on the culinary line! The chef has taken your ticket, and your dishes are currently sizzling on the preparation stations.`;
      case 'READY':
        return `DING! 🔔 Your order #${receipt.billNumber} is freshly prepared, hot, and ready! Service staff has been notified to present it to your table.`;
      case 'DELIVERED':
        return `Your order has been served. Thank you for dining with Sizzle! Please let our staff know if you need anything else.`;
      default:
        return `Sizzle Intelligence is actively monitoring your ticket in the kitchen queue.`;
    }
  };

  return (
    <div className="space-y-4">
      {/* Live Header Status Banner */}
      <div className="bg-gradient-to-r from-[#1E293B] to-[#0F172A] border border-[#334155] rounded-2xl p-4 text-white shadow-lg relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#F97316]/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 font-mono">
              Live KDS Telemetry Sync
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
            <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin text-[#F97316]' : ''}`} />
            <span>Synced {lastSyncTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
          </div>
        </div>

        {/* Counter Display & Status Hero */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
          <div>
            <span className="text-xs text-gray-400 block mb-0.5">Order #{receipt.billNumber}</span>
            <div className="flex items-center gap-2">
              <span className="text-lg sm:text-xl font-bold font-['Poppins']">
                {currentStatus === 'PENDING' && 'In Kitchen Queue'}
                {currentStatus === 'PREPARING' && 'Actively Cooking / Sizzling'}
                {currentStatus === 'READY' && 'Hot & Ready to Serve!'}
                {currentStatus === 'DELIVERED' && 'Delivered to Table'}
              </span>
            </div>
            <p className="text-xs text-gray-300 mt-1">
              {receipt.items.length} {receipt.items.length === 1 ? 'item' : 'items'} • Table {receipt.tableNumber || '1'}
            </p>
          </div>

          {/* Countdown Clock Badge */}
          <div className="bg-[#0B0F17]/90 border border-[#374151] rounded-2xl px-5 py-3 text-center min-w-[140px] shadow-inner">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">
              {currentStatus === 'READY' || currentStatus === 'DELIVERED' ? 'Elapsed Prep' : 'Estimated Time'}
            </span>
            <div className="text-2xl sm:text-3xl font-black font-mono text-[#F97316] tracking-tight mt-0.5">
              {currentStatus === 'DELIVERED'
                ? '00:00'
                : currentStatus === 'READY'
                ? 'READY'
                : secondsRemaining > 0
                ? formatTime(secondsRemaining)
                : 'PLATING...'}
            </div>
            <span className="text-[10px] text-gray-400 block mt-0.5">
              {secondsRemaining > 0 && currentStatus !== 'READY' && currentStatus !== 'DELIVERED'
                ? 'minutes remaining'
                : 'pickup ready'}
            </span>
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="mt-3">
          <div className="flex justify-between text-[11px] text-gray-400 mb-1 font-mono">
            <span>Kitchen Fulfillment</span>
            <span>{progressPercent}% Complete</span>
          </div>
          <div className="w-full h-2 bg-[#1E293B] rounded-full overflow-hidden border border-[#334155]/60">
            <div
              className="h-full bg-gradient-to-r from-[#F97316] to-[#EA580C] rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 4-Step KDS Progress Stepper */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
        <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-4 flex items-center gap-1.5 font-['Poppins']">
          <ChefHat className="w-4 h-4 text-[#F97316]" />
          <span>Kitchen Display System (KDS) Status</span>
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = idx < currentStepIdx;
            const isCurrent = idx === currentStepIdx;

            return (
              <div
                key={step.id}
                className={`p-3 rounded-xl border transition-all text-center relative ${
                  isCurrent
                    ? 'border-[#F97316] bg-[#F97316]/5 shadow-sm ring-2 ring-[#F97316]/20'
                    : isCompleted
                    ? 'border-emerald-200 bg-emerald-50/50'
                    : 'border-gray-100 bg-gray-50/50 opacity-60'
                }`}
              >
                {isCurrent && (
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#F97316] text-white text-[9px] font-extrabold px-2 py-0.2 rounded-full uppercase tracking-wider">
                    Current
                  </span>
                )}
                <div
                  className={`w-8 h-8 rounded-full mx-auto mb-1.5 flex items-center justify-center ${
                    isCurrent
                      ? 'bg-[#F97316] text-white shadow-md animate-bounce'
                      : isCompleted
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <p className="text-xs font-bold text-gray-800 leading-tight">{step.label}</p>
                <p className="text-[10px] text-gray-500 mt-0.5">{step.sublabel}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Kitchen Progress Insight & Telemetry Card */}
      <div className="bg-[#FFFDF8] border border-[#F97316]/30 rounded-2xl p-4 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-lg bg-[#F97316]/10 text-[#F97316] flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-[#1E1E1E] font-['Poppins']">
              Sizzle Intelligence Kitchen Advisor
            </span>
          </div>

          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200">
            Real-Time AI Telemetry
          </span>
        </div>

        <p className="text-xs text-gray-700 leading-relaxed font-sans">
          {getAiExplanation()}
        </p>

        {/* Ordered Items summary list */}
        <div className="pt-2 border-t border-gray-100 flex flex-wrap gap-1.5">
          {receipt.items.map((item, i) => (
            <span
              key={i}
              className="text-[11px] bg-white border border-gray-200 text-gray-700 px-2 py-0.5 rounded-md font-medium"
            >
              {item.quantity}x {item.foodItem.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
