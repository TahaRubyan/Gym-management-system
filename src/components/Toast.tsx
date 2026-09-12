import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex flex-col items-center px-4 space-y-2 pointer-events-none safe-top">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center justify-between w-full max-w-sm px-4 py-3 rounded-xl border shadow-xl backdrop-blur-xl transition-all duration-300 animate-in fade-in slide-in-from-top-4 ${
            toast.type === 'success'
              ? 'bg-[#141923]/95 border-[#10B981]/50 text-[#F9FAFB] shadow-emerald-500/10'
              : toast.type === 'error'
              ? 'bg-[#141923]/95 border-[#EF4444]/50 text-[#F9FAFB] shadow-red-500/10'
              : 'bg-[#141923]/95 border-[#222B3D] text-[#F9FAFB]'
          }`}
        >
          <div className="flex items-center space-x-3">
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-[#EF4444] shrink-0" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-[#F59E0B] shrink-0" />}
            <div>
              <p className="text-sm font-semibold tracking-wide text-white">{toast.title}</p>
              {toast.message && (
                <p className="text-xs text-[#9CA3AF] mt-0.5">{toast.message}</p>
              )}
            </div>
          </div>
          <button
            onClick={() => onDismiss(toast.id)}
            className="p-1 text-[#9CA3AF] hover:text-white rounded-lg transition-colors ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
