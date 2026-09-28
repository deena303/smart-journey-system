import React, { useState } from 'react';
import { Route, Location } from '../../types/journey';
import { TransportBadge } from '../common/TransportBadge';
import { MapView } from '../route/MapView';
import { MapPin, Navigation, ArrowDown, Map as MapIcon, ChevronDown, ChevronUp } from 'lucide-react';

interface SimplifiedRouteMapProps {
  route: Route;
  origin?: Location;
  destination?: Location;
}

export const SimplifiedRouteMap: React.FC<SimplifiedRouteMapProps> = ({
  route,
  origin,
  destination
}) => {
  const [showFullMap, setShowFullMap] = useState<boolean>(false);

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
          <Navigation className="w-3.5 h-3.5 text-[#5F2CFF]" />
          <span>Lightweight Route Corridor</span>
        </div>

        <button
          type="button"
          onClick={() => setShowFullMap(!showFullMap)}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#5F2CFF] hover:underline"
        >
          <MapIcon className="w-3.5 h-3.5" />
          <span>{showFullMap ? 'Hide full map' : 'Open full map'}</span>
          {showFullMap ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {showFullMap ? (
        <div className="mt-3">
          <MapView route={route} origin={origin} destination={destination} interactive={false} />
        </div>
      ) : (
        /* Lightweight Vertical Linear Route Corridor (High Contrast, Low Power SVG/CSS) */
        <div className="py-2 px-1">
          <div className="space-y-3">
            {/* Origin Node */}
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-[#5F2CFF] text-white flex items-center justify-center text-xs font-bold shrink-0">
                A
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-[#0B0B12] truncate">
                  {origin?.name || 'Chennai Central'}
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  Starting point
                </div>
              </div>
            </div>

            {/* Segments in sequence */}
            {route.segments.map((seg, idx) => (
              <div key={seg.id} className="relative pl-3.5 ml-3 border-l-2 border-[#5F2CFF]/30 py-1 space-y-1">
                <div className="flex items-center gap-2">
                  <TransportBadge mode={seg.mode} size="sm" />
                  <span className="text-xs font-semibold text-slate-700 tabular-nums">
                    {seg.duration} min · {seg.distance} km
                  </span>
                </div>
                {seg.lineName && (
                  <div className="text-[11px] font-medium text-[#5F2CFF]">
                    {seg.lineName}
                  </div>
                )}
              </div>
            ))}

            {/* Destination Node */}
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs font-bold shrink-0">
                B
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-[#0B0B12] truncate">
                  {destination?.name || 'Chennai Airport'}
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  Final destination
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
