import { Route, JourneyPreference, JourneySearchQuery } from '../types/journey';
import { calculateJourneyScore } from './routeScoring';

export interface RouteFilterConstraints {
  maxBudget?: number;
  maxTransfers?: number;
  maxWalkingKm?: number;
  wheelchairAccessible?: boolean;
}

export const filterRoutesByConstraints = (
  routes: Route[],
  constraints?: RouteFilterConstraints
): Route[] => {
  if (!constraints) return routes;

  return routes.filter((route) => {
    if (constraints.maxBudget !== undefined && route.cost > constraints.maxBudget) {
      return false;
    }
    if (
      constraints.maxTransfers !== undefined &&
      route.transfers > constraints.maxTransfers
    ) {
      return false;
    }
    if (
      constraints.maxWalkingKm !== undefined &&
      route.walkingDistance > constraints.maxWalkingKm
    ) {
      return false;
    }
    if (constraints.wheelchairAccessible && !route.isAccessible) {
      return false;
    }
    return true;
  });
};

export const rankRoutes = (
  routes: Route[],
  preference: JourneyPreference = 'balanced',
  constraints?: RouteFilterConstraints
): Route[] => {
  const eligibleRoutes = filterRoutesByConstraints(routes, constraints);
  const pool = eligibleRoutes.length > 0 ? eligibleRoutes : routes;

  // Find natural superlatives
  const fastestDuration = Math.min(...pool.map((r) => r.duration));
  const cheapestCost = Math.min(...pool.map((r) => r.cost));
  const lowestEmissions = Math.min(...pool.map((r) => r.emissions));

  // Score each route according to the chosen preference
  const scoredRoutes = pool.map((route) => {
    const scoreBreakdown = calculateJourneyScore(route, preference, pool);
    return {
      ...route,
      score: scoreBreakdown.overall,
      scoreBreakdown
    };
  });

  // Sort descending by calculated score
  const sorted = [...scoredRoutes].sort((a, b) => b.score - a.score);

  // Re-assign appropriate tags
  const fastestId = pool.find((r) => r.duration === fastestDuration)?.id;
  const cheapestId = pool.find((r) => r.cost === cheapestCost)?.id;
  const ecoId = pool.find((r) => r.emissions === lowestEmissions)?.id;

  const result = sorted.map((route, index) => {
    let tag: Route['tag'] | undefined;
    if (index === 0) {
      tag = 'recommended';
    } else if (route.id === fastestId) {
      tag = 'fastest';
    } else if (route.id === cheapestId) {
      tag = 'cheapest';
    } else if (route.id === ecoId) {
      tag = 'eco';
    }

    return {
      ...route,
      tag
    };
  });

  return result;
};
