import React from 'react';
import { useNavigate } from 'react-router-dom';
import { JourneyHistory } from '../../types/journey';
import { TransportBadge, TransportSequence } from '../common/TransportBadge';
import { useJourney } from '../../context/JourneyContext';
import { Clock, Calendar, Banknote, ArrowRight, MapPin, CheckCircle2 } from 'lucide-react';

interface HistoryItemProps {
  item: JourneyHistory;
}

export const HistoryItem: React.FC<HistoryItemProps> = ({ item }) => {
  const navigate = useNavigate();
  const { performSearch } = useJourney();

  const formattedDate = new Date(item.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const formattedTime = new Date(item.date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const handleReplan = async () => {
    await performSearch({
      origin: item.origin,
      destination: item.destination,
      departureTime: 'Now',
      preference: item.preference
    });
    navigate('/results');
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 hover:border-slate-300 shadow-xs hover:shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      {/* Left side: route details */}
      <div className="flex items-start gap-3 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-[#DFF6FF]/60 flex items-center justify-center text-[#5F2CFF] shrink-0 mt-0.5">
          <Clock className="w-5 h-5" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formattedDate} · {formattedTime}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#5F2CFF] bg-[#5F2CFF]/10 px-2 py-0.5 rounded-full">
              {item.preference.replace('_', ' ')}
            </span>
          </div>

          <h4 className="text-sm sm:text-base font-bold text-[#0B0B12] font-display flex items-center gap-1.5 truncate">
            <span>{item.origin.name}</span>
            <span className="text-slate-400">→</span>
            <span>{item.destination.name}</span>
          </h4>

          <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap">
            <span className="font-semibold text-slate-700">{item.routeName}</span>
            <span>·</span>
            <span className="tabular-nums">{item.duration} min</span>
            <span>·</span>
            <span className="tabular-nums font-semibold text-emerald-600">₹{item.cost}</span>
            <span>·</span>
            <span className="tabular-nums">{item.distance} km</span>
          </div>
        </div>
      </div>

      {/* Right side: sequence & replay */}
      <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 shrink-0">
        <TransportSequence modes={item.transportModes} className="hidden md:flex" />

        <button
          type="button"
          onClick={handleReplan}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-[#DFF6FF] text-slate-700 hover:text-[#5F2CFF] font-semibold text-xs transition-colors cursor-pointer"
        >
          <span>Plan Again</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
