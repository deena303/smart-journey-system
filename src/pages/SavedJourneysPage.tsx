import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useJourney } from '../context/JourneyContext';
import { SavedJourneyCard } from '../components/saved/SavedJourneyCard';
import { EmptyState } from '../components/common/LoadingState';
import { Bookmark, Plus, Compass } from 'lucide-react';

export const SavedJourneysPage: React.FC = () => {
  const navigate = useNavigate();
  const { savedJourneys } = useJourney();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DFF6FF] text-[#5F2CFF] text-xs font-bold uppercase tracking-wider mb-2">
            <Bookmark className="w-3.5 h-3.5" />
            <span>Saved Library</span>
          </div>
          <h1 className="text-3xl font-black text-[#0B0B12] font-display">
            Your saved journeys
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Frequently traveled corridors with saved transit preferences and custom notes.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#5F2CFF] hover:bg-[#5F2CFF]/90 text-white font-semibold text-xs shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Plan New Journey</span>
        </button>
      </div>

      {/* Grid of Saved Journeys */}
      {savedJourneys.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {savedJourneys.map((journey) => (
            <SavedJourneyCard key={journey.id} journey={journey} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No saved journeys yet"
          description="Save your recurring commutes like Home to College, Office, or Airport for quick one-tap routing."
          actionLabel="Plan your first journey"
          onAction={() => navigate('/')}
          icon={<Bookmark className="w-7 h-7" />}
        />
      )}
    </div>
  );
};
