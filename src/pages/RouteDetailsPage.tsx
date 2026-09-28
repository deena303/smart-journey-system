import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Route } from '../../src/types/journey';
import { JourneyService } from '../services/journeyService';
import { useJourney } from '../context/JourneyContext';
import { MapView } from '../components/MapView';
import { JourneyTimeline } from '../components/route/JourneyTimeline';
import { LoadingState, EmptyState } from '../components/common/LoadingState';
import { ArrowLeft, Bookmark, Share2, Sparkles, GitCompare } from 'lucide-react';

export const RouteDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { searchResult, saveCurrentJourney, showToast } = useJourney();

  const [route, setRoute] = useState<Route | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeSegmentId, setActiveSegmentId] = useState<string | undefined>();
  const [isSaved, setIsSaved] = useState<boolean>(false);

  useEffect(() => {
    const fetchRoute = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const found = await JourneyService.getRouteById(id);
        if (found) {
          setRoute(found);
          if (found.segments.length > 0) {
            setActiveSegmentId(found.segments[0].id);
          }
        }
      } catch (err) {
        console.error('Error fetching route:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoute();
  }, [id]);

  if (loading) {
    return <LoadingState message="Loading journey details..." submessage="Fetching corridor waypoints and transit schedule" />;
  }

  if (!route) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <EmptyState
          title="Route not found"
          description="The requested journey route does not exist or has expired."
          actionLabel="Back to Results"
          onAction={() => navigate('/results')}
        />
      </div>
    );
  }

  const origin = searchResult?.origin;
  const destination = searchResult?.destination;

  const handleSave = async () => {
    await saveCurrentJourney(
      `${origin?.name || 'Chennai Central'} → ${destination?.name || 'Airport'} (${route.name})`,
      `${route.duration} min, ₹${route.cost}, ${route.transfers} transfers`
    );
    setIsSaved(true);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    showToast('Link Copied', 'Journey details URL copied to clipboard');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#0B0B12] transition-colors self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to routes</span>
        </button>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleSave}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
              isSaved
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 shadow-2xs'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-emerald-600' : ''}`} />
            <span>{isSaved ? 'Saved to Library' : 'Save Journey'}</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white text-slate-700 border border-slate-200 hover:border-slate-300 shadow-2xs transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>

          <Link
            to="/compare"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white text-slate-700 border border-slate-200 hover:border-[#5F2CFF] shadow-2xs transition-colors"
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>Compare</span>
          </Link>

          <Link
            to="/what-if"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#5F2CFF] text-white hover:bg-[#5F2CFF]/90 shadow-xs transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simulate What-If</span>
          </Link>
        </div>
      </div>

      {/* Main Responsive Split Layout:
          Desktop: Left Timeline, Right Map
          Mobile: Map first (order-1), Timeline second (order-2) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Timeline Panel */}
        <div className="order-2 lg:order-1 lg:col-span-5">
          <JourneyTimeline
            route={route}
            activeSegmentId={activeSegmentId}
            onSelectSegment={setActiveSegmentId}
          />
        </div>

        {/* Simulated Map View */}
        <div className="order-1 lg:order-2 lg:col-span-7 sticky top-20">
          <MapView
            route={route}
            origin={origin}
            destination={destination}
            activeSegmentId={activeSegmentId}
            onSelectSegment={setActiveSegmentId}
          />
        </div>
      </div>
    </div>
  );
};
