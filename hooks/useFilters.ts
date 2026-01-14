import { useState, useCallback } from 'react';
import type { ActiveFilters } from '../features/filters/filterTypes';
import { createDefaultFilters } from '../features/filters/filterUtils';

export function useFilters() {
  const [filters, setFilters] = useState<ActiveFilters>(createDefaultFilters());

  const toggleTag = useCallback((tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag],
    }));
  }, []);

  const setMinRating = useCallback((rating: number) => {
    setFilters(prev => ({
      ...prev,
      minRating: rating,
    }));
  }, []);

  const togglePriceRange = useCallback((priceRange: string) => {
    setFilters(prev => ({
      ...prev,
      priceRanges: prev.priceRanges.includes(priceRange)
        ? prev.priceRanges.filter(p => p !== priceRange)
        : [...prev.priceRanges, priceRange],
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
    toggleTag,
    setMinRating,
    togglePriceRange,
    setMaxDistance,
    resetFilters,
  };
}
