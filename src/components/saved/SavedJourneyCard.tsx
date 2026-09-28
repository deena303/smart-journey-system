import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SavedJourney } from '../../types/journey';
import { TransportBadge } from '../common/TransportBadge';
import { useJourney } from '../../context/JourneyContext';
import { Clock, Banknote, ArrowRight, Trash2, Edit3, Check, X, MapPin } from 'lucide-react';
import { JourneyService } from '../../services/journeyService';

interface SavedJourneyCardProps {
  journey: SavedJourney;
}

export const SavedJourneyCard: React.FC<SavedJourneyCardProps> = ({ journey }) => {
  const navigate = useNavigate();
  const { performSearch, removeSavedJourney, showToast } = useJourney();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedTitle, setEditedTitle] = useState<string>(journey.title);
  const [editedNotes, setEditedNotes] = useState<string>(journey.notes || '');

  const handleStart = async () => {
    await performSearch({
      origin: journey.origin,
      destination: journey.destination,
      departureTime: 'Now',
      preference: journey.preference
    });
    navigate('/results');
  };

  const handleSaveEdit = async () => {
    await JourneyService.updateSavedJourney(journey.id, {
      title: editedTitle,
      notes: editedNotes
    });
    setIsEditing(false);
    showToast('Updated', 'Saved journey details updated');
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 hover:border-slate-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        {/* Header row */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <TransportBadge mode={journey.preferredMode} size="sm" />
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              title="Edit notes"
              aria-label="Edit notes"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => removeSavedJourney(journey.id)}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              title="Delete journey"
              aria-label="Delete journey"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Title / Edit form */}
        {isEditing ? (
          <div className="space-y-2 mb-3">
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="w-full text-sm font-bold text-[#0B0B12] p-1.5 border border-[#5F2CFF] rounded-lg"
              placeholder="Journey name"
            />
            <textarea
              value={editedNotes}
              onChange={(e) => setEditedNotes(e.target.value)}
              className="w-full text-xs text-slate-600 p-1.5 border border-slate-200 rounded-lg"
              rows={2}
              placeholder="Add personal notes (e.g. morning commute notes)"
            />
            <div className="flex items-center gap-1.5 justify-end">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-2 py-1 text-xs text-slate-500 hover:bg-slate-100 rounded-md"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="px-2.5 py-1 text-xs bg-[#5F2CFF] text-white rounded-md font-semibold"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h4 className="text-lg font-bold text-[#0B0B12] font-display mb-1">
              {journey.title}
            </h4>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2 truncate">
              <MapPin className="w-3 h-3 text-[#5F2CFF] shrink-0" />
              <span>{journey.origin.name}</span>
              <span>→</span>
              <span>{journey.destination.name}</span>
            </div>
            {journey.notes && (
              <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mb-4 line-clamp-2">
                {journey.notes}
              </p>
            )}
          </div>
        )}

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-2 py-3 border-t border-slate-100 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Usual: <strong className="text-[#0B0B12]">{journey.usualDuration} min</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Banknote className="w-3.5 h-3.5 text-slate-400" />
            <span>Fare: <strong className="text-[#0B0B12]">₹{journey.usualCost}</strong></span>
          </div>
        </div>
      </div>

      {/* Start CTA */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
          Saved: {new Date(journey.savedAt).toLocaleDateString()}
        </span>

        <button
          type="button"
          onClick={handleStart}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#5F2CFF] hover:bg-[#5F2CFF]/90 text-white font-semibold text-xs transition-colors shadow-xs cursor-pointer"
        >
          <span>Start Journey</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
