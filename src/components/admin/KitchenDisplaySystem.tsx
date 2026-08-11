import React, { useState, useEffect, useMemo } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { ReceiptData } from '../../types';
import {
  ChefHat,
  Clock,
  CheckCircle2,
  AlertCircle,
  Flame,
  UtensilsCrossed,
  Search,
  Filter,
  Volume2,
  VolumeX,
  RefreshCw,
  ShoppingBag,
  Bell,
  ArrowRight,
} from 'lucide-react';

export const KitchenDisplaySystem: React.FC = () => {
  const { orders, updateOrderStatus } = useAdmin();

  const [activeFilter, setActiveFilter] = useState<'ALL_ACTIVE' | 'PENDING' | 'PREPARING' | 'READY'>('ALL_ACTIVE');
  const [searchQuery, setSearchQuery] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [nowTime, setNowTime] = useState<number>(Date.now());

  // Update ticker every 10 seconds for prep timers
  useEffect(() => {
    const interval = setInterval(() => {
      setNowTime(Date.now());
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Filter non-delivered/non-cancelled active kitchen tickets
  const activeOrders = useMemo(() => {
    return orders.filter((o) => {
      const status = o.orderStatus || 'PENDING';
      return status !== 'DELIVERED' && status !== 'CANCELLED';
    });
  }, [orders]);

  // Apply tab filter & search
  const filteredTickets = useMemo(() => {
    return activeOrders.filter((order) => {
      const status = order.orderStatus || 'PENDING';
      const matchesStatus =
        activeFilter === 'ALL_ACTIVE' ? true : status === activeFilter;

      const q = searchQuery.toLowerCase().trim();
      const cleanQ = q.replace('#', '');
      const matchesSearch =
        !q ||
        order.billNumber.toString().includes(cleanQ) ||
        order.customer.customerName.toLowerCase().includes(q) ||
        (order.tableNumber && order.tableNumber.toLowerCase().includes(q));

      return matchesStatus && matchesSearch;
    });
  }, [activeOrders, activeFilter, searchQuery]);

  // Statistics
  const pendingCount = useMemo(() => activeOrders.filter((o) => (o.orderStatus || 'PENDING') === 'PENDING').length, [activeOrders]);
  const preparingCount = useMemo(() => activeOrders.filter((o) => o.orderStatus === 'PREPARING').length, [activeOrders]);
  const readyCount = useMemo(() => activeOrders.filter((o) => o.orderStatus === 'READY').length, [activeOrders]);

  // Helper to parse elapsed prep time in minutes
  const getElapsedMinutes = (dateTimeStr: string): number => {
    try {
      const parsed = new Date(dateTimeStr).getTime();
      if (!isNaN(parsed)) {
        return Math.max(0, Math.floor((nowTime - parsed) / 60000));
      }
    } catch {
      // Fallback
    }
    return 5;
  };

  const getUrgencyColor = (mins: number) => {
    if (mins >= 20) return 'bg-red-500/20 text-red-400 border-red-500/50 animate-pulse';
    if (mins >= 10) return 'bg-amber-500/20 text-amber-400 border-amber-500/50';
    return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
  };

  return (
    <div className="space-y-6">
      {/* Top Header Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#161922] border border-[#262B3B] p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Active Kitchen Tickets</p>
            <p className="text-2xl font-bold text-white mt-1">{activeOrders.length}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
            <ChefHat className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#161922] border border-[#262B3B] p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Pending (New)</p>
            <p className="text-2xl font-bold text-amber-400 mt-1">{pendingCount}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#161922] border border-[#262B3B] p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">In Kitchen (Cooking)</p>
            <p className="text-2xl font-bold text-blue-400 mt-1">{preparingCount}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
        </div>

        <div className="bg-[#161922] border border-[#262B3B] p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Ready to Serve</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">{readyCount}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Control & Filter Bar */}
      <div className="bg-[#161922] border border-[#262B3B] p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          <button
            onClick={() => setActiveFilter('ALL_ACTIVE')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeFilter === 'ALL_ACTIVE'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20'
                : 'bg-[#1E2330] text-gray-400 hover:text-white hover:bg-[#262B3B]'
            }`}
          >
            All Active ({activeOrders.length})
          </button>
          <button
            onClick={() => setActiveFilter('PENDING')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeFilter === 'PENDING'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                : 'bg-[#1E2330] text-gray-400 hover:text-white hover:bg-[#262B3B]'
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setActiveFilter('PREPARING')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeFilter === 'PREPARING'
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                : 'bg-[#1E2330] text-gray-400 hover:text-white hover:bg-[#262B3B]'
            }`}
          >
            Preparing ({preparingCount})
          </button>
          <button
            onClick={() => setActiveFilter('READY')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeFilter === 'READY'
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                : 'bg-[#1E2330] text-gray-400 hover:text-white hover:bg-[#262B3B]'
            }`}
          >
            Ready ({readyCount})
          </button>
        </div>

        {/* Search & Audio controls */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search table or ticket #"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1A1F2C] border border-[#262B3B] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
            />
          </div>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-lg border text-xs flex items-center gap-1.5 transition-all ${
              soundEnabled
                ? 'bg-orange-500/10 border-orange-500/30 text-orange-400'
                : 'bg-[#1E2330] border-[#262B3B] text-gray-400'
            }`}
            title="Toggle kitchen chime sound"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Kitchen Ticket Cards Grid */}
      {filteredTickets.length === 0 ? (
        <div className="bg-[#161922] border border-[#262B3B] rounded-2xl p-12 text-center">
          <ChefHat className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-1">Kitchen Queue Clear!</h3>
          <p className="text-sm text-gray-400 max-w-sm mx-auto">
            No active tickets matching the current filter. New orders will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTickets.map((ticket) => {
            const status = ticket.orderStatus || 'PENDING';
            const elapsedMins = getElapsedMinutes(ticket.dateTime);

            return (
              <div
                key={ticket.billNumber}
                className={`bg-[#161922] border rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 shadow-xl ${
                  status === 'PENDING'
                    ? 'border-amber-500/40 shadow-amber-500/5'
                    : status === 'PREPARING'
                    ? 'border-blue-500/40 shadow-blue-500/5'
                    : 'border-emerald-500/40 shadow-emerald-500/5'
                }`}
              >
                <div>
                  {/* Card Header: Ticket #, Table & Prep Timer */}
                  <div className="flex items-center justify-between border-b border-[#262B3B] pb-3 mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-black text-white">#{ticket.billNumber}</span>
                        {ticket.tableNumber && (
                          <span className="bg-[#242A38] text-gray-300 px-2 py-0.5 rounded text-xs font-semibold">
                            {ticket.tableNumber}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{ticket.customer.customerName}</p>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      {/* Urgency Prep Timer */}
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border flex items-center gap-1 ${getUrgencyColor(elapsedMins)}`}>
                        <Clock className="w-3 h-3" />
                        {elapsedMins}m elapsed
                      </span>
                      {/* Status Badge */}
                      <span
                        className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                          status === 'PENDING'
                            ? 'bg-amber-500/10 text-amber-400'
                            : status === 'PREPARING'
                            ? 'bg-blue-500/10 text-blue-400'
                            : 'bg-emerald-500/10 text-emerald-400'
                        }`}
                      >
                        {status}
                      </span>
                    </div>
                  </div>

                  {/* Special Order Notes */}
                  {ticket.orderNotes && (
                    <div className="bg-amber-500/10 border border-amber-500/30 p-2.5 rounded-lg mb-4 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-200 font-medium leading-relaxed">
                        <strong className="text-amber-400">Chef Note:</strong> {ticket.orderNotes}
                      </p>
                    </div>
                  )}

                  {/* Itemized Dish List */}
                  <div className="space-y-2.5 mb-6">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Ordered Items</p>
                    {ticket.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between bg-[#1A1F2C] p-2.5 rounded-lg border border-[#262B3B]"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="w-6 h-6 rounded bg-orange-500/20 text-orange-400 font-bold text-xs flex items-center justify-center shrink-0">
                            {item.quantity}x
                          </span>
                          <span className="text-xs font-semibold text-white truncate">
                            {item.foodItem.name}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400 font-medium shrink-0 ml-2">
                          ₹{item.totalPrice.toFixed(0)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Action Controls */}
                <div className="border-t border-[#262B3B] pt-4 flex items-center gap-2">
                  {status === 'PENDING' && (
                    <button
                      onClick={() => updateOrderStatus(ticket.billNumber, 'PREPARING')}
                      className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/10 active:scale-[0.98]"
                    >
                      <Flame className="w-4 h-4" />
                      Start Cooking
                    </button>
                  )}

                  {status === 'PREPARING' && (
                    <button
                      onClick={() => updateOrderStatus(ticket.billNumber, 'READY')}
                      className="w-full py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/10 active:scale-[0.98]"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Mark Ready to Serve
                    </button>
                  )}

                  {status === 'READY' && (
                    <button
                      onClick={() => updateOrderStatus(ticket.billNumber, 'DELIVERED')}
                      className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-black font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/10 active:scale-[0.98]"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      Complete Order
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
