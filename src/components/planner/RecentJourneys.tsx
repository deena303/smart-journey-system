import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RECENT_JOURNEYS, RecentJourneyItem } from '../../data/demoJourneys';
import { TransportBadge } from '../common/TransportBadge';
import { useJourney } from '../../context/JourneyContext';
import { Clock, ArrowRight, History } from 'lucide-react';

export const RecentJourneys: React.FC = () => {
  const navigate = useNavigate();
  const { performSearch } = useJourney();

  const handleSelectRecent = async (item: RecentJourneyItem) => {
    await performSearch({
      origin: item.origin,
      destination: item.destination,
      departureTime: 'Now',
      preference: 'balanced'
    });
    navigate('/results');
  };

  return (
    <div className="w-full mt-10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-[#5F2CFF]" />
          <h3 className="text-sm font-bold tracking-tight text-[#0B0B12] uppercase tracking-wider">
            Recent Journeys
          </h3>
        </div>
        <span className="text-xs text-slate-500">Fast one-tap routing</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {RECENT_JOURNEYS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => handleSelectRecent(item)}
            className="text-left bg-white hover:bg-[#DFF6FF]/30 p-4 rounded-2xl border border-slate-200/70 hover:border-[#5F2CFF]/40 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <TransportBadge mode={item.preferredMode} size="sm" />
                <span className="text-xs font-semibold tabular-nums text-slate-700">
                  ~{item.duration} min
                </span>
              </div>

              <h4 className="text-sm font-bold text-[#0B0B12] group-hover:text-[#5F2CFF] transition-colors mb-1">
                {item.title}
              </h4>

              <p className="text-xs text-slate-500 truncate">
                {item.origin.name} → {item.destination.name}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {item.lastUsed}
              </span>
              <span className="inline-flex items-center gap-1 font-semibold text-[#5F2CFF] opacity-0 group-hover:opacity-100 transition-opacity">
                Plan <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
