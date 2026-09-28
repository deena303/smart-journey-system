export type TransportMode = 'metro' | 'bus' | 'train' | 'cab' | 'bike' | 'walk';

export type BatteryMode = 'normal' | 'saver' | 'critical';

export type JourneyPreference =
  | 'balanced'
  | 'save_time'
  | 'save_money'
  | 'eco_friendly'
  | 'less_walking'
  | 'fewer_transfers';

export interface Location {
  id: string;
  name: string;
  area: string;
  landmark?: string;
  latitude?: number;
  longitude?: number;
  type?: 'transit_hub' | 'airport' | 'commercial' | 'beach' | 'residential';
  coordinates: {
    x: number; // percentage in simulated map (0 to 100)
    y: number; // percentage in simulated map (0 to 100)
    lat: number;
    lng: number;
  };
}

export interface RouteNextAction {
  step: string;
  duration: number; // in minutes
  distance: string; // e.g. "450 m"
  transportMode: TransportMode;
  details: string;
  thenAction?: string;
}

export interface RouteSegment {
  id: string;
  mode: TransportMode;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  duration: number; // in minutes
  distance: number; // in km
  lineName?: string;
  stopsCount?: number;
  instructions?: string;
  color?: string;
  accessibility?: boolean;
  geometry?: [number, number][]; // [longitude, latitude]
}

export interface JourneyScoreBreakdown {
  overall: number; // 0 - 100
  label: string; // e.g. "Excellent match", "Very good", "Moderate"
  timeScore: number;
  costScore: number;
  transferScore: number;
  walkingScore: number;
  ecoScore: number;
}

export interface Route {
  id: string;
  name: string;
  tag?: 'recommended' | 'fastest' | 'cheapest' | 'eco';
  summary: string;
  duration: number; // in minutes
  distance: number; // in km
  cost: number; // in INR (₹)
  walkingDistance: number; // in km
  walkingDuration: number; // in minutes
  transfers: number;
  emissions: number; // in grams of CO2
  transportModes: TransportMode[];
  score: number; // 0 - 100
  scoreBreakdown: JourneyScoreBreakdown;
  segments: RouteSegment[];
  geometry?: [number, number][]; // [longitude, latitude] array for OpenStreetMap / MapLibre line
  isAccessible?: boolean;
  // Battery-Aware & Low-Interaction Metrics
  interactionCount: number; // e.g. 1 for Cab, 2 for Metro, 5 for Bus+Bus
  interactionScore: number; // 0-100 rating for friction/number of app & vehicle interactions
  batteryAwareScore?: number;
  nextAction?: RouteNextAction;
}

export interface JourneySearchQuery {
  origin: Location | null;
  destination: Location | null;
  departureTime: string;
  preference: JourneyPreference;
  maxBudget?: number;
  maxTransfers?: number;
  maxWalkingKm?: number;
  wheelchairAccessible?: boolean;
}

export interface JourneySearchResult {
  query: JourneySearchQuery;
  origin: Location;
  destination: Location;
  departureTime: string;
  routes: Route[];
  recommendedRouteId: string;
  fastestRouteId: string;
  cheapestRouteId: string;
  ecoRouteId: string;
  timestamp: string;
}

export interface SavedJourney {
  id: string;
  title: string;
  origin: Location;
  destination: Location;
  usualDuration: number;
  usualCost: number;
  preferredMode: TransportMode;
  preference: JourneyPreference;
  savedAt: string;
  notes?: string;
}

export interface JourneyHistory {
  id: string;
  date: string; // ISO date string
  origin: Location;
  destination: Location;
  routeName: string;
  duration: number;
  cost: number;
  distance: number;
  preference: JourneyPreference;
  transportModes: TransportMode[];
  status: 'completed' | 'planned';
}

export interface UserPreferences {
  defaultPriority: JourneyPreference;
  maxWalkingDistanceKm: number;
  maxTransfers: number;
  preferredModes: TransportMode[];
  wheelchairFriendly: boolean;
  avoidStairs: boolean;
  notifyDelays: boolean;
}
