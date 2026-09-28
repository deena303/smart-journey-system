import React from 'react';
import { JourneyScoreBreakdown } from '../../types/journey';

interface RouteScoreProps {
  score: number;
  breakdown?: JourneyScoreBreakdown;
  compact?: boolean;
}

export const RouteScore: React.FC<RouteScoreProps> = ({
  score,
  breakdown,
  compact = false
}) => {
  const getScoreColor = (val: number) => {
    if (val >= 90) return 'text-[#5F2CFF]';
    if (val >= 80) return 'text-emerald-600';
    if (val >= 70) return 'text-blue-600';
    return 'text-amber-600';
  };

  const getBarColor = (val: number) => {
    if (val >= 90) return 'bg-[#5F2CFF]';
    if (val >= 80) return 'bg-emerald-500';
    if (val >= 70) return 'bg-blue-500';
    return 'bg-amber-500';
  };

  if (compact) {
    return (
      <div className="flex items-center gap-1.5">
        <span className={`text-base font-extrabold tabular-nums font-display ${getScoreColor(score)}`}>
          {score}
        </span>
        <span className="text-xs text-slate-400 font-medium">/100</span>
      </div>
    );
  }

  return (
    <div className="bg-slate-50/70 rounded-2xl p-4 border border-slate-200/60">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Journey Score
          </span>
          <div className="text-xs font-semibold text-slate-700">
            {breakdown?.label || 'Match evaluation'}
          </div>
        </div>

        <div className="flex items-baseline">
          <span className={`text-2xl font-black font-display tabular-nums ${getScoreColor(score)}`}>
            {score}
          </span>
          <span className="text-xs font-semibold text-slate-400 ml-0.5">/100</span>
        </div>
      </div>

      {breakdown && (
        <div className="mt-3 space-y-2 text-xs">
          <div>
            <div className="flex justify-between text-slate-600 mb-1">
              <span>Travel Time</span>
              <span className="font-semibold tabular-nums">{breakdown.timeScore}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getBarColor(
                  breakdown.timeScore
                )}`}
                style={{ width: `${breakdown.timeScore}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-600 mb-1">
              <span>Cost</span>
              <span className="font-semibold tabular-nums">{breakdown.costScore}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getBarColor(
                  breakdown.costScore
                )}`}
                style={{ width: `${breakdown.costScore}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-600 mb-1">
              <span>Transfers</span>
              <span className="font-semibold tabular-nums">{breakdown.transferScore}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getBarColor(
                  breakdown.transferScore
                )}`}
                style={{ width: `${breakdown.transferScore}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-600 mb-1">
              <span>Walking</span>
              <span className="font-semibold tabular-nums">{breakdown.walkingScore}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getBarColor(
                  breakdown.walkingScore
                )}`}
                style={{ width: `${breakdown.walkingScore}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-600 mb-1">
              <span>Eco & Emissions</span>
              <span className="font-semibold tabular-nums">{breakdown.ecoScore}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getBarColor(
                  breakdown.ecoScore
                )}`}
                style={{ width: `${breakdown.ecoScore}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
