import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { BAKU_CENTER } from '../lib/constants';

export interface LocationData {
  latitude: number;
  longitude: number;
  loading: boolean;
  error: string | null;
}

/**
 * Hook to get user's current location
 * Falls back to Baku city center if permission denied or unavailable
 */
export function useLocation(): LocationData {
  const [location, setLocation] = useState<LocationData>({
    latitude: BAKU_CENTER.latitude,
    longitude: BAKU_CENTER.longitude,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let mounted = true;

    async function getLocation() {
      try {
        // Request permission
        const { status } = await Location.requestForegroundPermissionsAsync();
        
        if (!mounted) return;

        if (status !== 'granted') {
          setLocation({
            latitude: BAKU_CENTER.latitude,
            longitude: BAKU_CENTER.longitude,
            loading: false,
            error: 'Location permission denied',
          });
          return;
        }

        // Get current position
        const position = await Location.getCurrentPositionAsync({});
        
        if (!mounted) return;

        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          loading: false,
          error: null,
        });
      } catch (error) {
        if (!mounted) return;
        setLocation({
          latitude: BAKU_CENTER.latitude,
          longitude: BAKU_CENTER.longitude,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to get location',
        });
      }
    }

    getLocation();

    return () => {
      mounted = false;
    };
  }, []);

  return location;
}
