import React from 'react';
import { Route, JourneyPreference } from '../../types/journey';
import { TransportBadge, TransportSequence } from '../common/TransportBadge';
import { RouteScore } from '../results/RouteScore';
import { PreferenceSelector } from '../planner/PreferenceSelector';
import { Sparkles, ArrowRight, Zap, DollarSign, Leaf, Check, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RouteComparisonProps {
  routes: Route[];
  activePreference: JourneyPreference;
  onPreferenceChange: (pref: JourneyPreference) => void;
}

export const RouteComparison: React.FC<RouteComparisonProps> = ({
  routes,
  activePreference,
  onPreferenceChange
}) => {
  const navigate = useNavigate();

  if (!routes || routes.length === 0) return null;

  // Find minimums/best values for each row
  const minDuration = Math.min(...routes.map((r) => r.duration));
  const minCost = Math.min(...routes.map((r) => r.cost));
  const minDistance = Math.min(...routes.map((r) => r.distance));
  const minTransfers = Math.min(...routes.map((r) => r.transfers));
  const minWalking = Math.min(...routes.map((r) => r.walkingDuration));
  const minEmissions = Math.min(...routes.map((r) => r.emissions));
  const maxScore = Math.max(...routes.map((r) => r.score));

  return (
    <div className="space-y-6">
      {/* Top Preference Selector */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Compare Against Priority
          </h4>
          <p className="text-xs text-slate-600 mt-0.5">
            Routes are evaluated dynamically based on your chosen traveling style:
          </p>
        </div>
        <PreferenceSelector value={activePreference} onChange={onPreferenceChange} size="sm" />
      </div>

      {/* Comparison Table / Matrix */}
      <div className="overflow-x-auto rounded-3xl border border-slate-200/90 bg-white shadow-md">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70">
              <th className="py-4 px-5 text-xs font-bold uppercase tracking-wider text-slate-500 w-44">
                Criteria
              </th>
              {routes.map((route, idx) => {
                const isRecommended = idx === 0;
                return (
                  <th
                    key={route.id}
                    className={`py-4 px-5 align-top ${
                      isRecommended ? 'bg-[#DFF6FF]/40 border-x border-[#5F2CFF]/20' : ''
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      {isRecommended ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#5F2CFF] text-white">
                          <Sparkles className="w-2.5 h-2.5" />
                          Recommended
                        </span>
                      ) : route.tag === 'fastest' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                          <Zap className="w-2.5 h-2.5" />
                          Fastest
                        </span>
                      ) : route.tag === 'cheapest' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          <DollarSign className="w-2.5 h-2.5" />
                          Cheapest
                        </span>
                      ) : route.tag === 'eco' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                          <Leaf className="w-2.5 h-2.5" />
                          Eco
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-slate-400">
                          Option {idx + 1}
                        </span>
                      )}
                    </div>

                    <div className="text-sm font-bold text-[#0B0B12] font-display">
                      {route.name}
                    </div>

                    <div className="mt-2">
                      <TransportSequence modes={route.transportModes} />
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-xs">
            {/* Row 1: Journey Score */}
            <tr className="hover:bg-slate-50/50">
              <td className="py-3.5 px-5 font-semibold text-[#0B0B12]">Journey Score</td>
              {routes.map((route, idx) => (
                <td
                  key={route.id}
                  className={`py-3.5 px-5 tabular-nums ${
                    idx === 0 ? 'bg-[#DFF6FF]/20 border-x border-[#5F2CFF]/15' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base font-extrabold font-display text-[#5F2CFF]">
                      {route.score}
                    </span>
                    <span className="text-slate-400 font-normal">/100</span>
                    {route.score === maxScore && (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                        Top
                      </span>
                    )}
                  </div>
                </td>
              ))}
            </tr>

            {/* Row 2: Travel Time */}
            <tr className="hover:bg-slate-50/50">
              <td className="py-3.5 px-5 font-semibold text-[#0B0B12]">Travel Time</td>
              {routes.map((route, idx) => (
                <td
                  key={route.id}
                  className={`py-3.5 px-5 tabular-nums ${
                    idx === 0 ? 'bg-[#DFF6FF]/20 border-x border-[#5F2CFF]/15' : ''
                  }`}
                >
                  <span
                    className={`font-bold ${
                      route.duration === minDuration ? 'text-amber-600' : 'text-slate-800'
                    }`}
                  >
                    {route.duration} min
                  </span>
                  {route.duration === minDuration && (
                    <span className="ml-1.5 text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-md">
                      Fastest
                    </span>
                  )}
                </td>
              ))}
            </tr>

            {/* Row 3: Cost */}
            <tr className="hover:bg-slate-50/50">
              <td className="py-3.5 px-5 font-semibold text-[#0B0B12]">Estimated Fare</td>
              {routes.map((route, idx) => (
                <td
                  key={route.id}
                  className={`py-3.5 px-5 tabular-nums ${
                    idx === 0 ? 'bg-[#DFF6FF]/20 border-x border-[#5F2CFF]/15' : ''
                  }`}
                >
                  <span
                    className={`font-bold ${
                      route.cost === minCost ? 'text-emerald-600' : 'text-slate-800'
                    }`}
                  >
                    ₹{route.cost}
                  </span>
                  {route.cost === minCost && (
                    <span className="ml-1.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                      Cheapest
                    </span>
                  )}
                </td>
              ))}
            </tr>

            {/* Row 4: Distance */}
            <tr className="hover:bg-slate-50/50">
              <td className="py-3.5 px-5 font-semibold text-[#0B0B12]">Total Distance</td>
              {routes.map((route, idx) => (
                <td
                  key={route.id}
                  className={`py-3.5 px-5 tabular-nums ${
                    idx === 0 ? 'bg-[#DFF6FF]/20 border-x border-[#5F2CFF]/15' : ''
                  }`}
                >
                  {route.distance} km
                </td>
              ))}
            </tr>

            {/* Row 5: Transfers */}
            <tr className="hover:bg-slate-50/50">
              <td className="py-3.5 px-5 font-semibold text-[#0B0B12]">Vehicle Transfers</td>
              {routes.map((route, idx) => (
                <td
                  key={route.id}
                  className={`py-3.5 px-5 tabular-nums ${
                    idx === 0 ? 'bg-[#DFF6FF]/20 border-x border-[#5F2CFF]/15' : ''
                  }`}
                >
                  <span className="font-semibold text-slate-800">
                    {route.transfers === 0 ? 'Direct (0)' : `${route.transfers} transfer`}
                  </span>
                </td>
              ))}
            </tr>

            {/* Row 6: Walking Distance & Time */}
            <tr className="hover:bg-slate-50/50">
              <td className="py-3.5 px-5 font-semibold text-[#0B0B12]">Walking Distance</td>
              {routes.map((route, idx) => (
                <td
                  key={route.id}
                  className={`py-3.5 px-5 tabular-nums ${
                    idx === 0 ? 'bg-[#DFF6FF]/20 border-x border-[#5F2CFF]/15' : ''
                  }`}
                >
                  {route.walkingDuration} min ({route.walkingDistance} km)
                </td>
              ))}
            </tr>

            {/* Row 7: Carbon Emissions */}
            <tr className="hover:bg-slate-50/50">
              <td className="py-3.5 px-5 font-semibold text-[#0B0B12]">Carbon Footprint</td>
              {routes.map((route, idx) => (
                <td
                  key={route.id}
                  className={`py-3.5 px-5 tabular-nums ${
                    idx === 0 ? 'bg-[#DFF6FF]/20 border-x border-[#5F2CFF]/15' : ''
                  }`}
                >
                  <span
                    className={
                      route.emissions === minEmissions ? 'font-bold text-teal-700' : 'text-slate-700'
                    }
                  >
                    {Math.round(route.emissions / 10) / 100} kg CO₂
                  </span>
                  {route.emissions === minEmissions && (
                    <span className="ml-1.5 text-[10px] font-semibold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded-md">
                      Cleanest
                    </span>
                  )}
                </td>
              ))}
            </tr>

            {/* Row 8: Action */}
            <tr>
              <td className="py-4 px-5 font-semibold text-slate-400">View Journey</td>
              {routes.map((route, idx) => (
                <td
                  key={route.id}
                  className={`py-4 px-5 ${
                    idx === 0 ? 'bg-[#DFF6FF]/20 border-x border-[#5F2CFF]/15' : ''
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => navigate(`/route/${route.id}`)}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      idx === 0
                        ? 'bg-[#5F2CFF] hover:bg-[#5F2CFF]/90 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-[#DFF6FF] text-slate-700 hover:text-[#5F2CFF]'
                    }`}
                  >
                    <span>Inspect</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Philosophy Callout Card */}
      <div className="bg-[#DFF6FF]/30 border border-[#5F2CFF]/20 rounded-2xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-[#5F2CFF] shrink-0 mt-0.5" />
        <p className="text-xs text-slate-700 leading-relaxed">
          <strong>Intelligent routing note:</strong> JourneyIQ does not declare one single route
          universally "best". A cab might save 11 minutes but cost 7x more. Our scoring algorithm
          balances every factor dynamically according to your chosen priority.
        </p>
      </div>
    </div>
  );
};
