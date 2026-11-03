import React, { useState } from 'react';
import { Printer, Copy, Check, X, Heart, Flame, Activity, Receipt as ReceiptIcon, Clock, ChefHat } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { LiveKitchenTracker } from './LiveKitchenTracker';

export const ReceiptModal: React.FC = () => {
  const { activeReceipt, setActiveReceipt, showToast } = useCart();
  const [copied, setCopied] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'tracker' | 'receipt'>('tracker');

  if (!activeReceipt) return null;

  const { billNumber, dateTime, customer, items, bill } = activeReceipt;

  const handlePrint = () => {
    setViewMode('receipt');
    setTimeout(() => {
      window.print();
    }, 150);
  };

  const generatePlainTextReceipt = () => {
    let text = `==============================================================\n`;
    text += `                          SIZZLE\n`;
    text += `                  Taste That Brings People Together\n`;
    text += `==============================================================\n`;
    text += `Bill No        : #${billNumber}\n`;
    text += `Date & Time    : ${dateTime}\n`;
    text += `Customer Name  : ${customer.customerName}\n`;
    text += `Phone Number   : ${customer.phoneNumber}\n`;
    text += `Payment Method : ${customer.paymentMethod}\n`;

    if (customer.paymentMethod === 'Cash' && customer.amountReceived !== undefined) {
      text += `Amount Received: ₹${customer.amountReceived.toFixed(2)}\n`;
      text += `Balance Return : ₹${(customer.changeReturned || 0).toFixed(2)}\n`;
    } else if (customer.paymentMethod === 'Card' && customer.cardLastFour) {
      text += `Card Number    : **** **** **** ${customer.cardLastFour}\n`;
    } else if (customer.paymentMethod === 'UPI' && customer.upiId) {
      text += `UPI ID         : ${customer.upiId}\n`;
    }

    text += `--------------------------------------------------------------\n`;
    text += `ID   Item                      Qty      Amount\n`;
    text += `--------------------------------------------------------------\n`;

    items.forEach((item) => {
      const idStr = String(item.foodItem.id).padEnd(4, ' ');
      const nameStr = item.foodItem.name.padEnd(25, ' ');
      const qtyStr = String(item.quantity).padEnd(8, ' ');
      const amtStr = `₹${item.totalPrice.toFixed(2)}`;
      text += `${idStr} ${nameStr} ${qtyStr} ${amtStr}\n`;
    });

    text += `--------------------------------------------------------------\n`;
    text += `Subtotal              : ₹${bill.subtotal.toFixed(2)}\n`;
    text += `GST (5%)              : ₹${bill.gst.toFixed(2)}\n`;
    text += `Discount              : ₹${bill.discount.toFixed(2)}\n`;
    text += `--------------------------------------------------------------\n`;
    text += `Grand Total           : ₹${bill.grandTotal.toFixed(2)}\n`;
    text += `==============================================================\n`;
    text += `          Thank You For Dining With SIZZLE!\n`;
    text += `               Visit Again Soon ❤️\n`;
    text += `==============================================================\n`;

    return text;
  };

  const handleCopyText = () => {
    const text = generatePlainTextReceipt();
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('Receipt copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#FFFFFF] rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-[#ECECEC] my-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Controls Bar (Hidden during printing) */}
        <div className="no-print bg-[#FFFDF8] p-4 border-b border-[#ECECEC] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#2E7D32]" />
            <span className="text-xs font-bold text-[#1E1E1E] font-['Poppins']">
              Order #{billNumber} Confirmed
            </span>
          </div>

          <button
            onClick={() => setActiveReceipt(null)}
            className="p-1.5 text-[#6B7280] hover:text-[#1E1E1E] hover:bg-[#ECECEC] rounded-xl transition-colors cursor-pointer"
            title="Close modal (Active tracker will remain accessible in the bottom right corner)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Mode Tab Switcher */}
        <div className="no-print bg-[#FFFDF8] px-4 pt-1 pb-3 border-b border-[#ECECEC]">
          <div className="flex bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('tracker')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold font-['Poppins'] flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'tracker'
                  ? 'bg-white text-[#F97316] shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Live KDS Tracker & Counter</span>
            </button>
            <button
              onClick={() => setViewMode('receipt')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold font-['Poppins'] flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'receipt'
                  ? 'bg-white text-[#F97316] shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <ReceiptIcon className="w-3.5 h-3.5" />
              <span>Bill Receipt</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 bg-[#FFFFFF] max-h-[75vh] overflow-y-auto">
          {viewMode === 'tracker' ? (
            <LiveKitchenTracker
              receipt={activeReceipt}
              onStatusChange={(newStatus) => {
                setActiveReceipt((prev) => (prev ? { ...prev, orderStatus: newStatus } : prev));
              }}
            />
          ) : (
            <div
              id="printable-receipt"
              className="bg-[#FFFDF8] border border-[#ECECEC] rounded-2xl p-6 shadow-xs font-mono text-xs text-[#1E1E1E] space-y-4"
            >
              {/* Header / Brand Logo & Restaurant Name */}
              <div className="text-center space-y-1 pb-3 border-b border-dashed border-[#ECECEC]">
                <div className="w-10 h-10 rounded-xl bg-[#E85D04] text-white flex items-center justify-center mx-auto mb-1">
                  <Flame className="w-6 h-6" />
                </div>
                <h1 className="text-2xl font-black font-['Poppins'] text-[#1E1E1E] tracking-tight">
                  SIZZLE
                </h1>
                <p className="text-[11px] text-[#6B7280] font-sans italic">
                  Taste That Brings People Together
                </p>
              </div>

              {/* Bill & Customer Metadata */}
              <div className="space-y-1 text-[11px] text-[#1E1E1E] pb-3 border-b border-dashed border-[#ECECEC]">
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Order ID</span>
                  <span className="font-bold">#{billNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Date & Time</span>
                  <span>{dateTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Customer Name</span>
                  <span className="font-semibold">{customer.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Phone Number</span>
                  <span>{customer.phoneNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Payment Method</span>
                  <span className="font-bold text-[#E85D04]">{customer.paymentMethod}</span>
                </div>

                {customer.paymentMethod === 'Cash' && customer.amountReceived !== undefined && (
                  <>
                    <div className="flex justify-between pt-0.5">
                      <span className="text-[#6B7280]">Amount Received</span>
                      <span className="font-semibold">₹{customer.amountReceived.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6B7280]">Change Returned</span>
                      <span className="font-bold text-[#2E7D32]">₹{(customer.changeReturned || 0).toFixed(2)}</span>
                    </div>
                  </>
                )}

                {customer.paymentMethod === 'Card' && customer.cardLastFour && (
                  <div className="flex justify-between pt-0.5">
                    <span className="text-[#6B7280]">Card Number</span>
                    <span className="font-mono">**** **** **** {customer.cardLastFour}</span>
                  </div>
                )}

                {customer.paymentMethod === 'UPI' && customer.upiId && (
                  <div className="flex justify-between pt-0.5">
                    <span className="text-[#6B7280]">UPI Reference</span>
                    <span className="font-mono">{customer.upiId}</span>
                  </div>
                )}
              </div>

              {/* Items Table List */}
              <div className="space-y-1.5 pb-3 border-b border-dashed border-[#ECECEC]">
                <div className="flex justify-between text-[10px] font-bold text-[#6B7280] uppercase pb-1 border-b border-[#ECECEC]">
                  <span>Item</span>
                  <div className="flex gap-4">
                    <span>Qty</span>
                    <span className="w-14 text-right">Price</span>
                  </div>
                </div>

                {items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-[11px]">
                    <span className="truncate max-w-[180px] font-medium">{item.foodItem.name}</span>
                    <div className="flex gap-4 items-center">
                      <span className="text-[#6B7280]">x{item.quantity}</span>
                      <span className="w-14 text-right font-semibold">₹{item.totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Financial Calculation Summary */}
              <div className="space-y-1 text-[11px] pb-3 border-b border-dashed border-[#ECECEC]">
                <div className="flex justify-between text-[#6B7280]">
                  <span>Subtotal</span>
                  <span>₹{bill.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#6B7280]">
                  <span>GST (5%)</span>
                  <span>₹{bill.gst.toFixed(2)}</span>
                </div>
                {bill.discount > 0 && (
                  <div className="flex justify-between text-[#2E7D32] font-semibold">
                    <span>Discount (10% applied)</span>
                    <span>-₹{bill.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-sm font-black pt-1.5 border-t border-[#ECECEC] text-[#1E1E1E]">
                  <span>Grand Total</span>
                  <span className="text-[#E85D04] text-base">₹{bill.grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Receipt Footer Message */}
              <div className="text-center pt-2 space-y-1">
                <p className="text-[11px] font-bold text-[#1E1E1E] flex items-center justify-center gap-1 font-['Poppins']">
                  <span>Thank you for dining with SIZZLE!</span>
                  <Heart className="w-3.5 h-3.5 text-[#D32F2F] fill-current" />
                </p>
                <p className="text-[10px] text-[#6B7280]">
                  We hope you enjoyed your culinary experience. Visit again soon!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions Footer */}
        <div className="no-print bg-[#FFFDF8] p-4 border-t border-[#ECECEC] flex items-center justify-between gap-3">
          {viewMode === 'receipt' ? (
            <>
              <button
                onClick={handleCopyText}
                className="flex-1 bg-white hover:bg-[#F5F5F5] text-[#1E1E1E] border border-[#ECECEC] py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-[#2E7D32]" /> : <Copy className="w-4 h-4 text-[#6B7280]" />}
                <span>{copied ? 'Copied to Clipboard' : 'Copy Text Receipt'}</span>
              </button>

              <button
                onClick={handlePrint}
                className="flex-1 bg-[#E85D04] hover:bg-[#D45203] text-white py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-[#E85D04]/20 transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Receipt</span>
              </button>
            </>
          ) : (
            <div className="w-full flex items-center justify-between text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Live status automatically reflects Kitchen KDS updates</span>
              </span>
              <button
                onClick={() => setViewMode('receipt')}
                className="text-[#F97316] hover:underline font-bold cursor-pointer"
              >
                View Bill Receipt &rarr;
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
