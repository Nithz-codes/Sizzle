import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import {
  Settings,
  Store,
  Phone,
  Mail,
  MapPin,
  Clock,
  Save,
  CheckCircle2,
} from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { settings, updateSettings } = useAdmin();

  const [restaurantName, setRestaurantName] = useState(settings.restaurantName);
  const [contactNumber, setContactNumber] = useState(settings.contactNumber);
  const [email, setEmail] = useState(settings.email);
  const [address, setAddress] = useState(settings.address);
  const [openingHours, setOpeningHours] = useState(settings.openingHours);

  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      restaurantName,
      contactNumber,
      email,
      address,
      openingHours,
    });

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-[#1E293B] border border-[#374151] rounded-2xl p-6 shadow-md flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#F9FAFB] font-['Poppins']">
              Admin & Restaurant Settings
            </h1>
            <p className="text-xs text-[#9CA3AF]">
              Configure restaurant contact information, branding details, and operating schedules.
            </p>
          </div>
        </div>

        {isSaved && (
          <span className="inline-flex items-center gap-1.5 bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30 px-3 py-1 rounded-full text-xs font-bold animate-fadeIn">
            <CheckCircle2 className="w-4 h-4" />
            Saved Successfully!
          </span>
        )}
      </div>

      {/* Settings Form Card */}
      <form onSubmit={handleSubmit} className="bg-[#1E293B] border border-[#374151] rounded-2xl p-6 sm:p-8 shadow-md space-y-6">
        <h2 className="text-base font-bold text-[#F9FAFB] font-['Poppins'] pb-3 border-b border-[#374151]">
          General Restaurant Information
        </h2>

        <div className="space-y-5 text-xs">
          {/* Restaurant Name */}
          <div>
            <label className="block text-[#D1D5DB] font-bold mb-1.5 flex items-center gap-2">
              <Store className="w-4 h-4 text-[#F97316]" />
              Restaurant Name *
            </label>
            <input
              type="text"
              required
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              className="w-full bg-[#111827] border border-[#374151] rounded-xl px-4 py-2.5 text-[#F9FAFB] text-sm focus:outline-none focus:border-[#F97316] transition-all font-semibold"
            />
          </div>

          {/* Contact Number & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#D1D5DB] font-bold mb-1.5 flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#F97316]" />
                Contact Number *
              </label>
              <input
                type="text"
                required
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="w-full bg-[#111827] border border-[#374151] rounded-xl px-4 py-2.5 text-[#F9FAFB] focus:outline-none focus:border-[#F97316] transition-all font-semibold"
              />
            </div>

            <div>
              <label className="block text-[#D1D5DB] font-bold mb-1.5 flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#F97316]" />
                Support Email *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#111827] border border-[#374151] rounded-xl px-4 py-2.5 text-[#F9FAFB] focus:outline-none focus:border-[#F97316] transition-all font-semibold"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-[#D1D5DB] font-bold mb-1.5 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#F97316]" />
              Physical Address *
            </label>
            <textarea
              rows={2}
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-[#111827] border border-[#374151] rounded-xl p-3 text-[#F9FAFB] focus:outline-none focus:border-[#F97316] transition-all font-semibold"
            />
          </div>

          {/* Opening Hours */}
          <div>
            <label className="block text-[#D1D5DB] font-bold mb-1.5 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#F97316]" />
              Opening Hours Schedule *
            </label>
            <input
              type="text"
              required
              value={openingHours}
              onChange={(e) => setOpeningHours(e.target.value)}
              className="w-full bg-[#111827] border border-[#374151] rounded-xl px-4 py-2.5 text-[#F9FAFB] focus:outline-none focus:border-[#F97316] transition-all font-semibold"
            />
          </div>

          {/* System Defaults */}
          <div className="bg-[#111827] border border-[#374151] p-4 rounded-xl space-y-2">
            <h3 className="font-bold text-[#D1D5DB] uppercase tracking-wider text-[11px]">
              System Defaults
            </h3>
            <div className="flex items-center justify-between text-[#9CA3AF]">
              <span>Currency Symbol</span>
              <strong className="text-[#F9FAFB] font-mono">{settings.currencySymbol} (INR)</strong>
            </div>
            <div className="flex items-center justify-between text-[#9CA3AF]">
              <span>GST Rate</span>
              <strong className="text-[#22C55E] font-mono">{settings.gstPercentage}%</strong>
            </div>
            <div className="flex items-center justify-between text-[#9CA3AF]">
              <span>Discount Threshold</span>
              <strong className="text-[#F97316] font-mono">10% OFF on ₹1,000+</strong>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4 border-t border-[#374151] flex justify-end">
          <button
            type="submit"
            className="bg-[#F97316] hover:bg-[#EA580C] text-white font-extrabold text-xs px-6 py-3 rounded-xl transition-all cursor-pointer shadow-lg shadow-[#F97316]/20 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};
