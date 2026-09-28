import React from 'react';
import { useJourney } from '../../context/JourneyContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useJourney();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((toast) => {
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';
        const isInfo = toast.type === 'info';

        return (
          <div
            key={toast.id}
            role="status"
            className="pointer-events-auto bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-xl border border-slate-200/80 flex items-start gap-3 transition-all transform translate-y-0"
          >
            <div className="shrink-0 mt-0.5">
              {isError ? (
                <AlertCircle className="w-5 h-5 text-rose-500" />
              ) : isWarning ? (
                <AlertCircle className="w-5 h-5 text-amber-500" />
              ) : isInfo ? (
                <Info className="w-5 h-5 text-[#5F2CFF]" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-[#0B0B12]">{toast.title}</h4>
              {toast.description && (
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{toast.description}</p>
              )}
            </div>

            <button
              onClick={() => dismissToast(toast.id)}
              className="text-slate-400 hover:text-slate-700 transition-colors p-1 -mr-1"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
