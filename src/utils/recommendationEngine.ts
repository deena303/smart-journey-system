import { Route, JourneyPreference } from '../types/journey';
import { RouteFilterConstraints, rankRoutes } from './routeRanking';

export interface RecommendationReason {
  headline: string;
  summary: string;
  comparisons: {
    label: string;
    value: string;
    isAdvantage: boolean;
  }[];
}

export const generateRecommendationReason = (
  recommendedRoute: Route,
  allRoutes: Route[],
  preference: JourneyPreference
): RecommendationReason => {
  const fastestRoute = [...allRoutes].sort((a, b) => a.duration - b.duration)[0];
  const cheapestRoute = [...allRoutes].sort((a, b) => a.cost - b.cost)[0];

  let headline = 'Best balance of time, cost and convenience for your selected preference.';
  if (preference === 'save_time') {
    headline = 'Optimized for minimum travel time with prioritized rapid transit.';
  } else if (preference === 'save_money') {
    headline = 'Maximized transit savings while maintaining reasonable travel duration.';
  } else if (preference === 'eco_friendly') {
    headline = 'Minimal carbon footprint utilizing electrified high-capacity transit.';
  } else if (preference === 'less_walking') {
    headline = 'Convenient point-to-point connections with minimal walking requirements.';
  } else if (preference === 'fewer_transfers') {
    headline = 'Streamlined direct connection minimizing platform transfers and waiting.';
  }

  const comparisons: RecommendationReason['comparisons'] = [];

  // Time difference compared to fastest
  if (recommendedRoute.id === fastestRoute.id) {
    comparisons.push({
      label: 'Fastest available',
      value: `${recommendedRoute.duration} min total`,
      isAdvantage: true
    });
  } else {
    const diff = recommendedRoute.duration - fastestRoute.duration;
    comparisons.push({
      label: 'Speed comparison',
      value: `${diff} min slower than fastest`,
      isAdvantage: diff <= 12
    });
  }

  // Cost difference compared to fastest (usually cab or premium)
  if (fastestRoute.cost > recommendedRoute.cost) {
    const saving = fastestRoute.cost - recommendedRoute.cost;
    comparisons.push({
      label: 'Cost savings',
      value: `₹${saving} cheaper than fastest (${fastestRoute.name})`,
      isAdvantage: true
    });
  } else if (recommendedRoute.id === cheapestRoute.id) {
    comparisons.push({
      label: 'Price benchmark',
      value: `Cheapest route at ₹${recommendedRoute.cost}`,
      isAdvantage: true
    });
  } else {
    comparisons.push({
      label: 'Fare',
      value: `₹${recommendedRoute.cost} total transit fare`,
      isAdvantage: true
    });
  }

  // Transfer count
  comparisons.push({
    label: 'Transfers',
    value:
      recommendedRoute.transfers === 0
        ? '0 transfers (direct)'
        : `${recommendedRoute.transfers} transfer`,
    isAdvantage: recommendedRoute.transfers <= 1
  });

  // Walking
  comparisons.push({
    label: 'Walking required',
    value: `${recommendedRoute.walkingDuration} min walking (${recommendedRoute.walkingDistance} km)`,
    isAdvantage: recommendedRoute.walkingDuration <= 10
  });

  return {
    headline,
    summary: `JourneyIQ evaluated ${allRoutes.length} available transport options. ${recommendedRoute.name} delivers a Journey Score of ${recommendedRoute.score}/100, fitting your preference profile.`,
    comparisons
  };
};

export interface WhatIfSimulationResult {
  previousRoute: Route;
  newRoute: Route;
  hasChanged: boolean;
  explanation: string;
  appliedConstraints: RouteFilterConstraints;
  appliedPreference: JourneyPreference;
}

export const simulateWhatIf = (
  baseRoutes: Route[],
  previousRouteId: string,
  newPreference: JourneyPreference,
  constraints: RouteFilterConstraints
): WhatIfSimulationResult => {
  const previousRoute =
    baseRoutes.find((r) => r.id === previousRouteId) || baseRoutes[0];

  const reranked = rankRoutes(baseRoutes, newPreference, constraints);
  const newRoute = reranked[0] || previousRoute;

  const hasChanged = previousRoute.id !== newRoute.id;

  let explanation = '';
  if (hasChanged) {
    if (constraints.maxBudget && previousRoute.cost > constraints.maxBudget) {
      explanation = `With your ₹${constraints.maxBudget} budget constraint, the ${previousRoute.name} (₹${previousRoute.cost}) is excluded. ${newRoute.name} provides the highest score (${newRoute.score}/100) among the remaining options.`;
    } else if (
      constraints.maxTransfers !== undefined &&
      previousRoute.transfers > constraints.maxTransfers
    ) {
      explanation = `Restricting transfers to maximum ${constraints.maxTransfers} filtered out ${previousRoute.name}. ${newRoute.name} satisfies your transfer limit with a score of ${newRoute.score}/100.`;
    } else if (
      constraints.maxWalkingKm !== undefined &&
      previousRoute.walkingDistance > constraints.maxWalkingKm
    ) {
      explanation = `Limiting walking distance to ${constraints.maxWalkingKm} km selected ${newRoute.name}, requiring only ${newRoute.walkingDistance} km on foot.`;
    } else {
      explanation = `Adjusting priority to "${newPreference.replace('_', ' ')}" rebalanced route trade-offs, making ${newRoute.name} the top recommendation.`;
    }
  } else {
    explanation = `${newRoute.name} remains your optimal journey even with these criteria, continuing to achieve the highest balance score (${newRoute.score}/100).`;
  }

  return {
    previousRoute,
    newRoute,
    hasChanged,
    explanation,
    appliedConstraints: constraints,
    appliedPreference: newPreference
  };
};
