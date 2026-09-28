import React from 'react';
import { NavLink } from 'react-router-dom';
import { Compass, GitCompare, Sparkles, Bookmark, History, Sliders } from 'lucide-react';

export const MobileNavigation: React.FC = () => {
  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 flex items-center justify-around shadow-lg"
    >
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-[11px] font-medium transition-colors ${
            isActive ? 'text-[#5F2CFF]' : 'text-slate-500 hover:text-slate-900'
          }`
        }
      >
        <Compass className="w-5 h-5" />
        <span>Plan</span>
      </NavLink>

      <NavLink
        to="/compare"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-[11px] font-medium transition-colors ${
            isActive ? 'text-[#5F2CFF]' : 'text-slate-500 hover:text-slate-900'
          }`
        }
      >
        <GitCompare className="w-5 h-5" />
        <span>Compare</span>
      </NavLink>

      <NavLink
        to="/what-if"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-[11px] font-medium transition-colors ${
            isActive ? 'text-[#5F2CFF]' : 'text-slate-500 hover:text-slate-900'
          }`
        }
      >
        <Sparkles className="w-5 h-5 text-[#5F2CFF]" />
        <span>What-If</span>
      </NavLink>

      <NavLink
        to="/saved"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-[11px] font-medium transition-colors ${
            isActive ? 'text-[#5F2CFF]' : 'text-slate-500 hover:text-slate-900'
          }`
        }
      >
        <Bookmark className="w-5 h-5" />
        <span>Saved</span>
      </NavLink>

      <NavLink
        to="/history"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-[11px] font-medium transition-colors ${
            isActive ? 'text-[#5F2CFF]' : 'text-slate-500 hover:text-slate-900'
          }`
        }
      >
        <History className="w-5 h-5" />
        <span>History</span>
      </NavLink>

      <NavLink
        to="/preferences"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-[11px] font-medium transition-colors ${
            isActive ? 'text-[#5F2CFF]' : 'text-slate-500 hover:text-slate-900'
          }`
        }
      >
        <Sliders className="w-5 h-5" />
        <span>Prefs</span>
      </NavLink>
    </nav>
  );
};
