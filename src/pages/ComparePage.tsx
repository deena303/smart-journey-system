import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useJourney } from '../context/JourneyContext';
import { RouteComparison } from '../components/compare/RouteComparison';
import { EmptyState } from '../components/common/LoadingState';
import { GitCompare, ArrowLeft, Sparkles, Navigation } from 'lucide-react';
import { CHENNAI_CENTRAL_TO_AIRPORT_ROUTES } from '../data/demoRoutes';

export const ComparePage: React.FC = () => {
  const navigate = useNavigate();
  const { searchResult, changePreference } = useJourney();

  const routes = searchResult?.routes || CHENNAI_CENTRAL_TO_AIRPORT_ROUTES;
  const origin = searchResult?.origin || { name: 'Chennai Central' };
  const destination = searchResult?.destination || { name: 'Chennai Airport' };
  const preference = searchResult?.query.preference || 'balanced';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      {/* Top Breadcrumb & Actions */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#0B0B12] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>

        <Link
          to="/what-if"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#5F2CFF]/10 text-[#5F2CFF] text-xs font-semibold hover:bg-[#5F2CFF]/15 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Simulate with Constraints</span>
        </Link>
      </div>

      {/* Header section */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DFF6FF] text-[#5F2CFF] text-xs font-bold uppercase tracking-wider mb-2">
          <GitCompare className="w-3.5 h-3.5" />
          <span>Side-by-Side Matrix</span>
        </div>
        <h1 className="text-3xl font-black text-[#0B0B12] font-display">
          Compare Route Options
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Evaluating all feasible routes between <strong className="text-slate-800">{origin.name}</strong> and <strong className="text-slate-800">{destination.name}</strong>.
        </p>
      </div>

      {/* Comparison Component */}
      <RouteComparison
        routes={routes}
        activePreference={preference}
        onPreferenceChange={(newPref) => changePreference(newPref)}
      />
    </div>
  );
};
