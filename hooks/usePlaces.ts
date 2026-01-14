import { useEffect, useState } from 'react';
import type { Place } from '../features/places/placeTypes';
import { fetchPlaces } from '../features/places/placeService';
import { applyPlaceFilters } from '../features/filters/filterUtils';

export function usePlaces(activeFilterIds: string[] = []) {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    
    fetchPlaces()
      .then((data) => {
        if (!mounted) return;
        const filtered = applyPlaceFilters(data, activeFilterIds);
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
  }, [activeFilterIds.join(',')]);

  return { places, loading, error };
}
