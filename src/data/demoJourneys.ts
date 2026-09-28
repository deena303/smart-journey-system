import { SavedJourney, JourneyHistory, UserPreferences, Location } from '../types/journey';
import { DEMO_LOCATIONS } from './demoLocations';

const central = DEMO_LOCATIONS[0];
const airport = DEMO_LOCATIONS[1];
const tnagar = DEMO_LOCATIONS[2];
const guindy = DEMO_LOCATIONS[3];
const annanagar = DEMO_LOCATIONS[4];
const marina = DEMO_LOCATIONS[6];
const velachery = DEMO_LOCATIONS[7];
const adyar = DEMO_LOCATIONS[8];

export interface RecentJourneyItem {
  id: string;
  origin: Location;
  destination: Location;
  title: string;
  preferredMode: 'metro' | 'bus' | 'cab' | 'train';
  lastUsed: string;
  duration: number;
}

export const RECENT_JOURNEYS: RecentJourneyItem[] = [
  {
    id: 'recent-1',
    origin: annanagar,
    destination: guindy,
    title: 'Home → College',
    preferredMode: 'metro',
    lastUsed: 'Yesterday, 8:45 AM',
    duration: 34
  },
  {
    id: 'recent-2',
    origin: central,
    destination: airport,
    title: 'Chennai Central → Airport',
    preferredMode: 'metro',
    lastUsed: '3 days ago',
    duration: 42
  },
  {
    id: 'recent-3',
    origin: tnagar,
    destination: marina,
    title: 'T Nagar → Marina Beach',
    preferredMode: 'bus',
    lastUsed: 'Last Sunday',
    duration: 26
  }
];

export const INITIAL_SAVED_JOURNEYS: SavedJourney[] = [
  {
    id: 'saved-1',
    title: 'Home → College',
    origin: annanagar,
    destination: guindy,
    usualDuration: 34,
    usualCost: 45,
    preferredMode: 'metro',
    preference: 'balanced',
    savedAt: '2026-09-20',
    notes: 'Morning college run via Anna Nagar Tower Metro to Guindy station'
  },
  {
    id: 'saved-2',
    title: 'Home → Office',
    origin: tnagar,
    destination: velachery,
    usualDuration: 28,
    usualCost: 35,
    preferredMode: 'bus',
    preference: 'save_time',
    savedAt: '2026-09-18',
    notes: 'Daily tech corridor commute via bypass bus 570 or cab during rain'
  },
  {
    id: 'saved-3',
    title: 'College → Home',
    origin: guindy,
    destination: annanagar,
    usualDuration: 35,
    usualCost: 45,
    preferredMode: 'metro',
    preference: 'fewer_transfers',
    savedAt: '2026-09-22',
    notes: 'Evening return via direct green line line interchange'
  }
];

export const INITIAL_JOURNEY_HISTORY: JourneyHistory[] = [
  {
    id: 'hist-1',
    date: '2026-09-27T09:10:00Z',
    origin: central,
    destination: airport,
    routeName: 'Metro + Walk',
    duration: 42,
    cost: 55,
    distance: 18.7,
    preference: 'balanced',
    transportModes: ['walk', 'metro', 'walk'],
    status: 'completed'
  },
  {
    id: 'hist-2',
    date: '2026-09-26T14:30:00Z',
    origin: tnagar,
    destination: marina,
    routeName: 'Bus (MTC Transit)',
    duration: 28,
    cost: 20,
    distance: 8.4,
    preference: 'save_money',
    transportModes: ['walk', 'bus', 'walk'],
    status: 'completed'
  },
  {
    id: 'hist-3',
    date: '2026-09-25T19:15:00Z',
    origin: guindy,
    destination: annanagar,
    routeName: 'Metro Direct',
    duration: 32,
    cost: 45,
    distance: 14.2,
    preference: 'save_time',
    transportModes: ['walk', 'metro', 'walk'],
    status: 'completed'
  },
  {
    id: 'hist-4',
    date: '2026-09-22T08:00:00Z',
    origin: velachery,
    destination: adyar,
    routeName: 'Cab Express',
    duration: 18,
    cost: 160,
    distance: 7.1,
    preference: 'save_time',
    transportModes: ['cab'],
    status: 'completed'
  },
  {
    id: 'hist-5',
    date: '2026-09-15T11:20:00Z',
    origin: central,
    destination: tnagar,
    routeName: 'Metro + Walk',
    duration: 22,
    cost: 35,
    distance: 9.8,
    preference: 'eco_friendly',
    transportModes: ['walk', 'metro', 'walk'],
    status: 'completed'
  }
];

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  defaultPriority: 'balanced',
  maxWalkingDistanceKm: 1.5,
  maxTransfers: 2,
  preferredModes: ['metro', 'bus', 'train', 'cab', 'walk'],
  wheelchairFriendly: false,
  avoidStairs: false,
  notifyDelays: true
};
