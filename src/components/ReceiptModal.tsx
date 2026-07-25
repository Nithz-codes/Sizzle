import React, { useState } from 'react';
import { Printer, Copy, Check, X, Heart, Flame } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const ReceiptModal: React.FC = () => {
  const { activeReceipt, setActiveReceipt, showToast } = useCart();
  const [copied, setCopied] = useState<boolean>(false);

  if (!activeReceipt) return null;

  const { billNumber, dateTime, customer, items, bill } = activeReceipt;

  const handlePrint = () => {
    window.print();
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FFFFFF] rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-[#ECECEC] my-8 animate-in fade-in zoom-in-95 duration-200">
        
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
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Paper Receipt Rendered Container */}
        <div className="p-6 bg-[#FFFFFF]">
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

              {/* Payment Details */}
              {customer.paymentMethod === 'Cash' && customer.amountReceived !== undefined && (
                <>
                  <div className="flex justify-between pt-0.5">
                    <span className="text-[#6B7280]">Amount Received</span>
                    <span className="font-semibold">₹{customer.amountReceived.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">Change Returned</span>
                    <span className="font-semibold text-[#2E7D32]">
                      ₹{(customer.changeReturned || 0).toFixed(2)}
                    </span>
                  </div>
                </>
              )}

              {customer.paymentMethod === 'Card' && customer.cardLastFour && (
                <div className="flex justify-between pt-0.5">
                  <span className="text-[#6B7280]">Card Details</span>
                  <span className="font-semibold">**** {customer.cardLastFour}</span>
                </div>
              )}

              {customer.paymentMethod === 'UPI' && (
                <div className="flex justify-between pt-0.5">
                  <span className="text-[#6B7280]">UPI ID</span>
                  <span className="font-semibold">payments@sizzle</span>
                </div>
              )}
            </div>

            {/* Itemized Table */}
            <div className="space-y-2 pb-3 border-b border-dashed border-[#ECECEC]">
              <div className="grid grid-cols-12 font-bold text-[#6B7280] text-[10px] uppercase tracking-wider pb-1">
                <span className="col-span-2">ID</span>
                <span className="col-span-5">Item</span>
                <span className="col-span-2 text-center">Qty</span>
                <span className="col-span-3 text-right">Amount</span>
              </div>

              {items.map((item) => (
                <div key={item.foodItem.id} className="grid grid-cols-12 text-[11px] items-center">
                  <span className="col-span-2 text-[#6B7280]">#{item.foodItem.id}</span>
                  <span className="col-span-5 font-semibold font-sans truncate pr-1">
                    {item.foodItem.name}
                  </span>
                  <span className="col-span-2 text-center">{item.quantity}</span>
                  <span className="col-span-3 text-right font-bold">
                    ₹{item.totalPrice.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Subtotal, Taxes, Discount */}
            <div className="space-y-1.5 text-[11px] pb-3 border-b border-dashed border-[#ECECEC]">
              <div className="flex justify-between">
                <span className="text-[#6B7280]">Subtotal</span>
                <span>₹{bill.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B7280]">GST (5%)</span>
                <span>₹{bill.gst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B7280]">Discount</span>
                <span className={bill.discount > 0 ? 'text-[#2E7D32] font-bold' : ''}>
                  {bill.discount > 0 ? `-₹${bill.discount.toFixed(2)}` : '₹0.00'}
                </span>
              </div>
            </div>

            {/* Grand Total */}
            <div className="flex justify-between items-center text-sm font-extrabold pt-1 text-[#1E1E1E]">
              <span>Grand Total</span>
              <span className="text-base font-black text-[#E85D04]">
                ₹{bill.grandTotal.toFixed(2)}
              </span>
            </div>

            {/* Footer Message */}
            <div className="text-center pt-3 text-[10px] text-[#6B7280] font-sans space-y-0.5 border-t border-dashed border-[#ECECEC]">
              <p className="font-semibold text-[#1E1E1E]">Thank you for dining with SIZZLE!</p>
              <p className="flex items-center justify-center gap-1 font-medium text-[#6B7280]">
                <span>Visit Again Soon</span>
                <Heart className="w-3 h-3 text-[#D32F2F] fill-[#D32F2F]" />
              </p>
            </div>

          </div>
        </div>

        {/* Action Buttons (Hidden during printing) */}
        <div className="no-print p-4 sm:p-6 bg-[#FFFDF8] border-t border-[#ECECEC] flex flex-col sm:flex-row items-center gap-2.5">
          <button
            onClick={handleCopyText}
            className="w-full sm:w-auto flex-1 bg-[#FFFFFF] border border-[#ECECEC] hover:border-[#E85D04] text-[#1E1E1E] font-semibold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
          >
            {copied ? <Check className="w-4 h-4 text-[#2E7D32]" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied Text' : 'Copy Text'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="w-full sm:w-auto flex-1 bg-[#1E1E1E] hover:bg-black text-white font-semibold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>

          <button
            onClick={() => setActiveReceipt(null)}
            className="w-full sm:w-auto bg-[#E85D04] hover:bg-[#C94B00] text-white font-bold text-xs py-3 px-5 rounded-xl transition-all shadow-md shadow-[#E85D04]/20 cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
