import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJourney } from '../context/JourneyContext';
import { HistoryItem } from '../components/history/HistoryItem';
import { EmptyState } from '../components/common/LoadingState';
import { History, Trash2, Calendar, Filter } from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { history, clearAllHistory } = useJourney();

  const [activeFilter, setActiveFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');

  const filteredHistory = history.filter((item) => {
    if (activeFilter === 'all') return true;

    const itemDate = new Date(item.date).getTime();
    const now = new Date().getTime();
    const oneDay = 24 * 60 * 60 * 1000;

    if (activeFilter === 'today') {
      return now - itemDate <= oneDay;
    }
    if (activeFilter === 'week') {
      return now - itemDate <= 7 * oneDay;
    }
    if (activeFilter === 'month') {
      return now - itemDate <= 30 * oneDay;
    }
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DFF6FF] text-[#5F2CFF] text-xs font-bold uppercase tracking-wider mb-2">
            <History className="w-3.5 h-3.5" />
            <span>Activity Log</span>
          </div>
          <h1 className="text-3xl font-black text-[#0B0B12] font-display">
            Journey history
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Past calculated journeys and completed commutes across Chennai.
          </p>
        </div>

        {history.length > 0 && (
          <button
            type="button"
            onClick={clearAllHistory}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors self-start sm:self-auto cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Time Filters Bar */}
      <div className="flex items-center justify-between gap-2 p-1.5 bg-white rounded-2xl border border-slate-200/80 mb-6 shadow-2xs">
        <div className="flex items-center gap-1 overflow-x-auto">
          {[
            { id: 'all', label: 'All Journeys' },
            { id: 'today', label: 'Today' },
            { id: 'week', label: 'This Week' },
            { id: 'month', label: 'This Month' }
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setActiveFilter(f.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeFilter === f.id
                  ? 'bg-[#5F2CFF] text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-400 tabular-nums px-3 hidden sm:inline">
          {filteredHistory.length} record{filteredHistory.length === 1 ? '' : 's'}
        </span>
      </div>

      {/* History Items List */}
      {filteredHistory.length > 0 ? (
        <div className="space-y-3">
          {filteredHistory.map((item) => (
            <HistoryItem key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No journeys found for this period"
          description="Your journey searches and trips will appear here automatically."
          actionLabel="Plan a journey"
          onAction={() => navigate('/')}
          icon={<History className="w-7 h-7" />}
        />
      )}
    </div>
  );
};
