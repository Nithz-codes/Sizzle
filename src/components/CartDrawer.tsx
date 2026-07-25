import React from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Sparkles, AlertCircle, Percent } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cartItems,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
    gst,
    discount,
    grandTotal,
    setIsCheckoutOpen,
  } = useCart();

  if (!isCartOpen) return null;

  const neededForDiscount = Math.max(0, 1000 - subtotal);
  const discountProgress = Math.min(100, (subtotal / 1000) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FFFDF8] border-l border-[#ECECEC] shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-[#ECECEC] bg-[#FFFFFF] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#E85D04]/10 text-[#E85D04] flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#1E1E1E] font-['Poppins']">
                  Your Order Cart
                </h2>
                <p className="text-xs text-[#6B7280]">
                  {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} selected
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {cartItems.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-[#D32F2F] hover:bg-[#D32F2F]/10 px-2.5 py-1 rounded-lg border border-[#D32F2F]/20 transition-colors cursor-pointer"
                >
                  Clear
                </button>
              )}
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-[#6B7280] hover:text-[#1E1E1E] hover:bg-[#ECECEC] rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Discount Progress Meter */}
          {cartItems.length > 0 && (
            <div className="bg-[#FFFFFF] px-4 py-3 border-b border-[#ECECEC]">
              <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                <div className="flex items-center gap-1.5">
                  <Percent className="w-3.5 h-3.5 text-[#E85D04]" />
                  <span>
                    {subtotal >= 1000
                      ? '🎉 10% Discount Unlocked!'
                      : `Add ₹${neededForDiscount.toFixed(2)} more for 10% OFF`}
                  </span>
                </div>
                <span className="text-[#E85D04] font-extrabold">
                  {discountProgress.toFixed(0)}%
                </span>
              </div>
              <div className="w-full h-2 bg-[#ECECEC] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#E85D04] transition-all duration-300 rounded-full"
                  style={{ width: `${discountProgress}%` }}
                />
              </div>
              <p className="text-[11px] text-[#6B7280] mt-1">
                {subtotal >= 1000
                  ? 'Your total order subtotal is ₹1,000 or more!'
                  : 'Orders over ₹1,000 get an instant 10% discount on subtotal.'}
              </p>
            </div>
          )}

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 text-[#6B7280]">
                <div className="w-16 h-16 rounded-2xl bg-[#ECECEC] flex items-center justify-center mb-4 text-[#6B7280]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-[#1E1E1E] mb-1">
                  Your cart is empty
                </h3>
                <p className="text-xs max-w-xs mb-6">
                  Select your favorite dishes from our menu to begin building your order.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="bg-[#E85D04] hover:bg-[#C94B00] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  Browse Menu
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.foodItem.id}
                  className="bg-[#FFFFFF] border border-[#ECECEC] rounded-2xl p-3.5 flex items-center gap-3 shadow-2xs hover:border-[#E85D04]/30 transition-all"
                >
                  <img
                    src={item.foodItem.image}
                    alt={item.foodItem.name}
                    className="w-16 h-16 object-cover rounded-xl shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <h4 className="font-bold text-sm text-[#1E1E1E] truncate font-['Poppins']">
                        {item.foodItem.name}
                      </h4>
                      <button
                        onClick={() => removeItem(item.foodItem.id)}
                        className="text-[#6B7280] hover:text-[#D32F2F] p-1 transition-colors cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-[#6B7280] mb-2">
                      <span className="font-mono text-[10px] bg-[#FFFDF8] px-1.5 py-0.5 rounded border border-[#ECECEC]">
                        #{item.foodItem.id}
                      </span>
                      <span>₹{item.foodItem.price.toFixed(2)} each</span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      {/* Quantity adjuster */}
                      <div className="flex items-center bg-[#FFFDF8] border border-[#ECECEC] rounded-xl p-0.5">
                        <button
                          onClick={() => updateQuantity(item.foodItem.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-[#ECECEC] text-[#1E1E1E] cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-bold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.foodItem.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-[#ECECEC] text-[#1E1E1E] cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Line Total */}
                      <span className="font-extrabold text-sm text-[#1E1E1E]">
                        ₹{item.totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Bill Calculations */}
          {cartItems.length > 0 && (
            <div className="p-4 sm:p-6 bg-[#FFFFFF] border-t border-[#ECECEC] space-y-3">
              <div className="space-y-2 text-xs text-[#6B7280]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#1E1E1E]">
                    ₹{subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>GST (5%)</span>
                  <span className="font-semibold text-[#1E1E1E]">
                    ₹{gst.toFixed(2)}
                  </span>
                </div>

                {discount > 0 ? (
                  <div className="flex justify-between text-[#2E7D32] font-semibold">
                    <span>Discount (10% OFF)</span>
                    <span>-₹{discount.toFixed(2)}</span>
                  </div>
                ) : (
                  <div className="flex justify-between text-[#6B7280]/70 italic">
                    <span>Discount (over ₹1,000)</span>
                    <span>₹0.00</span>
                  </div>
                )}

                <div className="pt-2 border-t border-[#ECECEC] flex justify-between items-center text-base">
                  <span className="font-bold text-[#1E1E1E] font-['Poppins']">
                    Grand Total
                  </span>
                  <span className="font-extrabold text-[#E85D04] text-lg">
                    ₹{grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsCheckoutOpen(true);
                }}
                className="w-full bg-[#E85D04] hover:bg-[#C94B00] text-white font-bold py-3.5 rounded-xl shadow-md shadow-[#E85D04]/20 flex items-center justify-center gap-2 text-sm transition-all cursor-pointer active:scale-98"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
