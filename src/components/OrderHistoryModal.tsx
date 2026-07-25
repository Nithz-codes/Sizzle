import React from 'react';
import { X, History, Receipt, ChevronRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { ReceiptData } from '../types';

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({ isOpen, onClose }) => {
  const { pastReceipts, setActiveReceipt } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FFFDF8] border border-[#ECECEC] rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-[#FFFFFF] p-5 sm:p-6 border-b border-[#ECECEC] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#E85D04]/10 text-[#E85D04] flex items-center justify-center">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#1E1E1E] font-['Poppins']">
                Session Order History
              </h2>
              <p className="text-xs text-[#6B7280]">
                {pastReceipts.length} completed {pastReceipts.length === 1 ? 'order' : 'orders'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#6B7280] hover:text-[#1E1E1E] hover:bg-[#ECECEC] rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of Orders */}
        <div className="p-5 sm:p-6 max-h-[60vh] overflow-y-auto space-y-3">
          {pastReceipts.length === 0 ? (
            <div className="py-12 text-center text-[#6B7280]">
              <ShoppingBag className="w-10 h-10 mx-auto mb-2 text-[#6B7280]/60" />
              <p className="text-sm font-semibold">No orders placed yet in this session.</p>
            </div>
          ) : (
            pastReceipts.map((receipt: ReceiptData) => (
              <div
                key={receipt.billNumber}
                onClick={() => {
                  setActiveReceipt(receipt);
                  onClose();
                }}
                className="bg-[#FFFFFF] border border-[#ECECEC] hover:border-[#E85D04]/50 rounded-2xl p-4 transition-all cursor-pointer shadow-xs hover:shadow-md flex items-center justify-between group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-[#1E1E1E]">
                      Bill #{receipt.billNumber}
                    </span>
                    <span className="text-[10px] font-bold text-[#E85D04] bg-[#E85D04]/10 px-2 py-0.5 rounded-md border border-[#E85D04]/20">
                      {receipt.customer.paymentMethod}
                    </span>
                  </div>

                  <p className="text-xs text-[#6B7280]">
                    Customer: <span className="font-semibold text-[#1E1E1E]">{receipt.customer.customerName}</span> ({receipt.customer.phoneNumber})
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-[#6B7280] pt-1">
                    <span>{receipt.dateTime}</span>
                    <span>•</span>
                    <span>{receipt.items.length} items</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="block text-[10px] text-[#6B7280] font-medium uppercase">Grand Total</span>
                    <span className="text-base font-extrabold text-[#E85D04]">
                      ₹{receipt.bill.grandTotal.toFixed(2)}
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#6B7280] group-hover:text-[#E85D04] group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
