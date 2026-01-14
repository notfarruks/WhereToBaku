import { supabase } from '../../lib/supabase';
import type { User, UserPreferences } from './userTypes';

/**
 * Get current user
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    // TODO: Implement Supabase auth
    // const { data: { user } } = await supabase.auth.getUser();
    // if (!user) return null;
    // return user as User;
    
    return null; // For MVP, no user auth yet
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

/**
 * Update user preferences
 */
export async function updateUserPreferences(
  userId: string,
  preferences: UserPreferences
): Promise<boolean> {
  try {
    // TODO: Implement Supabase update
    // const { error } = await supabase
    //   .from('users')
    //   .update({ preferences })
    //   .eq('id', userId);
    // return !error;
    
    return false; // For MVP
  } catch (error) {
    console.error('Error updating preferences:', error);
    return false;
  }
}
