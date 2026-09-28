import React from 'react';
import { JourneyPreference, TransportMode } from '../../types/journey';
import { Zap, DollarSign, Sparkles, Leaf, Footprints, RefreshCcw, Armchair } from 'lucide-react';

interface PriorityCardProps {
  id: JourneyPreference;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  isSelected: boolean;
  onSelect: () => void;
}

export const PriorityCard: React.FC<PriorityCardProps> = ({
  title,
  subtitle,
  icon: Icon,
  isSelected,
  onSelect
}) => {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`p-5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
        isSelected
          ? 'bg-[#DFF6FF]/60 border-[#5F2CFF] shadow-sm shadow-[#5F2CFF]/15 ring-2 ring-[#5F2CFF]/20 scale-[1.01]'
          : 'bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center ${
            isSelected ? 'bg-[#5F2CFF] text-white' : 'bg-slate-100 text-slate-700'
          }`}
        >
          <Icon className="w-4 h-4" />
        </div>

        {isSelected && (
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#5F2CFF] bg-white px-2 py-0.5 rounded-full border border-[#5F2CFF]/20">
            Selected
          </span>
        )}
      </div>

      <div>
        <h4 className="text-sm font-bold text-[#0B0B12] font-display mb-1">{title}</h4>
        <p className="text-xs text-slate-500 leading-relaxed">{subtitle}</p>
      </div>
    </button>
  );
};
