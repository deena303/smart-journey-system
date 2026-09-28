import { Route, JourneyPreference, BatteryMode } from '../types/journey';
import { RouteFilterConstraints } from './routeRanking';

/**
 * Calculates a battery-aware journey score.
 * When in Critical Battery mode (<= 5%), heavy weight is shifted toward:
 * 1. Low interaction count (minimizing phone usage, transfers, and app re-checks)
 * 2. Fewer transfers
 * 3. Quick arrival / direct transport
 */
export const calculateBatteryAwareScore = (
  route: Route,
  preference: JourneyPreference = 'balanced',
  batteryMode: BatteryMode = 'normal'
): number => {
  if (batteryMode === 'normal') {
    return route.score;
  }

  // Battery Saver mode (6% - 20%): Moderate interaction & transfer penalty
  if (batteryMode === 'saver') {
    const interactionBonus = (route.interactionScore / 100) * 20;
    const transferPenalty = route.transfers * 6;
    const adjusted = Math.round(route.score * 0.8 + interactionBonus - transferPenalty);
    return Math.min(99, Math.max(50, adjusted));
  }

  // Critical Battery mode (<= 5%):
  // Emphasizes:
  // - High Interaction Score (40% weight): Single-mode or direct journeys (Cab = 95, Metro direct = 90) beat complex 2-transfer buses
  // - Fewer Transfers (30% weight): 0 transfers = +20, 1 transfer = +5, 2+ transfers = -25
  // - Duration / ETA (30% weight): Gets user to destination before phone dies
  const interactionComponent = (route.interactionScore / 100) * 40;

  let transferBonus = 0;
  if (route.transfers === 0) transferBonus = 30;
  else if (route.transfers === 1) transferBonus = 18;
  else transferBonus = 5;

  // Time component: normalize under 60 min
  const timeScore = Math.max(10, 30 - Math.max(0, route.duration - 25) * 0.5);

  const criticalScore = Math.round(interactionComponent + transferBonus + timeScore);
  return Math.min(99, Math.max(50, criticalScore));
};

/**
 * Ranks routes taking battery mode into consideration.
 * In Critical Battery mode, routes with high interaction counts (e.g. multiple bus transfers)
 * drop significantly in priority.
 */
export const rankBatteryAwareRoutes = (
  routes: Route[],
  preference: JourneyPreference = 'balanced',
  batteryMode: BatteryMode = 'normal',
  constraints?: RouteFilterConstraints
): Route[] => {
  // Filter out inaccessible or over-budget routes if constraints set
  let pool = routes;
  if (constraints) {
    pool = routes.filter((r) => {
      if (constraints.maxBudget && r.cost > constraints.maxBudget) return false;
      if (constraints.maxTransfers !== undefined && r.transfers > constraints.maxTransfers) return false;
      if (constraints.wheelchairAccessible && !r.isAccessible) return false;
      return true;
    });
    if (pool.length === 0) pool = routes;
  }

  // Calculate battery-aware scores
  const scored = pool.map((route) => {
    const batteryAwareScore = calculateBatteryAwareScore(route, preference, batteryMode);
    return {
      ...route,
      batteryAwareScore
    };
  });

  // Sort: In critical battery mode, sort primarily by batteryAwareScore
  const sorted = [...scored].sort((a, b) => {
    if (batteryMode === 'critical') {
      return (b.batteryAwareScore ?? b.score) - (a.batteryAwareScore ?? a.score);
    }
    if (batteryMode === 'saver') {
      return (b.batteryAwareScore ?? b.score) - (a.batteryAwareScore ?? a.score);
    }
    return b.score - a.score;
  });

  return sorted.map((r, idx) => ({
    ...r,
    tag: idx === 0 ? 'recommended' : r.tag
  }));
};

/**
 * Generates an explanation specific to critical battery mode
 */
export const generateBatteryAwareRecommendation = (
  route: Route,
  batteryMode: BatteryMode
): {
  headline: string;
  rationale: string;
  interactionAdvantage: string;
} => {
  if (batteryMode === 'critical') {
    return {
      headline: 'Selected for minimum phone interaction & immediate arrival',
      rationale: `With battery at 5%, this ${route.name} route requires only ${route.interactionCount} manual check-ins and ${route.transfers} transfers, letting you lock your screen while traveling.`,
      interactionAdvantage: `Low-Interaction Score: ${route.interactionScore}/100 · ${route.transfers === 0 ? 'Zero transfers' : `${route.transfers} transfer`}`
    };
  }

  if (batteryMode === 'saver') {
    return {
      headline: 'Battery Saver: Streamlined route chosen to preserve power',
      rationale: `${route.name} was prioritized for low screen time and dependable schedules.`,
      interactionAdvantage: `Interaction Score: ${route.interactionScore}/100`
    };
  }

  return {
    headline: 'Standard recommendation based on your travel priorities',
    rationale: route.summary,
    interactionAdvantage: `${route.duration} min · ₹${route.cost}`
  };
};
