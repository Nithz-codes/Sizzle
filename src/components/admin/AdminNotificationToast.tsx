import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useAuth } from '../../context/AuthContext';
import { Calendar, RefreshCw, Utensils, X, Info, ChefHat } from 'lucide-react';

export const AdminNotificationToast: React.FC = () => {
  const { toastAlert, dismissToastAlert, setActiveTab } = useAdmin();
  const { isAdmin } = useAuth();

  if (!isAdmin || !toastAlert) return null;

  const handleCardClick = () => {
    if (toastAlert.type === 'order') {
      setActiveTab('kitchen');
    }
    dismissToastAlert();
  };

  const getIcon = () => {
    switch (toastAlert.type) {
      case 'order':
        return <ChefHat className="w-5 h-5 text-[#F97316]" />;
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
      <div
        onClick={handleCardClick}
        className="flex items-center gap-3 bg-[#1E293B] border-2 border-[#F97316] text-[#F9FAFB] p-4 rounded-2xl shadow-2xl max-w-md w-full backdrop-blur-md cursor-pointer hover:scale-102 transition-all group"
      >
        <div className="p-2.5 rounded-xl bg-[#F97316]/20 border border-[#F97316]/40 shrink-0">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-sm font-extrabold text-[#F97316] font-['Poppins'] truncate">
              {toastAlert.title}
            </h4>
            <span className="text-[10px] text-[#9CA3AF] shrink-0">{toastAlert.timestamp}</span>
          </div>
          <p className="text-xs text-[#D1D5DB] truncate mt-0.5">{toastAlert.message}</p>
          {toastAlert.type === 'order' && (
            <div className="mt-1.5 text-[11px] font-extrabold text-[#F97316] group-hover:underline flex items-center gap-1">
              <span>Open Kitchen KDS Screen &rarr;</span>
            </div>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            dismissToastAlert();
          }}
          className="text-[#9CA3AF] hover:text-[#F9FAFB] p-1 rounded-lg hover:bg-[#1F2937] transition-colors shrink-0 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
