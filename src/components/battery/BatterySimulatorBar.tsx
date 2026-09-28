import React, { useState } from 'react';
import { useBattery } from '../../context/BatteryContext';
import { Battery, BatteryCharging, BatteryWarning, BatteryLow, Sparkles, Smartphone, ChevronDown, ChevronUp } from 'lucide-react';

export const BatterySimulatorBar: React.FC = () => {
  const {
    batteryLevel,
    batteryMode,
    isSimulated,
    hasDeviceBatteryAPI,
    setBatteryLevel,
    syncWithDeviceBattery
  } = useBattery();

  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const getBatteryIcon = () => {
    if (batteryLevel <= 5) {
      return <BatteryLow className="w-4 h-4 text-rose-500 animate-pulse" />;
    }
    if (batteryLevel <= 20) {
      return <BatteryWarning className="w-4 h-4 text-amber-500" />;
    }
    return <Battery className="w-4 h-4 text-emerald-500" />;
  };

  const getBadgeClass = () => {
    if (batteryMode === 'critical') {
      return 'bg-rose-500 text-white shadow-xs';
    }
    if (batteryMode === 'saver') {
      return 'bg-amber-100 text-amber-900 border border-amber-300';
    }
    return 'bg-emerald-50 text-emerald-800 border border-emerald-200';
  };

  return (
    <aside aria-label="Demo battery control bar" className="w-full bg-[#0B0B12] text-white border-b border-white/10 px-4 py-2 text-xs transition-all">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Hackathon demo indicator */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[11px] text-[#DFF6FF]">
            {getBatteryIcon()}
            <span>Battery Simulation:</span>
          </div>

          <span className="font-extrabold tabular-nums text-sm font-display text-white">
            {batteryLevel}%
          </span>

          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${getBadgeClass()}`}
          >
            {batteryMode === 'critical'
              ? 'Critical Mode (≤5%)'
              : batteryMode === 'saver'
              ? 'Battery Saver (6-20%)'
              : 'Normal Mode'}
          </span>
        </div>

        {/* Right: Instant preset buttons for judges */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
            Judge Presets:
          </span>

          {[
            { level: 100, label: '100% (Normal)' },
            { level: 20, label: '20% (Saver)' },
            { level: 10, label: '10%' },
            { level: 5, label: '5% (Critical)' }
          ].map(({ level, label }) => (
            <button
              type="button"
              key={level}
              onClick={() => setBatteryLevel(level)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                batteryLevel === level
                  ? level <= 5
                    ? 'bg-rose-500 text-white shadow-sm ring-2 ring-rose-400'
                    : 'bg-[#5F2CFF] text-white shadow-sm ring-2 ring-[#8B6CFF]'
                  : 'bg-white/10 hover:bg-white/20 text-slate-200'
              }`}
            >
              {label}
            </button>
          ))}

          {hasDeviceBatteryAPI && (
            <button
              type="button"
              onClick={syncWithDeviceBattery}
              title="Read actual battery level from browser"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 text-xs font-medium transition-colors"
            >
              <Smartphone className="w-3 h-3" />
              <span className="hidden md:inline">Real Battery</span>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
