import React, { useState, useEffect } from 'react';
import {
  X,
  CreditCard,
  Banknote,
  QrCode,
  User,
  Phone,
  CheckCircle2,
  Copy,
  Check,
  AlertCircle,
  IndianRupee,
  Lock,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Customer } from '../types';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cartItems,
    subtotal,
    gst,
    discount,
    grandTotal,
    placeOrder,
  } = useCart();

  // Customer state
  const [name, setName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Card' | 'UPI'>('Cash');

  // Cash payment state
  const [amountReceived, setAmountReceived] = useState<string>('');

  // Card payment state
  const [cardHolderName, setCardHolderName] = useState<string>('');
  const [cardNumber, setCardNumber] = useState<string>('');
  const [cardExpiry, setCardExpiry] = useState<string>('');
  const [cardCvv, setCardCvv] = useState<string>('');

  // UPI payment state
  const [upiConfirmed, setUpiConfirmed] = useState<boolean>(false);
  const [upiCopied, setUpiCopied] = useState<boolean>(false);

  // Errors state
  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
    cash?: string;
    cardHolder?: string;
    cardNumber?: string;
    cardExpiry?: string;
    cardCvv?: string;
    upi?: string;
  }>({});

  // Reset state whenever checkout modal opens (BUG #2 FIX)
  useEffect(() => {
    if (isCheckoutOpen) {
      setName('');
      setPhoneNumber('');
      setPaymentMethod('Cash');
      setAmountReceived('');
      setCardHolderName('');
      setCardNumber('');
      setCardExpiry('');
      setCardCvv('');
      setUpiConfirmed(false);
      setUpiCopied(false);
      setErrors({});
    }
  }, [isCheckoutOpen]);

  if (!isCheckoutOpen) return null;

  // Cash calculations (BUG #3)
  const numReceived = parseFloat(amountReceived) || 0;
  const changeToReturn = numReceived - grandTotal;
  const isCashInsufficient = paymentMethod === 'Cash' && numReceived < grandTotal;

  // Format Card Number (XXXX XXXX XXXX XXXX)
  const handleCardNumberChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})/g, '$1 ').trim();
    setCardNumber(formatted);
    if (errors.cardNumber) setErrors((prev) => ({ ...prev, cardNumber: undefined }));
  };

  // Format Card Expiry (MM/YY)
  const handleCardExpiryChange = (val: string) => {
    let raw = val.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 2) {
      const mm = parseInt(raw.slice(0, 2), 10);
      if (mm > 12) raw = '12' + raw.slice(2);
      if (mm === 0) raw = '01' + raw.slice(2);
      raw = raw.slice(0, 2) + '/' + raw.slice(2);
    }
    setCardExpiry(raw);
    if (errors.cardExpiry) setErrors((prev) => ({ ...prev, cardExpiry: undefined }));
  };

  const validateForm = (): boolean => {
    const errs: typeof errors = {};

    // Customer Name
    if (!name.trim()) {
      errs.name = 'Please enter customer full name';
    }

    // Phone Number
    const cleanedPhone = phoneNumber.replace(/\D/g, '');
    if (!phoneNumber.trim()) {
      errs.phone = 'Please enter phone number';
    } else if (cleanedPhone.length !== 10) {
      errs.phone = 'Please enter a valid 10-digit phone number';
    }

    // Payment Method Validations
    if (paymentMethod === 'Cash') {
      if (!amountReceived.trim()) {
        errs.cash = 'Please enter the amount received from customer';
      } else if (numReceived < grandTotal) {
        errs.cash = 'Insufficient payment.';
      }
    } else if (paymentMethod === 'Card') {
      if (!cardHolderName.trim()) {
        errs.cardHolder = 'Enter cardholder name';
      }
      const rawCard = cardNumber.replace(/\D/g, '');
      if (rawCard.length !== 16) {
        errs.cardNumber = 'Card number must be 16 digits';
      }
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardExpiry)) {
        errs.cardExpiry = 'Enter valid expiry (MM/YY)';
      }
      if (!/^\d{3,4}$/.test(cardCvv)) {
        errs.cardCvv = 'CVV must be 3 or 4 digits';
      }
    } else if (paymentMethod === 'UPI') {
      if (!upiConfirmed) {
        errs.upi = 'Please confirm payment completion on your UPI app';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const rawCard = cardNumber.replace(/\D/g, '');
    const lastFour = rawCard.slice(-4);

    const customerObj: Customer = {
      customerName: name.trim(),
      phoneNumber: phoneNumber.trim(),
      paymentMethod,
      ...(paymentMethod === 'Cash'
        ? {
            amountReceived: numReceived,
            changeReturned: Math.max(0, changeToReturn),
          }
        : {}),
      ...(paymentMethod === 'Card'
        ? {
            cardHolderName: cardHolderName.trim(),
            cardLastFour: lastFour || '1234',
          }
        : {}),
      ...(paymentMethod === 'UPI'
        ? {
            upiId: 'payments@sizzle',
          }
        : {}),
    };

    placeOrder(customerObj);
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText('payments@sizzle');
    setUpiCopied(true);
    setTimeout(() => setUpiCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FFFDF8] border border-[#ECECEC] rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-[#FFFFFF] p-5 sm:p-6 border-b border-[#ECECEC] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#E85D04] bg-[#E85D04]/10 px-2.5 py-0.5 rounded-full border border-[#E85D04]/20">
              Final Step
            </span>
            <h2 className="text-xl font-bold text-[#1E1E1E] font-['Poppins'] mt-1">
              Checkout & Customer Details
            </h2>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-2 text-[#6B7280] hover:text-[#1E1E1E] hover:bg-[#ECECEC] rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-6">
          
          {/* Order Summary Snapshot */}
          <div className="bg-[#FFFFFF] border border-[#ECECEC] rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#1E1E1E] pb-2 border-b border-[#ECECEC]">
              <span>Order Summary ({cartItems.length} items)</span>
              <span className="text-[#E85D04]">SIZZLE</span>
            </div>

            <div className="max-h-28 overflow-y-auto space-y-1.5 pt-1 pr-1 text-xs text-[#6B7280]">
              {cartItems.map((item) => (
                <div key={item.foodItem.id} className="flex justify-between items-center">
                  <span className="truncate pr-2">
                    {item.quantity}x {item.foodItem.name}
                  </span>
                  <span className="font-semibold text-[#1E1E1E]">
                    ₹{item.totalPrice.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-[#ECECEC] space-y-1 text-xs">
              <div className="flex justify-between text-[#6B7280]">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#6B7280]">
                <span>GST (5%)</span>
                <span>₹{gst.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-[#2E7D32] font-semibold">
                  <span>Discount (10% OFF)</span>
                  <span>-₹{discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-sm font-extrabold text-[#1E1E1E] pt-1 border-t border-[#ECECEC]">
                <span>Grand Total</span>
                <span className="text-[#E85D04] text-base">₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Customer Details Form */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1E1E1E] font-['Poppins']">
              Customer Information
            </h3>

            {/* Name Input */}
            <div>
              <label className="block text-xs font-semibold text-[#1E1E1E] mb-1">
                Customer Name <span className="text-[#D32F2F]">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B7280]" />
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                  }}
                  className={`w-full bg-[#FFFFFF] border rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#1E1E1E] focus:outline-none focus:ring-2 transition-all ${
                    errors.name
                      ? 'border-[#D32F2F] focus:ring-[#D32F2F]/10'
                      : 'border-[#ECECEC] focus:border-[#E85D04] focus:ring-[#E85D04]/10'
                  }`}
                />
              </div>
              {errors.name && (
                <p className="text-[11px] text-[#D32F2F] mt-1 font-medium">{errors.name}</p>
              )}
            </div>

            {/* Phone Number Input */}
            <div>
              <label className="block text-xs font-semibold text-[#1E1E1E] mb-1">
                Phone Number <span className="text-[#D32F2F]">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B7280]" />
                <input
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                    if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
                  }}
                  className={`w-full bg-[#FFFFFF] border rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#1E1E1E] focus:outline-none focus:ring-2 transition-all ${
                    errors.phone
                      ? 'border-[#D32F2F] focus:ring-[#D32F2F]/10'
                      : 'border-[#ECECEC] focus:border-[#E85D04] focus:ring-[#E85D04]/10'
                  }`}
                />
              </div>
              {errors.phone && (
                <p className="text-[11px] text-[#D32F2F] mt-1 font-medium">{errors.phone}</p>
              )}
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-semibold text-[#1E1E1E] mb-2">
                Select Payment Method <span className="text-[#D32F2F]">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                
                {/* Cash */}
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod('Cash');
                    setErrors({});
                  }}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                    paymentMethod === 'Cash'
                      ? 'border-[#E85D04] bg-[#E85D04]/5 text-[#E85D04] font-bold shadow-2xs'
                      : 'border-[#ECECEC] bg-[#FFFFFF] text-[#6B7280] hover:text-[#1E1E1E]'
                  }`}
                >
                  <Banknote className="w-5 h-5" />
                  <span className="text-xs">Cash</span>
                </button>

                {/* Card */}
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod('Card');
                    setErrors({});
                  }}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                    paymentMethod === 'Card'
                      ? 'border-[#E85D04] bg-[#E85D04]/5 text-[#E85D04] font-bold shadow-2xs'
                      : 'border-[#ECECEC] bg-[#FFFFFF] text-[#6B7280] hover:text-[#1E1E1E]'
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span className="text-xs">Card</span>
                </button>

                {/* UPI */}
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod('UPI');
                    setErrors({});
                  }}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                    paymentMethod === 'UPI'
                      ? 'border-[#E85D04] bg-[#E85D04]/5 text-[#E85D04] font-bold shadow-2xs'
                      : 'border-[#ECECEC] bg-[#FFFFFF] text-[#6B7280] hover:text-[#1E1E1E]'
                  }`}
                >
                  <QrCode className="w-5 h-5" />
                  <span className="text-xs">UPI</span>
                </button>

              </div>
            </div>

            {/* DYNAMIC PAYMENT METHOD DETAILS */}

            {/* 1. CASH PAYMENT FLOW (BUG #3) */}
            {paymentMethod === 'Cash' && (
              <div className="bg-[#FFFFFF] border border-[#ECECEC] rounded-2xl p-4 space-y-3.5 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#1E1E1E]">Cash Payment Calculator</h4>
                  <span className="text-[10px] bg-[#E85D04]/10 text-[#E85D04] font-bold px-2 py-0.5 rounded-full">
                    Live Calculation
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E1E1E] mb-1">
                    Amount Received (₹) <span className="text-[#D32F2F]">*</span>
                  </label>
                  <div className="relative">
                    <IndianRupee className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B7280]" />
                    <input
                      type="number"
                      step="any"
                      placeholder={`Min ₹${grandTotal.toFixed(2)}`}
                      value={amountReceived}
                      onChange={(e) => {
                        setAmountReceived(e.target.value);
                        if (errors.cash) setErrors((prev) => ({ ...prev, cash: undefined }));
                      }}
                      className={`w-full bg-[#FFFDF8] border rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#1E1E1E] font-bold focus:outline-none transition-all ${
                        isCashInsufficient || errors.cash
                          ? 'border-[#D32F2F] focus:ring-2 focus:ring-[#D32F2F]/10'
                          : 'border-[#ECECEC] focus:border-[#E85D04] focus:ring-2 focus:ring-[#E85D04]/10'
                      }`}
                    />
                  </div>
                </div>

                {/* Quick preset buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[11px] text-[#6B7280] font-medium">Presets:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setAmountReceived(grandTotal.toFixed(2));
                      if (errors.cash) setErrors((prev) => ({ ...prev, cash: undefined }));
                    }}
                    className="text-[11px] font-bold bg-[#ECECEC] hover:bg-[#E85D04] hover:text-white px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    Exact (₹{grandTotal.toFixed(2)})
                  </button>
                  {[500, 1000, 2000].map(
                    (preset) =>
                      preset >= grandTotal && (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => {
                            setAmountReceived(preset.toString());
                            if (errors.cash) setErrors((prev) => ({ ...prev, cash: undefined }));
                          }}
                          className="text-[11px] font-bold bg-[#ECECEC] hover:bg-[#E85D04] hover:text-white px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                        >
                          ₹{preset}
                        </button>
                      )
                  )}
                </div>

                {/* Cash Calculation Display */}
                {amountReceived.trim() !== '' && (
                  <div
                    className={`p-3 rounded-xl border space-y-1.5 transition-all text-xs ${
                      isCashInsufficient
                        ? 'bg-[#D32F2F]/5 border-[#D32F2F]/30 text-[#D32F2F]'
                        : 'bg-[#2E7D32]/5 border-[#2E7D32]/30 text-[#2E7D32]'
                    }`}
                  >
                    <div className="flex justify-between items-center font-medium">
                      <span>Grand Total:</span>
                      <span className="font-bold">₹{grandTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center font-medium">
                      <span>Amount Received:</span>
                      <span className="font-bold">₹{numReceived.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-current/20 pt-1.5 flex justify-between items-center font-extrabold text-sm">
                      <span>{isCashInsufficient ? 'Shortage:' : 'Balance to Return:'}</span>
                      <span>
                        ₹{Math.abs(changeToReturn).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Error / Validation Message */}
                {(errors.cash || isCashInsufficient) && (
                  <div className="flex items-center gap-2 text-xs text-[#D32F2F] font-bold bg-[#D32F2F]/10 p-2.5 rounded-xl border border-[#D32F2F]/20">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>
                      {errors.cash || 'Insufficient payment. Please collect full order amount.'}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* 2. CARD PAYMENT FLOW (BUG #4) */}
            {paymentMethod === 'Card' && (
              <div className="bg-[#FFFFFF] border border-[#ECECEC] rounded-2xl p-4 space-y-3.5 animate-in fade-in duration-150">
                <div className="flex items-center justify-between pb-1 border-b border-[#ECECEC]">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#1E1E1E]">
                    <Lock className="w-3.5 h-3.5 text-[#2E7D32]" />
                    <span>Demo Card Checkout</span>
                  </div>
                  <span className="text-[10px] text-[#6B7280]">256-Bit SSL Secured</span>
                </div>

                {/* Card Holder Name */}
                <div>
                  <label className="block text-xs font-semibold text-[#1E1E1E] mb-1">
                    Cardholder Name <span className="text-[#D32F2F]">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    value={cardHolderName}
                    onChange={(e) => {
                      setCardHolderName(e.target.value);
                      if (errors.cardHolder) setErrors((prev) => ({ ...prev, cardHolder: undefined }));
                    }}
                    className="w-full bg-[#FFFDF8] border border-[#ECECEC] rounded-xl px-3.5 py-2 text-xs text-[#1E1E1E] focus:outline-none focus:border-[#E85D04]"
                  />
                  {errors.cardHolder && (
                    <p className="text-[11px] text-[#D32F2F] mt-1 font-medium">{errors.cardHolder}</p>
                  )}
                </div>

                {/* Card Number */}
                <div>
                  <label className="block text-xs font-semibold text-[#1E1E1E] mb-1">
                    Card Number (16 Digits) <span className="text-[#D32F2F]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="4532 1234 5678 9012"
                      value={cardNumber}
                      onChange={(e) => handleCardNumberChange(e.target.value)}
                      className="w-full bg-[#FFFDF8] border border-[#ECECEC] rounded-xl px-3.5 py-2 text-xs text-[#1E1E1E] font-mono focus:outline-none focus:border-[#E85D04]"
                    />
                    <CreditCard className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
                  </div>
                  {errors.cardNumber && (
                    <p className="text-[11px] text-[#D32F2F] mt-1 font-medium">{errors.cardNumber}</p>
                  )}
                </div>

                {/* Expiry & CVV */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#1E1E1E] mb-1">
                      Expiry (MM/YY) <span className="text-[#D32F2F]">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="12/28"
                      value={cardExpiry}
                      onChange={(e) => handleCardExpiryChange(e.target.value)}
                      className="w-full bg-[#FFFDF8] border border-[#ECECEC] rounded-xl px-3.5 py-2 text-xs text-[#1E1E1E] font-mono focus:outline-none focus:border-[#E85D04]"
                    />
                    {errors.cardExpiry && (
                      <p className="text-[11px] text-[#D32F2F] mt-1 font-medium">{errors.cardExpiry}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1E1E1E] mb-1">
                      CVV (3-4 Digits) <span className="text-[#D32F2F]">*</span>
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      placeholder="123"
                      value={cardCvv}
                      onChange={(e) => {
                        setCardCvv(e.target.value.replace(/\D/g, ''));
                        if (errors.cardCvv) setErrors((prev) => ({ ...prev, cardCvv: undefined }));
                      }}
                      className="w-full bg-[#FFFDF8] border border-[#ECECEC] rounded-xl px-3.5 py-2 text-xs text-[#1E1E1E] font-mono focus:outline-none focus:border-[#E85D04]"
                    />
                    {errors.cardCvv && (
                      <p className="text-[11px] text-[#D32F2F] mt-1 font-medium">{errors.cardCvv}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 3. UPI PAYMENT FLOW (BUG #5) */}
            {paymentMethod === 'UPI' && (
              <div className="bg-[#FFFFFF] border border-[#ECECEC] rounded-2xl p-4 text-center space-y-3 animate-in fade-in duration-150">
                <div className="flex items-center justify-between pb-1 border-b border-[#ECECEC]">
                  <span className="text-xs font-bold text-[#1E1E1E]">Instant Scan & Pay</span>
                  <span className="text-[10px] text-[#2E7D32] bg-[#2E7D32]/10 font-bold px-2 py-0.5 rounded-full">
                    Zero Extra Fee
                  </span>
                </div>

                {/* QR Code Container */}
                <div className="bg-[#FFFDF8] border border-[#ECECEC] p-3 rounded-2xl inline-block shadow-2xs">
                  <svg className="w-36 h-36 mx-auto" viewBox="0 0 100 100">
                    <rect width="100" height="100" fill="#FFFFFF" rx="8" />
                    {/* Top-Left Finder */}
                    <rect x="8" y="8" width="28" height="28" fill="#1E1E1E" rx="4" />
                    <rect x="12" y="12" width="20" height="20" fill="#FFFFFF" rx="2" />
                    <rect x="16" y="16" width="12" height="12" fill="#E85D04" rx="1" />

                    {/* Top-Right Finder */}
                    <rect x="64" y="8" width="28" height="28" fill="#1E1E1E" rx="4" />
                    <rect x="68" y="12" width="20" height="20" fill="#FFFFFF" rx="2" />
                    <rect x="72" y="16" width="12" height="12" fill="#E85D04" rx="1" />

                    {/* Bottom-Left Finder */}
                    <rect x="8" y="64" width="28" height="28" fill="#1E1E1E" rx="4" />
                    <rect x="12" y="68" width="20" height="20" fill="#FFFFFF" rx="2" />
                    <rect x="16" y="72" width="12" height="12" fill="#E85D04" rx="1" />

                    {/* Dummy Data Matrix Dots */}
                    <rect x="42" y="10" width="6" height="6" fill="#1E1E1E" />
                    <rect x="52" y="10" width="6" height="6" fill="#1E1E1E" />
                    <rect x="42" y="20" width="6" height="6" fill="#1E1E1E" />
                    <rect x="50" y="28" width="8" height="8" fill="#1E1E1E" />

                    <rect x="10" y="42" width="6" height="6" fill="#1E1E1E" />
                    <rect x="22" y="42" width="6" height="6" fill="#1E1E1E" />
                    <rect x="30" y="42" width="10" height="10" fill="#E85D04" />

                    <rect x="44" y="44" width="12" height="12" fill="#1E1E1E" rx="2" />
                    <rect x="60" y="42" width="8" height="8" fill="#1E1E1E" />
                    <rect x="74" y="42" width="6" height="6" fill="#1E1E1E" />
                    <rect x="86" y="42" width="6" height="6" fill="#1E1E1E" />

                    <rect x="42" y="62" width="8" height="8" fill="#1E1E1E" />
                    <rect x="54" y="62" width="6" height="6" fill="#1E1E1E" />
                    <rect x="64" y="64" width="8" height="8" fill="#1E1E1E" />

                    <rect x="42" y="76" width="12" height="12" fill="#E85D04" rx="2" />
                    <rect x="60" y="76" width="8" height="8" fill="#1E1E1E" />
                    <rect x="74" y="76" width="12" height="12" fill="#1E1E1E" />
                  </svg>
                  <p className="text-[10px] font-bold text-[#E85D04] mt-1 font-['Poppins']">
                    SIZZLE PAY
                  </p>
                </div>

                {/* UPI ID Info */}
                <div className="flex items-center justify-between bg-[#FFFDF8] border border-[#ECECEC] p-2.5 rounded-xl text-xs">
                  <div className="text-left">
                    <span className="block text-[10px] text-[#6B7280]">UPI ID:</span>
                    <span className="font-bold text-[#1E1E1E] font-mono">payments@sizzle</span>
                  </div>
                  <button
                    type="button"
                    onClick={copyUpiId}
                    className="flex items-center gap-1 text-[11px] font-bold text-[#E85D04] hover:bg-[#E85D04]/10 px-2.5 py-1 rounded-lg transition-all cursor-pointer"
                  >
                    {upiCopied ? <Check className="w-3.5 h-3.5 text-[#2E7D32]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{upiCopied ? 'Copied' : 'Copy ID'}</span>
                  </button>
                </div>

                {/* Confirmation Checkbox */}
                <label className="flex items-center gap-2 text-xs font-semibold text-[#1E1E1E] text-left pt-1 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={upiConfirmed}
                    onChange={(e) => {
                      setUpiConfirmed(e.target.checked);
                      if (errors.upi) setErrors((prev) => ({ ...prev, upi: undefined }));
                    }}
                    className="w-4 h-4 rounded border-[#ECECEC] text-[#E85D04] focus:ring-[#E85D04] cursor-pointer"
                  />
                  <span>I have completed the payment on my UPI app</span>
                </label>

                {errors.upi && (
                  <p className="text-[11px] text-[#D32F2F] text-left font-medium">{errors.upi}</p>
                )}
              </div>
            )}

          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsCheckoutOpen(false)}
              className="px-4 py-3 text-xs font-bold text-[#6B7280] hover:text-[#1E1E1E] cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isCashInsufficient}
              className={`flex-1 font-bold py-3.5 rounded-xl shadow-md flex items-center justify-center gap-2 text-sm transition-all cursor-pointer ${
                isCashInsufficient
                  ? 'bg-[#ECECEC] text-[#6B7280] cursor-not-allowed shadow-none'
                  : 'bg-[#E85D04] hover:bg-[#C94B00] text-white shadow-[#E85D04]/20 active:scale-98'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Place Order & Generate Bill</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
