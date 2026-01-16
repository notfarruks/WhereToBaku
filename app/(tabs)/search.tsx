import React from "react";
import { ScrollView, Text, TextInput, View } from "react-native";
import { Header } from "../../components/Header";
import { FilterChip } from "../../components/FilterChip";
import { PlaceCard } from "../../components/PlaceCard";
import { usePlaces } from "../../hooks/usePlaces";
import { useFilters } from "../../hooks/useFilters";
import { useLocation } from "../../hooks/useLocation";
import type { PlaceCategory, PriceRange } from "../../features/places/placeTypes";

const TAG_FILTERS: { id: string; label: string }[] = [
  { id: "restaurant", label: "Restaurants" },
  { id: "cafe", label: "Cafes" },
  { id: "museum", label: "Museums" },
  { id: "park", label: "Parks" },
  { id: "historical", label: "Historical" },
  { id: "nightlife", label: "Nightlife" },
];

const CATEGORY_FILTERS: { id: PlaceCategory; label: string }[] = [
  { id: "restaurant", label: "Restaurant" },
  { id: "cafe", label: "Cafe" },
  { id: "bar", label: "Bar" },
  { id: "park", label: "Park" },
  { id: "museum", label: "Museum" },
  { id: "landmark", label: "Landmark" },
  { id: "shopping", label: "Shopping" },
];

const PRICE_FILTERS: { id: PriceRange; label: string }[] = [
  { id: "budget", label: "$" },
  { id: "moderate", label: "$$" },
  { id: "expensive", label: "$$$" },
];

const DISTANCE_OPTIONS: { id: number | null; label: string }[] = [
  { id: null, label: "Any distance" },
  { id: 2, label: "<2 km" },
  { id: 5, label: "<5 km" },
  { id: 10, label: "<10 km" },
];

export default function SearchScreen() {
  const { filters, setQuery, toggleTag, toggleCategory, togglePriceRange, setMaxDistance } =
    useFilters();
  const location = useLocation();

  const userLocation = !location.loading
    ? { lat: location.latitude, lng: location.longitude }
    : undefined;

  const { places } = usePlaces(filters, userLocation);

  return (
    <ScrollView>
      <Header title="Search places" />
      <View style={{ paddingHorizontal: 16, paddingTop: 8, gap: 12 }}>
        <View style={{ gap: 6 }}>
          <Text style={{ fontWeight: "600" }}>Search</Text>
          <TextInput
            placeholder="Search by name, description, or tag"
            value={filters.query}
            onChangeText={setQuery}
            style={{
              borderWidth: 1,
              borderColor: "#E5E7EB",
              borderRadius: 10,
              paddingHorizontal: 12,
              paddingVertical: 8,
            }}
          />
        </View>

        <View style={{ gap: 6 }}>
          <Text style={{ fontWeight: "600" }}>Categories</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {CATEGORY_FILTERS.map((filter) => (
              <FilterChip
                key={filter.id}
                label={filter.label}
                selected={filters.categories.includes(filter.id)}
                onPress={() => toggleCategory(filter.id)}
              />
            ))}
          </View>
        </View>

        <View style={{ gap: 6 }}>
          <Text style={{ fontWeight: "600" }}>Tags</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {TAG_FILTERS.map((filter) => (
              <FilterChip
                key={filter.id}
                label={filter.label}
                selected={filters.tags.includes(filter.id)}
                onPress={() => toggleTag(filter.id)}
              />
            ))}
          </View>
        </View>

        <View style={{ gap: 6 }}>
          <Text style={{ fontWeight: "600" }}>Price</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {PRICE_FILTERS.map((filter) => (
              <FilterChip
                key={filter.id}
                label={filter.label}
                selected={filters.priceRange.includes(filter.id)}
                onPress={() => togglePriceRange(filter.id)}
              />
            ))}
          </View>
        </View>

        <View style={{ gap: 6 }}>
          <Text style={{ fontWeight: "600" }}>Distance</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {DISTANCE_OPTIONS.map((option) => (
              <FilterChip
                key={String(option.id)}
                label={option.label}
                selected={filters.maxDistance === option.id}
                onPress={() => setMaxDistance(option.id)}
              />
            ))}
          </View>
          {filters.maxDistance != null && location.loading && (
            <Text style={{ fontSize: 12, color: "#6B7280" }}>
              Getting your location to filter by distance...
            </Text>
          )}
          {filters.maxDistance != null && location.error && (
            <Text style={{ fontSize: 12, color: "#B91C1C" }}>
              {location.error} — showing all distances.
            </Text>
          )}
        </View>
      </View>
      <View style={{ padding: 16, gap: 12 }}>
        {places.map((place) => (
          <PlaceCard key={place.id} place={place} />
        ))}
      </View>
    </ScrollView>
  );
}
