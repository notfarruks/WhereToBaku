import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { PlaceCategory, PriceRange } from '../features/places/placeTypes';

const PREFS_KEY = '@WhereToBaku:onboardingPrefs';

type OnboardingPreferences = {
  tags: string[];
  priceRanges: PriceRange[];
  categories: PlaceCategory[];
  completed: boolean;
};

const DEFAULT_PREFS: OnboardingPreferences = {
  tags: [],
  priceRanges: [],
  categories: [],
  completed: false,
};

export function useOnboardingPreferences() {
  const [preferences, setPreferences] = useState<OnboardingPreferences>(DEFAULT_PREFS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadPrefs() {
      try {
        const stored = await AsyncStorage.getItem(PREFS_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setPreferences({ ...DEFAULT_PREFS, ...parsed });
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load preferences';
        console.error('Error loading onboarding preferences:', err);
        setError(new Error(message));
      } finally {
        setLoading(false);
      }
    }
    loadPrefs();
  }, []);

  const persist = useCallback(
    async (next: OnboardingPreferences) => {
      setPreferences(next);
      try {
        await AsyncStorage.setItem(PREFS_KEY, JSON.stringify(next));
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to save preferences';
        console.error('Error saving onboarding preferences:', err);
        setError(new Error(message));
      }
    },
    []
  );

  const toggleTag = useCallback(
    (tag: string) => {
      const nextTags = preferences.tags.includes(tag)
        ? preferences.tags.filter(t => t !== tag)
        : [...preferences.tags, tag];
      persist({ ...preferences, tags: nextTags });
    },
    [preferences, persist]
  );

  const togglePriceRange = useCallback(
    (price: PriceRange) => {
      const nextPrices = preferences.priceRanges.includes(price)
        ? preferences.priceRanges.filter(p => p !== price)
        : [...preferences.priceRanges, price];
      persist({ ...preferences, priceRanges: nextPrices });
    },
    [preferences, persist]
  );

  const toggleCategory = useCallback(
    (category: PlaceCategory) => {
      const nextCategories = preferences.categories.includes(category)
        ? preferences.categories.filter(c => c !== category)
        : [...preferences.categories, category];
      persist({ ...preferences, categories: nextCategories });
    },
    [preferences, persist]
  );

  const saveAndComplete = useCallback(() => {
    return persist({ ...preferences, completed: true });
  }, [preferences, persist]);

  const resetPreferences = useCallback(() => {
    return persist(DEFAULT_PREFS);
  }, [persist]);

  return {
    preferences,
    loading,
    error,
    toggleTag,
    togglePriceRange,
    toggleCategory,
    saveAndComplete,
    resetPreferences,
    setCompleted: (completed: boolean) => persist({ ...preferences, completed }),
  };
}
