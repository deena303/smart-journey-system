import React, { useState, useRef, useEffect } from 'react';
import { Location } from '../../types/journey';
import { searchLocations, DEMO_LOCATIONS } from '../../data/demoLocations';
import { MapPin, Navigation, Search, X } from 'lucide-react';

interface LocationAutocompleteProps {
  label: string;
  placeholder: string;
  value: Location | null;
  onChange: (loc: Location | null) => void;
  icon?: 'origin' | 'destination';
  excludeId?: string;
  required?: boolean;
}

export const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({
  label,
  placeholder,
  value,
  onChange,
  icon = 'origin',
  excludeId
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState(value ? value.name : '');
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      setInputText(value.name);
    } else {
      setInputText('');
    }
  }, [value]);

  useEffect(() => {
    const filtered = searchLocations(inputText).filter((loc) => loc.id !== excludeId);
    setSuggestions(filtered);
  }, [inputText, excludeId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (loc: Location) => {
    onChange(loc);
    setInputText(loc.name);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    setInputText('');
    setIsOpen(true);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <label className="block text-xs font-semibold tracking-wider uppercase text-slate-500 mb-1.5">
        {label}
      </label>

      <div
        className={`relative flex items-center bg-white border rounded-xl px-3.5 py-3 transition-all ${
          isOpen
            ? 'border-[#5F2CFF] ring-2 ring-[#5F2CFF]/15 shadow-sm'
            : 'border-slate-200/90 hover:border-slate-300'
        }`}
      >
        <div className="shrink-0 mr-3">
          {icon === 'origin' ? (
            <div className="w-6 h-6 rounded-full bg-[#DFF6FF] flex items-center justify-center text-[#5F2CFF]">
              <Navigation className="w-3.5 h-3.5" />
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
              <MapPin className="w-3.5 h-3.5" />
            </div>
          )}
        </div>

        <input
          type="text"
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm font-medium text-[#0B0B12] placeholder-slate-400 focus:outline-hidden"
        />

        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-md transition-colors"
            aria-label="Clear location"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Autocomplete suggestions dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-white rounded-xl shadow-xl border border-slate-200/90 max-h-64 overflow-y-auto py-1">
          <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Popular Chennai Locations
          </div>
          {suggestions.length > 0 ? (
            suggestions.map((loc) => {
              const isSelected = value?.id === loc.id;
              return (
                <button
                  type="button"
                  key={loc.id}
                  onClick={() => handleSelect(loc)}
                  className={`w-full text-left px-3.5 py-2.5 flex items-center justify-between text-xs transition-colors ${
                    isSelected
                      ? 'bg-[#DFF6FF]/60 text-[#5F2CFF]'
                      : 'hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <div className="truncate">
                      <div className="font-semibold text-xs text-[#0B0B12] truncate">
                        {loc.name}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {loc.area} {loc.landmark ? `· ${loc.landmark}` : ''}
                      </div>
                    </div>
                  </div>
                  {loc.type && (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 shrink-0 ml-2">
                      {loc.type === 'transit_hub'
                        ? 'Hub'
                        : loc.type === 'airport'
                        ? 'Airport'
                        : loc.type === 'beach'
                        ? 'Beach'
                        : 'Area'}
                    </span>
                  )}
                </button>
              );
            })
          ) : (
            <div className="p-4 text-center text-xs text-slate-500">
              No matching locations found
            </div>
          )}
        </div>
      )}
    </div>
  );
};
