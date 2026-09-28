import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Route } from '../../types/journey';
import { TransportSequence } from '../common/TransportBadge';
import { RouteScore } from './RouteScore';
import { ArrowRight, Clock, Banknote, Navigation, Footprints, Zap, DollarSign, Leaf } from 'lucide-react';

interface RouteCardProps {
  route: Route;
  onSelect?: () => void;
}

export const RouteCard: React.FC<RouteCardProps> = ({ route, onSelect }) => {
  const navigate = useNavigate();

  const getTagBadge = () => {
    if (route.tag === 'fastest') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800">
          <Zap className="w-3 h-3 text-amber-600" />
          Fastest
        </span>
      );
    }
    if (route.tag === 'cheapest') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
          <DollarSign className="w-3 h-3 text-emerald-600" />
          Cheapest
        </span>
      );
    }
    if (route.tag === 'eco') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-teal-100 text-teal-800">
          <Leaf className="w-3 h-3 text-teal-600" />
          Eco Friendly
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold text-slate-500 bg-slate-100">
        Alternative
      </span>
    );
  };

  const handleView = () => {
    if (onSelect) onSelect();
    navigate(`/route/${route.id}`);
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-slate-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        {/* Top header row with tag and score */}
        <div className="flex items-center justify-between gap-2 mb-3">
          {getTagBadge()}
          <RouteScore score={route.score} compact />
        </div>

        {/* Title and summary */}
        <h4 className="text-lg font-bold text-[#0B0B12] font-display mb-1">
          {route.name}
        </h4>
        <p className="text-xs text-slate-500 mb-3 line-clamp-1">{route.summary}</p>

        {/* Transport Modes */}
        <div className="mb-4">
          <TransportSequence modes={route.transportModes} />
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-2.5 py-3 border-t border-slate-100 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>
              <strong className="text-[#0B0B12]">{route.duration} min</strong> · {route.distance} km
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Banknote className="w-3.5 h-3.5 text-slate-400" />
            <span>
              <strong className="text-[#0B0B12]">₹{route.cost}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Navigation className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {route.transfers === 0 ? '0 transfers' : `${route.transfers} transfer`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Footprints className="w-3.5 h-3.5 text-slate-400" />
            <span>{route.walkingDuration} min walking</span>
          </div>
        </div>
      </div>

      {/* Action button */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] font-medium text-slate-400">
          Emissions: {Math.round(route.emissions / 10) / 100} kg CO₂
        </span>

        <button
          type="button"
          onClick={handleView}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-[#DFF6FF] text-slate-800 hover:text-[#5F2CFF] font-semibold text-xs transition-colors cursor-pointer"
        >
          <span>View Journey</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
