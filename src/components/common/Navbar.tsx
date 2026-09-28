import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Sliders, User, Compass, Sparkles, Bookmark, History, GitCompare, Battery, BatteryWarning, BatteryLow } from 'lucide-react';
import { useBattery } from '../../context/BatteryContext';

export const Navbar: React.FC = () => {
  const { batteryLevel, batteryMode, setBatteryLevel } = useBattery();

  const cycleBattery = () => {
    if (batteryLevel > 20) setBatteryLevel(20);
    else if (batteryLevel > 5) setBatteryLevel(5);
    else setBatteryLevel(100);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-[#0B0B12]/5 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold tracking-tight text-[#0B0B12] hover:opacity-90 transition-opacity"
          >
            <div className="w-8 h-8 rounded-lg bg-[#5F2CFF] flex items-center justify-center text-white shadow-sm shadow-[#5F2CFF]/30">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <span className="font-display tracking-tight text-xl">
              Journey<span className="text-[#5F2CFF]">IQ</span>
            </span>
          </Link>
        </div>

        {/* Zone 2: Navigation Links (Single-line, unboxed, subtle hover) */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `transition-colors duration-150 py-1 border-b-2 ${
                isActive
                  ? 'border-[#5F2CFF] text-[#5F2CFF] font-semibold'
                  : 'border-transparent text-[#0B0B12]/70 hover:text-[#0B0B12]'
              }`
            }
          >
            Plan
          </NavLink>
          <NavLink
            to="/compare"
            className={({ isActive }) =>
              `flex items-center gap-1.5 transition-colors duration-150 py-1 border-b-2 ${
                isActive
                  ? 'border-[#5F2CFF] text-[#5F2CFF] font-semibold'
                  : 'border-transparent text-[#0B0B12]/70 hover:text-[#0B0B12]'
              }`
            }
          >
            <GitCompare className="w-4 h-4" />
            <span>Compare</span>
          </NavLink>
          <NavLink
            to="/what-if"
            className={({ isActive }) =>
              `flex items-center gap-1.5 transition-colors duration-150 py-1 border-b-2 ${
                isActive
                  ? 'border-[#5F2CFF] text-[#5F2CFF] font-semibold'
                  : 'border-transparent text-[#0B0B12]/70 hover:text-[#0B0B12]'
              }`
            }
          >
            <Sparkles className="w-4 h-4 text-[#5F2CFF]" />
            <span>What-If</span>
          </NavLink>
          <NavLink
            to="/saved"
            className={({ isActive }) =>
              `flex items-center gap-1.5 transition-colors duration-150 py-1 border-b-2 ${
                isActive
                  ? 'border-[#5F2CFF] text-[#5F2CFF] font-semibold'
                  : 'border-transparent text-[#0B0B12]/70 hover:text-[#0B0B12]'
              }`
            }
          >
            <Bookmark className="w-4 h-4" />
            <span>Saved</span>
          </NavLink>
          <NavLink
            to="/history"
            className={({ isActive }) =>
              `flex items-center gap-1.5 transition-colors duration-150 py-1 border-b-2 ${
                isActive
                  ? 'border-[#5F2CFF] text-[#5F2CFF] font-semibold'
                  : 'border-transparent text-[#0B0B12]/70 hover:text-[#0B0B12]'
              }`
            }
          >
            <History className="w-4 h-4" />
            <span>History</span>
          </NavLink>
        </nav>

        {/* Zone 3: Actions (Battery Quick-Pill, Preferences, User Avatar) */}
        <div className="flex items-center gap-3">
          {/* Battery Status Pill */}
          <button
            type="button"
            onClick={cycleBattery}
            title={`Battery: ${batteryLevel}% (${batteryMode}). Click to cycle.`}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
              batteryMode === 'critical'
                ? 'bg-rose-100 text-rose-800 border border-rose-300 ring-2 ring-rose-400/40 animate-pulse'
                : batteryMode === 'saver'
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            }`}
          >
            {batteryMode === 'critical' ? (
              <BatteryLow className="w-3.5 h-3.5 text-rose-600" />
            ) : batteryMode === 'saver' ? (
              <BatteryWarning className="w-3.5 h-3.5 text-amber-600" />
            ) : (
              <Battery className="w-3.5 h-3.5 text-emerald-600" />
            )}
            <span className="tabular-nums">{batteryLevel}%</span>
          </button>

          <Link
            to="/preferences"
            aria-label="Travel Preferences"
            className="p-2 text-[#0B0B12]/70 hover:text-[#5F2CFF] hover:bg-[#DFF6FF]/40 rounded-lg transition-colors"
            title="Travel Preferences"
          >
            <Sliders className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#5F2CFF] to-[#8B6CFF] text-white flex items-center justify-center text-xs font-semibold shadow-xs">
              <User className="w-4 h-4" />
            </div>
            <span className="hidden lg:inline-block text-xs font-medium text-slate-700">
              Chennai Express
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

