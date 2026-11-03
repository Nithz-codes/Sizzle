import React, { useState, useEffect } from 'react';
import { Flame, Clock, Bell, CheckCircle2, ChevronRight, ChefHat, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { ReceiptData } from '../types';
import { orderApi } from '../services/api';

export const FloatingOrderTrackerPill: React.FC = () => {
  const { activeReceipt, setActiveReceipt, pastReceipts } = useCart();
  const [persistedOrder, setPersistedOrder] = useState<ReceiptData | null>(null);

  // Read latest active order from memory or localStorage
  useEffect(() => {
    if (activeReceipt) {
      setPersistedOrder(activeReceipt);
      return;
    }
    try {
      const saved = localStorage.getItem('sizzle_active_customer_order');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.orderStatus !== 'DELIVERED' && parsed.orderStatus !== 'CANCELLED') {
          setPersistedOrder(parsed);
          return;
        }
      }
    } catch {}

    if (pastReceipts && pastReceipts.length > 0) {
      const latest = pastReceipts[0];
      if (latest && latest.orderStatus !== 'DELIVERED' && latest.orderStatus !== 'CANCELLED') {
        setPersistedOrder(latest);
      }
    }
  }, [activeReceipt, pastReceipts]);

  // Real-time synchronization
  const [liveStatus, setLiveStatus] = useState<string>(
    persistedOrder?.orderStatus || 'PENDING'
  );

  useEffect(() => {
    if (persistedOrder?.orderStatus) {
      setLiveStatus(persistedOrder.orderStatus);
    }
  }, [persistedOrder?.orderStatus]);

  useEffect(() => {
    if (!persistedOrder) return;

    const handleLocalBroadcast = (e: any) => {
      const detail = e.detail;
      if (!detail) return;
      if (
        detail.billNumber === persistedOrder.billNumber ||
        (persistedOrder.id && detail.orderId === persistedOrder.id)
      ) {
        const nextStatus = detail.orderStatus || detail.status;
        if (nextStatus) {
          setLiveStatus(nextStatus);
          setPersistedOrder((prev) => (prev ? { ...prev, orderStatus: nextStatus } : prev));
        }
      }
    };

    window.addEventListener('sizzle_order_status_updated', handleLocalBroadcast);

    const interval = setInterval(async () => {
      const idOrNumber = persistedOrder.id || persistedOrder.orderNumber || persistedOrder.billNumber;
      if (!idOrNumber) return;
      try {
        const res = await orderApi.getOrderByIdOrNumber(idOrNumber);
        if (res.success && res.data && res.data.orderStatus) {
          const remoteStatus = res.data.orderStatus;
          if (remoteStatus !== liveStatus) {
            setLiveStatus(remoteStatus);
            setPersistedOrder((prev) => (prev ? { ...prev, orderStatus: remoteStatus as any } : prev));
          }
        }
      } catch {}
    }, 4000);

    return () => {
      window.removeEventListener('sizzle_order_status_updated', handleLocalBroadcast);
      clearInterval(interval);
    };
  }, [persistedOrder?.id, persistedOrder?.billNumber, liveStatus]);

  // Don't render if no active order or if already delivered and modal is open
  if (!persistedOrder || liveStatus === 'DELIVERED') {
    return null;
  }

  // Calculate live countdown timer for pill
  const startedAt = persistedOrder.preparationStartedAt || Date.now();
  const totalMins = persistedOrder.estimatedMinutes || 20;
  const elapsedSecs = Math.max(0, Math.floor((Date.now() - startedAt) / 1000));
  const remainingSecs = Math.max(0, totalMins * 60 - elapsedSecs);
  const m = Math.floor(remainingSecs / 60);
  const s = remainingSecs % 60;
  const timeStr = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

  const handleOpenTracker = () => {
    setActiveReceipt({
      ...persistedOrder,
      orderStatus: liveStatus as any,
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 animate-in slide-in-from-bottom-5 duration-300">
      <button
        onClick={handleOpenTracker}
        className="group bg-gradient-to-r from-[#111827] to-[#1F2937] hover:from-[#000000] hover:to-[#111827] text-white pl-4 pr-3 py-3 rounded-2xl shadow-2xl border border-[#374151] flex items-center gap-3.5 cursor-pointer transition-all hover:scale-105 active:scale-95"
      >
        {/* Pulsing indicator */}
        <div className="relative flex items-center justify-center">
          <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-[#F97316]/40 opacity-75" />
          <div className="w-8 h-8 rounded-xl bg-[#F97316] text-white flex items-center justify-center shadow-md">
            {liveStatus === 'READY' ? (
              <Bell className="w-4 h-4 animate-bounce" />
            ) : liveStatus === 'PREPARING' ? (
              <Flame className="w-4 h-4 animate-pulse" />
            ) : (
              <ChefHat className="w-4 h-4" />
            )}
          </div>
        </div>

        {/* Order Details Text */}
        <div className="text-left">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-gray-400 font-mono">
              Order #{persistedOrder.billNumber}
            </span>
            <span
              className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full ${
                liveStatus === 'READY'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-pulse'
                  : liveStatus === 'PREPARING'
                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
              }`}
            >
              {liveStatus === 'READY' ? 'READY TO SERVE' : liveStatus === 'PREPARING' ? 'COOKING IN KDS' : 'IN QUEUE'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-white mt-0.5">
            <Clock className="w-3 h-3 text-[#F97316]" />
            <span className="font-mono text-[#F97316]">
              {liveStatus === 'READY' ? 'Hot & Ready!' : remainingSecs > 0 ? `${timeStr} remaining` : 'Plating now...'}
            </span>
          </div>
        </div>

        {/* Arrow Button */}
        <div className="w-7 h-7 rounded-xl bg-white/10 group-hover:bg-[#F97316] text-white flex items-center justify-center transition-colors">
          <ChevronRight className="w-4 h-4" />
        </div>
      </button>
    </div>
  );
};
