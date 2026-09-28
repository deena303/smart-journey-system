import { Route, JourneyPreference, JourneyScoreBreakdown } from '../types/journey';

export interface ScoreWeights {
  time: number;
  cost: number;
  transfers: number;
  walking: number;
  eco: number;
}

const PREFERENCE_WEIGHTS: Record<JourneyPreference, ScoreWeights> = {
  balanced: {
    time: 0.28,
    cost: 0.24,
    transfers: 0.18,
    walking: 0.16,
    eco: 0.14
  },
  save_time: {
    time: 0.55,
    cost: 0.10,
    transfers: 0.15,
    walking: 0.12,
    eco: 0.08
  },
  save_money: {
    time: 0.15,
    cost: 0.55,
    transfers: 0.10,
    walking: 0.10,
    eco: 0.10
  },
  eco_friendly: {
    time: 0.15,
    cost: 0.15,
    transfers: 0.10,
    walking: 0.10,
    eco: 0.50
  },
  less_walking: {
    time: 0.20,
    cost: 0.15,
    transfers: 0.15,
    walking: 0.45,
    eco: 0.05
  },
  fewer_transfers: {
    time: 0.20,
    cost: 0.15,
    transfers: 0.45,
    walking: 0.12,
    eco: 0.08
  }
};

export const calculateJourneyScore = (
  route: Route,
  preference: JourneyPreference = 'balanced',
  allRoutesInBatch?: Route[]
): JourneyScoreBreakdown => {
  // Establish benchmarks from batch if available, or realistic defaults
  const minDuration = allRoutesInBatch
    ? Math.min(...allRoutesInBatch.map((r) => r.duration))
    : 30;
  const maxDuration = allRoutesInBatch
    ? Math.max(...allRoutesInBatch.map((r) => r.duration))
    : 70;

  const minCost = allRoutesInBatch
    ? Math.min(...allRoutesInBatch.map((r) => r.cost))
    : 30;
  const maxCost = allRoutesInBatch
    ? Math.max(...allRoutesInBatch.map((r) => r.cost))
    : 450;

  // 1. Time score: 100 for fastest, tapering down to 60 for slowest
  const durationSpan = Math.max(1, maxDuration - minDuration);
  const timeScore = Math.max(
    55,
    Math.round(100 - ((route.duration - minDuration) / durationSpan) * 45)
  );

  // 2. Cost score: 100 for cheapest, tapering down to 45 for highest
  const costSpan = Math.max(1, maxCost - minCost);
  const costScore = Math.max(
    45,
    Math.round(100 - ((route.cost - minCost) / costSpan) * 55)
  );

  // 3. Transfer score: 0 transfers = 100, 1 transfer = 88, 2 transfers = 65, 3+ = 40
  let transferScore = 100;
  if (route.transfers === 1) transferScore = 88;
  else if (route.transfers === 2) transferScore = 65;
  else if (route.transfers >= 3) transferScore = 40;

  // 4. Walking score: based on walking duration and distance
  // Under 3 min = 98, under 6 min = 90, under 10 min = 82, under 15 min = 68, 15+ min = 50
  let walkingScore = 85;
  if (route.walkingDuration <= 3) walkingScore = 98;
  else if (route.walkingDuration <= 6) walkingScore = 90;
  else if (route.walkingDuration <= 10) walkingScore = 82;
  else if (route.walkingDuration <= 15) walkingScore = 68;
  else walkingScore = 52;

  // 5. Eco score: based on emissions (grams CO2)
  // Low emissions (<300g) = 96-100, Medium (300-1000g) = 85-92, High (>1500g) = 40-55
  let ecoScore = 80;
  if (route.emissions <= 250) ecoScore = 98;
  else if (route.emissions <= 600) ecoScore = 90;
  else if (route.emissions <= 1200) ecoScore = 75;
  else ecoScore = 45;

  const weights = PREFERENCE_WEIGHTS[preference] || PREFERENCE_WEIGHTS.balanced;

  const weightedOverall = Math.round(
    timeScore * weights.time +
      costScore * weights.cost +
      transferScore * weights.transfers +
      walkingScore * weights.walking +
      ecoScore * weights.eco
  );

  let label = 'Good match';
  if (weightedOverall >= 90) label = 'Excellent match';
  else if (weightedOverall >= 82) label = 'Strong option';
  else if (weightedOverall >= 75) label = 'Moderate match';
  else label = 'Alternative route';

  return {
    overall: Math.min(99, Math.max(50, weightedOverall)),
    label,
    timeScore,
    costScore,
    transferScore,
    walkingScore,
    ecoScore
  };
};
