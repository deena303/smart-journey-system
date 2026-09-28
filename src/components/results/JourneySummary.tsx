import React from 'react';
import { Route } from '../../types/journey';
import { Zap, DollarSign, Sparkles, Leaf } from 'lucide-react';

interface JourneySummaryProps {
  routes: Route[];
  onSelectRoute?: (routeId: string) => void;
}

export const JourneySummary: React.FC<JourneySummaryProps> = ({ routes, onSelectRoute }) => {
  if (!routes || routes.length === 0) return null;

  const fastest = [...routes].sort((a, b) => a.duration - b.duration)[0];
  const cheapest = [...routes].sort((a, b) => a.cost - b.cost)[0];
  const recommended = routes[0];
  const eco = [...routes].sort((a, b) => a.emissions - b.emissions)[0];

  const summaryItems = [
    {
      title: 'Fastest',
      value: `${fastest.duration} min`,
      subtext: fastest.name,
      icon: Zap,
      iconBg: 'bg-amber-100 text-amber-700',
      routeId: fastest.id
    },
    {
      title: 'Cheapest',
      value: `₹${cheapest.cost}`,
      subtext: cheapest.name,
      icon: DollarSign,
      iconBg: 'bg-emerald-100 text-emerald-700',
      routeId: cheapest.id
    },
    {
      title: 'Best Balance',
      value: `${recommended.duration} min`,
      subtext: `Score ${recommended.score}/100`,
      icon: Sparkles,
      iconBg: 'bg-[#5F2CFF]/15 text-[#5F2CFF]',
      routeId: recommended.id,
      isHighlighted: true
    },
    {
      title: 'Lowest Emissions',
      value: `${Math.round(eco.emissions / 10) / 100} kg CO₂`,
      subtext: eco.name.includes('Metro') ? 'Metro' : eco.name,
      icon: Leaf,
      iconBg: 'bg-teal-100 text-teal-700',
      routeId: eco.id
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 my-6">
      {summaryItems.map((item, idx) => {
        const Icon = item.icon;
        return (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectRoute && onSelectRoute(item.routeId)}
            className={`p-3.5 rounded-2xl border text-left transition-all hover:scale-[1.02] cursor-pointer ${
              item.isHighlighted
                ? 'bg-[#DFF6FF]/70 border-[#5F2CFF]/30 shadow-xs'
                : 'bg-white border-slate-200/80 hover:border-slate-300 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                {item.title}
              </span>
              <div className={`w-6 h-6 rounded-lg ${item.iconBg} flex items-center justify-center`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="text-xl font-bold font-display tabular-nums text-[#0B0B12]">
              {item.value}
            </div>

            <div className="text-xs text-slate-500 truncate mt-0.5">{item.subtext}</div>
          </button>
        );
      })}
    </div>
  );
};
