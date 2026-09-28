import React from 'react';
import { useBattery } from '../../context/BatteryContext';
import { BatteryWarning, X, Sparkles } from 'lucide-react';

export const BatterySaverBanner: React.FC = () => {
  const { batteryMode, batteryLevel, setOverrideExitSaver } = useBattery();

  if (batteryMode !== 'saver') return null;

  return (
    <div
      role="status"
      className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 text-xs text-amber-900 transition-all"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <BatteryWarning className="w-4 h-4 text-amber-600 shrink-0" />
          <div>
            <strong className="font-semibold">Battery Saver active ({batteryLevel}%):</strong>{' '}
            <span className="text-amber-800">
              JourneyIQ is prioritizing low-interaction routes to preserve your remaining charge.
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setOverrideExitSaver(true)}
          className="text-amber-700 hover:text-amber-900 font-bold underline hover:no-underline text-xs shrink-0 cursor-pointer"
        >
          Exit Battery Saver
        </button>
      </div>
    </div>
  );
};
