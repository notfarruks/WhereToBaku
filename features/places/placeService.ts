import type { Place } from './placeTypes';
import { mockPlaces } from '../../lib/mockData';
import { supabase } from '../../lib/supabase';

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
    
    return mockPlaces;
  } catch (error) {
    console.error('Error fetching places:', error);
    // Fallback to mock data on error
    return mockPlaces;
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
    
    return mockPlaces.find(p => p.id === id) || null;
  } catch (error) {
    console.error('Error fetching place:', error);
    return null;
  }
}
