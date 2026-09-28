import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  JourneySearchQuery,
  JourneySearchResult,
  JourneyPreference,
  Route,
  SavedJourney,
  JourneyHistory,
  UserPreferences
} from '../types/journey';
import { JourneyService } from '../services/journeyService';
import { DEFAULT_USER_PREFERENCES } from '../data/demoJourneys';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'info' | 'warning' | 'error';
}

interface JourneyContextType {
  searchResult: JourneySearchResult | null;
  isLoading: boolean;
  error: string | null;
  userPreferences: UserPreferences;
  savedJourneys: SavedJourney[];
  history: JourneyHistory[];
  toasts: ToastMessage[];
  performSearch: (query: JourneySearchQuery) => Promise<JourneySearchResult | null>;
  changePreference: (newPref: JourneyPreference) => Promise<void>;
  saveCurrentJourney: (title?: string, notes?: string) => Promise<SavedJourney | null>;
  removeSavedJourney: (id: string) => Promise<void>;
  updateUserPreferences: (prefs: UserPreferences) => Promise<void>;
  clearAllHistory: () => Promise<void>;
  refreshHistory: () => Promise<void>;
  showToast: (title: string, description?: string, type?: ToastMessage['type']) => void;
  dismissToast: (id: string) => void;
}

const JourneyContext = createContext<JourneyContextType | undefined>(undefined);

export const JourneyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [searchResult, setSearchResult] = useState<JourneySearchResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>(DEFAULT_USER_PREFERENCES);
  const [savedJourneys, setSavedJourneys] = useState<SavedJourney[]>([]);
  const [history, setHistory] = useState<JourneyHistory[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Initial load
  useEffect(() => {
    const loadInitialState = async () => {
      try {
        const [prefs, saved, hist, lastSearch] = await Promise.all([
          JourneyService.getPreferences(),
          JourneyService.getSavedJourneys(),
          JourneyService.getJourneyHistory(),
          JourneyService.getLastSearchResult()
        ]);
        setUserPreferences(prefs);
        setSavedJourneys(saved);
        setHistory(hist);
        setSearchResult(lastSearch);
      } catch (err) {
        console.error('Error initializing journey state:', err);
      }
    };
    loadInitialState();
  }, []);

  const showToast = (
    title: string,
    description?: string,
    type: ToastMessage['type'] = 'success'
  ) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const performSearch = async (query: JourneySearchQuery): Promise<JourneySearchResult | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await JourneyService.searchJourneys(query);
      setSearchResult(result);
      // Refresh history list since search records into history
      const updatedHistory = await JourneyService.getJourneyHistory();
      setHistory(updatedHistory);
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to search journeys';
      setError(msg);
      showToast('Search Failed', msg, 'error');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const changePreference = async (newPref: JourneyPreference) => {
    if (!searchResult) return;
    setIsLoading(true);
    try {
      const updatedRoutes = await JourneyService.recalculateJourney(
        searchResult.routes,
        newPref,
        {
          maxBudget: searchResult.query.maxBudget,
          maxTransfers: searchResult.query.maxTransfers,
          maxWalkingKm: searchResult.query.maxWalkingKm,
          wheelchairAccessible: searchResult.query.wheelchairAccessible
        }
      );

      const recommended = updatedRoutes[0] || searchResult.routes[0];
      setSearchResult({
        ...searchResult,
        query: { ...searchResult.query, preference: newPref },
        routes: updatedRoutes,
        recommendedRouteId: recommended.id
      });
      showToast(
        'Priority Updated',
        `Re-ranked routes for "${newPref.replace('_', ' ')}"`
      );
    } catch (err) {
      console.error('Failed to update preference:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const saveCurrentJourney = async (title?: string, notes?: string): Promise<SavedJourney | null> => {
    if (!searchResult) return null;
    const recommended = searchResult.routes.find(
      (r) => r.id === searchResult.recommendedRouteId
    ) || searchResult.routes[0];

    try {
      const saved = await JourneyService.saveJourney({
        title: title || `${searchResult.origin.name} → ${searchResult.destination.name}`,
        origin: searchResult.origin,
        destination: searchResult.destination,
        usualDuration: recommended.duration,
        usualCost: recommended.cost,
        preferredMode: recommended.transportModes[1] || recommended.transportModes[0] || 'metro',
        preference: searchResult.query.preference,
        notes: notes || `Optimal route: ${recommended.name} (${recommended.duration} min)`
      });

      const updated = await JourneyService.getSavedJourneys();
      setSavedJourneys(updated);
      showToast('Journey Saved', `Added to your saved journeys`);
      return saved;
    } catch (err) {
      showToast('Failed to save', 'Could not save journey', 'error');
      return null;
    }
  };

  const removeSavedJourney = async (id: string) => {
    try {
      await JourneyService.deleteSavedJourney(id);
      setSavedJourneys((prev) => prev.filter((item) => item.id !== id));
      showToast('Removed', 'Journey removed from saved list');
    } catch (err) {
      showToast('Error', 'Failed to delete journey', 'error');
    }
  };

  const updateUserPreferences = async (prefs: UserPreferences) => {
    try {
      const updated = await JourneyService.updatePreferences(prefs);
      setUserPreferences(updated);
      showToast('Preferences Saved', 'Your travel profile has been updated');
    } catch (err) {
      showToast('Error', 'Failed to save preferences', 'error');
    }
  };

  const clearAllHistory = async () => {
    try {
      await JourneyService.clearJourneyHistory();
      setHistory([]);
      showToast('History Cleared', 'All past journey records cleared');
    } catch (err) {
      showToast('Error', 'Failed to clear history', 'error');
    }
  };

  const refreshHistory = async () => {
    const hist = await JourneyService.getJourneyHistory();
    setHistory(hist);
  };

  return (
    <JourneyContext.Provider
      value={{
        searchResult,
        isLoading,
        error,
        userPreferences,
        savedJourneys,
        history,
        toasts,
        performSearch,
        changePreference,
        saveCurrentJourney,
        removeSavedJourney,
        updateUserPreferences,
        clearAllHistory,
        refreshHistory,
        showToast,
        dismissToast
      }}
    >
      {children}
    </JourneyContext.Provider>
  );
};

export const useJourney = (): JourneyContextType => {
  const context = useContext(JourneyContext);
  if (!context) {
    throw new Error('useJourney must be used within a JourneyProvider');
  }
  return context;
};
