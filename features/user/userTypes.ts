export type UserId = string;

export interface User {
  id: UserId;
  email: string;
  name?: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  favoriteTags?: string[];
  defaultLocation?: {
    latitude: number;
    longitude: number;
  };
  language?: string;
}
