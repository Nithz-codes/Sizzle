import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger',
  onConfirm,
  onClose,
}) => {
  if (!isOpen) return null;

  const getTheme = () => {
    switch (type) {
      case 'danger':
        return {
          iconColor: 'text-[#EF4444]',
          bgColor: 'bg-[#EF4444]/10',
          borderColor: 'border-[#EF4444]/30',
          btnBg: 'bg-[#EF4444] hover:bg-[#DC2626] text-white',
        };
      case 'warning':
        return {
          iconColor: 'text-[#F59E0B]',
          bgColor: 'bg-[#F59E0B]/10',
          borderColor: 'border-[#F59E0B]/30',
          btnBg: 'bg-[#F59E0B] hover:bg-[#D97706] text-white',
        };
      default:
        return {
          iconColor: 'text-[#F97316]',
          bgColor: 'bg-[#F97316]/10',
          borderColor: 'border-[#F97316]/30',
          btnBg: 'bg-[#F97316] hover:bg-[#EA580C] text-white',
        };
    }
  };

  const theme = getTheme();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[#1E293B] border border-[#374151] rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#374151]">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${theme.bgColor} ${theme.borderColor} border`}>
              <AlertTriangle className={`w-5 h-5 ${theme.iconColor}`} />
            </div>
            <h3 className="text-lg font-bold text-[#F9FAFB] font-['Poppins']">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#9CA3AF] hover:text-[#F9FAFB] p-1 rounded-lg hover:bg-[#1F2937] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-sm text-[#D1D5DB] space-y-2">
          <p>{message}</p>
        </div>

        {/* Actions */}
        <div className="p-5 bg-[#111827] border-t border-[#374151] flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#D1D5DB] hover:text-[#F9FAFB] bg-[#1F2937] hover:bg-[#374151] rounded-xl transition-all border border-[#374151] cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md ${theme.btnBg}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
