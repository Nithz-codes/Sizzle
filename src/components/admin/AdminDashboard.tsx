import React, { useMemo } from 'react';
import { useAdmin } from '../../context/AdminContext';
import {
  DollarSign,
  ShoppingBag,
  Clock,
  ChefHat,
  CheckCircle2,
  Truck,
  Calendar,
  UtensilsCrossed,
  Flame,
  Award,
  TrendingUp,
  ArrowUpRight,
  FileSpreadsheet,
  Settings,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { orders, reservations, tablesList, setActiveTab } = useAdmin();

  // Metric Computations
  const metrics = useMemo(() => {
    // Total Revenue (exclude cancelled orders)
    const validOrders = orders.filter((o) => o.orderStatus !== 'CANCELLED');
    const todayRevenue = validOrders.reduce((sum, o) => sum + o.bill.grandTotal, 0);

    const pendingCount = orders.filter((o) => o.orderStatus === 'PENDING' || !o.orderStatus).length;
    const preparingCount = orders.filter((o) => o.orderStatus === 'PREPARING').length;
    const readyCount = orders.filter((o) => o.orderStatus === 'READY').length;
    const deliveredCount = orders.filter((o) => o.orderStatus === 'DELIVERED').length;

    const availableTables = tablesList.filter((t) => !t.isOccupied).length;
    const totalTables = tablesList.length;

    // Top Selling Food & Most Popular Category
    const itemSalesMap: Record<string, { name: string; image: string; category: string; price: number; qty: number; revenue: number }> = {};
    const categorySalesMap: Record<string, number> = {};

    orders.forEach((order) => {
      if (order.orderStatus === 'CANCELLED') return;
      order.items.forEach((item) => {
        const key = item.foodItem.name;
        if (!itemSalesMap[key]) {
          itemSalesMap[key] = {
            name: item.foodItem.name,
            image: item.foodItem.image,
            category: item.foodItem.category,
            price: item.foodItem.price,
            qty: 0,
            revenue: 0,
          };
        }
        itemSalesMap[key].qty += item.quantity;
        itemSalesMap[key].revenue += item.totalPrice;

        const cat = item.foodItem.category;
        categorySalesMap[cat] = (categorySalesMap[cat] || 0) + item.quantity;
      });
    });

    const topFood = Object.values(itemSalesMap).sort((a, b) => b.qty - a.qty)[0] || {
      name: 'Truffle Mushroom Burger',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80',
      category: 'Burger',
      price: 249,
      qty: 12,
      revenue: 2988,
    };

    const topCategoryEntry = Object.entries(categorySalesMap).sort((a, b) => b[1] - a[1])[0] || ['Burger', 15];
    const totalItemsSold = Object.values(categorySalesMap).reduce((a, b) => a + b, 0) || 1;
    const popularCategory = {
      name: topCategoryEntry[0],
      count: topCategoryEntry[1],
      percentage: Math.round((topCategoryEntry[1] / totalItemsSold) * 100),
    };

    return {
      todayRevenue,
      todayOrdersCount: orders.length,
      pendingCount,
      preparingCount,
      readyCount,
      deliveredCount,
      totalReservationsCount: reservations.length,
      availableTables,
      totalTables,
      topFood,
      popularCategory,
    };
  }, [orders, reservations, tablesList]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Executive Command Banner */}
      <div className="bg-[#1F2937] border border-[#374151] rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-[#F97316]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-[#F97316]/10 border border-[#F97316]/30 text-[#F97316] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5" />
              <span>Real-Time Enterprise Command</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F9FAFB] font-['Poppins']">
              SIZZLE Dashboard Overview
            </h1>
            <p className="text-xs sm:text-sm text-[#D1D5DB] max-w-xl">
              Monitor key metrics, order lifecycles, table availability, and live sales performance for today's service.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('reports')}
              className="bg-[#F97316] hover:bg-[#EA580C] text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-[#F97316]/20 flex items-center gap-2 cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Export Reports</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className="bg-[#374151] hover:bg-[#4B5563] text-[#F9FAFB] font-semibold text-xs px-4 py-2.5 rounded-xl border border-[#4B5563] transition-all flex items-center gap-2 cursor-pointer"
            >
              <Settings className="w-4 h-4 text-[#F97316]" />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Row 1: Primary Enterprise KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Today's Revenue */}
        <div className="bg-[#1E293B] border border-[#374151] hover:border-[#F97316]/50 p-6 rounded-2xl shadow-md transition-all space-y-4 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider font-['Poppins']">
              Today's Revenue
            </span>
            <div className="w-10 h-10 rounded-xl bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-[#F9FAFB] font-['Poppins']">
              ₹{metrics.todayRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#22C55E] font-semibold mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18.4% vs yesterday</span>
            </div>
          </div>
        </div>

        {/* Today's Orders */}
        <div className="bg-[#1E293B] border border-[#374151] hover:border-[#F97316]/50 p-6 rounded-2xl shadow-md transition-all space-y-4 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider font-['Poppins']">
              Today's Orders
            </span>
            <div className="w-10 h-10 rounded-xl bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-[#F9FAFB] font-['Poppins']">
              {metrics.todayOrdersCount}
            </div>
            <p className="text-xs text-[#9CA3AF] mt-1">Orders placed in session</p>
          </div>
        </div>

        {/* Total Reservations */}
        <div className="bg-[#1E293B] border border-[#374151] hover:border-[#F97316]/50 p-6 rounded-2xl shadow-md transition-all space-y-4 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider font-['Poppins']">
              Total Reservations
            </span>
            <div className="w-10 h-10 rounded-xl bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-[#F9FAFB] font-['Poppins']">
              {metrics.totalReservationsCount}
            </div>
            <p className="text-xs text-[#9CA3AF] mt-1">Table bookings scheduled</p>
          </div>
        </div>

        {/* Available Tables */}
        <div className="bg-[#1E293B] border border-[#374151] hover:border-[#F97316]/50 p-6 rounded-2xl shadow-md transition-all space-y-4 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider font-['Poppins']">
              Available Tables
            </span>
            <div className="w-10 h-10 rounded-xl bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#F9FAFB] font-['Poppins']">
                {metrics.availableTables}
              </span>
              <span className="text-sm font-semibold text-[#9CA3AF]">/ {metrics.totalTables} Tables</span>
            </div>
            {/* Occupancy bar */}
            <div className="w-full bg-[#111827] h-2 rounded-full mt-2 overflow-hidden border border-[#374151]">
              <div
                className="bg-[#22C55E] h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.round((metrics.availableTables / metrics.totalTables) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Order Lifecycle Cards */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-[#F9FAFB] font-['Poppins'] flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#F97316]" />
          <span>Live Order Status Lifecycle</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Pending */}
          <div
            onClick={() => setActiveTab('orders')}
            className="bg-[#1E293B] border border-[#F59E0B]/30 hover:border-[#F59E0B]/70 p-5 rounded-2xl shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#F59E0B] uppercase tracking-wider">Pending</span>
              <Clock className="w-4 h-4 text-[#F59E0B] group-hover:rotate-45 transition-transform" />
            </div>
            <div className="text-2xl font-extrabold text-[#F9FAFB] mt-2 font-['Poppins']">
              {metrics.pendingCount}
            </div>
            <p className="text-[11px] text-[#9CA3AF] mt-1">Awaiting kitchen action</p>
          </div>

          {/* Preparing */}
          <div
            onClick={() => setActiveTab('orders')}
            className="bg-[#1E293B] border border-[#3B82F6]/30 hover:border-[#3B82F6]/70 p-5 rounded-2xl shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#3B82F6] uppercase tracking-wider">Preparing</span>
              <ChefHat className="w-4 h-4 text-[#3B82F6] group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl font-extrabold text-[#F9FAFB] mt-2 font-['Poppins']">
              {metrics.preparingCount}
            </div>
            <p className="text-[11px] text-[#9CA3AF] mt-1">Cooking in kitchen</p>
          </div>

          {/* Ready */}
          <div
            onClick={() => setActiveTab('orders')}
            className="bg-[#1E293B] border border-[#22C55E]/30 hover:border-[#22C55E]/70 p-5 rounded-2xl shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#22C55E] uppercase tracking-wider">Ready</span>
              <CheckCircle2 className="w-4 h-4 text-[#22C55E] group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl font-extrabold text-[#F9FAFB] mt-2 font-['Poppins']">
              {metrics.readyCount}
            </div>
            <p className="text-[11px] text-[#9CA3AF] mt-1">Ready for serving</p>
          </div>

          {/* Delivered */}
          <div
            onClick={() => setActiveTab('orders')}
            className="bg-[#1E293B] border border-[#38BDF8]/30 hover:border-[#38BDF8]/70 p-5 rounded-2xl shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#38BDF8] uppercase tracking-wider">Delivered</span>
              <Truck className="w-4 h-4 text-[#38BDF8] group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="text-2xl font-extrabold text-[#F9FAFB] mt-2 font-['Poppins']">
              {metrics.deliveredCount}
            </div>
            <p className="text-[11px] text-[#9CA3AF] mt-1">Completed & billed</p>
          </div>
        </div>
      </div>

      {/* Row 3: Product Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Food Card */}
        <div className="bg-[#1E293B] border border-[#374151] rounded-2xl p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#374151]">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#F9FAFB] font-['Poppins']">Top Selling Food Item</h3>
                <p className="text-xs text-[#9CA3AF]">Highest quantity ordered today</p>
              </div>
            </div>
            <span className="text-xs font-extrabold text-[#F97316] bg-[#F97316]/10 px-3 py-1 rounded-full border border-[#F97316]/30">
              #1 Bestseller
            </span>
          </div>

          <div className="flex items-center gap-4 pt-1">
            <img
              src={metrics.topFood.image}
              alt={metrics.topFood.name}
              className="w-20 h-20 rounded-xl object-cover border border-[#374151] shadow-md shrink-0"
            />
            <div className="space-y-1 min-w-0 flex-1">
              <span className="text-[11px] font-bold text-[#F97316] bg-[#F97316]/10 px-2 py-0.5 rounded-md uppercase">
                {metrics.topFood.category}
              </span>
              <h4 className="text-base font-bold text-[#F9FAFB] truncate">{metrics.topFood.name}</h4>
              <div className="flex items-center gap-4 text-xs text-[#D1D5DB] pt-1">
                <span>Unit Price: <strong className="text-white">₹{metrics.topFood.price}</strong></span>
                <span>•</span>
                <span>Sold: <strong className="text-[#22C55E]">{metrics.topFood.qty} orders</strong></span>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="block text-[10px] text-[#9CA3AF] uppercase font-semibold">Total Revenue</span>
              <span className="text-lg font-extrabold text-[#22C55E] font-['Poppins']">
                ₹{metrics.topFood.revenue.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Most Popular Category Card */}
        <div className="bg-[#1E293B] border border-[#374151] rounded-2xl p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#374151]">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#F9FAFB] font-['Poppins']">Most Popular Category</h3>
                <p className="text-xs text-[#9CA3AF]">Category with highest customer demand</p>
              </div>
            </div>
            <span className="text-xs font-extrabold text-[#F97316] bg-[#F97316]/10 px-3 py-1 rounded-full border border-[#F97316]/30">
              {metrics.popularCategory.percentage}% Share
            </span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="space-y-1">
              <h4 className="text-2xl font-extrabold text-[#F9FAFB] font-['Poppins']">
                {metrics.popularCategory.name}
              </h4>
              <p className="text-xs text-[#D1D5DB]">
                Total <strong className="text-[#F97316]">{metrics.popularCategory.count} items</strong> ordered across active tables
              </p>
            </div>

            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#F97316] to-[#EA580C] flex items-center justify-center text-white font-black text-xl shadow-lg">
              {metrics.popularCategory.name.charAt(0)}
            </div>
          </div>

          {/* Progress Share Bar */}
          <div className="space-y-1 pt-2">
            <div className="flex justify-between text-xs text-[#9CA3AF] font-medium">
              <span>Category Share</span>
              <span>{metrics.popularCategory.percentage}% of total food sales</span>
            </div>
            <div className="w-full bg-[#111827] h-2 rounded-full overflow-hidden border border-[#374151]">
              <div
                className="bg-[#F97316] h-full rounded-full transition-all duration-500"
                style={{ width: `${metrics.popularCategory.percentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Row 4: Quick Navigation Shortcuts */}
      <div className="bg-[#1E293B] border border-[#374151] rounded-2xl p-6 shadow-md space-y-4">
        <h3 className="text-base font-bold text-[#F9FAFB] font-['Poppins']">Quick Admin Management Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <button
            onClick={() => setActiveTab('orders')}
            className="flex items-center justify-between p-4 rounded-xl bg-[#1F2937] hover:bg-[#374151] border border-[#374151] text-left transition-all cursor-pointer group"
          >
            <div>
              <span className="block font-bold text-[#F9FAFB] text-sm">Manage Orders</span>
              <span className="text-xs text-[#9CA3AF]">{orders.length} total orders</span>
            </div>
            <ArrowUpRight className="w-5 h-5 text-[#F97316] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>

          <button
            onClick={() => setActiveTab('reservations')}
            className="flex items-center justify-between p-4 rounded-xl bg-[#1F2937] hover:bg-[#374151] border border-[#374151] text-left transition-all cursor-pointer group"
          >
            <div>
              <span className="block font-bold text-[#F9FAFB] text-sm">Bookings & Tables</span>
              <span className="text-xs text-[#9CA3AF]">{reservations.length} reservations</span>
            </div>
            <ArrowUpRight className="w-5 h-5 text-[#F97316] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>

          <button
            onClick={() => setActiveTab('customers')}
            className="flex items-center justify-between p-4 rounded-xl bg-[#1F2937] hover:bg-[#374151] border border-[#374151] text-left transition-all cursor-pointer group"
          >
            <div>
              <span className="block font-bold text-[#F9FAFB] text-sm">Customer Directory</span>
              <span className="text-xs text-[#9CA3AF]">View profile status</span>
            </div>
            <ArrowUpRight className="w-5 h-5 text-[#F97316] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className="flex items-center justify-between p-4 rounded-xl bg-[#1F2937] hover:bg-[#374151] border border-[#374151] text-left transition-all cursor-pointer group"
          >
            <div>
              <span className="block font-bold text-[#F9FAFB] text-sm">Export Reports</span>
              <span className="text-xs text-[#9CA3AF]">PDF & CSV downloads</span>
            </div>
            <ArrowUpRight className="w-5 h-5 text-[#F97316] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
