import type { Place } from './placeTypes';
import { PLACES } from '../../src/data/places';

/**
 * Fetch places from backend (Supabase) or return mock data for MVP
 */
export async function fetchPlaces(): Promise<Place[]> {
  // For MVP, return mock data
  // TODO: Replace with actual Supabase query when backend is ready
  try {
    // Uncomment when Supabase is configured:
    // const { data, error } = await supabase
    //   .from('places')
    //   .select('*');
    // if (error) throw error;
    // return data || [];
    
    return PLACES;
  } catch (error) {
    console.error('Error fetching places:', error);
    // Fallback to mock data on error
    return PLACES;
  }
}

/**
 * Fetch a single place by ID
 */
export async function fetchPlaceById(id: string): Promise<Place | null> {
  try {
    // TODO: Replace with actual Supabase query
    // const { data, error } = await supabase
    //   .from('places')
    //   .select('*')
    //   .eq('id', id)
    //   .single();
    // if (error) throw error;
    // return data;
    
    return PLACES.find(p => p.id === id) || null;
  } catch (error) {
    console.error('Error fetching place:', error);
    return null;
  }
}
