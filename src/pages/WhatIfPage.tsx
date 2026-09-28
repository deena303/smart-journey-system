import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useJourney } from '../context/JourneyContext';
import { WhatIfPanel } from '../components/whatif/WhatIfPanel';
import { CHENNAI_CENTRAL_TO_AIRPORT_ROUTES } from '../data/demoRoutes';
import { Sparkles, ArrowLeft, GitCompare } from 'lucide-react';

export const WhatIfPage: React.FC = () => {
  const navigate = useNavigate();
  const { searchResult } = useJourney();

  const routes = searchResult?.routes || CHENNAI_CENTRAL_TO_AIRPORT_ROUTES;
  const origin = searchResult?.origin || { name: 'Chennai Central' };
  const destination = searchResult?.destination || { name: 'Chennai Airport' };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#0B0B12] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/compare')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#5F2CFF] transition-colors"
        >
          <GitCompare className="w-3.5 h-3.5" />
          <span>Compare Table</span>
        </button>
      </div>

      {/* Header section */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DFF6FF] text-[#5F2CFF] text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Intelligent Scenario Testing</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#0B0B12] font-display">
          What if your journey changed?
        </h1>
        <p className="text-sm text-slate-500 mt-1 max-w-2xl">
          Adjust your priorities and see how the recommendation changes for {origin.name} → {destination.name}.
        </p>
      </div>

      {/* What-If Interactive Panel */}
      <WhatIfPanel
        initialRoutes={routes}
        initialRouteId={searchResult?.recommendedRouteId}
      />
    </div>
  );
};
