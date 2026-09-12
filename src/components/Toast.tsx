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
          className={`pointer-events-auto flex items-center justify-between w-full max-w-sm px-4 py-3 rounded-2xl border shadow-xl backdrop-blur-xl transition-all duration-300 animate-in fade-in slide-in-from-top-4 ${
            toast.type === 'success'
              ? 'bg-[#182023]/95 border-[#7fb6ac]/50 text-[#9ba9c2] shadow-glow-mint'
              : toast.type === 'error'
              ? 'bg-[#182023]/95 border-[#67758d]/50 text-[#9ba9c2]'
              : 'bg-[#182023]/95 border-[#2a3639] text-[#9ba9c2]'
          }`}
        >
          <div className="flex items-center space-x-3">
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-[#7fb6ac] shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-[#67758d] shrink-0" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-[#7fb6ac] shrink-0" />}
            <div>
              <p className="text-sm font-semibold tracking-wide text-[#9ba9c2]">{toast.title}</p>
              {toast.message && (
                <p className="text-xs text-[#6c7674] mt-0.5 font-mono">{toast.message}</p>
              )}
            </div>
          </div>
          <button
            onClick={() => onDismiss(toast.id)}
            className="p-1 text-[#6c7674] hover:text-[#9ba9c2] rounded-lg transition-colors ml-2 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
