import { useEffect, useMemo, useState } from 'react';
import type { ActiveFilters } from '../features/filters/filterTypes';
import { applyFilters, DEFAULT_FILTERS } from '../features/filters/filterUtils';
import type { Place } from '../features/places/placeTypes';
import { fetchPlaces } from '../features/places/placeService';

type GeoPoint = { lat: number; lng: number };

export function usePlaces(
  filters: ActiveFilters = DEFAULT_FILTERS,
  userLocation?: GeoPoint
) {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const filterKey = useMemo(() => JSON.stringify(filters), [filters]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    
    fetchPlaces()
      .then((data) => {
        if (!mounted) return;
        const filtered = applyFilters(data, filters, userLocation);
        setPlaces(filtered);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err instanceof Error ? err : new Error('Failed to load places'));
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [filterKey, userLocation?.lat, userLocation?.lng]);

  return { places, loading, error };
}
