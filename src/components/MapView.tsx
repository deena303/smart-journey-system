import React, { useEffect, useRef, useState } from 'react';
import { Map, Marker, LngLatBounds, AttributionControl, GeoJSONSource } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Route, Location } from '../types/journey';
import { ZoomIn, ZoomOut, Maximize2, RotateCcw, AlertTriangle, Navigation, Sparkles } from 'lucide-react';

export interface MapViewProps {
  origin?: Location;
  destination?: Location;
  route?: Route;
  height?: string;
  interactive?: boolean;
  className?: string;
  activeSegmentId?: string;
  onSelectSegment?: (segmentId: string) => void;
}

export const MapView: React.FC<MapViewProps> = ({
  origin,
  destination,
  route,
  height = '100%',
  interactive = true,
  className = ''
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const originMarkerRef = useRef<Marker | null>(null);
  const destMarkerRef = useRef<Marker | null>(null);
  const [mapError, setMapError] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Default Chennai coordinates
  const defaultLng = 80.2200;
  const defaultLat = 13.0400;

  // Extract coordinates safely
  const startLng = origin?.longitude ?? origin?.coordinates?.lng ?? 80.2707;
  const startLat = origin?.latitude ?? origin?.coordinates?.lat ?? 13.0827;
  const endLng = destination?.longitude ?? destination?.coordinates?.lng ?? 80.1709;
  const endLat = destination?.latitude ?? destination?.coordinates?.lat ?? 12.9941;

  // 1. Initialize MapLibre Map once
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    try {
      const map = new Map({
        container: mapContainerRef.current,
        style: {
          version: 8,
          sources: {
            'osm-tiles': {
              type: 'raster',
              tiles: [
                'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
              ],
              tileSize: 256,
              attribution: '© <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors'
            }
          },
          layers: [
            {
              id: 'osm-tiles-layer',
              type: 'raster',
              source: 'osm-tiles',
              minzoom: 0,
              maxzoom: 19
            }
          ]
        },
        center: [defaultLng, defaultLat],
        zoom: 11.2,
        interactive: interactive,
        attributionControl: false
      });

      // Add standard attribution in bottom-right corner
      map.addControl(
        new AttributionControl({
          compact: true,
          customAttribution: '© OpenStreetMap contributors'
        }),
        'bottom-right'
      );

      map.on('load', () => {
        setIsLoaded(true);
      });

      map.on('error', (e) => {
        console.warn('MapLibre notice:', e);
      });

      mapRef.current = map;
    } catch (err) {
      console.error('Error initializing MapLibre:', err);
      setMapError(true);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // 2. Update Route Geometry, Layers & Markers whenever route/origin/destination changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const updateMapContent = () => {
      if (!map.isStyleLoaded()) {
        map.once('styledata', updateMapContent);
        return;
      }

      // 1. Route Geometry coordinates
      let lineCoordinates: [number, number][] = [];
      if (route?.geometry && route.geometry.length > 0) {
        lineCoordinates = route.geometry;
      } else if (origin && destination) {
        lineCoordinates = [
          [startLng, startLat],
          [endLng, endLat]
        ];
      }

      const geojsonData = {
        type: 'Feature' as const,
        properties: {},
        geometry: {
          type: 'LineString' as const,
          coordinates: lineCoordinates
        }
      };

      // Add or update GeoJSON source
      const source = map.getSource('journey-route-source') as GeoJSONSource;
      if (source) {
        source.setData(geojsonData);
      } else {
        map.addSource('journey-route-source', {
          type: 'geojson',
          data: geojsonData
        });

        // Outer glow/shadow layer (Chrome Violet)
        map.addLayer({
          id: 'route-glow',
          type: 'line',
          source: 'journey-route-source',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#5F2CFF',
            'line-width': 12,
            'line-opacity': 0.22
          }
        });

        // White casing boundary for contrast
        map.addLayer({
          id: 'route-casing',
          type: 'line',
          source: 'journey-route-source',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#FFFFFF',
            'line-width': 6.5,
            'line-opacity': 0.95
          }
        });

        // Core route line (Chrome Violet #5F2CFF)
        map.addLayer({
          id: 'route-line',
          type: 'line',
          source: 'journey-route-source',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#5F2CFF',
            'line-width': 4.5,
            'line-opacity': 0.95
          }
        });
      }

      // 2. Custom Origin Marker (Chrome Violet with "Start" label)
      if (originMarkerRef.current) {
        originMarkerRef.current.remove();
      }

      if (origin) {
        const originEl = document.createElement('div');
        originEl.className = 'origin-marker-container group cursor-pointer';
        originEl.innerHTML = `
          <div style="display: flex; flex-direction: column; align-items: center; pointer-events: auto;">
            <div style="background: #0B0B12; color: #FFFFFF; font-size: 10px; font-weight: 800; padding: 2px 7px; border-radius: 9999px; border: 1px solid rgba(255,255,255,0.2); box-shadow: 0 4px 6px -1px rgba(0,0,0,0.2); white-space: nowrap; margin-bottom: 2px;">
              Start
            </div>
            <div style="width: 28px; height: 28px; border-radius: 50%; background: #5F2CFF; border: 3px solid #FFFFFF; box-shadow: 0 0 12px rgba(95,44,255,0.6); display: flex; align-items: center; justify-content: center; color: #FFFFFF; font-weight: 900; font-size: 11px;">
              A
            </div>
          </div>
        `;

        originMarkerRef.current = new Marker({
          element: originEl,
          anchor: 'bottom'
        })
          .setLngLat([startLng, startLat])
          .addTo(map);
      }

      // 3. Custom Destination Marker (Vibrant Accent with "Destination" label)
      if (destMarkerRef.current) {
        destMarkerRef.current.remove();
      }

      if (destination) {
        const destEl = document.createElement('div');
        destEl.className = 'destination-marker-container group cursor-pointer';
        destEl.innerHTML = `
          <div style="display: flex; flex-direction: column; align-items: center; pointer-events: auto;">
            <div style="background: #0B0B12; color: #DFF6FF; font-size: 10px; font-weight: 800; padding: 2px 7px; border-radius: 9999px; border: 1px solid #5F2CFF; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.2); white-space: nowrap; margin-bottom: 2px;">
              Destination
            </div>
            <div style="width: 28px; height: 28px; border-radius: 50%; background: #E11D48; border: 3px solid #FFFFFF; box-shadow: 0 0 12px rgba(225,29,72,0.6); display: flex; align-items: center; justify-content: center; color: #FFFFFF; font-weight: 900; font-size: 11px;">
              B
            </div>
          </div>
        `;

        destMarkerRef.current = new Marker({
          element: destEl,
          anchor: 'bottom'
        })
          .setLngLat([endLng, endLat])
          .addTo(map);
      }

      // 4. Fit bounds to show entire route with comfortable padding
      if (lineCoordinates.length > 0) {
        const bounds = new LngLatBounds();
        lineCoordinates.forEach((coord) => bounds.extend(coord));
        map.fitBounds(bounds, {
          padding: { top: 70, bottom: 60, left: 60, right: 60 },
          maxZoom: 14.5,
          duration: 900
        });
      }
    };

    if (map.isStyleLoaded()) {
      updateMapContent();
    } else {
      map.once('load', updateMapContent);
    }
  }, [route, origin, destination, startLng, startLat, endLng, endLat]);

  const handleZoomIn = () => {
    mapRef.current?.zoomIn({ duration: 300 });
  };

  const handleZoomOut = () => {
    mapRef.current?.zoomOut({ duration: 300 });
  };

  const handleResetView = () => {
    const map = mapRef.current;
    if (!map) return;
    const coords = route?.geometry || [
      [startLng, startLat],
      [endLng, endLat]
    ];
    if (coords.length > 0) {
      const bounds = new LngLatBounds();
      coords.forEach((c) => bounds.extend(c));
      map.fitBounds(bounds, {
        padding: { top: 70, bottom: 60, left: 60, right: 60 },
        maxZoom: 14.5,
        duration: 800
      });
    }
  };

  // Graceful fallback if WebGL or MapLibre fails
  if (mapError) {
    return (
      <div
        className={`w-full bg-slate-100 rounded-3xl p-6 flex flex-col items-center justify-center text-center border border-slate-200 ${className}`}
        style={{ height }}
      >
        <div className="w-12 h-12 rounded-2xl bg-[#DFF6FF] text-[#5F2CFF] flex items-center justify-center mb-3">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-bold text-[#0B0B12]">Map unavailable</h4>
        <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4">
          Interactive map could not load. All route details, timetables, and navigation directions remain active.
        </p>
        <div className="text-xs font-semibold text-[#5F2CFF] bg-white px-3 py-1.5 rounded-xl border border-slate-200">
          {origin?.name || 'Chennai Central'} → {destination?.name || 'Chennai Airport'} ({route?.duration || 42} min)
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full rounded-3xl overflow-hidden border border-slate-200 shadow-md bg-slate-100 ${className}`}
      style={{ height, minHeight: '360px' }}
    >
      {/* MapLibre WebGL DOM Container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating Glass Blue Information Overlay Card */}
      {route && (
        <div className="absolute top-3 left-3 z-10 max-w-xs sm:max-w-sm rounded-2xl bg-[#DFF6FF]/90 backdrop-blur-md border border-[#5F2CFF]/30 p-3.5 shadow-lg text-[#0B0B12] transition-all">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#5F2CFF] mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {route.tag === 'recommended'
                ? '⭐ AI Recommended Route'
                : route.tag === 'fastest'
                ? '⚡ Fastest Route'
                : route.tag === 'cheapest'
                ? '💰 Cheapest Route'
                : 'Selected Route'}
            </span>
          </div>

          <h4 className="text-sm font-bold text-[#0B0B12] truncate">
            {route.name}
          </h4>

          <div className="text-xs text-slate-700 font-semibold mt-0.5">
            {route.duration} min · {route.distance} km · ₹{route.cost}
          </div>

          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-2">
            <span>{route.transfers === 0 ? 'Direct (0 transfers)' : `${route.transfers} transfer`}</span>
            <span>·</span>
            <span>{route.walkingDuration} min walking</span>
          </div>
        </div>
      )}

      {/* Custom Map Control Buttons (Zoom in, Zoom out, Reset) */}
      {interactive && (
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5 bg-white/95 backdrop-blur-md p-1 rounded-xl border border-slate-200/90 shadow-md">
          <button
            type="button"
            onClick={handleZoomIn}
            title="Zoom In"
            aria-label="Zoom In"
            className="p-2 text-slate-700 hover:text-[#5F2CFF] hover:bg-[#DFF6FF]/50 rounded-lg transition-colors cursor-pointer"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            title="Zoom Out"
            aria-label="Zoom Out"
            className="p-2 text-slate-700 hover:text-[#5F2CFF] hover:bg-[#DFF6FF]/50 rounded-lg transition-colors cursor-pointer"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleResetView}
            title="Fit Entire Route"
            aria-label="Fit Entire Route"
            className="p-2 text-slate-700 hover:text-[#5F2CFF] hover:bg-[#DFF6FF]/50 rounded-lg transition-colors cursor-pointer border-t border-slate-100"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
export default MapView;
