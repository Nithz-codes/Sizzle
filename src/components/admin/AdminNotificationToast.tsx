import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import { ShoppingBag, Calendar, RefreshCw, Utensils, X, Info } from 'lucide-react';

export const AdminNotificationToast: React.FC = () => {
  const { toastAlert, dismissToastAlert } = useAdmin();

  if (!toastAlert) return null;

  const getIcon = () => {
    switch (toastAlert.type) {
      case 'order':
        return <ShoppingBag className="w-5 h-5 text-[#22C55E]" />;
      case 'reservation':
        return <Calendar className="w-5 h-5 text-[#3B82F6]" />;
      case 'status':
        return <RefreshCw className="w-5 h-5 text-[#F59E0B]" />;
      case 'food':
        return <Utensils className="w-5 h-5 text-[#F97316]" />;
      default:
        return <Info className="w-5 h-5 text-[#F97316]" />;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
      <div className="flex items-center gap-3 bg-[#1E293B] border border-[#F97316]/50 text-[#F9FAFB] p-4 rounded-2xl shadow-2xl max-w-md w-full backdrop-blur-md">
        <div className="p-2.5 rounded-xl bg-[#F97316]/10 border border-[#F97316]/20 shrink-0">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-sm font-bold text-[#F97316] font-['Poppins'] truncate">
              {toastAlert.title}
            </h4>
            <span className="text-[10px] text-[#9CA3AF] shrink-0">{toastAlert.timestamp}</span>
          </div>
          <p className="text-xs text-[#D1D5DB] truncate mt-0.5">{toastAlert.message}</p>
        </div>
        <button
          onClick={dismissToastAlert}
          className="text-[#9CA3AF] hover:text-[#F9FAFB] p-1 rounded-lg hover:bg-[#1F2937] transition-colors shrink-0 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
