import { useState, useCallback } from 'react';
import type { PlaceCategory, PriceRange } from '../features/places/placeTypes';
import type { ActiveFilters } from '../features/filters/filterTypes';
import { createDefaultFilters } from '../features/filters/filterUtils';

export function useFilters() {
  const [filters, setFilters] = useState<ActiveFilters>(createDefaultFilters());

  const setQuery = useCallback((query: string) => {
    setFilters(prev => ({
      ...prev,
      query,
    }));
  }, []);

  const toggleTag = useCallback((tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag],
    }));
  }, []);

  const toggleCategory = useCallback((category: PlaceCategory) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category],
    }));
  }, []);

  const setMinRating = useCallback((rating: number) => {
    setFilters(prev => ({
      ...prev,
      minRating: rating,
    }));
  }, []);

  const togglePriceRange = useCallback((price: PriceRange) => {
    setFilters(prev => ({
      ...prev,
      priceRange: prev.priceRange.includes(price)
        ? prev.priceRange.filter(p => p !== price)
        : [...prev.priceRange, price],
    }));
  }, []);

  const setMaxDistance = useCallback((distance: number | null) => {
    setFilters(prev => ({
      ...prev,
      maxDistance: distance,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(createDefaultFilters());
  }, []);

  return {
    filters,
    setQuery,
    toggleTag,
    toggleCategory,
    setMinRating,
    togglePriceRange,
    setMaxDistance,
    resetFilters,
  };
}
