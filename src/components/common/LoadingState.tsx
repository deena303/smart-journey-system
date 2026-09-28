import React from 'react';
import { Compass, AlertCircle, Inbox, RefreshCw } from 'lucide-react';

export const LoadingState: React.FC<{ message?: string; submessage?: string }> = ({
  message = 'Calculating optimal journeys...',
  submessage = 'Analyzing time, distance, cost, transfers and carbon metrics'
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-2xl bg-[#DFF6FF] flex items-center justify-center animate-pulse">
          <Compass className="w-8 h-8 text-[#5F2CFF] animate-spin" style={{ animationDuration: '3s' }} />
        </div>
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#5F2CFF]/20 to-[#8B6CFF]/20 blur-md -z-10" />
      </div>
      <h3 className="text-lg font-bold text-[#0B0B12] mb-1">{message}</h3>
      <p className="text-sm text-slate-500 max-w-sm">{submessage}</p>
    </div>
  );
};

export const EmptyState: React.FC<{
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}> = ({ title, description, actionLabel, onAction, icon }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white rounded-2xl border border-slate-200/60 p-8 shadow-xs">
      <div className="w-14 h-14 rounded-2xl bg-[#DFF6FF]/60 flex items-center justify-center text-[#5F2CFF] mb-4">
        {icon || <Inbox className="w-7 h-7" />}
      </div>
      <h3 className="text-base font-bold text-[#0B0B12] mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-md mb-6">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 bg-[#5F2CFF] hover:bg-[#5F2CFF]/90 text-white font-medium text-xs rounded-xl shadow-xs transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export const ErrorState: React.FC<{
  title?: string;
  message?: string;
  onRetry?: () => void;
}> = ({
  title = 'Something went wrong',
  message = 'We could not complete this journey calculation. Please check inputs and try again.',
  onRetry
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-rose-50/50 rounded-2xl border border-rose-200/60 p-8">
      <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold text-rose-900 mb-1">{title}</h3>
      <p className="text-sm text-rose-700/80 max-w-md mb-5">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs rounded-lg transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Calculation</span>
        </button>
      )}
    </div>
  );
};
