import type { PlaceCategory, PriceRange } from '../places/placeTypes';

export type FilterId = string;

export interface Filter {
  id: FilterId;
  label: string;
  type: 'tag' | 'rating' | 'price' | 'distance' | 'category' | 'search';
  value?: string | number;
}

export interface ActiveFilters {
  query: string;
  tags: string[];
  categories: PlaceCategory[];
  minRating: number;
  priceRange: PriceRange[];
  maxDistance: number | null;
  openNow: boolean;
}
