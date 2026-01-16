import { useState, useEffect, useCallback } from 'react';
// For MVP, use AsyncStorage to persist favorites
// TODO: Replace with Supabase when backend is ready
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@WhereToBaku:favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Load favorites from storage
  useEffect(() => {
    async function loadFavorites() {
      try {
        const stored = await AsyncStorage.getItem(FAVORITES_KEY);
        if (stored) {
          setFavorites(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
      } finally {
        setLoading(false);
      }
    }
    loadFavorites();
  }, []);

  // Save favorites to storage
  const saveFavorites = useCallback(async (newFavorites: string[]) => {
    try {
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  }, []);

  const toggleFavorite = useCallback(
    async (placeId: string) => {
      const newFavorites = favorites.includes(placeId)
        ? favorites.filter(id => id !== placeId)
        : [...favorites, placeId];
      await saveFavorites(newFavorites);
    },
    [favorites, saveFavorites]
  );

  const isFavorite = useCallback(
    (placeId: string) => favorites.includes(placeId),
    [favorites]
  );

  return {
    favorites,
    loading,
    toggleFavorite,
    isFavorite,
  };
}
