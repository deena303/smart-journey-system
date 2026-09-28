import React, { useState } from 'react';
import { Route, Location } from '../../types/journey';
import { TransportBadge, TransportSequence } from '../common/TransportBadge';
import { SimplifiedRouteMap } from './SimplifiedRouteMap';
import {
  BatteryLow,
  ArrowRight,
  Clock,
  Banknote,
  Navigation,
  Footprints,
  CheckCircle2,
  Lock,
  ChevronRight,
  Compass,
  ArrowDown
} from 'lucide-react';
import { useBattery } from '../../context/BatteryContext';

interface CriticalBatteryViewProps {
  route: Route;
  origin?: Location;
  destination?: Location;
}

export const CriticalBatteryView: React.FC<CriticalBatteryViewProps> = ({
  route,
  origin,
  destination
}) => {
  const { batteryLevel } = useBattery();
  const [journeyStarted, setJourneyStarted] = useState<boolean>(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  const nextAction = route.nextAction || {
    step: `Head towards ${route.segments[0]?.to || 'Station'}`,
    duration: route.segments[0]?.duration || 5,
    distance: `${route.segments[0]?.distance || 0.4} km`,
    transportMode: route.segments[0]?.mode || 'walk',
    details: route.segments[0]?.instructions || 'Begin your trip towards the departure platform',
    thenAction: route.segments[1] ? `Take ${route.segments[1].mode} towards destination` : undefined
  };

  const handleNextStep = () => {
    if (activeStepIndex < route.segments.length - 1) {
      setActiveStepIndex((prev) => prev + 1);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5 transition-all">
      {/* 5% Battery Notification Banner (Prominent yet elegant high-contrast) */}
      <div className="bg-[#0B0B12] text-white p-5 rounded-3xl border border-rose-500/40 shadow-xl">
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <BatteryLow className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-xs font-black tracking-wider uppercase text-rose-400">
                {batteryLevel}% Battery Detected
              </span>
              <div className="text-sm font-bold text-white">
                Critical Battery Mode
              </div>
            </div>
          </div>

          <span className="text-[11px] font-semibold text-slate-400 bg-white/10 px-2.5 py-1 rounded-full">
            Low-Interaction Mode
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed mt-2">
          We've simplified your journey to minimize interaction and keep only the essential information you need before your phone sleeps.
        </p>
      </div>

      {/* Main Essential Journey Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#5F2CFF]/30 shadow-xl space-y-6">
        {/* Origin ↓ Destination Header */}
        <div className="pb-5 border-b border-slate-100">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Destination Route
          </span>
          <div className="text-2xl sm:text-3xl font-black text-[#0B0B12] font-display flex items-center gap-2 flex-wrap">
            <span>{origin?.name || 'Chennai Central'}</span>
            <span className="text-[#5F2CFF]">↓</span>
            <span>{destination?.name || 'Chennai Airport'}</span>
          </div>
        </div>

        {/* Recommended Route Badge & ETA */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#DFF6FF] text-[#5F2CFF] mb-2">
              ⭐ Recommended
            </div>
            <h2 className="text-2xl font-black text-[#0B0B12] font-display">
              {route.name}
            </h2>
            <div className="mt-2">
              <TransportSequence modes={route.transportModes} />
            </div>
          </div>

          <div className="text-right">
            <div className="text-3xl font-black font-display text-[#5F2CFF] tabular-nums">
              {route.duration} <span className="text-base font-normal text-slate-500">min</span>
            </div>
            <div className="text-xs font-semibold text-slate-500 mt-0.5">
              ETA: {route.segments[route.segments.length - 1]?.arrivalTime || '09:52 AM'}
            </div>
          </div>
        </div>

        {/* Secondary Essential Metrics: Distance, Cost, Transfers */}
        <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/70 text-center">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Distance</span>
            <span className="text-sm font-extrabold text-[#0B0B12] tabular-nums">
              {route.distance} km
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Fare</span>
            <span className="text-sm font-extrabold text-emerald-600 tabular-nums">
              ₹{route.cost}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Transfers</span>
            <span className="text-sm font-extrabold text-[#0B0B12] tabular-nums">
              {route.transfers === 0 ? 'Direct (0)' : `${route.transfers}`}
            </span>
          </div>
        </div>

        {/* NEXT ACTION / LIVE STEP */}
        {!journeyStarted ? (
          <div className="bg-[#DFF6FF]/60 rounded-2xl p-5 border border-[#5F2CFF]/25">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#5F2CFF] block mb-1">
              Next Action
            </span>

            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <TransportBadge mode={nextAction.transportMode} size="md" />
              </div>
              <div>
                <h4 className="text-base font-bold text-[#0B0B12]">
                  {nextAction.step}
                </h4>
                <div className="text-xs font-semibold text-slate-600 mt-0.5">
                  {nextAction.duration} min · {nextAction.distance}
                </div>
                {nextAction.details && (
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {nextAction.details}
                  </p>
                )}
                {nextAction.thenAction && (
                  <div className="mt-3 pt-2.5 border-t border-[#5F2CFF]/15 text-xs text-slate-700 font-medium flex items-center gap-1.5">
                    <span className="text-[#5F2CFF] font-bold">Then:</span>
                    <span>{nextAction.thenAction}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Active Turn-by-Turn Guidance once Start Journey is tapped */
          <div className="bg-[#0B0B12] text-white rounded-2xl p-6 border-2 border-[#5F2CFF] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#DFF6FF]">
                Active Journey · Step {activeStepIndex + 1} of {route.segments.length}
              </span>
              <span className="text-xs text-slate-400">Lock screen safe</span>
            </div>

            <div className="flex items-start gap-3 pt-2">
              <TransportBadge mode={route.segments[activeStepIndex]?.mode || 'walk'} size="lg" />
              <div>
                <h3 className="text-lg font-bold text-white">
                  {route.segments[activeStepIndex]?.instructions || route.segments[activeStepIndex]?.to}
                </h3>
                <div className="text-xs text-slate-300 mt-1">
                  Duration: {route.segments[activeStepIndex]?.duration} min · {route.segments[activeStepIndex]?.distance} km
                </div>
                {route.segments[activeStepIndex]?.lineName && (
                  <div className="text-xs text-[#8B6CFF] font-bold mt-1">
                    {route.segments[activeStepIndex]?.lineName}
                  </div>
                )}
              </div>
            </div>

            {/* Next step advance button */}
            <button
              type="button"
              onClick={handleNextStep}
              className="w-full mt-4 py-3 rounded-xl bg-white hover:bg-slate-100 text-[#0B0B12] font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <span>{activeStepIndex < route.segments.length - 1 ? 'Mark Step Complete & Continue' : 'Arrived at Destination'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* DOMINANT ACTION: START JOURNEY BUTTON */}
        {!journeyStarted ? (
          <button
            type="button"
            onClick={() => setJourneyStarted(true)}
            className="w-full py-5 rounded-2xl bg-[#5F2CFF] hover:bg-[#5F2CFF]/90 active:scale-[0.99] text-white font-extrabold text-base tracking-wide shadow-xl shadow-[#5F2CFF]/35 transition-all flex items-center justify-center gap-3 cursor-pointer"
          >
            <Compass className="w-5 h-5 text-white" />
            <span>START JOURNEY</span>
            <ArrowRight className="w-5 h-5 text-white" />
          </button>
        ) : (
          <div className="text-center text-xs text-slate-500 pt-1">
            Trip guidance active. You can safely lock your screen to preserve the remaining 5% charge.
          </div>
        )}
      </div>

      {/* Lightweight Route Map (Non-interactive SVG/CSS corridor) */}
      <SimplifiedRouteMap route={route} origin={origin} destination={destination} />
    </div>
  );
};
