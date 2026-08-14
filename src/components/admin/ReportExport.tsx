import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { analyticsApi, inventoryApi } from '../../services/api';
import {
  FileSpreadsheet,
  Download,
  Printer,
  FileText,
  Calendar,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Award,
  Clock,
  PieChart,
  Package,
} from 'lucide-react';

export const ReportExport: React.FC = () => {
  const { orders, reservations, settings } = useAdmin();

  const [activeReportTab, setActiveReportTab] = useState<'orders' | 'reservations' | 'revenue' | 'inventory'>('orders');
  const [analyticsOverview, setAnalyticsOverview] = useState<any>(null);
  const [topDishes, setTopDishes] = useState<any[]>([]);
  const [categorySales, setCategorySales] = useState<any[]>([]);
  const [hourlyDemand, setHourlyDemand] = useState<any[]>([]);
  const [inventoryList, setInventoryList] = useState<any[]>([]);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState<boolean>(false);

  useEffect(() => {
    setIsLoadingAnalytics(true);
    Promise.all([
      analyticsApi.getOverview().catch(() => null),
      analyticsApi.getTopDishes(5).catch(() => null),
      analyticsApi.getCategorySales().catch(() => null),
      analyticsApi.getHourlyDemand().catch(() => null),
      inventoryApi.getAllItems().catch(() => null),
    ]).then(([ov, td, cat, hr, inv]) => {
      if (ov?.success && ov?.data) setAnalyticsOverview(ov.data);
      if (td?.success && Array.isArray(td.data)) setTopDishes(td.data);
      if (cat?.success && Array.isArray(cat.data)) setCategorySales(cat.data);
      if (hr?.success && Array.isArray(hr.data)) setHourlyDemand(hr.data);
      if (inv?.success && Array.isArray(inv.data)) setInventoryList(inv.data);
      setIsLoadingAnalytics(false);
    });
  }, []);

  // CSV Export Utility (Uses UTF-8 Blob & Object URL to prevent URI fragment truncations)
  const exportToCSV = (filename: string, headers: string[], rows: (string | number | undefined | null)[][]) => {
    const csvLines = [
      headers.map((h) => `"${String(h).replace(/"/g, '""')}"`).join(','),
      ...rows.map((row) =>
        row.map((val) => `"${String(val ?? '').replace(/"/g, '""')}"`).join(',')
      ),
    ];
    // UTF-8 BOM prefix (\uFEFF) ensures Excel and text editors parse symbols and UTF-8 characters cleanly
    const csvString = '\uFEFF' + csvLines.join('\r\n');

    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // PDF Export Utility (Invokes HTML document print view)
  const exportToPDF = (reportTitle: string, htmlBody: string) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${reportTitle} - ${settings.restaurantName}</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 30px; color: #1e293b; }
            h1 { color: #f97316; margin-bottom: 5px; font-size: 24px; }
            .header { border-b: 2px solid #e2e8f0; padding-bottom: 15px; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 12px; }
            th { background: #f1f5f9; text-align: left; padding: 10px; border-bottom: 2px solid #cbd5e1; font-weight: bold; }
            td { padding: 10px; border-bottom: 1px solid #e2e8f0; }
            .summary-box { background: #fff7ed; border: 1px solid #ffedd5; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
            .footer { margin-top: 30px; font-size: 11px; color: #64748b; text-align: center; border-t: 1px solid #e2e8f0; pt: 15px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${settings.restaurantName}</h1>
            <p><strong>Report:</strong> ${reportTitle} | Generated on ${new Date().toLocaleString()}</p>
            <p>${settings.address} | ${settings.contactNumber}</p>
          </div>
          ${htmlBody}
          <div class="footer">
            Generated automatically by SIZZLE Enterprise Restaurant Management System.
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  // Orders Export Handlers
  const handleExportOrdersCSV = () => {
    const headers = ['Order ID', 'Date & Time', 'Customer Name', 'Phone', 'Payment Method', 'Items Count', 'Subtotal (₹)', 'GST (₹)', 'Grand Total (₹)', 'Status'];
    const rows = orders.map((o) => [
      o.billNumber ? `ORD-${o.billNumber}` : 'ORD-N/A',
      o.dateTime || '',
      o.customer?.customerName || 'Guest Customer',
      o.customer?.phoneNumber || 'N/A',
      o.customer?.paymentMethod || 'Cash',
      o.items ? o.items.length : 0,
      o.bill?.subtotal ? Number(o.bill.subtotal).toFixed(2) : '0.00',
      o.bill?.gst ? Number(o.bill.gst).toFixed(2) : '0.00',
      o.bill?.grandTotal ? Number(o.bill.grandTotal).toFixed(2) : '0.00',
      o.orderStatus || 'PENDING',
    ]);
    exportToCSV('Orders_Report', headers, rows);
  };

  const handleExportOrdersPDF = () => {
    const rowsHtml = orders
      .map(
        (o) => `
      <tr>
        <td>#${o.billNumber}</td>
        <td>${o.dateTime}</td>
        <td>${o.customer.customerName} (${o.customer.phoneNumber})</td>
        <td>${o.customer.paymentMethod}</td>
        <td>₹${o.bill.grandTotal.toFixed(2)}</td>
        <td><strong>${o.orderStatus || 'PENDING'}</strong></td>
      </tr>
    `
      )
      .join('');

    const totalRevenue = orders.filter((o) => o.orderStatus !== 'CANCELLED').reduce((s, o) => s + o.bill.grandTotal, 0);

    const bodyHtml = `
      <div class="summary-box">
        <p><strong>Total Orders:</strong> ${orders.length} | <strong>Total Sales Revenue:</strong> ₹${totalRevenue.toFixed(2)}</p>
      </div>
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Date</th>
            <th>Customer</th>
            <th>Payment</th>
            <th>Grand Total</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    `;
    exportToPDF('Orders Executive Report', bodyHtml);
  };

  // Reservations Export Handlers
  const handleExportReservationsCSV = () => {
    const headers = ['Reservation ID', 'Guest Name', 'Email', 'Phone', 'Date', 'Time', 'Guests', 'Table', 'Status', 'Occasion'];
    const rows = reservations.map((r) => [
      r.id,
      r.guestName,
      r.email,
      r.phone,
      r.date,
      r.time,
      r.guestCount,
      r.assignedTable,
      r.status,
      r.occasion || 'N/A',
    ]);
    exportToCSV('Reservations_Report', headers, rows);
  };

  const handleExportReservationsPDF = () => {
    const rowsHtml = reservations
      .map(
        (r) => `
      <tr>
        <td>${r.id}</td>
        <td>${r.guestName}</td>
        <td>${r.phone}</td>
        <td>${r.date} ${r.time}</td>
        <td>${r.guestCount} Guests</td>
        <td>${r.assignedTable}</td>
        <td><strong>${r.status}</strong></td>
      </tr>
    `
      )
      .join('');

    const bodyHtml = `
      <div class="summary-box">
        <p><strong>Total Bookings:</strong> ${reservations.length}</p>
      </div>
      <table>
        <thead>
          <tr>
            <th>Res ID</th>
            <th>Guest Name</th>
            <th>Phone</th>
            <th>Schedule</th>
            <th>Capacity</th>
            <th>Table</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    `;
    exportToPDF('Reservations Master Report', bodyHtml);
  };

  // Revenue Export Handlers
  const handleExportRevenueCSV = () => {
    const validOrders = orders.filter((o) => o.orderStatus !== 'CANCELLED');
    const totalSubtotal = validOrders.reduce((s, o) => s + o.bill.subtotal, 0);
    const totalGST = validOrders.reduce((s, o) => s + o.bill.gst, 0);
    const totalDiscounts = validOrders.reduce((s, o) => s + o.bill.discount, 0);
    const grandRevenue = validOrders.reduce((s, o) => s + o.bill.grandTotal, 0);

    const headers = ['Metric Description', 'Value (₹)'];
    const rows = [
      ['Total Completed Orders', validOrders.length],
      ['Gross Subtotal Sales', totalSubtotal.toFixed(2)],
      ['Total Discounts Awarded (10%)', totalDiscounts.toFixed(2)],
      ['Total GST Collected (5%)', totalGST.toFixed(2)],
      ['Net Realized Revenue', grandRevenue.toFixed(2)],
    ];
    exportToCSV('Revenue_Summary_Report', headers, rows);
  };

  const handleExportRevenuePDF = () => {
    const validOrders = orders.filter((o) => o.orderStatus !== 'CANCELLED');
    const totalSubtotal = validOrders.reduce((s, o) => s + o.bill.subtotal, 0);
    const totalGST = validOrders.reduce((s, o) => s + o.bill.gst, 0);
    const totalDiscounts = validOrders.reduce((s, o) => s + o.bill.discount, 0);
    const grandRevenue = validOrders.reduce((s, o) => s + o.bill.grandTotal, 0);

    const bodyHtml = `
      <div class="summary-box">
        <h2>Executive Financial Performance</h2>
        <p><strong>Net Realized Revenue:</strong> ₹${grandRevenue.toFixed(2)}</p>
      </div>
      <table>
        <thead>
          <tr>
            <th>Financial Metric</th>
            <th>Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Total Completed Orders</td><td>${validOrders.length}</td></tr>
          <tr><td>Gross Subtotal Sales</td><td>₹${totalSubtotal.toFixed(2)}</td></tr>
          <tr><td>Discounts Applied (10% over ₹1000)</td><td>-₹${totalDiscounts.toFixed(2)}</td></tr>
          <tr><td>5% GST Collected</td><td>₹${totalGST.toFixed(2)}</td></tr>
          <tr style="font-weight: bold; background: #f8fafc;"><td>Net Grand Revenue</td><td>₹${grandRevenue.toFixed(2)}</td></tr>
        </tbody>
      </table>
    `;
    exportToPDF('Revenue Financial Summary Report', bodyHtml);
  };

  // Inventory Export Handlers
  const handleExportInventoryCSV = () => {
    const headers = ['Item ID', 'Ingredient Name', 'Category', 'Stock Quantity', 'Unit', 'Min Threshold', 'Unit Cost (₹)', 'Total Valuation (₹)', 'Status'];
    const rows = inventoryList.map((item) => [
      item.id,
      item.name,
      item.category,
      item.quantity,
      item.unit,
      item.minThreshold,
      Number(item.costPerUnit || 0).toFixed(2),
      Number(item.totalValue || (item.costPerUnit * item.quantity) || 0).toFixed(2),
      item.status,
    ]);
    exportToCSV('Inventory_Stock_Report', headers, rows);
  };

  const handleExportInventoryPDF = () => {
    const rowsHtml = inventoryList
      .map(
        (i) => `
      <tr>
        <td>#${i.id}</td>
        <td>${i.name}</td>
        <td>${i.category}</td>
        <td>${i.quantity} ${i.unit}</td>
        <td>₹${Number(i.costPerUnit || 0).toFixed(2)}</td>
        <td>₹${Number(i.totalValue || 0).toFixed(2)}</td>
        <td><strong>${i.status}</strong></td>
      </tr>
    `
      )
      .join('');

    const bodyHtml = `
      <div class="summary-box">
        <p><strong>Total Ingredients Tracked:</strong> ${inventoryList.length}</p>
      </div>
      <table>
        <thead>
          <tr>
            <th>Item ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Unit Cost</th>
            <th>Valuation</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    `;
    exportToPDF('Inventory Stock Audit Report', bodyHtml);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-[#1E293B] border border-[#374151] rounded-2xl p-6 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#F9FAFB] font-['Poppins']">
              Business Intelligence & Report Export Center
            </h1>
            <p className="text-xs text-[#9CA3AF]">
              Live sales performance analytics, peak hour demand insights, and instant CSV/PDF reporting.
            </p>
          </div>
        </div>
      </div>

      {/* BI Analytics Metrics Overview Grid */}
      {analyticsOverview && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#1E293B] border border-[#374151] p-5 rounded-2xl shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#9CA3AF] font-bold uppercase tracking-wider">Total Sales Revenue</span>
              <DollarSign className="w-5 h-5 text-[#22C55E]" />
            </div>
            <p className="text-2xl font-extrabold text-[#F9FAFB] font-['Poppins'] mt-2">
              ₹{Number(analyticsOverview.totalRevenue || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
            <span className="text-[11px] text-[#22C55E] font-semibold mt-1 inline-block">Live DB Analytics</span>
          </div>

          <div className="bg-[#1E293B] border border-[#374151] p-5 rounded-2xl shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#9CA3AF] font-bold uppercase tracking-wider">Average Order Value</span>
              <TrendingUp className="w-5 h-5 text-[#F97316]" />
            </div>
            <p className="text-2xl font-extrabold text-[#F9FAFB] font-['Poppins'] mt-2">
              ₹{Number(analyticsOverview.averageOrderValue || 0).toFixed(2)}
            </p>
            <span className="text-[11px] text-[#9CA3AF] mt-1 inline-block">Per Customer Checkout</span>
          </div>

          <div className="bg-[#1E293B] border border-[#374151] p-5 rounded-2xl shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#9CA3AF] font-bold uppercase tracking-wider">Completed Orders</span>
              <ShoppingBag className="w-5 h-5 text-[#3B82F6]" />
            </div>
            <p className="text-2xl font-extrabold text-[#F9FAFB] font-['Poppins'] mt-2">
              {analyticsOverview.totalOrders || 0}
            </p>
            <span className="text-[11px] text-[#3B82F6] font-semibold mt-1 inline-block">Settled & Delivered</span>
          </div>

          <div className="bg-[#1E293B] border border-[#374151] p-5 rounded-2xl shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#9CA3AF] font-bold uppercase tracking-wider">Active Kitchen Queue</span>
              <Clock className="w-5 h-5 text-[#F59E0B]" />
            </div>
            <p className="text-2xl font-extrabold text-[#F9FAFB] font-['Poppins'] mt-2">
              {(analyticsOverview.pendingOrders || 0) + (analyticsOverview.preparingOrders || 0)}
            </p>
            <span className="text-[11px] text-[#F59E0B] font-semibold mt-1 inline-block">Pending Preparation</span>
          </div>
        </div>
      )}

      {/* Tabs & Export Triggers Bar */}
      <div className="bg-[#1E293B] border border-[#374151] rounded-2xl p-4 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Report Category Selector */}
        <div className="flex items-center bg-[#111827] p-1 rounded-xl border border-[#374151] text-xs font-medium w-full md:w-auto overflow-x-auto">
          <button
            onClick={() => setActiveReportTab('orders')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeReportTab === 'orders'
                ? 'bg-[#F97316] text-white font-bold shadow-md'
                : 'text-[#9CA3AF] hover:text-[#F9FAFB]'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Orders Report</span>
          </button>

          <button
            onClick={() => setActiveReportTab('reservations')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeReportTab === 'reservations'
                ? 'bg-[#F97316] text-white font-bold shadow-md'
                : 'text-[#9CA3AF] hover:text-[#F9FAFB]'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Reservations</span>
          </button>

          <button
            onClick={() => setActiveReportTab('revenue')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeReportTab === 'revenue'
                ? 'bg-[#F97316] text-white font-bold shadow-md'
                : 'text-[#9CA3AF] hover:text-[#F9FAFB]'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Revenue Summary</span>
          </button>

          <button
            onClick={() => setActiveReportTab('inventory')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeReportTab === 'inventory'
                ? 'bg-[#F97316] text-white font-bold shadow-md'
                : 'text-[#9CA3AF] hover:text-[#F9FAFB]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Inventory Report</span>
          </button>
        </div>

        {/* Action Export Buttons */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <button
            onClick={() => {
              if (activeReportTab === 'orders') handleExportOrdersCSV();
              else if (activeReportTab === 'reservations') handleExportReservationsCSV();
              else if (activeReportTab === 'inventory') handleExportInventoryCSV();
              else handleExportRevenueCSV();
            }}
            className="bg-[#374151] hover:bg-[#4B5563] text-[#F9FAFB] font-bold text-xs px-4 py-2.5 rounded-xl border border-[#4B5563] transition-all flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Download className="w-4 h-4 text-[#F97316]" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => {
              if (activeReportTab === 'orders') handleExportOrdersPDF();
              else if (activeReportTab === 'reservations') handleExportReservationsPDF();
              else if (activeReportTab === 'inventory') handleExportInventoryPDF();
              else handleExportRevenuePDF();
            }}
            className="bg-[#F97316] hover:bg-[#EA580C] text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-[#F97316]/20"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Live Report Preview Area */}
      <div className="bg-[#1E293B] border border-[#374151] rounded-2xl shadow-md p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#374151]">
          <h2 className="text-base font-bold text-[#F9FAFB] font-['Poppins'] flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#F97316]" />
            <span>
              Live Preview:{' '}
              {activeReportTab === 'orders'
                ? 'Orders Data'
                : activeReportTab === 'reservations'
                ? 'Reservations Data'
                : activeReportTab === 'inventory'
                ? 'Inventory Stock Report'
                : 'Revenue Financial Summary'}
            </span>
          </h2>
          <span className="text-xs text-[#9CA3AF] font-medium">Ready for instant export</span>
        </div>

        {/* Orders Preview */}
        {activeReportTab === 'orders' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#111827] border-b border-[#374151] text-[#9CA3AF] font-semibold uppercase text-[11px]">
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Customer Name</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4 text-right">Grand Total</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#374151]/40 text-[#D1D5DB]">
                {orders.map((o) => (
                  <tr key={o.billNumber}>
                    <td className="py-3 px-4 font-bold text-[#F9FAFB]">#{o.billNumber}</td>
                    <td className="py-3 px-4 text-[#9CA3AF]">{o.dateTime}</td>
                    <td className="py-3 px-4 font-medium">{o.customer.customerName}</td>
                    <td className="py-3 px-4">{o.customer.paymentMethod}</td>
                    <td className="py-3 px-4 text-right font-bold text-[#22C55E]">
                      ₹{o.bill.grandTotal.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#D1D5DB]">{o.orderStatus || 'PENDING'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Reservations Preview */}
        {activeReportTab === 'reservations' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#111827] border-b border-[#374151] text-[#9CA3AF] font-semibold uppercase text-[11px]">
                  <th className="py-3 px-4">Res ID</th>
                  <th className="py-3 px-4">Guest Name</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Guests</th>
                  <th className="py-3 px-4">Assigned Table</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#374151]/40 text-[#D1D5DB]">
                {reservations.map((r) => (
                  <tr key={r.id}>
                    <td className="py-3 px-4 font-bold text-[#F9FAFB]">{r.id}</td>
                    <td className="py-3 px-4 font-medium">{r.guestName}</td>
                    <td className="py-3 px-4 text-[#9CA3AF]">{r.phone}</td>
                    <td className="py-3 px-4">{r.date} {r.time}</td>
                    <td className="py-3 px-4 font-bold text-[#F97316]">{r.guestCount} Guests</td>
                    <td className="py-3 px-4">{r.assignedTable}</td>
                    <td className="py-3 px-4 font-bold text-[#D1D5DB]">{r.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Revenue Preview */}
        {activeReportTab === 'revenue' && (
          <div className="space-y-4 max-w-xl mx-auto py-4">
            <div className="bg-[#111827] border border-[#374151] p-6 rounded-2xl space-y-4">
              <h3 className="text-base font-bold text-[#F9FAFB] font-['Poppins'] pb-2 border-b border-[#374151]">
                Financial Breakdown Summary
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-[#D1D5DB]">
                  <span>Total Completed Orders</span>
                  <strong className="text-white">
                    {orders.filter((o) => o.orderStatus !== 'CANCELLED').length} Orders
                  </strong>
                </div>

                <div className="flex justify-between text-[#D1D5DB]">
                  <span>Gross Subtotal Sales</span>
                  <strong className="text-white">
                    ₹
                    {orders
                      .filter((o) => o.orderStatus !== 'CANCELLED')
                      .reduce((s, o) => s + o.bill.subtotal, 0)
                      .toFixed(2)}
                  </strong>
                </div>

                <div className="flex justify-between text-[#22C55E]">
                  <span>Discounts Applied (10% on ₹1,000+)</span>
                  <strong>
                    -₹
                    {orders
                      .filter((o) => o.orderStatus !== 'CANCELLED')
                      .reduce((s, o) => s + o.bill.discount, 0)
                      .toFixed(2)}
                  </strong>
                </div>

                <div className="flex justify-between text-[#D1D5DB]">
                  <span>GST Collected (5%)</span>
                  <strong className="text-white">
                    ₹
                    {orders
                      .filter((o) => o.orderStatus !== 'CANCELLED')
                      .reduce((s, o) => s + o.bill.gst, 0)
                      .toFixed(2)}
                  </strong>
                </div>

                <div className="flex justify-between text-base font-extrabold text-[#F9FAFB] pt-3 border-t border-[#374151]">
                  <span>Net Realized Revenue</span>
                  <span className="text-[#22C55E] font-['Poppins'] text-lg">
                    ₹
                    {orders
                      .filter((o) => o.orderStatus !== 'CANCELLED')
                      .reduce((s, o) => s + o.bill.grandTotal, 0)
                      .toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Inventory Preview */}
        {activeReportTab === 'inventory' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#111827] border-b border-[#374151] text-[#9CA3AF] font-semibold uppercase text-[11px]">
                  <th className="py-3 px-4">Item ID</th>
                  <th className="py-3 px-4">Ingredient Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Stock Quantity</th>
                  <th className="py-3 px-4 text-right">Unit Cost</th>
                  <th className="py-3 px-4 text-right">Total Valuation</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#374151]/40 text-[#D1D5DB]">
                {inventoryList.map((i) => (
                  <tr key={i.id}>
                    <td className="py-3 px-4 font-bold text-[#F9FAFB]">#{i.id}</td>
                    <td className="py-3 px-4 font-medium">{i.name}</td>
                    <td className="py-3 px-4 text-[#9CA3AF]">{i.category}</td>
                    <td className="py-3 px-4 font-bold text-[#F97316]">{i.quantity} {i.unit}</td>
                    <td className="py-3 px-4 text-right">₹{Number(i.costPerUnit || 0).toFixed(2)}</td>
                    <td className="py-3 px-4 text-right font-bold text-[#22C55E]">
                      ₹{Number(i.totalValue || (i.costPerUnit * i.quantity) || 0).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 font-bold">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                        i.status === 'IN_STOCK' ? 'bg-[#22C55E]/10 text-[#22C55E]' :
                        i.status === 'LOW_STOCK' ? 'bg-[#F59E0B]/10 text-[#F59E0B]' :
                        'bg-[#EF4444]/10 text-[#EF4444]'
                      }`}>
                        {i.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
