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
    <div className="fixed top-4 left-0 right-0 z-50 flex flex-col items-center px-4 space-y-2 pointer-events-none safe-top select-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center justify-between w-full max-w-sm px-4 py-3 rounded-2xl border shadow-apple-modal backdrop-blur-xl transition-all duration-300 animate-in fade-in slide-in-from-top-4 ${
            toast.type === 'success'
              ? 'bg-white/95 border-[#1A3EEA]/40 text-[#0F172A]'
              : toast.type === 'error'
              ? 'bg-white/95 border-red-200 text-[#0F172A]'
              : 'bg-white/95 border-[#E9ECEF] text-[#0F172A]'
          }`}
        >
          <div className="flex items-center space-x-3">
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-[#1A3EEA] shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-[#1A3EEA] shrink-0" />}
            <div>
              <p className="text-sm font-bold tracking-tight text-[#0F172A]">{toast.title}</p>
              {toast.message && (
                <p className="text-xs text-[#64748B] mt-0.5 font-mono">{toast.message}</p>
              )}
            </div>
          </div>
          <button
            onClick={() => onDismiss(toast.id)}
            className="p-1 text-[#94A3B8] hover:text-[#0F172A] rounded-lg transition-colors ml-2 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
