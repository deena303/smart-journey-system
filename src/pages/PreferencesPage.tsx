import React, { useState } from 'react';
import { useJourney } from '../context/JourneyContext';
import { UserPreferences, JourneyPreference, TransportMode } from '../types/journey';
import { PriorityCard } from '../components/preferences/PreferenceCard';
import {
  Zap,
  DollarSign,
  Sparkles,
  Leaf,
  Footprints,
  RefreshCcw,
  Armchair,
  Save,
  Check,
  Accessibility,
  Sliders,
  Train,
  Bus,
  Car,
  Bike
} from 'lucide-react';

export const PreferencesPage: React.FC = () => {
  const { userPreferences, updateUserPreferences } = useJourney();

  const [priority, setPriority] = useState<JourneyPreference>(
    userPreferences.defaultPriority || 'balanced'
  );
  const [maxWalkingKm, setMaxWalkingKm] = useState<number>(
    userPreferences.maxWalkingDistanceKm || 1.5
  );
  const [maxTransfers, setMaxTransfers] = useState<number>(
    userPreferences.maxTransfers !== undefined ? userPreferences.maxTransfers : 2
  );
  const [preferredModes, setPreferredModes] = useState<TransportMode[]>(
    userPreferences.preferredModes || ['metro', 'bus', 'train', 'cab', 'walk']
  );
  const [wheelchairFriendly, setWheelchairFriendly] = useState<boolean>(
    userPreferences.wheelchairFriendly || false
  );
  const [avoidStairs, setAvoidStairs] = useState<boolean>(
    userPreferences.avoidStairs || false
  );
  const [notifyDelays, setNotifyDelays] = useState<boolean>(
    userPreferences.notifyDelays ?? true
  );

  const toggleMode = (mode: TransportMode) => {
    if (preferredModes.includes(mode)) {
      if (preferredModes.length > 1) {
        setPreferredModes(preferredModes.filter((m) => m !== mode));
      }
    } else {
      setPreferredModes([...preferredModes, mode]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserPreferences = {
      defaultPriority: priority,
      maxWalkingDistanceKm: maxWalkingKm,
      maxTransfers,
      preferredModes,
      wheelchairFriendly,
      avoidStairs,
      notifyDelays
    };
    await updateUserPreferences(updated);
  };

  const priorityOptions = [
    {
      id: 'save_time' as JourneyPreference,
      title: 'Save Time',
      subtitle: 'Fastest door-to-door transit routes',
      icon: Zap
    },
    {
      id: 'save_money' as JourneyPreference,
      title: 'Save Money',
      subtitle: 'Lowest fare public transit & bus passes',
      icon: DollarSign
    },
    {
      id: 'balanced' as JourneyPreference,
      title: 'Smart Balance',
      subtitle: 'Harmonious optimization of time, cost & comfort',
      icon: Armchair
    },
    {
      id: 'eco_friendly' as JourneyPreference,
      title: 'Eco Friendly',
      subtitle: 'Electric metro corridors & minimum carbon impact',
      icon: Leaf
    },
    {
      id: 'less_walking' as JourneyPreference,
      title: 'Less Walking',
      subtitle: 'Near-direct transit with minimal walking steps',
      icon: Footprints
    },
    {
      id: 'fewer_transfers' as JourneyPreference,
      title: 'Fewer Transfers',
      subtitle: 'Direct single-vehicle lines & minimal switching',
      icon: RefreshCcw
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DFF6FF] text-[#5F2CFF] text-xs font-bold uppercase tracking-wider mb-2">
          <Sliders className="w-3.5 h-3.5" />
          <span>Personal Mobility Profile</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#0B0B12] font-display">
          How do you like to travel?
        </h1>
        <p className="text-sm text-slate-500 mt-1 max-w-2xl">
          Customize your journey scoring algorithm. These preferences guide our AI recommendation engine across all Chennai routes.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Section 1: Default Priority Cards */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
          <h3 className="text-base font-bold text-[#0B0B12] mb-1">
            Primary Travel Style
          </h3>
          <p className="text-xs text-slate-500 mb-5">
            Select your baseline priority for calculating the Journey Score:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {priorityOptions.map((opt) => (
              <PriorityCard
                key={opt.id}
                id={opt.id}
                title={opt.title}
                subtitle={opt.subtitle}
                icon={opt.icon}
                isSelected={priority === opt.id}
                onSelect={() => setPriority(opt.id)}
              />
            ))}
          </div>
        </div>

        {/* Section 2: Walking & Transfer Tolerances */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
          <h3 className="text-base font-bold text-[#0B0B12] mb-1">
            Physical & Connection Tolerances
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            Fine-tune how far you are willing to walk and how many vehicle changes to accept:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Max Walking Distance */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Maximum Walking Distance
                </label>
                <span className="text-sm font-extrabold font-display text-[#5F2CFF] tabular-nums">
                  {maxWalkingKm} km
                </span>
              </div>
              <input
                type="range"
                min={0.3}
                max={3.0}
                step={0.1}
                value={maxWalkingKm}
                onChange={(e) => setMaxWalkingKm(Number(e.target.value))}
                className="w-full accent-[#5F2CFF]"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>0.3 km (Short)</span>
                <span>1.5 km (Moderate)</span>
                <span>3.0 km (Active)</span>
              </div>
            </div>

            {/* Maximum Transfers */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Maximum Line Transfers
                </label>
                <span className="text-sm font-extrabold font-display text-[#5F2CFF] tabular-nums">
                  {maxTransfers === 0 ? 'Direct only' : `${maxTransfers} max`}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 mt-2">
                {[0, 1, 2, 3].map((val) => (
                  <button
                    type="button"
                    key={val}
                    onClick={() => setMaxTransfers(val)}
                    className={`py-2 text-xs font-bold rounded-xl transition-all ${
                      maxTransfers === val
                        ? 'bg-[#5F2CFF] text-white shadow-xs'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {val === 0 ? 'Direct' : val}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Preferred Transport Modes */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
          <h3 className="text-base font-bold text-[#0B0B12] mb-1">
            Preferred Transport Modes
          </h3>
          <p className="text-xs text-slate-500 mb-5">
            Choose which transit vehicles to include in route searches:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { mode: 'metro' as TransportMode, label: 'Metro', icon: Train },
              { mode: 'bus' as TransportMode, label: 'Bus', icon: Bus },
              { mode: 'train' as TransportMode, label: 'Suburban Train', icon: Train },
              { mode: 'cab' as TransportMode, label: 'Cab', icon: Car },
              { mode: 'bike' as TransportMode, label: 'Bike', icon: Bike },
              { mode: 'walk' as TransportMode, label: 'Walking', icon: Footprints }
            ].map(({ mode, label, icon: Icon }) => {
              const isChecked = preferredModes.includes(mode);

              return (
                <button
                  type="button"
                  key={mode}
                  onClick={() => toggleMode(mode)}
                  className={`p-3.5 rounded-2xl border text-center flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                    isChecked
                      ? 'bg-[#DFF6FF]/60 border-[#5F2CFF] text-[#0B0B12] font-bold shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-400 opacity-60'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      isChecked ? 'bg-[#5F2CFF] text-white' : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs">{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 4: Accessibility & Comfort */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <Accessibility className="w-4 h-4 text-[#5F2CFF]" />
            <h3 className="text-base font-bold text-[#0B0B12]">
              Accessibility & Comfort
            </h3>
          </div>
          <p className="text-xs text-slate-500 mb-5">
            Optimize routes for step-free travel and universal access:
          </p>

          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3.5 rounded-2xl border border-slate-200/80 hover:bg-slate-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={wheelchairFriendly}
                onChange={(e) => setWheelchairFriendly(e.target.checked)}
                className="w-4 h-4 rounded text-[#5F2CFF] focus:ring-[#5F2CFF] accent-[#5F2CFF]"
              />
              <div>
                <div className="text-xs font-bold text-[#0B0B12]">
                  Wheelchair friendly routes only
                </div>
                <div className="text-[11px] text-slate-500">
                  Prioritize stations and vehicles with operational elevators, ramps, and level boarding.
                </div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3.5 rounded-2xl border border-slate-200/80 hover:bg-slate-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={avoidStairs}
                onChange={(e) => setAvoidStairs(e.target.checked)}
                className="w-4 h-4 rounded text-[#5F2CFF] focus:ring-[#5F2CFF] accent-[#5F2CFF]"
              />
              <div>
                <div className="text-xs font-bold text-[#0B0B12]">
                  Avoid stairs & heavy footbridges
                </div>
                <div className="text-[11px] text-slate-500">
                  Route via escalators, lifts, and ground-level street crossings.
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Submit Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#5F2CFF] hover:bg-[#5F2CFF]/90 text-white font-bold text-sm shadow-md shadow-[#5F2CFF]/25 hover:shadow-lg transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};
