import React from 'react';
import { TransportMode } from '../../types/journey';
import { Train, Bus, Car, Footprints, Bike, ArrowRight } from 'lucide-react';

interface TransportBadgeProps {
  mode: TransportMode;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const TransportBadge: React.FC<TransportBadgeProps> = ({
  mode,
  showLabel = true,
  size = 'md',
  className = ''
}) => {
  const getModeConfig = () => {
    switch (mode) {
      case 'metro':
        return {
          label: 'Metro',
          icon: Train,
          bg: 'bg-[#5F2CFF]/10 text-[#5F2CFF] border-[#5F2CFF]/20',
          dot: 'bg-[#5F2CFF]'
        };
      case 'bus':
        return {
          label: 'Bus',
          icon: Bus,
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dot: 'bg-emerald-500'
        };
      case 'cab':
        return {
          label: 'Cab',
          icon: Car,
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          dot: 'bg-amber-500'
        };
      case 'train':
        return {
          label: 'Suburban Train',
          icon: Train,
          bg: 'bg-blue-50 text-blue-700 border-blue-200',
          dot: 'bg-blue-500'
        };
      case 'bike':
        return {
          label: 'Bike',
          icon: Bike,
          bg: 'bg-purple-50 text-purple-700 border-purple-200',
          dot: 'bg-purple-500'
        };
      case 'walk':
      default:
        return {
          label: 'Walk',
          icon: Footprints,
          bg: 'bg-slate-100 text-slate-700 border-slate-200',
          dot: 'bg-slate-400'
        };
    }
  };

  const config = getModeConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2'
  }[size];

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4'
  }[size];

  return (
    <span
      className={`inline-flex items-center font-medium rounded-md border ${config.bg} ${sizeClasses} ${className}`}
    >
      <Icon className={iconSizes} />
      {showLabel && <span>{config.label}</span>}
    </span>
  );
};

export const TransportSequence: React.FC<{ modes: TransportMode[]; className?: string }> = ({
  modes,
  className = ''
}) => {
  return (
    <div className={`flex items-center gap-1.5 flex-wrap ${className}`}>
      {modes.map((mode, idx) => (
        <React.Fragment key={`${mode}-${idx}`}>
          <TransportBadge mode={mode} size="sm" />
          {idx < modes.length - 1 && (
            <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
