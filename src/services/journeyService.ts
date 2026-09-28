import {
  JourneySearchQuery,
  JourneySearchResult,
  Route,
  SavedJourney,
  JourneyHistory,
  UserPreferences,
  Location,
  JourneyPreference
} from '../types/journey';
import { DEMO_LOCATIONS, getLocationById } from '../data/demoLocations';
import { generateRoutesForPair, CHENNAI_CENTRAL_TO_AIRPORT_ROUTES } from '../data/demoRoutes';
import {
  INITIAL_SAVED_JOURNEYS,
  INITIAL_JOURNEY_HISTORY,
  DEFAULT_USER_PREFERENCES
} from '../data/demoJourneys';
import { rankRoutes, RouteFilterConstraints } from '../utils/routeRanking';
import { simulateWhatIf, WhatIfSimulationResult } from '../utils/recommendationEngine';

const STORAGE_KEYS = {
  SAVED_JOURNEYS: 'journeyiq_saved_journeys_v1',
  HISTORY: 'journeyiq_history_v1',
  PREFERENCES: 'journeyiq_user_preferences_v1',
  LAST_SEARCH: 'journeyiq_last_search_result_v1'
};

const getLocalData = <T>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : fallback;
  } catch (err) {
    console.error(`Error reading ${key} from localStorage:`, err);
    return fallback;
  }
};

const setLocalData = <T>(key: string, data: T): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error writing ${key} to localStorage:`, err);
  }
};

/**
 * Journey Service Layer
 * Abstracted API designed to be swapped with direct Supabase / Backend API calls
 */
export class JourneyService {
  /**
   * Search routes between origin and destination with specific preferences and constraints
   */
  static async searchJourneys(query: JourneySearchQuery): Promise<JourneySearchResult> {
    // Simulated network latency
    await new Promise((resolve) => setTimeout(resolve, 300));

    const origin = query.origin || DEMO_LOCATIONS[0];
    const destination = query.destination || DEMO_LOCATIONS[1];
    const departureTime = query.departureTime || '09:10';
    const preference = query.preference || 'balanced';

    // Base route pool
    const baseRoutes = generateRoutesForPair(origin, destination, departureTime);

    // Apply ranking and constraints
    const rankedRoutes = rankRoutes(baseRoutes, preference, {
      maxBudget: query.maxBudget,
      maxTransfers: query.maxTransfers,
      maxWalkingKm: query.maxWalkingKm,
      wheelchairAccessible: query.wheelchairAccessible
    });

    const recommendedRoute = rankedRoutes[0] || baseRoutes[0];
    const fastestRoute = [...rankedRoutes].sort((a, b) => a.duration - b.duration)[0];
    const cheapestRoute = [...rankedRoutes].sort((a, b) => a.cost - b.cost)[0];
    const ecoRoute = [...rankedRoutes].sort((a, b) => a.emissions - b.emissions)[0];

    const result: JourneySearchResult = {
      query,
      origin,
      destination,
      departureTime,
      routes: rankedRoutes,
      recommendedRouteId: recommendedRoute.id,
      fastestRouteId: fastestRoute?.id || recommendedRoute.id,
      cheapestRouteId: cheapestRoute?.id || recommendedRoute.id,
      ecoRouteId: ecoRoute?.id || recommendedRoute.id,
      timestamp: new Date().toISOString()
    };

    setLocalData(STORAGE_KEYS.LAST_SEARCH, result);

    // Automatically record search into history if not duplicate
    this.recordHistory({
      id: `hist-${Date.now()}`,
      date: new Date().toISOString(),
      origin,
      destination,
      routeName: recommendedRoute.name,
      duration: recommendedRoute.duration,
      cost: recommendedRoute.cost,
      distance: recommendedRoute.distance,
      preference,
      transportModes: recommendedRoute.transportModes,
      status: 'planned'
    }).catch(console.error);

    return result;
  }

  /**
   * Retrieve cached last search result or default demo result
   */
  static async getLastSearchResult(): Promise<JourneySearchResult> {
    const cached = getLocalData<JourneySearchResult | null>(STORAGE_KEYS.LAST_SEARCH, null);
    if (cached) return cached;

    // Default to Chennai Central -> Chennai Airport
    const origin = DEMO_LOCATIONS[0];
    const destination = DEMO_LOCATIONS[1];
    return this.searchJourneys({
      origin,
      destination,
      departureTime: '09:10',
      preference: 'balanced'
    });
  }

  /**
   * Get all routes for a specific search or route ID lookup
   */
  static async getRoutes(originId?: string, destinationId?: string): Promise<Route[]> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const origin = (originId && getLocationById(originId)) || DEMO_LOCATIONS[0];
    const destination = (destinationId && getLocationById(destinationId)) || DEMO_LOCATIONS[1];
    return generateRoutesForPair(origin, destination);
  }

  /**
   * Get specific route by its ID
   */
  static async getRouteById(routeId: string): Promise<Route | undefined> {
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Check last search result first
    const lastResult = getLocalData<JourneySearchResult | null>(STORAGE_KEYS.LAST_SEARCH, null);
    if (lastResult) {
      const found = lastResult.routes.find((r) => r.id === routeId);
      if (found) return found;
    }

    // Check canonical demo routes
    const canonical = CHENNAI_CENTRAL_TO_AIRPORT_ROUTES.find((r) => r.id === routeId);
    if (canonical) return canonical;

    // Generate fallback default
    const all = generateRoutesForPair(DEMO_LOCATIONS[0], DEMO_LOCATIONS[1]);
    return all.find((r) => r.id === routeId) || all[0];
  }

  /**
   * Recalculate routes with new preference or constraints
   */
  static async recalculateJourney(
    currentRoutes: Route[],
    preference: JourneyPreference,
    constraints?: RouteFilterConstraints
  ): Promise<Route[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return rankRoutes(currentRoutes, preference, constraints);
  }

  /**
   * Execute What-If simulation
   */
  static async executeWhatIf(
    routes: Route[],
    currentRouteId: string,
    newPreference: JourneyPreference,
    constraints: RouteFilterConstraints
  ): Promise<WhatIfSimulationResult> {
    await new Promise((resolve) => setTimeout(resolve, 250));
    return simulateWhatIf(routes, currentRouteId, newPreference, constraints);
  }

  /**
   * Saved Journeys
   */
  static async getSavedJourneys(): Promise<SavedJourney[]> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return getLocalData<SavedJourney[]>(STORAGE_KEYS.SAVED_JOURNEYS, INITIAL_SAVED_JOURNEYS);
  }

  static async saveJourney(journey: Omit<SavedJourney, 'id' | 'savedAt'>): Promise<SavedJourney> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const saved = getLocalData<SavedJourney[]>(STORAGE_KEYS.SAVED_JOURNEYS, INITIAL_SAVED_JOURNEYS);
    const newEntry: SavedJourney = {
      ...journey,
      id: `saved-${Date.now()}`,
      savedAt: new Date().toISOString()
    };
    const updated = [newEntry, ...saved];
    setLocalData(STORAGE_KEYS.SAVED_JOURNEYS, updated);
    return newEntry;
  }

  static async updateSavedJourney(id: string, updates: Partial<SavedJourney>): Promise<SavedJourney | null> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const saved = getLocalData<SavedJourney[]>(STORAGE_KEYS.SAVED_JOURNEYS, INITIAL_SAVED_JOURNEYS);
    const index = saved.findIndex((item) => item.id === id);
    if (index === -1) return null;
    const updated = { ...saved[index], ...updates };
    saved[index] = updated;
    setLocalData(STORAGE_KEYS.SAVED_JOURNEYS, saved);
    return updated;
  }

  static async deleteSavedJourney(id: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const saved = getLocalData<SavedJourney[]>(STORAGE_KEYS.SAVED_JOURNEYS, INITIAL_SAVED_JOURNEYS);
    const filtered = saved.filter((item) => item.id !== id);
    setLocalData(STORAGE_KEYS.SAVED_JOURNEYS, filtered);
    return true;
  }

  /**
   * Journey History
   */
  static async getJourneyHistory(): Promise<JourneyHistory[]> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return getLocalData<JourneyHistory[]>(STORAGE_KEYS.HISTORY, INITIAL_JOURNEY_HISTORY);
  }

  static async recordHistory(item: JourneyHistory): Promise<void> {
    const history = getLocalData<JourneyHistory[]>(STORAGE_KEYS.HISTORY, INITIAL_JOURNEY_HISTORY);
    // Prevent immediate duplicate entries
    if (
      history.length > 0 &&
      history[0].origin.id === item.origin.id &&
      history[0].destination.id === item.destination.id &&
      history[0].routeName === item.routeName
    ) {
      return;
    }
    const updated = [item, ...history].slice(0, 25);
    setLocalData(STORAGE_KEYS.HISTORY, updated);
  }

  static async clearJourneyHistory(): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    setLocalData(STORAGE_KEYS.HISTORY, []);
    return true;
  }

  /**
   * User Preferences
   */
  static async getPreferences(): Promise<UserPreferences> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return getLocalData<UserPreferences>(STORAGE_KEYS.PREFERENCES, DEFAULT_USER_PREFERENCES);
  }

  static async updatePreferences(preferences: UserPreferences): Promise<UserPreferences> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    setLocalData(STORAGE_KEYS.PREFERENCES, preferences);
    return preferences;
  }
}
