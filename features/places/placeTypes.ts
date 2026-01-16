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
  id: PlaceId;
  name: string;
  description: string;
  address: string;
  location: { lat: number; lng: number };
  rating: number;
  tags: string[];
  category: PlaceCategory;
  images: string[];
  priceRange?: PriceRange;
  hours?: string;
  openNow?: boolean;
  phone?: string;
  instagram?: string;
  website?: string;
}

export interface PlaceFilters {
  query?: string;
  tags?: string[];
  categories?: PlaceCategory[];
  minRating?: number;
  priceRange?: PriceRange[];
  maxDistance?: number; // in kilometers
}
