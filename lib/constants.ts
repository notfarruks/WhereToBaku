// App-wide constants
export const APP_NAME = 'WhereToBaku';

// Baku city center coordinates (default location)
export const BAKU_CENTER = {
  latitude: 40.4093,
  longitude: 49.8671,
};

// Default search radius in kilometers
export const DEFAULT_SEARCH_RADIUS = 10;

// Rating constants
export const MIN_RATING = 0;
export const MAX_RATING = 5;

// Price range labels
export const PRICE_RANGES = {
  budget: 'Budget',
  moderate: 'Moderate',
  expensive: 'Expensive',
} as const;

// Common place tags
export const PLACE_TAGS = [
  'restaurant',
  'cafe',
  'museum',
  'park',
  'shopping',
  'entertainment',
  'historical',
  'nightlife',
  'family-friendly',
  'romantic',
] as const;
