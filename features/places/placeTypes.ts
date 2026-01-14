export type PlaceId = string;

export interface Place {
  id: PlaceId;
  name: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  rating: number;
  tags: string[];
  imageUrl?: string;
  priceRange?: 'budget' | 'moderate' | 'expensive';
  openingHours?: string;
  phoneNumber?: string;
  website?: string;
}

export interface PlaceFilters {
  tags?: string[];
  minRating?: number;
  priceRange?: ('budget' | 'moderate' | 'expensive')[];
  maxDistance?: number; // in kilometers
}
