import { useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SETTINGS_KEY = '@WhereToBaku:appSettings';

type DistanceUnit = 'km';

type AppSettings = {
  locationEnabled: boolean;
  distanceUnit: DistanceUnit;
};

const DEFAULT_SETTINGS: AppSettings = {
  locationEnabled: true,
  distanceUnit: 'km',
};

export function useAppSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const raw = await AsyncStorage.getItem(SETTINGS_KEY);
        if (raw) {
          setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(raw) });
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load settings'));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const persist = useCallback(async (next: AppSettings) => {
    setSettings(next);
    try {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to save settings'));
    }
  }, []);

  const toggleLocation = useCallback(() => {
    persist({ ...settings, locationEnabled: !settings.locationEnabled });
  }, [settings, persist]);

  const setDistanceUnit = useCallback(
    (unit: DistanceUnit) => {
      persist({ ...settings, distanceUnit: unit });
    },
    [settings, persist]
  );

  return { settings, loading, error, toggleLocation, setDistanceUnit };
}
