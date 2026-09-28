import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Location, JourneyPreference } from '../../types/journey';
import { DEMO_LOCATIONS } from '../../data/demoLocations';
import { LocationAutocomplete } from './LocationAutocomplete';
import { PreferenceSelector } from './PreferenceSelector';
import { useJourney } from '../../context/JourneyContext';
import { ArrowUpDown, ArrowRight, Clock, SlidersHorizontal, Loader2 } from 'lucide-react';

interface JourneySearchProps {
  initialOrigin?: Location | null;
  initialDestination?: Location | null;
  initialPreference?: JourneyPreference;
  compact?: boolean;
}

export const JourneySearch: React.FC<JourneySearchProps> = ({
  initialOrigin = DEMO_LOCATIONS[0], // Chennai Central
  initialDestination = DEMO_LOCATIONS[1], // Chennai Airport
  initialPreference = 'balanced',
  compact = false
}) => {
  const navigate = useNavigate();
  const { performSearch, isLoading } = useJourney();

  const [origin, setOrigin] = useState<Location | null>(initialOrigin);
  const [destination, setDestination] = useState<Location | null>(initialDestination);
  const [departureTime, setDepartureTime] = useState<string>('Now');
  const [preference, setPreference] = useState<JourneyPreference>(initialPreference);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [maxBudget, setMaxBudget] = useState<number>(500);
  const [maxTransfers, setMaxTransfers] = useState<number>(2);

  const handleSwap = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!origin || !destination) return;

    await performSearch({
      origin,
      destination,
      departureTime,
      preference,
      maxBudget: showAdvanced ? maxBudget : undefined,
      maxTransfers: showAdvanced ? maxTransfers : undefined
    });

    navigate('/results');
  };

  return (
    <form
      onSubmit={handleSearch}
      className={`bg-white rounded-3xl p-5 sm:p-7 shadow-xl border border-slate-200/70 transition-all ${
        compact ? 'max-w-4xl mx-auto' : 'w-full'
      }`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        {/* Origin field */}
        <div className="lg:col-span-5">
          <LocationAutocomplete
            label="From"
            placeholder="Where are you starting?"
            value={origin}
            onChange={setOrigin}
            icon="origin"
            excludeId={destination?.id}
          />
        </div>

        {/* Swap button */}
        <div className="flex justify-center -my-2 lg:my-0 lg:col-span-1">
          <button
            type="button"
            onClick={handleSwap}
            aria-label="Swap origin and destination"
            title="Swap locations"
            className="p-2.5 rounded-full bg-[#DFF6FF]/60 hover:bg-[#DFF6FF] text-[#5F2CFF] border border-[#5F2CFF]/20 hover:scale-105 active:scale-95 transition-all"
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>
        </div>

        {/* Destination field */}
        <div className="lg:col-span-6">
          <LocationAutocomplete
            label="To"
            placeholder="Where are you going?"
            value={destination}
            onChange={setDestination}
            icon="destination"
            excludeId={origin?.id}
          />
        </div>
      </div>

      {/* Row 2: Departure & Quick Preference Selector */}
      <div className="mt-5 pt-5 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Departure Time */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Departure:</span>
          </div>

          <div className="inline-flex rounded-lg bg-slate-100 p-0.5 text-xs font-medium">
            {['Now', '09:30', '14:00', '18:15'].map((timeOption) => (
              <button
                type="button"
                key={timeOption}
                onClick={() => setDepartureTime(timeOption)}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  departureTime === timeOption
                    ? 'bg-white text-[#0B0B12] shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {timeOption}
              </button>
            ))}
          </div>
        </div>

        {/* Priority quick label */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Priority:
          </span>
          <span className="text-xs font-bold text-[#5F2CFF] bg-[#DFF6FF]/60 px-2.5 py-0.5 rounded-full">
            {preference === 'balanced'
              ? 'Smart Balance'
              : preference === 'save_time'
              ? 'Save Time'
              : preference === 'save_money'
              ? 'Save Money'
              : preference === 'eco_friendly'
              ? 'Eco Friendly'
              : preference === 'less_walking'
              ? 'Less Walking'
              : 'Fewer Transfers'}
          </span>
        </div>
      </div>

      {/* Row 3: Priority Chips */}
      <div className="mt-4">
        <label className="block text-xs font-semibold tracking-wider uppercase text-slate-500 mb-2">
          Journey Preference
        </label>
        <PreferenceSelector value={preference} onChange={setPreference} size="md" />
      </div>

      {/* Advanced filters toggle */}
      {showAdvanced && (
        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in duration-200">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Max Budget: ₹{maxBudget}
            </label>
            <input
              type="range"
              min={30}
              max={600}
              step={10}
              value={maxBudget}
              onChange={(e) => setMaxBudget(Number(e.target.value))}
              className="w-full accent-[#5F2CFF]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Max Transfers: {maxTransfers}
            </label>
            <input
              type="range"
              min={0}
              max={3}
              step={1}
              value={maxTransfers}
              onChange={(e) => setMaxTransfers(Number(e.target.value))}
              className="w-full accent-[#5F2CFF]"
            />
          </div>
        </div>
      )}

      {/* Submit CTA & Actions */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-xs font-medium text-slate-500 hover:text-[#5F2CFF] flex items-center gap-1.5 transition-colors order-2 sm:order-1"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>{showAdvanced ? 'Hide advanced filters' : 'Advanced route filters'}</span>
        </button>

        <button
          type="submit"
          disabled={isLoading || !origin || !destination}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-[#5F2CFF] hover:bg-[#5F2CFF]/90 active:scale-[0.99] text-white font-semibold text-sm shadow-md shadow-[#5F2CFF]/25 hover:shadow-lg hover:shadow-[#5F2CFF]/35 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer order-1 sm:order-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Calculating Routes...</span>
            </>
          ) : (
            <>
              <span>Find Best Route</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
};
