import { Location } from '../types/journey';

export const DEMO_LOCATIONS: Location[] = [
  {
    id: 'chennai-central',
    name: 'Chennai Central',
    area: 'Park Town / George Town',
    landmark: 'Puratchi Thalaivar Dr. M.G. Ramachandran Central Railway Station',
    type: 'transit_hub',
    latitude: 13.0827,
    longitude: 80.2707,
    coordinates: { x: 58, y: 22, lat: 13.0827, lng: 80.2707 }
  },
  {
    id: 'chennai-airport',
    name: 'Chennai Airport',
    area: 'Meenambakkam',
    landmark: 'Chennai International Airport (MAA) Terminals 1-4',
    type: 'airport',
    latitude: 12.9941,
    longitude: 80.1709,
    coordinates: { x: 38, y: 82, lat: 12.9941, lng: 80.1709 }
  },
  {
    id: 't-nagar',
    name: 'T Nagar',
    area: 'Thyagaraya Nagar',
    landmark: 'Panagal Park / Usman Road Shopping Hub',
    type: 'commercial',
    latitude: 13.0418,
    longitude: 80.2337,
    coordinates: { x: 48, y: 52, lat: 13.0418, lng: 80.2337 }
  },
  {
    id: 'guindy',
    name: 'Guindy',
    area: 'Guindy Industrial Estate',
    landmark: 'Kathipara Junction & Guindy Metro / Suburban Interchange',
    type: 'transit_hub',
    latitude: 13.0067,
    longitude: 80.2023,
    coordinates: { x: 42, y: 64, lat: 13.0067, lng: 80.2023 }
  },
  {
    id: 'anna-nagar',
    name: 'Anna Nagar',
    area: 'Anna Nagar West / East',
    landmark: 'Anna Nagar Roundtana / Tower Park',
    type: 'residential',
    latitude: 13.0850,
    longitude: 80.2101,
    coordinates: { x: 36, y: 28, lat: 13.0850, lng: 80.2101 }
  },
  {
    id: 'tambaram',
    name: 'Tambaram',
    area: 'Tambaram Sanatorium',
    landmark: 'Tambaram Railway Terminal & Southern Gateway',
    type: 'transit_hub',
    latitude: 12.9249,
    longitude: 80.1000,
    coordinates: { x: 28, y: 92, lat: 12.9249, lng: 80.1000 }
  },
  {
    id: 'marina-beach',
    name: 'Marina Beach',
    area: 'Triplicane / Mylapore Coast',
    landmark: 'Kamarajar Salai / Light House & Promenade',
    type: 'beach',
    latitude: 13.0500,
    longitude: 80.2824,
    coordinates: { x: 68, y: 44, lat: 13.0500, lng: 80.2824 }
  },
  {
    id: 'velachery',
    name: 'Velachery',
    area: 'Velachery Main Road',
    landmark: 'Phoenix Marketcity & MRTS Velachery Terminal',
    type: 'commercial',
    latitude: 12.9759,
    longitude: 80.2212,
    coordinates: { x: 52, y: 72, lat: 12.9759, lng: 80.2212 }
  },
  {
    id: 'adyar',
    name: 'Adyar',
    area: 'Adyar Circle',
    landmark: 'Gandhi Mandapam Road / Malar Hospital',
    type: 'residential',
    latitude: 13.0012,
    longitude: 80.2565,
    coordinates: { x: 62, y: 60, lat: 13.0012, lng: 80.2565 }
  },
  {
    id: 'egmore',
    name: 'Chennai Egmore',
    area: 'Egmore',
    landmark: 'Egmore Railway Station & Government Museum',
    type: 'transit_hub',
    latitude: 13.0784,
    longitude: 80.2607,
    coordinates: { x: 54, y: 32, lat: 13.0784, lng: 80.2607 }
  }
];

export const getLocationById = (id: string): Location | undefined => {
  return DEMO_LOCATIONS.find((loc) => loc.id === id);
};

export const searchLocations = (query: string): Location[] => {
  if (!query || query.trim().length === 0) return DEMO_LOCATIONS.slice(0, 5);
  const q = query.toLowerCase().trim();
  return DEMO_LOCATIONS.filter(
    (loc) =>
      loc.name.toLowerCase().includes(q) ||
      loc.area.toLowerCase().includes(q) ||
      (loc.landmark && loc.landmark.toLowerCase().includes(q))
  );
};
