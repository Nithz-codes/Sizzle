import React, { useState } from 'react';
import { FoodItem } from '../../types';
import { useAdmin } from '../../context/AdminContext';
import { Edit, X, Save, Image, Tag, DollarSign, FileText, CheckCircle2 } from 'lucide-react';
import { CATEGORIES } from '../../data/menuData';

interface EditFoodModalProps {
  item: FoodItem;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (updatedItem: FoodItem) => void;
}

export const EditFoodModal: React.FC<EditFoodModalProps> = ({ item, isOpen, onClose, onSave }) => {
  const { addNotification } = useAdmin();

  const [name, setName] = useState(item.name);
  const [category, setCategory] = useState(item.category);
  const [price, setPrice] = useState(item.price);
  const [description, setDescription] = useState(item.description);
  const [image, setImage] = useState(item.image);
  const [isVeg, setIsVeg] = useState(item.isVeg);
  const [prepTime, setPrepTime] = useState(item.prepTime || '15 mins');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Mutate properties on item reference
    item.name = name.trim();
    item.category = category;
    item.price = Number(price);
    item.description = description.trim();
    item.image = image.trim();
    item.isVeg = isVeg;
    item.prepTime = prepTime;

    if (onSave) {
      onSave(item);
    }

    addNotification(
      'Food Item Updated',
      `Successfully updated menu details for "${item.name}"`,
      'food'
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[#1E293B] border border-[#374151] rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="p-6 bg-[#111827] border-b border-[#374151] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20">
              <Edit className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#F9FAFB] font-['Poppins']">
                Edit Menu Item Details
              </h3>
              <p className="text-xs text-[#9CA3AF]">Modify name, category, price, or dish image</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#9CA3AF] hover:text-[#F9FAFB] p-2 rounded-xl hover:bg-[#1F2937] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
          
          {/* Dish Preview Image */}
          <div className="flex items-center gap-4 bg-[#111827] border border-[#374151] p-3 rounded-2xl">
            <img
              src={image || item.image}
              alt={name}
              className="w-16 h-16 rounded-xl object-cover border border-[#374151] shrink-0"
              onError={(e) => {
                // Fallback image if broken URL
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80';
              }}
            />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] text-[#9CA3AF] block font-semibold uppercase">Image Preview</span>
              <p className="text-xs text-[#F9FAFB] font-bold truncate">{name || 'Dish Name'}</p>
              <span className="text-[11px] text-[#F97316] font-bold">₹{price}</span>
            </div>
          </div>

          {/* Dish Name */}
          <div>
            <label className="block text-[#D1D5DB] font-bold mb-1.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-[#F97316]" />
              Dish Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#111827] border border-[#374151] rounded-xl px-3.5 py-2.5 text-[#F9FAFB] text-xs focus:outline-none focus:border-[#F97316] transition-all font-semibold"
            />
          </div>

          {/* Category & Price */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#D1D5DB] font-bold mb-1.5">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#111827] border border-[#374151] rounded-xl px-3 py-2.5 text-[#F9FAFB] text-xs focus:outline-none focus:border-[#F97316] cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.displayName} ({cat.name})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[#D1D5DB] font-bold mb-1.5 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-[#22C55E]" />
                Price (₹) *
              </label>
              <input
                type="number"
                required
                min={0}
                step={1}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full bg-[#111827] border border-[#374151] rounded-xl px-3.5 py-2.5 text-[#F9FAFB] text-xs focus:outline-none focus:border-[#F97316] font-bold"
              />
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-[#D1D5DB] font-bold mb-1.5 flex items-center gap-1.5">
              <Image className="w-3.5 h-3.5 text-[#F97316]" />
              Image URL *
            </label>
            <input
              type="url"
              required
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full bg-[#111827] border border-[#374151] rounded-xl px-3.5 py-2.5 text-[#F9FAFB] text-xs focus:outline-none focus:border-[#F97316] font-mono text-[11px]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[#D1D5DB] font-bold mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#F97316]" />
              Description *
            </label>
            <textarea
              rows={2}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#111827] border border-[#374151] rounded-xl p-3 text-[#F9FAFB] text-xs focus:outline-none focus:border-[#F97316]"
            />
          </div>

          {/* Veg / Non-Veg Toggle & Prep Time */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-[#D1D5DB] font-bold mb-1.5">Dietary Type</label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsVeg(true)}
                  className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs transition-all cursor-pointer border ${
                    isVeg
                      ? 'bg-[#22C55E]/20 text-[#22C55E] border-[#22C55E]'
                      : 'bg-[#111827] text-[#9CA3AF] border-[#374151]'
                  }`}
                >
                  🟢 VEG
                </button>
                <button
                  type="button"
                  onClick={() => setIsVeg(false)}
                  className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs transition-all cursor-pointer border ${
                    !isVeg
                      ? 'bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444]'
                      : 'bg-[#111827] text-[#9CA3AF] border-[#374151]'
                  }`}
                >
                  🔴 NON-VEG
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[#D1D5DB] font-bold mb-1.5">Prep Time</label>
              <input
                type="text"
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
                className="w-full bg-[#111827] border border-[#374151] rounded-xl px-3 py-2 text-[#F9FAFB] text-xs focus:outline-none"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-3 border-t border-[#374151] flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-[#1F2937] hover:bg-[#374151] text-[#F9FAFB] font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer border border-[#374151]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#F97316] hover:bg-[#EA580C] text-white font-extrabold px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-lg shadow-[#F97316]/20 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Dish Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
