import { Route, TransportMode, Location } from '../types/journey';

// Canonical route geometry for Chennai Central -> Airport
const METRO_WALK_GEOMETRY: [number, number][] = [
  [80.2707, 13.0827], // Chennai Central
  [80.2721, 13.0780],
  [80.2715, 13.0673], // Government Estate
  [80.2642, 13.0588], // LIC
  [80.2541, 13.0519], // Thousand Lights
  [80.2472, 13.0441], // AG-DMS
  [80.2435, 13.0375], // Teynampet
  [80.2378, 13.0298], // Nandanam
  [80.2245, 13.0210], // Saidapet
  [80.2185, 13.0135], // Little Mount
  [80.2023, 13.0067], // Guindy
  [80.1985, 13.0035], // Alandur
  [80.1872, 12.9982], // Nanganallur Road
  [80.1795, 12.9960], // Meenambakkam
  [80.1709, 12.9941], // Chennai Airport Metro
  [80.1695, 12.9928]  // Terminal 1 Departures
];

const CAB_GEOMETRY: [number, number][] = [
  [80.2707, 13.0827], // Central
  [80.2680, 13.0780], // EVR Periyar Salai
  [80.2620, 13.0650], // Anna Salai
  [80.2500, 13.0510], // Gemini Flyover
  [80.2390, 13.0330], // Teynampet
  [80.2280, 13.0220], // Saidapet Bridge
  [80.2050, 13.0070], // Kathipara Grade Separator
  [80.1900, 12.9990], // GST Road Expressway
  [80.1770, 12.9950], // Airport Flyover
  [80.1709, 12.9941]  // Airport Drop-off
];

const BUS_GEOMETRY: [number, number][] = [
  [80.2707, 13.0827],
  [80.2718, 13.0800],
  [80.2700, 13.0650],
  [80.2580, 13.0530],
  [80.2450, 13.0390],
  [80.2300, 13.0240], // Saidapet
  [80.2150, 13.0120],
  [80.2023, 13.0067], // Guindy
  [80.1880, 12.9985],
  [80.1740, 12.9948],
  [80.1709, 12.9941]
];

const ECO_METRO_GEOMETRY: [number, number][] = [
  [80.2707, 13.0827],
  [80.2690, 13.0730],
  [80.2610, 13.0570],
  [80.2490, 13.0450],
  [80.2360, 13.0310],
  [80.2210, 13.0180],
  [80.2023, 13.0067],
  [80.1920, 13.0010],
  [80.1790, 12.9960],
  [80.1709, 12.9941]
];

export const CHENNAI_CENTRAL_TO_AIRPORT_ROUTES: Route[] = [
  {
    id: 'route-central-airport-metro-walk',
    name: 'Metro + Walk',
    tag: 'recommended',
    summary: 'Central Metro Blue Line direct to Airport with short station walks',
    duration: 42,
    distance: 18.7,
    cost: 55,
    walkingDistance: 0.7,
    walkingDuration: 9,
    transfers: 1,
    emissions: 210, // grams CO2
    transportModes: ['walk', 'metro', 'walk'],
    score: 92,
    interactionCount: 2,
    interactionScore: 88,
    geometry: METRO_WALK_GEOMETRY,
    nextAction: {
      step: 'Walk to Puratchi Thalaivar Central Metro Station',
      duration: 5,
      distance: '450 m',
      transportMode: 'walk',
      details: 'Take the underground pedestrian subway from Central Station concourse to Metro Entrance 2',
      thenAction: 'Board Blue Line direct towards Airport (Platform 2)'
    },
    scoreBreakdown: {
      overall: 92,
      label: 'Excellent match',
      timeScore: 92,
      costScore: 95,
      transferScore: 88,
      walkingScore: 82,
      ecoScore: 96
    },
    isAccessible: true,
    segments: [
      {
        id: 'seg-1',
        mode: 'walk',
        from: 'Chennai Central Railway Concourse',
        to: 'Puratchi Thalaivar Central Metro Station',
        departureTime: '09:10',
        arrivalTime: '09:15',
        duration: 5,
        distance: 0.35,
        geometry: [
          [80.2707, 13.0827],
          [80.2715, 13.0815],
          [80.2721, 13.0780]
        ],
        instructions: 'Take the underground pedestrian subway from Central Station concourse to Metro Entrance 2'
      },
      {
        id: 'seg-2',
        mode: 'metro',
        from: 'Puratchi Thalaivar Central Metro Station',
        to: 'Chennai International Airport Metro Station',
        departureTime: '09:15',
        arrivalTime: '09:43',
        duration: 28,
        distance: 17.8,
        lineName: 'Blue Line (Direct)',
        stopsCount: 14,
        geometry: [
          [80.2721, 13.0780],
          [80.2715, 13.0673],
          [80.2642, 13.0588],
          [80.2541, 13.0519],
          [80.2472, 13.0441],
          [80.2435, 13.0375],
          [80.2378, 13.0298],
          [80.2245, 13.0210],
          [80.2185, 13.0135],
          [80.2023, 13.0067],
          [80.1985, 13.0035],
          [80.1872, 12.9982],
          [80.1795, 12.9960],
          [80.1709, 12.9941]
        ],
        instructions: 'Board Blue Line towards Chennai International Airport. Pass through Government Estate, Saidapet, and Guindy.',
        color: '#5F2CFF'
      },
      {
        id: 'seg-3',
        mode: 'walk',
        from: 'Chennai International Airport Metro Station',
        to: 'Airport Departures Terminal 1',
        departureTime: '09:43',
        arrivalTime: '09:47',
        duration: 4,
        distance: 0.35,
        geometry: [
          [80.1709, 12.9941],
          [80.1700, 12.9935],
          [80.1695, 12.9928]
        ],
        instructions: 'Use the elevated air-conditioned connector bridge directly to T1 Check-in Counters'
      }
    ]
  },
  {
    id: 'route-central-airport-cab',
    name: 'Cab via GST Road',
    tag: 'fastest',
    summary: 'Direct cab ride via Anna Salai and Grand Southern Trunk Road corridor',
    duration: 31,
    distance: 17.9,
    cost: 390,
    walkingDistance: 0.15,
    walkingDuration: 2,
    transfers: 0,
    emissions: 2450,
    transportModes: ['walk', 'cab'],
    score: 84,
    interactionCount: 1,
    interactionScore: 95,
    geometry: CAB_GEOMETRY,
    nextAction: {
      step: 'Walk to Designated Cab Pickup Bay 3',
      duration: 2,
      distance: '150 m',
      transportMode: 'walk',
      details: 'Proceed to Ola/Uber priority pickup bay in front of Moore Market complex',
      thenAction: 'Direct express drive to Terminal Drop-off via GST Road'
    },
    scoreBreakdown: {
      overall: 84,
      label: 'Fastest route',
      timeScore: 98,
      costScore: 52,
      transferScore: 100,
      walkingScore: 98,
      ecoScore: 45
    },
    isAccessible: true,
    segments: [
      {
        id: 'seg-cab-1',
        mode: 'walk',
        from: 'Chennai Central Main Gate',
        to: 'Designated Cab Pickup Bay 3',
        departureTime: '09:10',
        arrivalTime: '09:12',
        duration: 2,
        distance: 0.15,
        geometry: [
          [80.2707, 13.0827],
          [80.2695, 13.0820]
        ],
        instructions: 'Proceed to Ola/Uber priority pickup bay in front of Moore Market complex'
      },
      {
        id: 'seg-cab-2',
        mode: 'cab',
        from: 'Designated Cab Pickup Bay 3',
        to: 'Chennai Airport Departures Drop-off',
        departureTime: '09:12',
        arrivalTime: '09:41',
        duration: 29,
        distance: 17.75,
        lineName: 'Prime Sedan / Fast Track',
        geometry: CAB_GEOMETRY,
        instructions: 'Take EVR Periyar Salai into Anna Salai flyovers, continuing along GST Road past Guindy Kathipara grade separator'
      }
    ]
  },
  {
    id: 'route-central-airport-bus',
    name: 'Bus (MTC Transit)',
    tag: 'cheapest',
    summary: 'Budget MTC deluxe service via Mount Road with 1 transfer at Saidapet',
    duration: 58,
    distance: 20.4,
    cost: 35,
    walkingDistance: 1.1,
    walkingDuration: 12,
    transfers: 2,
    emissions: 620,
    transportModes: ['walk', 'bus', 'walk', 'bus', 'walk'],
    score: 76,
    interactionCount: 5,
    interactionScore: 62,
    geometry: BUS_GEOMETRY,
    nextAction: {
      step: 'Walk to Central Railway Bus Stop',
      duration: 4,
      distance: '250 m',
      transportMode: 'walk',
      details: 'Cross to MTC bus shelter',
      thenAction: 'Board Route 21G, transfer at Saidapet Court'
    },
    scoreBreakdown: {
      overall: 76,
      label: 'Budget friendly',
      timeScore: 68,
      costScore: 99,
      transferScore: 65,
      walkingScore: 70,
      ecoScore: 88
    },
    isAccessible: false,
    segments: [
      {
        id: 'seg-bus-1',
        mode: 'walk',
        from: 'Chennai Central',
        to: 'Central Railway Bus Stop',
        departureTime: '09:10',
        arrivalTime: '09:14',
        duration: 4,
        distance: 0.25,
        instructions: 'Walk across zebra crossing to the MTC bus shelter'
      },
      {
        id: 'seg-bus-2',
        mode: 'bus',
        from: 'Central Railway Bus Stop',
        to: 'Saidapet Court',
        departureTime: '09:14',
        arrivalTime: '09:46',
        duration: 32,
        distance: 11.2,
        lineName: 'MTC Route 21G / 18A Deluxe',
        stopsCount: 16,
        instructions: 'Board bus toward Saidapet. Alight at Saidapet Court bus shelter'
      },
      {
        id: 'seg-bus-3',
        mode: 'walk',
        from: 'Saidapet Court',
        to: 'Saidapet Metro Bus Interchange',
        departureTime: '09:46',
        arrivalTime: '09:48',
        duration: 2,
        distance: 0.15,
        instructions: 'Cross to platform 2 for connecting service'
      },
      {
        id: 'seg-bus-4',
        mode: 'bus',
        from: 'Saidapet Metro Bus Interchange',
        to: 'Airport Junction Halt',
        departureTime: '09:48',
        arrivalTime: '10:04',
        duration: 16,
        distance: 8.3,
        lineName: 'MTC Route B18 / Deluxe AC',
        stopsCount: 7,
        instructions: 'Ride through Guindy and alighting at Airport highway stop'
      },
      {
        id: 'seg-bus-5',
        mode: 'walk',
        from: 'Airport Junction Halt',
        to: 'Airport Terminal 1',
        departureTime: '10:04',
        arrivalTime: '10:10',
        duration: 6,
        distance: 0.7,
        instructions: 'Follow sidewalk up the entry ramp to Terminal 1'
      }
    ]
  },
  {
    id: 'route-central-airport-metro-eco',
    name: 'Metro Eco-Direct',
    tag: 'eco',
    summary: 'Green energy corridor via high-speed Metro Green/Blue interchange',
    duration: 45,
    distance: 19.2,
    cost: 50,
    walkingDistance: 0.5,
    walkingDuration: 7,
    transfers: 1,
    emissions: 180,
    transportModes: ['walk', 'metro', 'walk'],
    score: 90,
    interactionCount: 2,
    interactionScore: 90,
    geometry: ECO_METRO_GEOMETRY,
    nextAction: {
      step: 'Walk to Central Metro Concourse',
      duration: 4,
      distance: '250 m',
      transportMode: 'walk',
      details: 'Pass smart gates to board clean solar-powered train',
      thenAction: 'Ride direct to Airport Metro'
    },
    scoreBreakdown: {
      overall: 90,
      label: 'Lowest carbon footprint',
      timeScore: 89,
      costScore: 96,
      transferScore: 88,
      walkingScore: 88,
      ecoScore: 99
    },
    isAccessible: true,
    segments: [
      {
        id: 'seg-eco-1',
        mode: 'walk',
        from: 'Chennai Central North Gate',
        to: 'Central Metro Concourse',
        departureTime: '09:10',
        arrivalTime: '09:14',
        duration: 4,
        distance: 0.25,
        instructions: 'Walk through ramp to automated smart fare gates'
      },
      {
        id: 'seg-eco-2',
        mode: 'metro',
        from: 'Central Metro Concourse',
        to: 'Chennai International Airport Metro Station',
        departureTime: '09:14',
        arrivalTime: '09:52',
        duration: 38,
        distance: 18.6,
        lineName: 'CMRL 100% Regenerative Electric Fleet',
        stopsCount: 15,
        instructions: 'Board train powered by rooftop solar & regenerative braking grid',
        color: '#5F2CFF'
      },
      {
        id: 'seg-eco-3',
        mode: 'walk',
        from: 'Airport Station',
        to: 'Terminal 1 Departure Lobby',
        departureTime: '09:52',
        arrivalTime: '09:55',
        duration: 3,
        distance: 0.25,
        instructions: 'Walk through air-conditioned glass breezeway'
      }
    ]
  }
];

// Helper to generate dynamic coordinates between any arbitrary start and end location
function generateArcPoints(
  startLng: number,
  startLat: number,
  endLng: number,
  endLat: number,
  curvature: number = 0.005,
  steps: number = 8
): [number, number][] {
  const points: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    // Linear interpolation
    const lng = startLng + (endLng - startLng) * t;
    const lat = startLat + (endLat - startLat) * t;
    // Add subtle organic curve perpendicular to vector
    const perpFactor = Math.sin(t * Math.PI) * curvature;
    const dx = endLng - startLng;
    const dy = endLat - startLat;
    const curvedLng = lng - dy * perpFactor * 10;
    const curvedLat = lat + dx * perpFactor * 10;
    points.push([Number(curvedLng.toFixed(5)), Number(curvedLat.toFixed(5))]);
  }
  return points;
}

// Helper to generate dynamic routes between any two demo locations
export const generateRoutesForPair = (
  origin: Location,
  destination: Location,
  departureTimeStr: string = '09:10'
): Route[] => {
  // If specifically Chennai Central -> Airport, return canonical prompt data
  if (
    origin.id === 'chennai-central' &&
    destination.id === 'chennai-airport'
  ) {
    return CHENNAI_CENTRAL_TO_AIRPORT_ROUTES;
  }

  const startLng = origin.longitude || origin.coordinates.lng;
  const startLat = origin.latitude || origin.coordinates.lat;
  const endLng = destination.longitude || destination.coordinates.lng;
  const endLat = destination.latitude || destination.coordinates.lat;

  // Calculate approximate distance based on coordinates
  const dx = origin.coordinates.x - destination.coordinates.x;
  const dy = origin.coordinates.y - destination.coordinates.y;
  const approxDistance = Math.max(4.2, Math.round(Math.sqrt(dx * dx + dy * dy) * 0.35 * 10) / 10);

  const baseMinutes = Math.round(approxDistance * 1.8);

  const cabDuration = Math.max(16, Math.round(baseMinutes * 0.75));
  const cabCost = Math.round(110 + approxDistance * 18);

  const metroDuration = Math.max(20, Math.round(baseMinutes * 0.95));
  const metroCost = Math.min(60, Math.max(25, Math.round(20 + approxDistance * 1.8)));

  const busDuration = Math.max(28, Math.round(baseMinutes * 1.4));
  const busCost = Math.min(45, Math.max(15, Math.round(12 + approxDistance * 1.2)));

  const trainDuration = Math.max(18, Math.round(baseMinutes * 0.85));
  const trainCost = Math.min(25, Math.max(10, Math.round(5 + approxDistance * 0.8)));

  const metroGeo = generateArcPoints(startLng, startLat, endLng, endLat, 0.003, 10);
  const cabGeo = generateArcPoints(startLng, startLat, endLng, endLat, -0.002, 10);
  const busGeo = generateArcPoints(startLng, startLat, endLng, endLat, 0.006, 12);
  const trainGeo = generateArcPoints(startLng, startLat, endLng, endLat, -0.005, 8);

  return [
    {
      id: `route-${origin.id}-${destination.id}-metro`,
      name: 'Metro + Walk',
      tag: 'recommended',
      summary: `Fast multi-modal connection between ${origin.name} and ${destination.name}`,
      duration: metroDuration + 8,
      distance: approxDistance,
      cost: metroCost,
      walkingDistance: 0.6,
      walkingDuration: 8,
      transfers: 1,
      emissions: Math.round(approxDistance * 12),
      transportModes: ['walk', 'metro', 'walk'],
      score: 91,
      interactionCount: 2,
      interactionScore: 88,
      geometry: metroGeo,
      nextAction: {
        step: `Walk to ${origin.name} Metro Station`,
        duration: 4,
        distance: '300 m',
        transportMode: 'walk',
        details: 'Enter through automated gates to platform',
        thenAction: `Board Metro train towards ${destination.name}`
      },
      scoreBreakdown: {
        overall: 91,
        label: 'Best Smart Balance',
        timeScore: 90,
        costScore: 94,
        transferScore: 89,
        walkingScore: 85,
        ecoScore: 95
      },
      isAccessible: true,
      segments: [
        {
          id: 'seg-dyn-1',
          mode: 'walk',
          from: origin.name,
          to: `${origin.name} Transit Point`,
          departureTime: departureTimeStr,
          arrivalTime: '09:14',
          duration: 4,
          distance: 0.3,
          instructions: `Walk towards ${origin.name} metro concourse`
        },
        {
          id: 'seg-dyn-2',
          mode: 'metro',
          from: `${origin.name} Metro`,
          to: `${destination.name} Metro`,
          departureTime: '09:14',
          arrivalTime: '09:42',
          duration: metroDuration,
          distance: approxDistance - 0.6,
          lineName: 'Chennai Metro Corridor',
          stopsCount: Math.max(4, Math.round(approxDistance / 1.5)),
          instructions: 'Take rapid transit train directly toward destination',
          color: '#5F2CFF'
        },
        {
          id: 'seg-dyn-3',
          mode: 'walk',
          from: `${destination.name} Metro`,
          to: destination.name,
          departureTime: '09:42',
          arrivalTime: '09:46',
          duration: 4,
          distance: 0.3,
          instructions: `Exit toward ${destination.landmark || destination.name}`
        }
      ]
    },
    {
      id: `route-${origin.id}-${destination.id}-cab`,
      name: 'Cab / Ride Hailing',
      tag: 'fastest',
      summary: `Direct point-to-point express route from ${origin.name} to ${destination.name}`,
      duration: cabDuration,
      distance: approxDistance,
      cost: cabCost,
      walkingDistance: 0.1,
      walkingDuration: 2,
      transfers: 0,
      emissions: Math.round(approxDistance * 135),
      transportModes: ['walk', 'cab'],
      score: 83,
      interactionCount: 1,
      interactionScore: 95,
      geometry: cabGeo,
      nextAction: {
        step: 'Meet Cab Driver at Street Corner',
        duration: 2,
        distance: '100 m',
        transportMode: 'walk',
        details: 'Single vehicle direct route with zero transfers',
        thenAction: `Arrive at ${destination.name} in ~${cabDuration} min`
      },
      scoreBreakdown: {
        overall: 83,
        label: 'Fastest Door-to-Door',
        timeScore: 97,
        costScore: 54,
        transferScore: 100,
        walkingScore: 98,
        ecoScore: 42
      },
      isAccessible: true,
      segments: [
        {
          id: 'seg-dyn-cab-1',
          mode: 'walk',
          from: origin.name,
          to: 'Pickup Zone',
          departureTime: departureTimeStr,
          arrivalTime: '09:12',
          duration: 2,
          distance: 0.1,
          instructions: 'Meet vehicle at designated pickup point'
        },
        {
          id: 'seg-dyn-cab-2',
          mode: 'cab',
          from: 'Pickup Zone',
          to: destination.name,
          departureTime: '09:12',
          arrivalTime: '09:35',
          duration: cabDuration - 2,
          distance: approxDistance,
          lineName: 'City Sedan Express',
          instructions: 'Direct arterial route via main city corridors'
        }
      ]
    },
    {
      id: `route-${origin.id}-${destination.id}-bus`,
      name: 'City Bus Transit',
      tag: 'cheapest',
      summary: `MTC bus service with high frequency between ${origin.name} and ${destination.name}`,
      duration: busDuration + 10,
      distance: approxDistance + 1.4,
      cost: busCost,
      walkingDistance: 0.9,
      walkingDuration: 11,
      transfers: 1,
      emissions: Math.round(approxDistance * 32),
      transportModes: ['walk', 'bus', 'walk'],
      score: 75,
      interactionCount: 4,
      interactionScore: 68,
      geometry: busGeo,
      nextAction: {
        step: `Walk to ${origin.name} Bus Shelter`,
        duration: 5,
        distance: '400 m',
        transportMode: 'walk',
        details: 'Wait at designated MTC stop',
        thenAction: `Board bus toward ${destination.name}`
      },
      scoreBreakdown: {
        overall: 75,
        label: 'Lowest Cost Option',
        timeScore: 66,
        costScore: 98,
        transferScore: 78,
        walkingScore: 74,
        ecoScore: 89
      },
      isAccessible: false,
      segments: [
        {
          id: 'seg-dyn-bus-1',
          mode: 'walk',
          from: origin.name,
          to: `${origin.name} Bus Shelter`,
          departureTime: departureTimeStr,
          arrivalTime: '09:15',
          duration: 5,
          distance: 0.4,
          instructions: 'Walk to nearest MTC sheltered stop'
        },
        {
          id: 'seg-dyn-bus-2',
          mode: 'bus',
          from: `${origin.name} Bus Shelter`,
          to: `${destination.name} Stop`,
          departureTime: '09:15',
          arrivalTime: '09:50',
          duration: busDuration,
          distance: approxDistance,
          lineName: 'MTC Regular Transit Route',
          stopsCount: Math.max(6, Math.round(approxDistance * 1.2)),
          instructions: 'Direct service with standard urban stop intervals'
        },
        {
          id: 'seg-dyn-bus-3',
          mode: 'walk',
          from: `${destination.name} Stop`,
          to: destination.name,
          departureTime: '09:50',
          arrivalTime: '09:56',
          duration: 6,
          distance: 0.5,
          instructions: 'Walk down main street to arrival point'
        }
      ]
    },
    {
      id: `route-${origin.id}-${destination.id}-suburban-train`,
      name: 'Suburban Train + Metro',
      tag: 'eco',
      summary: `Eco-conscious electric rail link connecting ${origin.name} and ${destination.name}`,
      duration: trainDuration + 8,
      distance: approxDistance + 0.8,
      cost: trainCost + 15,
      walkingDistance: 0.5,
      walkingDuration: 7,
      transfers: 1,
      emissions: Math.round(approxDistance * 10),
      transportModes: ['walk', 'train', 'metro', 'walk'],
      score: 89,
      interactionCount: 3,
      interactionScore: 80,
      geometry: trainGeo,
      nextAction: {
        step: `Walk to ${origin.name} Railway Platform`,
        duration: 3,
        distance: '200 m',
        transportMode: 'walk',
        details: 'Proceed to Suburban Platform 1',
        thenAction: 'Electric EMU train connection'
      },
      scoreBreakdown: {
        overall: 89,
        label: 'Eco & Energy Efficient',
        timeScore: 88,
        costScore: 97,
        transferScore: 84,
        walkingScore: 86,
        ecoScore: 98
      },
      isAccessible: true,
      segments: [
        {
          id: 'seg-dyn-trn-1',
          mode: 'walk',
          from: origin.name,
          to: 'Railway Platform',
          departureTime: departureTimeStr,
          arrivalTime: '09:13',
          duration: 3,
          distance: 0.2,
          instructions: 'Enter suburban station concourse'
        },
        {
          id: 'seg-dyn-trn-2',
          mode: 'train',
          from: origin.name,
          to: 'Transit Interchange',
          departureTime: '09:13',
          arrivalTime: '09:32',
          duration: trainDuration,
          distance: approxDistance,
          lineName: 'Southern Electric Suburban Line',
          stopsCount: Math.max(3, Math.round(approxDistance / 2)),
          instructions: 'Ride electric EMU suburban train'
        },
        {
          id: 'seg-dyn-trn-3',
          mode: 'walk',
          from: 'Transit Interchange',
          to: destination.name,
          departureTime: '09:32',
          arrivalTime: '09:36',
          duration: 4,
          distance: 0.3,
          instructions: 'Walk from exit gate to destination'
        }
      ]
    }
  ];
};
