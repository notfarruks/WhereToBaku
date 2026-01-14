import type { Place } from '../places/placeTypes';
import type { ActiveFilters } from './filterTypes';

/**
 * Apply filters to a list of places
 */
export function applyPlaceFilters(
  places: Place[],
  activeFilterIds: string[] = []
): Place[] {
  // For now, return all places
  // TODO: Implement actual filtering logic based on activeFilterIds
  return places;
}

/**
 * Apply comprehensive filters to places
 */
export function applyFilters(
  places: Place[],
  filters: ActiveFilters
): Place[] {
  let filtered = [...places];

  // Filter by tags
  if (filters.tags.length > 0) {
    filtered = filtered.filter(place =>
      filters.tags.some(tag => place.tags.includes(tag))
    );
  }

  // Filter by minimum rating
  if (filters.minRating > 0) {
    filtered = filtered.filter(place => place.rating >= filters.minRating);
  }

  // Filter by price range
  if (filters.priceRanges.length > 0) {
    filtered = filtered.filter(place =>
      place.priceRange && filters.priceRanges.includes(place.priceRange)
    );
  }

  return filtered;
}

/**
 * Create default active filters
 */
export function createDefaultFilters(): ActiveFilters {
  return {
    tags: [],
    minRating: 0,
    priceRanges: [],
    maxDistance: null,
  };
}
