import React, { useState, useMemo } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { ReceiptData } from '../../types';
import { ConfirmationModal } from './ConfirmationModal';
import {
  ShoppingBag,
  Search,
  Clock,
  ChefHat,
  CheckCircle2,
  Truck,
  XCircle,
  Eye,
  X,
  Phone,
  FileText,
} from 'lucide-react';

export const OrderManagement: React.FC = () => {
  const { orders, updateOrderStatus } = useAdmin();

  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'PREPARING' | 'READY' | 'DELIVERED' | 'CANCELLED'>('ALL');

  // Order Details Modal State
  const [selectedOrder, setSelectedOrder] = useState<ReceiptData | null>(null);

  // Cancellation Confirmation Modal State
  const [cancelModalData, setCancelModalData] = useState<{ isOpen: boolean; billNumber: number | null }>({
    isOpen: false,
    billNumber: null,
  });

  // Filtered Orders Logic
  const filteredOrders = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const cleanQuery = query.replace('#', '');

    return orders.filter((order) => {
      // Search check
      const matchesSearch =
        !cleanQuery ||
        order.billNumber.toString().includes(cleanQuery) ||
        order.customer.customerName.toLowerCase().includes(query) ||
        order.customer.phoneNumber.includes(query);

      // Status check
      const currentStatus = order.orderStatus || 'PENDING';
      const matchesStatus = statusFilter === 'ALL' || currentStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  const handleCancelClick = (billNumber: number) => {
    setCancelModalData({ isOpen: true, billNumber });
  };

  const confirmCancelOrder = () => {
    if (cancelModalData.billNumber) {
      updateOrderStatus(cancelModalData.billNumber, 'CANCELLED');
    }
  };

  const getStatusBadge = (status: string = 'PENDING') => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1.5 bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase">
            <Clock className="w-3 h-3" />
            PENDING
          </span>
        );
      case 'PREPARING':
        return (
          <span className="inline-flex items-center gap-1.5 bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/30 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase">
            <ChefHat className="w-3 h-3" />
            PREPARING
          </span>
        );
      case 'READY':
        return (
          <span className="inline-flex items-center gap-1.5 bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase">
            <CheckCircle2 className="w-3 h-3" />
            READY
          </span>
        );
      case 'DELIVERED':
        return (
          <span className="inline-flex items-center gap-1.5 bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/30 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase">
            <Truck className="w-3 h-3" />
            DELIVERED
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1.5 bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/30 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase">
            <XCircle className="w-3 h-3" />
            CANCELLED
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-[#1E293B] border border-[#374151] rounded-2xl p-6 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#F9FAFB] font-['Poppins']">
              Order Management
            </h1>
            <p className="text-xs text-[#9CA3AF]">
              Track live orders, filter by customer or status, view detailed items breakdown, and execute quick status updates.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#D1D5DB] bg-[#1F2937] border border-[#374151] px-3 py-1.5 rounded-xl">
            Total Orders: <strong className="text-[#22C55E]">{orders.length}</strong>
          </span>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-[#1E293B] border border-[#374151] rounded-2xl p-4 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by Order ID (#1001) or Customer Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#111827] border border-[#374151] rounded-xl pl-10 pr-4 py-2 text-xs text-[#F9FAFB] placeholder-[#9CA3AF] focus:outline-none focus:border-[#F97316] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-[#9CA3AF] hover:text-[#F9FAFB]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-2 overflow-x-auto w-full md:w-auto">
          {(['ALL', 'PENDING', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                statusFilter === status
                  ? 'bg-[#F97316] text-white border-[#F97316] shadow-md'
                  : 'bg-[#111827] text-[#9CA3AF] border-[#374151] hover:text-[#F9FAFB]'
              }`}
            >
              {status === 'ALL' ? 'All Orders' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#1E293B] border border-[#374151] rounded-2xl shadow-md overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="py-16 text-center text-[#9CA3AF] space-y-3">
            <ShoppingBag className="w-12 h-12 text-[#374151] mx-auto" />
            <p className="text-sm font-semibold text-[#F9FAFB]">No orders match your criteria</p>
            <p className="text-xs max-w-sm mx-auto">
              Try clearing your search query or switching status filters to view orders.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#111827] border-b border-[#374151] text-[#9CA3AF] font-semibold uppercase text-[11px] tracking-wider">
                  <th className="py-4 px-6">Order ID & Date</th>
                  <th className="py-4 px-6">Customer Details</th>
                  <th className="py-4 px-6">Items Summary</th>
                  <th className="py-4 px-6 text-right">Grand Total</th>
                  <th className="py-4 px-6">Lifecycle Status</th>
                  <th className="py-4 px-6 text-center">Quick Status Actions</th>
                  <th className="py-4 px-6 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#374151]/50 text-[#D1D5DB]">
                {filteredOrders.map((order) => {
                  const currentStatus = order.orderStatus || 'PENDING';
                  return (
                    <tr key={order.billNumber} className="hover:bg-[#1F2937] transition-colors">
                      {/* Order ID & Date */}
                      <td className="py-4 px-6">
                        <div className="space-y-0.5">
                          <span className="font-extrabold text-sm text-[#F9FAFB] font-['Poppins'] block">
                            #{order.billNumber}
                          </span>
                          <span className="text-[11px] text-[#9CA3AF] block">{order.dateTime}</span>
                          {order.tableNumber && (
                            <span className="inline-block text-[10px] font-bold text-[#F59E0B] bg-[#F59E0B]/10 px-2 py-0.5 rounded border border-[#F59E0B]/20 mt-1">
                              {order.tableNumber}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Customer Details */}
                      <td className="py-4 px-6">
                        <div className="space-y-0.5">
                          <span className="font-bold text-[#F9FAFB] block">{order.customer.customerName}</span>
                          <span className="text-[11px] text-[#9CA3AF] flex items-center gap-1">
                            <Phone className="w-3 h-3 text-[#9CA3AF]" />
                            {order.customer.phoneNumber}
                          </span>
                          <span className="inline-block text-[10px] font-bold text-[#3B82F6] bg-[#3B82F6]/10 px-2 py-0.5 rounded border border-[#3B82F6]/20">
                            {order.customer.paymentMethod}
                          </span>
                        </div>
                      </td>

                      {/* Items Summary */}
                      <td className="py-4 px-6 max-w-xs">
                        <div className="text-xs text-[#D1D5DB] truncate">
                          {order.items.map((i) => `${i.quantity}x ${i.foodItem.name}`).join(', ')}
                        </div>
                        <span className="text-[10px] text-[#9CA3AF] font-semibold block mt-0.5">
                          {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                        </span>
                      </td>

                      {/* Grand Total */}
                      <td className="py-4 px-6 text-right">
                        <span className="font-extrabold text-sm text-[#22C55E] font-['Poppins']">
                          ₹{order.bill.grandTotal.toFixed(2)}
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td className="py-4 px-6">{getStatusBadge(currentStatus)}</td>

                      {/* Quick Status Update Buttons */}
                      <td className="py-4 px-6 text-center">
                        {currentStatus !== 'DELIVERED' && currentStatus !== 'CANCELLED' ? (
                          <div className="flex items-center justify-center gap-1.5">
                            {currentStatus === 'PENDING' && (
                              <button
                                onClick={() => updateOrderStatus(order.billNumber, 'PREPARING')}
                                className="bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-[11px] px-2.5 py-1 rounded-lg transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                              >
                                <ChefHat className="w-3 h-3" />
                                <span>Preparing</span>
                              </button>
                            )}

                            {currentStatus === 'PREPARING' && (
                              <button
                                onClick={() => updateOrderStatus(order.billNumber, 'READY')}
                                className="bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold text-[11px] px-2.5 py-1 rounded-lg transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                              >
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Ready</span>
                              </button>
                            )}

                            {currentStatus === 'READY' && (
                              <button
                                onClick={() => updateOrderStatus(order.billNumber, 'DELIVERED')}
                                className="bg-[#38BDF8] hover:bg-[#0284C7] text-white font-bold text-[11px] px-2.5 py-1 rounded-lg transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                              >
                                <Truck className="w-3 h-3" />
                                <span>Deliver</span>
                              </button>
                            )}

                            <button
                              onClick={() => handleCancelClick(order.billNumber)}
                              className="bg-[#EF4444]/10 hover:bg-[#EF4444] text-[#EF4444] hover:text-white border border-[#EF4444]/40 font-bold text-[11px] px-2 py-1 rounded-lg transition-all cursor-pointer"
                              title="Cancel Order"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-[#9CA3AF] italic">No further actions</span>
                        )}
                      </td>

                      {/* View Details Modal Button */}
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="bg-[#1F2937] hover:bg-[#374151] text-[#F9FAFB] p-2 rounded-xl border border-[#374151] transition-colors cursor-pointer"
                          title="View Order Details"
                        >
                          <Eye className="w-4 h-4 text-[#F97316]" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#1E293B] border border-[#374151] rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden my-8">
            {/* Header */}
            <div className="p-6 bg-[#111827] border-b border-[#374151] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-[#F9FAFB] font-['Poppins']">
                      Order #{selectedOrder.billNumber} Details
                    </h3>
                    {getStatusBadge(selectedOrder.orderStatus)}
                  </div>
                  <p className="text-xs text-[#9CA3AF]">{selectedOrder.dateTime}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-[#9CA3AF] hover:text-[#F9FAFB] p-2 rounded-xl hover:bg-[#1F2937] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto text-xs">
              <div className="bg-[#111827] border border-[#374151] p-4 rounded-2xl space-y-2">
                <h4 className="font-bold text-[#D1D5DB] uppercase tracking-wider text-[11px]">
                  Customer & Payment
                </h4>
                <div className="grid grid-cols-2 gap-3 text-[#D1D5DB]">
                  <div>
                    <span className="text-[#9CA3AF] block">Customer Name</span>
                    <strong className="text-[#F9FAFB] text-sm">{selectedOrder.customer.customerName}</strong>
                  </div>
                  <div>
                    <span className="text-[#9CA3AF] block">Phone</span>
                    <strong className="text-[#F9FAFB] text-sm">{selectedOrder.customer.phoneNumber}</strong>
                  </div>
                  <div>
                    <span className="text-[#9CA3AF] block">Payment Method</span>
                    <span className="font-extrabold text-[#F97316]">
                      {selectedOrder.customer.paymentMethod}
                    </span>
                  </div>
                  {selectedOrder.tableNumber && (
                    <div>
                      <span className="text-[#9CA3AF] block">Table Location</span>
                      <strong className="text-[#F59E0B]">{selectedOrder.tableNumber}</strong>
                    </div>
                  )}
                </div>
                {selectedOrder.orderNotes && (
                  <div className="pt-2 border-t border-[#374151] text-[#F59E0B]">
                    <strong>Special Instructions:</strong> {selectedOrder.orderNotes}
                  </div>
                )}
              </div>

              {/* Items Breakdown List */}
              <div className="space-y-3">
                <h4 className="font-bold text-[#D1D5DB] uppercase tracking-wider text-[11px]">
                  Ordered Items ({selectedOrder.items.length})
                </h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-[#111827] border border-[#374151] p-3 rounded-xl flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.foodItem.image}
                          alt={item.foodItem.name}
                          className="w-10 h-10 rounded-lg object-cover border border-[#374151] shrink-0"
                        />
                        <div>
                          <span className="font-bold text-[#F9FAFB] block">{item.foodItem.name}</span>
                          <span className="text-[11px] text-[#9CA3AF]">
                            ₹{item.foodItem.price} x {item.quantity}
                          </span>
                        </div>
                      </div>
                      <span className="font-extrabold text-[#22C55E] text-sm">
                        ₹{item.totalPrice.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bill Financial Summary */}
              <div className="bg-[#111827] border border-[#374151] p-4 rounded-2xl space-y-2">
                <div className="flex justify-between text-[#9CA3AF]">
                  <span>Subtotal</span>
                  <span>₹{selectedOrder.bill.subtotal.toFixed(2)}</span>
                </div>
                {selectedOrder.bill.discount > 0 && (
                  <div className="flex justify-between text-[#22C55E] font-semibold">
                    <span>Discount (10%)</span>
                    <span>-₹{selectedOrder.bill.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#9CA3AF]">
                  <span>GST (5%)</span>
                  <span>₹{selectedOrder.bill.gst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-[#F9FAFB] pt-2 border-t border-[#374151]">
                  <span>Grand Total</span>
                  <span className="text-[#22C55E] text-base font-['Poppins']">
                    ₹{selectedOrder.bill.grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#111827] border-t border-[#374151] flex items-center justify-between">
              <span className="text-[11px] text-[#9CA3AF]">SIZZLE POS Billing System</span>
              <button
                onClick={() => setSelectedOrder(null)}
                className="bg-[#1F2937] hover:bg-[#374151] text-[#F9FAFB] text-xs font-bold px-5 py-2 rounded-xl transition-all cursor-pointer border border-[#374151]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={cancelModalData.isOpen}
        title="Confirm Order Cancellation"
        message={`Are you sure you want to cancel Order #${cancelModalData.billNumber}? This action will alert kitchen staff.`}
        type="danger"
        confirmText="Yes, Cancel Order"
        onConfirm={confirmCancelOrder}
        onClose={() => setCancelModalData({ isOpen: false, billNumber: null })}
      />
    </div>
  );
};
