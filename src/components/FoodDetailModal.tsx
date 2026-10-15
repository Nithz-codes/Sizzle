import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Star,
  Clock,
  Flame,
  ShoppingBag,
  Plus,
  Minus,
  Check,
  ThumbsUp,
  MessageSquare,
  Sparkles,
  ChefHat,
  AlertCircle,
  ShieldCheck,
  Tag,
  Share2,
} from 'lucide-react';
import { FoodItem, DishReview } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { getDishFullDetails, saveDishReview } from '../data/dishReviewsAndIngredients';

interface FoodDetailModalProps {
  item: FoodItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const FoodDetailModal: React.FC<FoodDetailModalProps> = ({ item, isOpen, onClose }) => {
  const { addItem, cartItems, showToast, updateQuantity } = useCart();
  const { user, isAuthenticated } = useAuth();

  const [activeTab, setActiveTab] = useState<'ingredients' | 'reviews'>('ingredients');
  const [qty, setQty] = useState<number>(1);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Review Form State
  const [isWritingReview, setIsWritingReview] = useState<boolean>(false);
  const [reviewerName, setReviewerName] = useState<string>('');
  const [userRating, setUserRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewComment, setReviewComment] = useState<string>('');
  const [likedReviews, setLikedReviews] = useState<Record<string, boolean>>({});

  // Reset state when opening a new dish
  useEffect(() => {
    if (isOpen && item) {
      setQty(1);
      setIsWritingReview(false);
      setReviewComment('');
      setUserRating(5);
      if (user?.name) {
        setReviewerName(user.name);
      }
    }
  }, [isOpen, item, user]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Load dish full details including merged user reviews
  const dishDetails = useMemo(() => {
    if (!item) return null;
    return getDishFullDetails(item);
  }, [item, isWritingReview]);

  if (!isOpen || !item || !dishDetails) return null;

  // Check in-cart quantity
  const cartEntry = cartItems.find((c) => c.foodItem.id === item.id);
  const inCartQty = cartEntry ? cartEntry.quantity : 0;

  const handleAddToCart = () => {
    setIsAdding(true);
    addItem(item, qty);
    setQty(1);
    showToast(`Added ${qty}x ${item.name} to cart!`);
    setTimeout(() => setIsAdding(false), 450);
  };

  const handleShareDish = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `Check out ${item.name} at Sizzle Gourmet Restaurant! Delicious ${item.category} for ₹${item.price}.`
      );
      setCopiedLink(true);
      showToast('Dish details copied to clipboard!');
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      showToast('Please enter your review comment.');
      return;
    }

    const nameToUse = reviewerName.trim() || user?.name || 'Verified Diner';
    saveDishReview(item.id, {
      userName: nameToUse,
      rating: userRating,
      comment: reviewComment,
    });

    showToast('Thank you! Your review has been published.');
    setReviewComment('');
    setIsWritingReview(false);
  };

  const toggleHelpful = (revId: string) => {
    setLikedReviews((prev) => ({
      ...prev,
      [revId]: !prev[revId],
    }));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-[#FFFDF8] border-2 border-[#E85D04]/40 rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-[0_20px_60px_-15px_rgba(232,93,4,0.3)] overflow-hidden relative text-[#1E1E1E]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="px-5 py-4 bg-white/90 backdrop-blur-md border-b border-[#ECECEC] flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5">
            {/* Veg / Non-Veg Tag */}
            <div
              className={`w-4 h-4 border-2 flex items-center justify-center p-0.5 rounded-2xs ${
                item.isVeg ? 'border-[#2E7D32]' : 'border-[#D32F2F]'
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  item.isVeg ? 'bg-[#2E7D32]' : 'bg-[#D32F2F]'
                }`}
              />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#E85D04]">
                {item.category}
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold font-['Poppins'] text-[#1E1E1E] leading-tight">
                {item.name}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Share Button */}
            <button
              onClick={handleShareDish}
              className="p-2 rounded-full bg-stone-100 hover:bg-[#E85D04]/10 text-stone-600 hover:text-[#E85D04] transition-colors cursor-pointer"
              title="Share Dish"
              aria-label="Share Dish"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
              title="Close Modal"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="flex-1 overflow-y-auto space-y-5 p-4 sm:p-6 custom-scrollbar">
          {/* Dish Hero Image Banner */}
          <div className="relative h-60 sm:h-72 w-full rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shadow-inner group">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Overlaid Badges */}
            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
              <span className="bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-[#1E1E1E] shadow-sm flex items-center gap-1">
                {item.isVeg ? '🌱 100% Veg' : '🍗 Non-Veg Gourmet'}
              </span>
              {item.tags && item.tags.length > 0 && (
                <span className="bg-[#E85D04] text-white text-[11px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-sm">
                  {item.tags[0]}
                </span>
              )}
            </div>

            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
              <div className="flex items-center gap-2">
                {/* Rating Badge */}
                <div className="bg-amber-500/90 backdrop-blur-md px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 shadow-sm">
                  <Star className="w-3.5 h-3.5 fill-white text-white" />
                  <span>{dishDetails.averageRating}</span>
                  <span className="text-white/80 text-[10px]">({dishDetails.totalReviewCount})</span>
                </div>

                {/* Prep Time */}
                {item.prepTime && (
                  <div className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#E85D04]" />
                    <span>{item.prepTime}</span>
                  </div>
                )}
              </div>

              {/* Price Tag Overlay */}
              <div className="bg-emerald-600/95 backdrop-blur-md px-3 py-1 rounded-lg font-extrabold text-sm sm:text-base text-white shadow-md">
                ₹{item.price.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Description & Calories */}
          <div>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-normal">
              {item.description}
            </p>
          </div>

          {/* Macro Nutrition Pills Row */}
          {(item.calories || item.protein) && (
            <div className="grid grid-cols-4 gap-2 sm:gap-3 p-3 sm:p-4 rounded-2xl bg-white border border-[#ECECEC] shadow-2xs">
              <div className="text-center p-2 rounded-xl bg-orange-50 border border-orange-100">
                <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider block">Calories</span>
                <span className="text-sm sm:text-base font-extrabold text-[#E85D04]">{item.calories || 450}</span>
                <span className="text-[10px] text-orange-600/80 block">kcal</span>
              </div>
              <div className="text-center p-2 rounded-xl bg-emerald-50 border border-emerald-100">
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">Protein</span>
                <span className="text-sm sm:text-base font-extrabold text-emerald-700">{item.protein || 20}g</span>
                <span className="text-[10px] text-emerald-600/80 block">energy</span>
              </div>
              <div className="text-center p-2 rounded-xl bg-amber-50 border border-amber-100">
                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">Carbs</span>
                <span className="text-sm sm:text-base font-extrabold text-amber-700">{item.carbs || 45}g</span>
                <span className="text-[10px] text-amber-600/80 block">fuel</span>
              </div>
              <div className="text-center p-2 rounded-xl bg-rose-50 border border-rose-100">
                <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider block">Fat</span>
                <span className="text-sm sm:text-base font-extrabold text-rose-700">{item.fat || 18}g</span>
                <span className="text-[10px] text-rose-600/80 block">texture</span>
              </div>
            </div>
          )}

          {/* Section Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-stone-200 pb-1">
            <button
              type="button"
              onClick={() => setActiveTab('ingredients')}
              className={`pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'ingredients'
                  ? 'border-[#E85D04] text-[#E85D04]'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <ChefHat className="w-4 h-4" />
              <span>Ingredients & Chef Notes</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('reviews')}
              className={`pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'reviews'
                  ? 'border-[#E85D04] text-[#E85D04]'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>
                Ratings & Reviews ({dishDetails.totalReviewCount})
              </span>
            </button>
          </div>

          {/* TAB 1: INGREDIENTS & RECIPE */}
          {activeTab === 'ingredients' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Ingredients List */}
              <div className="space-y-2">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#E85D04]" />
                  What Goes Into This Dish
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {dishDetails.ingredients.map((ing, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white border border-[#ECECEC] text-xs font-semibold text-stone-800 shadow-2xs hover:border-[#E85D04]/40 transition-colors"
                    >
                      <span className="w-2 h-2 rounded-full bg-[#E85D04] shrink-0" />
                      <span>{ing}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chef Notes Card */}
              {dishDetails.chefNotes && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-[#1E1E1E] space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-amber-800 uppercase tracking-wider">
                    <ChefHat className="w-4 h-4 text-[#E85D04]" />
                    Chef Mario's Culinary Secret
                  </div>
                  <p className="text-xs sm:text-sm text-stone-700 italic leading-relaxed">
                    "{dishDetails.chefNotes}"
                  </p>
                </div>
              )}

              {/* Allergen & Dietary Information */}
              <div className="p-3.5 rounded-2xl bg-stone-100 border border-stone-200 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-stone-700">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Allergen & Dietary Information</span>
                </div>
                <p className="text-stone-500 leading-relaxed text-[11px]">
                  {dishDetails.allergens.length > 0 ? (
                    <>
                      <strong className="text-stone-700">Allergen Notice:</strong> Contains{' '}
                      {dishDetails.allergens.join(', ')}. Please inform the server if you have severe dietary allergies.
                    </>
                  ) : (
                    <>No common major allergens (nuts/soy/dairy) detected in standard preparation.</>
                  )}
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: RATINGS & REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-5 animate-fadeIn">
              {/* Ratings Summary Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#ECECEC] shadow-2xs flex flex-col sm:flex-row items-center gap-5 sm:gap-8">
                {/* Score Number */}
                <div className="text-center sm:text-left sm:border-r sm:border-stone-200 sm:pr-8 shrink-0">
                  <span className="text-4xl sm:text-5xl font-extrabold text-[#1E1E1E] block font-['Poppins']">
                    {dishDetails.averageRating}
                  </span>
                  <div className="flex items-center justify-center sm:justify-start gap-1 text-amber-400 my-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= Math.round(dishDetails.averageRating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-stone-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-stone-500 font-medium">
                    Based on {dishDetails.totalReviewCount} verified diner reviews
                  </span>
                </div>

                {/* Star Distribution Bars */}
                <div className="flex-1 w-full space-y-1.5 text-xs">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = dishDetails.ratingDistribution[star] || 0;
                    const pct = dishDetails.totalReviewCount > 0 ? (count / dishDetails.totalReviewCount) * 100 : 0;
                    return (
                      <div key={star} className="flex items-center gap-2">
                        <span className="w-6 text-stone-600 font-bold">{star}★</span>
                        <div className="flex-1 h-2 rounded-full bg-stone-100 overflow-hidden">
                          <div
                            className="h-full bg-amber-400 rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="w-8 text-right text-stone-400 text-[11px]">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Write a Review Button / Form Accordion */}
              <div className="rounded-2xl border border-[#ECECEC] bg-white overflow-hidden shadow-2xs">
                {!isWritingReview ? (
                  <button
                    type="button"
                    onClick={() => setIsWritingReview(true)}
                    className="w-full p-3.5 text-xs sm:text-sm font-bold text-[#E85D04] hover:bg-orange-50/70 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Rate this dish & share your dining experience</span>
                  </button>
                ) : (
                  <form onSubmit={handleSubmitReview} className="p-4 sm:p-5 space-y-3.5 bg-orange-50/40">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-stone-700">
                        Share Your Rating & Review
                      </h4>
                      <button
                        type="button"
                        onClick={() => setIsWritingReview(false)}
                        className="text-stone-400 hover:text-stone-600 text-xs font-bold cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>

                    {/* Interactive Star Picker */}
                    <div>
                      <label className="text-[11px] font-bold text-stone-600 uppercase block mb-1">
                        Your Rating
                      </label>
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setUserRating(star)}
                            className="p-1 rounded-md transition-transform hover:scale-120 cursor-pointer"
                            aria-label={`${star} Stars`}
                          >
                            <Star
                              className={`w-6 h-6 transition-colors ${
                                (hoverRating || userRating) >= star
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-stone-300'
                              }`}
                            />
                          </button>
                        ))}
                        <span className="text-xs font-bold text-amber-700 ml-2">
                          {userRating === 5
                            ? 'Exceptional!'
                            : userRating === 4
                            ? 'Very Good'
                            : userRating === 3
                            ? 'Good'
                            : userRating === 2
                            ? 'Fair'
                            : 'Poor'}
                        </span>
                      </div>
                    </div>

                    {/* Name Input */}
                    <div>
                      <label className="text-[11px] font-bold text-stone-600 uppercase block mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        value={reviewerName}
                        onChange={(e) => setReviewerName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-stone-200 focus:outline-hidden focus:border-[#E85D04]"
                      />
                    </div>

                    {/* Review Text */}
                    <div>
                      <label className="text-[11px] font-bold text-stone-600 uppercase block mb-1">
                        Review Comments
                      </label>
                      <textarea
                        rows={3}
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Tell other foodies about the flavor, crispiness, sauce, and presentation..."
                        className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-stone-200 focus:outline-hidden focus:border-[#E85D04]"
                        required
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setIsWritingReview(false)}
                        className="px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-semibold text-stone-600 hover:bg-stone-100 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-lg bg-[#E85D04] hover:bg-[#C94B00] text-white text-xs font-bold shadow-md shadow-[#E85D04]/20 transition-all cursor-pointer"
                      >
                        Publish Review
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Reviews List */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-stone-500">
                  Recent Verified Diner Feedback
                </h4>

                {dishDetails.reviews.map((rev) => {
                  const isLiked = likedReviews[rev.id];
                  const initial = rev.userName ? rev.userName.charAt(0).toUpperCase() : 'D';

                  return (
                    <div
                      key={rev.id}
                      className="p-4 rounded-2xl bg-white border border-[#ECECEC] shadow-2xs space-y-2.5 transition-all hover:border-[#E85D04]/30"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          {/* User Avatar Circle */}
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#E85D04] to-amber-400 text-white font-extrabold text-xs flex items-center justify-center shadow-2xs">
                            {initial}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-stone-800">{rev.userName}</span>
                              {rev.verifiedDiner && (
                                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.2 rounded-sm flex items-center gap-0.5">
                                  <Check className="w-2.5 h-2.5" /> Verified
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-stone-400">{rev.date}</span>
                          </div>
                        </div>

                        {/* Star Rating */}
                        <div className="flex items-center gap-0.5 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span className="text-xs font-extrabold text-amber-800">{rev.rating}</span>
                        </div>
                      </div>

                      <p className="text-xs text-stone-700 leading-relaxed">
                        {rev.comment}
                      </p>

                      <div className="flex items-center justify-between pt-1 border-t border-stone-100 text-[11px] text-stone-400">
                        <span>Was this review helpful?</span>
                        <button
                          type="button"
                          onClick={() => toggleHelpful(rev.id)}
                          className={`flex items-center gap-1 px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                            isLiked
                              ? 'bg-orange-100 text-[#E85D04] font-bold'
                              : 'hover:bg-stone-100 text-stone-500'
                          }`}
                        >
                          <ThumbsUp className="w-3 h-3" />
                          <span>{(rev.helpfulCount || 0) + (isLiked ? 1 : 0)}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Sticky Bottom Order Bar */}
        <div className="px-5 py-4 bg-white/95 backdrop-blur-md border-t border-[#ECECEC] flex items-center justify-between gap-3 z-10">
          <div>
            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
              Total Amount
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-[#1E1E1E]">
              ₹{(item.price * qty).toFixed(2)}
            </span>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Quantity Stepper */}
            <div className="flex items-center bg-stone-100 border border-stone-200 rounded-xl p-1">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-700 hover:bg-stone-200 transition-colors cursor-pointer"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center text-sm font-extrabold text-stone-800">
                {qty}
              </span>
              <button
                type="button"
                onClick={() => setQty((q) => q + 1)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-700 hover:bg-stone-200 transition-colors cursor-pointer"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className={`bg-[#E85D04] hover:bg-[#C94B00] text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-extrabold text-xs sm:text-sm transition-all shadow-lg shadow-[#E85D04]/30 active:scale-95 cursor-pointer flex items-center gap-2 ${
                isAdding ? 'scale-105 bg-[#2E7D32]' : ''
              }`}
            >
              {isAdding ? (
                <Check className="w-4 h-4 animate-bounce" />
              ) : (
                <ShoppingBag className="w-4 h-4" />
              )}
              <span>{isAdding ? 'Added to Cart!' : `Add to Cart • ₹${(item.price * qty).toFixed(2)}`}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
