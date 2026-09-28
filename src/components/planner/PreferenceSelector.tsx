import React from 'react';
import { JourneyPreference } from '../../types/journey';
import { Zap, DollarSign, Sparkles, Leaf, Footprints, RefreshCcw } from 'lucide-react';

interface PreferenceSelectorProps {
  value: JourneyPreference;
  onChange: (pref: JourneyPreference) => void;
  size?: 'sm' | 'md';
}

interface PreferenceOption {
  id: JourneyPreference;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

export const PREFERENCE_OPTIONS: PreferenceOption[] = [
  {
    id: 'balanced',
    label: 'Smart Balance',
    shortLabel: 'Smart Balance',
    icon: Sparkles,
    description: 'Harmonious optimization of time, cost & comfort'
  },
  {
    id: 'save_time',
    label: 'Save Time',
    shortLabel: 'Fastest',
    icon: Zap,
    description: 'Prioritizes shortest overall duration'
  },
  {
    id: 'save_money',
    label: 'Save Money',
    shortLabel: 'Cheapest',
    icon: DollarSign,
    description: 'Prioritizes minimum total transit fare'
  },
  {
    id: 'eco_friendly',
    label: 'Eco Friendly',
    shortLabel: 'Greenest',
    icon: Leaf,
    description: 'Prioritizes minimal carbon emissions'
  },
  {
    id: 'less_walking',
    label: 'Less Walking',
    shortLabel: 'Low Walk',
    icon: Footprints,
    description: 'Minimizes pedestrian distance and steps'
  },
  {
    id: 'fewer_transfers',
    label: 'Fewer Transfers',
    shortLabel: 'Direct',
    icon: RefreshCcw,
    description: 'Minimizes vehicle switches & platform waits'
  }
];

export const PreferenceSelector: React.FC<PreferenceSelectorProps> = ({
  value,
  onChange,
  size = 'md'
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {PREFERENCE_OPTIONS.map((opt) => {
        const isSelected = value === opt.id;
        const Icon = opt.icon;

        return (
          <button
            type="button"
            key={opt.id}
            onClick={() => onChange(opt.id)}
            title={opt.description}
            className={`inline-flex items-center gap-1.5 rounded-full font-medium transition-all duration-200 cursor-pointer whitespace-nowrap ${
              size === 'sm' ? 'px-3 py-1 text-xs' : 'px-3.5 py-1.5 text-xs'
            } ${
              isSelected
                ? 'bg-[#5F2CFF] text-white shadow-sm shadow-[#5F2CFF]/30 scale-[1.02]'
                : 'bg-white hover:bg-[#DFF6FF]/60 text-slate-700 border border-slate-200/80 hover:border-[#5F2CFF]/30'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-[#5F2CFF]'}`} />
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
};
