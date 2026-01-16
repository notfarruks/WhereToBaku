import type { Place } from '../places/placeTypes';
import { calculateDistance } from '../places/placeUtils';
import type { ActiveFilters } from './filterTypes';

export const DEFAULT_FILTERS: ActiveFilters = {
  query: '',
  tags: [],
  categories: [],
  minRating: 0,
  priceRange: [],
  maxDistance: null,
};

export function createDefaultFilters(): ActiveFilters {
  // Return a fresh copy to keep hook state updates predictable
  return { ...DEFAULT_FILTERS };
}

export function applyFilters(
  places: Place[],
  filters: ActiveFilters,
  userLocation?: { lat: number; lng: number }
): Place[] {
  let filtered = [...places];
  const query = filters.query.trim().toLowerCase();

  if (query) {
    filtered = filtered.filter(place => {
      const haystack = [
        place.name,
        place.description,
        place.address,
        place.category,
        ...place.tags,
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(query);
    });
  }

  if (filters.tags.length > 0) {
    filtered = filtered.filter(place =>
      filters.tags.some(tag => place.tags.includes(tag))
    );
  }

  if (filters.categories.length > 0) {
    filtered = filtered.filter(place =>
      filters.categories.includes(place.category)
    );
  }

  if (filters.minRating > 0) {
    filtered = filtered.filter(place => place.rating >= filters.minRating);
  }

  if (filters.priceRange.length > 0) {
    filtered = filtered.filter(
      place => place.priceRange && filters.priceRange.includes(place.priceRange)
    );
  }

  if (filters.maxDistance != null && userLocation) {
    const maxDistance = filters.maxDistance;
    filtered = filtered.filter(place => {
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        place.location.lat,
        place.location.lng
      );
      return distance <= maxDistance;
    });
  }

  return filtered;
}
