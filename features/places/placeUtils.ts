import type { Place } from './placeTypes';

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Calculate relevance score for a place based on filters and location
 */
export function calculateRelevanceScore(
  place: Place,
  userLat: number,
  userLon: number,
  activeTags: string[] = [],
  minRating: number = 0
): number {
  let score = place.rating;
  
  // Boost score if place matches active tags
  const matchingTags = place.tags.filter(tag => activeTags.includes(tag));
  score += matchingTags.length * 0.5;
  
  // Boost score based on rating (if above minimum)
  if (place.rating >= minRating) {
    score += (place.rating - minRating) * 0.3;
  } else {
    score -= 2; // Penalize places below minimum rating
  }
  
  // Distance factor (closer places get slight boost)
  const distance = calculateDistance(
    userLat,
    userLon,
    place.latitude,
    place.longitude
  );
  if (distance < 2) score += 0.5;
  else if (distance < 5) score += 0.2;
  
  return score;
}

/**
 * Sort places by relevance score
 */
export function sortPlacesByRelevance(
  places: Place[],
  userLat: number,
  userLon: number,
  activeTags: string[] = [],
  minRating: number = 0
): Place[] {
  return [...places].sort((a, b) => {
    const scoreA = calculateRelevanceScore(a, userLat, userLon, activeTags, minRating);
    const scoreB = calculateRelevanceScore(b, userLat, userLon, activeTags, minRating);
    return scoreB - scoreA;
  });
}

/**
 * Filter places by distance
 */
export function filterByDistance(
  places: Place[],
  userLat: number,
  userLon: number,
  maxDistanceKm: number
): Place[] {
  return places.filter(place => {
    const distance = calculateDistance(
      userLat,
      userLon,
      place.latitude,
      place.longitude
    );
    return distance <= maxDistanceKm;
  });
}
