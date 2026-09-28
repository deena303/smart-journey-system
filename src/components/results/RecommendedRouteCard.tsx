import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Route, JourneyPreference } from '../../types/journey';
import { TransportBadge, TransportSequence } from '../common/TransportBadge';
import { RouteScore } from './RouteScore';
import { generateRecommendationReason } from '../../utils/recommendationEngine';
import {
  Sparkles,
  ArrowRight,
  Clock,
  Navigation,
  Banknote,
  Footprints,
  RefreshCcw,
  ChevronDown,
  ChevronUp,
  Bookmark,
  Share2
} from 'lucide-react';
import { useJourney } from '../../context/JourneyContext';

interface RecommendedRouteCardProps {
  route: Route;
  allRoutes: Route[];
  preference: JourneyPreference;
  onOpenWhyModal?: () => void;
}

export const RecommendedRouteCard: React.FC<RecommendedRouteCardProps> = ({
  route,
  allRoutes,
  preference,
  onOpenWhyModal
}) => {
  const navigate = useNavigate();
  const { saveCurrentJourney, showToast } = useJourney();
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const reason = generateRecommendationReason(route, allRoutes, preference);

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await saveCurrentJourney();
    setIsSaved(true);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText?.(window.location.href);
    showToast('Link Copied', 'Journey details link copied to clipboard');
  };

  return (
    <div className="relative rounded-3xl bg-[#DFF6FF]/40 border-2 border-[#5F2CFF]/40 shadow-xl shadow-[#5F2CFF]/10 overflow-hidden backdrop-blur-md transition-all">
      {/* Top Banner Tag */}
      <div className="bg-[#5F2CFF] text-white px-5 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span className="text-xs font-black tracking-wider uppercase">
            AI Recommended Route
          </span>
        </div>
        <span className="text-xs font-medium text-white/90">
          Tailored to your priority
        </span>
      </div>

      <div className="p-6">
        {/* Main header row */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-2xl font-extrabold text-[#0B0B12] font-display">
                {route.name}
              </h3>
            </div>
            <p className="text-xs text-slate-600 mb-3">{route.summary}</p>
            <TransportSequence modes={route.transportModes} />
          </div>

          {/* Quick Metrics Badge Group */}
          <div className="flex items-center gap-3 shrink-0 self-start md:self-auto bg-white/80 p-3 rounded-2xl border border-white/60 shadow-xs">
            <RouteScore score={route.score} breakdown={route.scoreBreakdown} compact />
          </div>
        </div>

        {/* Primary Metric Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5 py-4 border-y border-[#5F2CFF]/15">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#5F2CFF]/10 text-[#5F2CFF] flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-lg font-bold font-display tabular-nums text-[#0B0B12]">
                {route.duration} <span className="text-xs font-normal text-slate-500">min</span>
              </div>
              <div className="text-[11px] text-slate-500">Travel time</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <Banknote className="w-4 h-4" />
            </div>
            <div>
              <div className="text-lg font-bold font-display tabular-nums text-[#0B0B12]">
                ₹{route.cost}
              </div>
              <div className="text-[11px] text-slate-500">Total fare</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
              <Navigation className="w-4 h-4" />
            </div>
            <div>
              <div className="text-lg font-bold font-display tabular-nums text-[#0B0B12]">
                {route.distance} <span className="text-xs font-normal text-slate-500">km</span>
              </div>
              <div className="text-[11px] text-slate-500">Distance</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
              <Footprints className="w-4 h-4" />
            </div>
            <div>
              <div className="text-lg font-bold font-display tabular-nums text-[#0B0B12]">
                {route.walkingDuration} <span className="text-xs font-normal text-slate-500">min</span>
              </div>
              <div className="text-[11px] text-slate-500">
                {route.transfers} {route.transfers === 1 ? 'transfer' : 'transfers'}
              </div>
            </div>
          </div>
        </div>

        {/* "Why JourneyIQ recommends this" section */}
        <div className="bg-white/80 rounded-2xl p-4 border border-[#5F2CFF]/15">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#5F2CFF]" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0B0B12]">
                Why JourneyIQ Recommends This
              </h4>
            </div>

            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs text-[#5F2CFF] hover:underline flex items-center gap-1 font-semibold"
            >
              {isExpanded ? (
                <>
                  <span>Less</span>
                  <ChevronUp className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  <span>Details</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>

          <p className="text-xs font-medium text-slate-700 leading-relaxed mb-3">
            "{reason.headline}"
          </p>

          {isExpanded && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-2 border-t border-slate-100">
              {reason.comparisons.map((comp, idx) => (
                <div
                  key={idx}
                  className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-2xs"
                >
                  <div className="text-[10px] uppercase font-semibold text-slate-400">
                    {comp.label}
                  </div>
                  <div className="text-xs font-bold text-[#0B0B12] mt-0.5">{comp.value}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Row */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSave}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                isSaved
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-emerald-600' : ''}`} />
              <span>{isSaved ? 'Saved' : 'Save Route'}</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white text-slate-700 border border-slate-200 hover:border-slate-300 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => navigate(`/route/${route.id}`)}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#5F2CFF] hover:bg-[#5F2CFF]/90 text-white font-semibold text-xs shadow-md shadow-[#5F2CFF]/30 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <span>View Journey Details</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
