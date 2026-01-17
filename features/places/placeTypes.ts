export type PlaceId = string;

export type PriceRange = 'budget' | 'moderate' | 'expensive';

export type PlaceCategory =
  | 'restaurant'
  | 'cafe'
  | 'bar'
  | 'park'
  | 'museum'
  | 'landmark'
  | 'shopping';

export interface Place {
  /**
   * Stable schema for v1. Freeze changes here before Supabase migration.
   */
  id: PlaceId;
  name: string;
  description: string;
  address: string;
  location: { lat: number; lng: number };
  rating: number;
  tags: string[];
  category: PlaceCategory;
  images: string[];
  /**
   * Optional fields below
   */
  priceRange?: PriceRange;
  hours?: string;
  openNow?: boolean;
  phone?: string;
  instagram?: string;
  website?: string;
  menuUrl?: string;
}

export interface PlaceFilters {
  query?: string;
  tags?: string[];
  categories?: PlaceCategory[];
  minRating?: number;
  priceRange?: PriceRange[];
  maxDistance?: number; // in kilometers
}
