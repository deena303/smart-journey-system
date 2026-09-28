import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useJourney } from '../context/JourneyContext';
import { useBattery } from '../context/BatteryContext';
import { JourneySummary } from '../components/results/JourneySummary';
import { RecommendedRouteCard } from '../components/results/RecommendedRouteCard';
import { RouteCard } from '../components/results/RouteCard';
import { PreferenceSelector } from '../components/planner/PreferenceSelector';
import { WhyThisRouteModal } from '../components/results/WhyThisRouteModal';
import { CriticalBatteryView } from '../components/battery/CriticalBatteryView';
import { LoadingState, EmptyState } from '../components/common/LoadingState';
import { MapView } from '../components/MapView';
import { rankBatteryAwareRoutes } from '../utils/batteryEngine';
import { MapPin, ArrowRight, GitCompare, Sparkles, SlidersHorizontal, ArrowLeft, BatteryLow, Eye, Map as MapIcon } from 'lucide-react';
import { JourneyPreference } from '../types/journey';

export const ResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const { searchResult, isLoading, changePreference } = useJourney();
  const { batteryMode } = useBattery();

  const [isWhyModalOpen, setIsWhyModalOpen] = useState(false);
  const [forceStandardView, setForceStandardView] = useState(false);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [mobileShowMap, setMobileShowMap] = useState<boolean>(true);

  if (isLoading) {
    return <LoadingState message="Evaluating optimal routes..." submessage="Analyzing multi-modal transit networks in Chennai" />;
  }

  if (!searchResult || searchResult.routes.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <EmptyState
          title="No routes found"
          description="We couldn't calculate routes for this origin and destination. Try searching between popular Chennai transit hubs."
          actionLabel="Return to Plan"
          onAction={() => navigate('/')}
        />
      </div>
    );
  }

  const { origin, destination, routes, query } = searchResult;

  // Apply battery-aware ranking dynamically based on current battery level
  const rankedRoutes = rankBatteryAwareRoutes(
    routes,
    query.preference,
    batteryMode,
    {
      maxBudget: query.maxBudget,
      maxTransfers: query.maxTransfers,
      maxWalkingKm: query.maxWalkingKm,
      wheelchairAccessible: query.wheelchairAccessible
    }
  );

  const recommendedRoute = rankedRoutes[0] || routes[0];
  const activeRoute = rankedRoutes.find((r) => r.id === selectedRouteId) || recommendedRoute;
  const otherRoutes = rankedRoutes.filter((r) => r.id !== recommendedRoute.id);

  const handlePreferenceChange = (newPref: JourneyPreference) => {
    changePreference(newPref);
  };

  // If in Critical Battery Mode (<= 5%) and not forced to standard:
  // Render the dedicated, high-contrast, low-interaction interface!
  if (batteryMode === 'critical' && !forceStandardView) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 animate-in fade-in duration-150">
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0B0B12] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Change Destination</span>
          </button>

          <button
            type="button"
            onClick={() => setForceStandardView(true)}
            className="text-xs text-slate-500 hover:text-[#5F2CFF] underline flex items-center gap-1"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View standard multiple routes & map</span>
          </button>
        </div>

        <CriticalBatteryView
          route={recommendedRoute}
          origin={origin}
          destination={destination}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
      {/* Back button & quick navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#0B0B12] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Edit Search</span>
        </button>

        <div className="flex items-center gap-2">
          {batteryMode === 'critical' && forceStandardView && (
            <button
              type="button"
              onClick={() => setForceStandardView(false)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold shadow-2xs hover:bg-rose-100 transition-colors"
            >
              <BatteryLow className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
              <span>Back to Critical Battery Mode</span>
            </button>
          )}

          <Link
            to="/compare"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-[#5F2CFF]/40 text-xs font-semibold text-slate-700 hover:text-[#5F2CFF] shadow-2xs transition-all"
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>Compare</span>
          </Link>
          <Link
            to="/what-if"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#5F2CFF]/10 text-[#5F2CFF] text-xs font-semibold hover:bg-[#5F2CFF]/15 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>What-If</span>
          </Link>
        </div>
      </div>

      {/* Header section */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#5F2CFF] mb-1">
              Best ways to get there
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0B0B12] font-display flex items-center gap-2 flex-wrap">
              <span>{origin.name}</span>
              <span className="text-slate-400">→</span>
              <span>{destination.name}</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              {rankedRoutes.length} routes found · Interactive OpenStreetMap view enabled
            </p>
          </div>

          {/* Quick interactive priority switcher */}
          <div className="self-start md:self-auto">
            <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Active Priority
            </span>
            <PreferenceSelector
              value={query.preference}
              onChange={handlePreferenceChange}
              size="sm"
            />
          </div>
        </div>
      </div>

      {/* Compact Result Summary row: clicking a category selects it on the map! */}
      <JourneySummary
        routes={rankedRoutes}
        onSelectRoute={(id) => setSelectedRouteId(id)}
      />

      {/* Mobile Map Toggle */}
      <div className="lg:hidden flex items-center justify-between p-3 mb-4 rounded-2xl bg-[#DFF6FF]/60 border border-[#5F2CFF]/20">
        <div className="flex items-center gap-2">
          <MapIcon className="w-4 h-4 text-[#5F2CFF]" />
          <span className="text-xs font-bold text-[#0B0B12]">
            Chennai Interactive Map: {activeRoute.name}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setMobileShowMap(!mobileShowMap)}
          className="text-xs font-bold text-[#5F2CFF] underline"
        >
          {mobileShowMap ? 'Hide Map' : 'Show Map'}
        </button>
      </div>

      {/* Mobile Map Render if toggled */}
      {mobileShowMap && (
        <div className="lg:hidden mb-6">
          <MapView
            route={activeRoute}
            origin={origin}
            destination={destination}
            height="340px"
          />
        </div>
      )}

      {/* Desktop Split Layout:
          LEFT (7 cols): Route Cards
          RIGHT (5 cols): Interactive OpenStreetMap */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Route Cards */}
        <div className="lg:col-span-7 space-y-6">
          {/* Active selection banner */}
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>Select any route to display on the live map:</span>
            <span className="font-bold text-[#5F2CFF]">
              Active: {activeRoute.name}
            </span>
          </div>

          {/* Recommended Route Card (Click anywhere to activate on map) */}
          <div
            onClick={() => setSelectedRouteId(recommendedRoute.id)}
            className={`cursor-pointer rounded-3xl transition-all ${
              activeRoute.id === recommendedRoute.id
                ? 'ring-4 ring-[#5F2CFF]/30 shadow-lg'
                : 'opacity-95 hover:opacity-100'
            }`}
          >
            <RecommendedRouteCard
              route={recommendedRoute}
              allRoutes={rankedRoutes}
              preference={query.preference}
              onOpenWhyModal={() => setIsWhyModalOpen(true)}
            />
          </div>

          {/* Alternative Routes Grid */}
          {otherRoutes.length > 0 && (
            <div className="pt-2">
              <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Other Route Alternatives ({otherRoutes.length})
                </h3>
                <span className="text-[11px] text-slate-400">Click to preview route</span>
              </div>

              <div className="space-y-3.5">
                {otherRoutes.map((route) => {
                  const isSelected = activeRoute.id === route.id;
                  return (
                    <div
                      key={route.id}
                      onClick={() => setSelectedRouteId(route.id)}
                      className={`cursor-pointer rounded-2xl transition-all ${
                        isSelected
                          ? 'ring-2 ring-[#5F2CFF] shadow-md'
                          : 'hover:border-slate-300'
                      }`}
                    >
                      <RouteCard route={route} onSelect={() => setSelectedRouteId(route.id)} />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Sticky Interactive OpenStreetMap (Desktop) */}
        <div className="hidden lg:block lg:col-span-5 sticky top-20">
          <div className="bg-white rounded-3xl p-3 border border-slate-200/80 shadow-md">
            <div className="flex items-center justify-between px-2 py-1.5 mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#0B0B12]">
                <MapPin className="w-4 h-4 text-[#5F2CFF]" />
                <span>OpenStreetMap · Chennai Corridor</span>
              </div>
              <span className="text-[10px] font-semibold text-slate-400">
                Live Route Tracking
              </span>
            </div>

            <MapView
              route={activeRoute}
              origin={origin}
              destination={destination}
              height="530px"
            />
          </div>
        </div>
      </div>

      {/* Why This Route Modal */}
      <WhyThisRouteModal
        isOpen={isWhyModalOpen}
        onClose={() => setIsWhyModalOpen(false)}
        route={recommendedRoute}
        allRoutes={rankedRoutes}
        preference={query.preference}
      />
    </div>
  );
};
export default ResultsPage;
