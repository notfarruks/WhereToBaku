export type FilterId = string;

export interface Filter {
  id: FilterId;
  label: string;
  type: 'tag' | 'rating' | 'price' | 'distance';
  value?: string | number;
}

export interface ActiveFilters {
  tags: string[];
  minRating: number;
  priceRanges: string[];
  maxDistance: number | null;
}
