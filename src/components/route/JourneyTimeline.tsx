import React from 'react';
import { Route, RouteSegment } from '../../types/journey';
import { TransportBadge } from '../common/TransportBadge';
import {
  Clock,
  Navigation,
  Banknote,
  Footprints,
  RefreshCcw,
  MapPin,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface JourneyTimelineProps {
  route: Route;
  activeSegmentId?: string;
  onSelectSegment?: (segmentId: string) => void;
}

export const JourneyTimeline: React.FC<JourneyTimelineProps> = ({
  route,
  activeSegmentId,
  onSelectSegment
}) => {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md">
      {/* Top summary card */}
      <div className="mb-6 pb-6 border-b border-slate-100">
        <h3 className="text-xl font-extrabold text-[#0B0B12] font-display mb-1">
          {route.name}
        </h3>
        <p className="text-xs text-slate-500 mb-4">{route.summary}</p>

        {/* 5-column metric summary row */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/60 text-xs">
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400">Total Time</span>
            <div className="text-base font-bold font-display tabular-nums text-[#0B0B12] mt-0.5">
              {route.duration} min
            </div>
          </div>

          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400">Distance</span>
            <div className="text-base font-bold font-display tabular-nums text-[#0B0B12] mt-0.5">
              {route.distance} km
            </div>
          </div>

          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400">Total Cost</span>
            <div className="text-base font-bold font-display tabular-nums text-emerald-600 mt-0.5">
              ₹{route.cost}
            </div>
          </div>

          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400">Transfers</span>
            <div className="text-base font-bold font-display tabular-nums text-[#0B0B12] mt-0.5">
              {route.transfers}
            </div>
          </div>

          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400">Walking</span>
            <div className="text-base font-bold font-display tabular-nums text-[#0B0B12] mt-0.5">
              {route.walkingDuration} min
            </div>
          </div>
        </div>
      </div>

      {/* Step by step timeline */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
        {route.segments.map((segment, index) => {
          const isSelected = activeSegmentId === segment.id;
          const isLast = index === route.segments.length - 1;

          return (
            <div
              key={segment.id}
              onClick={() => onSelectSegment && onSelectSegment(segment.id)}
              className={`relative cursor-pointer transition-all ${
                isSelected ? 'scale-[1.01]' : ''
              }`}
            >
              {/* Timeline Node Icon Dot */}
              <div
                className={`absolute -left-6 top-0 w-6 h-6 rounded-full flex items-center justify-center -translate-x-1/2 transition-all ${
                  segment.mode === 'metro'
                    ? 'bg-[#5F2CFF] text-white ring-4 ring-[#DFF6FF]'
                    : segment.mode === 'bus'
                    ? 'bg-emerald-500 text-white ring-4 ring-emerald-100'
                    : segment.mode === 'cab'
                    ? 'bg-amber-500 text-white ring-4 ring-amber-100'
                    : 'bg-slate-300 text-slate-700 ring-4 ring-slate-100'
                }`}
              >
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>

              {/* Segment Content Box */}
              <div
                className={`p-4 rounded-2xl border transition-all ${
                  isSelected
                    ? 'bg-[#DFF6FF]/40 border-[#5F2CFF]/40 shadow-xs'
                    : 'bg-slate-50/70 border-slate-200/70 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#0B0B12] tabular-nums">
                      {segment.departureTime}
                    </span>
                    <TransportBadge mode={segment.mode} size="sm" />
                  </div>
                  <span className="text-xs font-semibold text-slate-500 tabular-nums">
                    {segment.duration} min · {segment.distance} km
                  </span>
                </div>

                {/* From -> To Stations */}
                <div className="my-2 space-y-1">
                  <div className="text-xs font-bold text-[#0B0B12] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5F2CFF]" />
                    <span>{segment.from}</span>
                  </div>
                  <div className="pl-3 text-[11px] text-slate-400">↓</div>
                  <div className="text-xs font-bold text-[#0B0B12] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    <span>{segment.to}</span>
                  </div>
                </div>

                {segment.lineName && (
                  <div className="inline-block mt-1 text-[11px] font-semibold text-[#5F2CFF] bg-[#5F2CFF]/10 px-2.5 py-0.5 rounded-md">
                    {segment.lineName} {segment.stopsCount ? `· ${segment.stopsCount} stops` : ''}
                  </div>
                )}

                {segment.instructions && (
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed bg-white/70 p-2.5 rounded-xl border border-slate-200/40">
                    {segment.instructions}
                  </p>
                )}
              </div>
            </div>
          );
        })}

        {/* Arrival Destination Node */}
        <div className="relative">
          <div className="absolute -left-6 top-0 w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center -translate-x-1/2 ring-4 ring-rose-100">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
          <div className="pl-2">
            <div className="text-xs font-bold text-[#0B0B12]">
              {route.segments[route.segments.length - 1]?.arrivalTime} · Final Destination Arrived
            </div>
            <div className="text-xs text-slate-500">
              Trip completed via {route.name}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
