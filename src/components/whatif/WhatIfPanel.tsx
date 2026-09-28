import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Route, JourneyPreference } from '../../types/journey';
import { JourneyService } from '../../services/journeyService';
import { WhatIfSimulationResult } from '../../utils/recommendationEngine';
import { PreferenceSelector } from '../planner/PreferenceSelector';
import { TransportBadge } from '../common/TransportBadge';
import { Sparkles, ArrowRight, CheckCircle2, RotateCcw, AlertCircle, ArrowRightLeft } from 'lucide-react';

interface WhatIfPanelProps {
  initialRoutes: Route[];
  initialRouteId?: string;
}

export const WhatIfPanel: React.FC<WhatIfPanelProps> = ({
  initialRoutes,
  initialRouteId
}) => {
  const navigate = useNavigate();

  // Control state
  const [priority, setPriority] = useState<JourneyPreference>('balanced');
  const [budget, setBudget] = useState<number>(100);
  const [maxTransfers, setMaxTransfers] = useState<number>(1);
  const [maxWalkingKm, setMaxWalkingKm] = useState<number>(2.0);
  const [departureTime, setDepartureTime] = useState<string>('09:10');

  // Simulation result
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [result, setResult] = useState<WhatIfSimulationResult | null>(() => {
    // Initial calculation simulation: Cab as previous, budget 100 makes Metro + Walk winner
    const previous =
      initialRoutes.find((r) => r.tag === 'fastest') ||
      initialRoutes[1] ||
      initialRoutes[0];
    const candidate =
      initialRoutes.find((r) => r.tag === 'recommended') ||
      initialRoutes[0];

    return {
      previousRoute: previous,
      newRoute: candidate,
      hasChanged: true,
      explanation: `With your ₹100 budget, the ${previous.name} (₹${previous.cost}) is excluded. ${candidate.name} provides the highest score (${candidate.score}/100) among the remaining options.`,
      appliedConstraints: { maxBudget: 100, maxTransfers: 1, maxWalkingKm: 2.0 },
      appliedPreference: 'balanced'
    };
  });

  const handleRecalculate = async () => {
    setIsCalculating(true);
    try {
      const sim = await JourneyService.executeWhatIf(
        initialRoutes,
        result ? result.newRoute.id : initialRoutes[0].id,
        priority,
        {
          maxBudget: budget,
          maxTransfers,
          maxWalkingKm
        }
      );
      setResult(sim);
    } catch (err) {
      console.error('What-If simulation error:', err);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleReset = () => {
    setPriority('balanced');
    setBudget(400);
    setMaxTransfers(2);
    setMaxWalkingKm(2.5);
  };

  return (
    <div className="space-y-8">
      {/* Simulation Controls Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-extrabold text-[#0B0B12] font-display">
              Journey Simulator Controls
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Simulate constraints and discover how recommendations adapt in real time
            </p>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#5F2CFF] transition-colors self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset constraints</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
          {/* Priority */}
          <div className="lg:col-span-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
              Travel Priority
            </label>
            <PreferenceSelector value={priority} onChange={setPriority} size="md" />
          </div>

          {/* Budget Constraint Slider */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Maximum Budget
              </label>
              <span className="text-sm font-extrabold font-display text-[#5F2CFF] tabular-nums">
                ₹{budget}
              </span>
            </div>
            <input
              type="range"
              min={30}
              max={500}
              step={10}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full accent-[#5F2CFF]"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>₹30 (Bus)</span>
              <span>₹200 (Transit)</span>
              <span>₹500 (Cab)</span>
            </div>
          </div>

          {/* Max Transfers */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Maximum Transfers
              </label>
              <span className="text-sm font-extrabold font-display text-[#5F2CFF] tabular-nums">
                {maxTransfers === 0 ? 'Direct (0)' : `${maxTransfers} max`}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1.5 mt-2">
              {[0, 1, 2, 3].map((val) => (
                <button
                  type="button"
                  key={val}
                  onClick={() => setMaxTransfers(val)}
                  className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    maxTransfers === val
                      ? 'bg-[#5F2CFF] text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {val === 0 ? 'Direct' : val}
                </button>
              ))}
            </div>
          </div>

          {/* Max Walking Distance */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Max Walking
              </label>
              <span className="text-sm font-extrabold font-display text-[#5F2CFF] tabular-nums">
                {maxWalkingKm} km
              </span>
            </div>
            <input
              type="range"
              min={0.2}
              max={3.5}
              step={0.1}
              value={maxWalkingKm}
              onChange={(e) => setMaxWalkingKm(Number(e.target.value))}
              className="w-full accent-[#5F2CFF]"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>0.2 km</span>
              <span>1.5 km</span>
              <span>3.5 km</span>
            </div>
          </div>
        </div>

        {/* Recalculate CTA */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={handleRecalculate}
            disabled={isCalculating}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#5F2CFF] hover:bg-[#5F2CFF]/90 text-white font-bold text-sm shadow-md shadow-[#5F2CFF]/25 hover:shadow-lg transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>{isCalculating ? 'Recalculating Journey...' : 'Recalculate Journey'}</span>
          </button>
        </div>
      </div>

      {/* What-If Simulation Result Card */}
      {result && (
        <div className="bg-[#DFF6FF]/40 rounded-3xl p-6 sm:p-8 border-2 border-[#5F2CFF]/30 shadow-xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#5F2CFF] text-white">
              <Sparkles className="w-3.5 h-3.5" />
              {result.hasChanged ? 'Recommendation Changed' : 'Optimal Choice Confirmed'}
            </span>
          </div>

          <h4 className="text-xl sm:text-2xl font-extrabold text-[#0B0B12] font-display mt-2 mb-3">
            {result.hasChanged
              ? 'Your Recommendation Shifted'
              : 'Recommendation Remains Rock Solid'}
          </h4>

          {/* Explanation narrative */}
          <div className="bg-white/90 rounded-2xl p-4 border border-[#5F2CFF]/20 text-slate-800 text-sm leading-relaxed mb-6">
            <p className="font-medium">{result.explanation}</p>
          </div>

          {/* Before & After Visual Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Previous Route */}
            <div className="p-5 rounded-2xl bg-white/70 border border-slate-200/80">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Previous Selection
              </div>
              <div className="text-lg font-bold text-[#0B0B12] font-display mb-1">
                {result.previousRoute.name}
              </div>
              <div className="text-xs text-slate-500 mb-4 line-clamp-1">
                {result.previousRoute.summary}
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs py-2 border-t border-slate-100">
                <div>
                  <span className="text-slate-400 text-[10px] block">Time</span>
                  <strong className="text-slate-700">{result.previousRoute.duration} min</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Cost</span>
                  <strong className="text-slate-700">₹{result.previousRoute.cost}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Transfers</span>
                  <strong className="text-slate-700">{result.previousRoute.transfers}</strong>
                </div>
              </div>
            </div>

            {/* New Route */}
            <div className="p-5 rounded-2xl bg-white border-2 border-[#5F2CFF]/40 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#5F2CFF] text-white text-[10px] font-bold px-3 py-0.5 rounded-bl-xl">
                Active Match
              </div>

              <div className="text-[11px] font-bold uppercase tracking-wider text-[#5F2CFF] mb-2">
                New Recommended Journey
              </div>
              <div className="text-lg font-bold text-[#0B0B12] font-display mb-1">
                {result.newRoute.name}
              </div>
              <div className="text-xs text-slate-500 mb-4 line-clamp-1">
                {result.newRoute.summary}
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs py-2 border-t border-slate-100">
                <div>
                  <span className="text-slate-400 text-[10px] block">Time</span>
                  <strong className="text-[#5F2CFF]">{result.newRoute.duration} min</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Cost</span>
                  <strong className="text-emerald-600">₹{result.newRoute.cost}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Score</span>
                  <strong className="text-[#5F2CFF]">{result.newRoute.score}/100</strong>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => navigate(`/route/${result.newRoute.id}`)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#5F2CFF] text-white text-xs font-semibold hover:bg-[#5F2CFF]/90 transition-colors"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
