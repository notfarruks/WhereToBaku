import React, { useEffect, useMemo, useRef } from "react";
import { ScrollView, Text, TextInput, View, Switch } from "react-native";
import { Header } from "../../components/Header";
import { FilterChip } from "../../components/FilterChip";
import { PlaceCard } from "../../components/PlaceCard";
import { usePlaces } from "../../hooks/usePlaces";
import { useFilters } from "../../hooks/useFilters";
import { useLocation } from "../../hooks/useLocation";
import type { PlaceCategory, PriceRange } from "../../features/places/placeTypes";
import { useLocalSearchParams } from "expo-router";
import { createDefaultFilters } from "../../features/filters/filterUtils";
import { logEvent } from "../../lib/analytics";

const TAG_FILTERS: { id: string; label: string }[] = [
  { id: "romantic", label: "Romantic" },
  { id: "family-friendly", label: "Family friendly" },
  { id: "work-friendly", label: "Work friendly" },
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

const RATING_OPTIONS: { id: number; label: string }[] = [
  { id: 0, label: "Any rating" },
  { id: 4, label: "4.0+" },
  { id: 4.5, label: "4.5+" },
];

export default function SearchScreen() {
  const params = useLocalSearchParams<{ tags?: string; prices?: string; openNow?: string }>();
  const sessionStartRef = useRef<number>(Date.now());
  const hasLoggedFilterUseRef = useRef(false);

  const prefilledFilters = useMemo(() => {
    const base = createDefaultFilters();
    base.tags = params.tags ? params.tags.split(",").filter(Boolean) : [];
    base.priceRange = params.prices
      ? (params.prices.split(",").filter(Boolean) as PriceRange[])
      : [];
    base.openNow = params.openNow === "true" ? true : base.openNow;
    return base;
  }, [params.openNow, params.prices, params.tags]);

  const {
    filters,
    setAllFilters,
    setQuery,
    toggleTag,
    toggleCategory,
    togglePriceRange,
    setMaxDistance,
    setMinRating,
    toggleOpenNow,
    resetFilters,
  } = useFilters(prefilledFilters);

  useEffect(() => {
    setAllFilters(prefilledFilters);
    sessionStartRef.current = Date.now();
    hasLoggedFilterUseRef.current = false;
  }, [prefilledFilters, setAllFilters]);
  const location = useLocation();

  const userLocation = !location.loading
    ? { lat: location.latitude, lng: location.longitude }
    : undefined;

  const { places } = usePlaces(filters, userLocation);

  const hasActiveFilters =
    filters.query.trim().length > 0 ||
    filters.tags.length > 0 ||
    filters.categories.length > 0 ||
    filters.priceRange.length > 0 ||
    filters.maxDistance != null ||
    filters.minRating > 0 ||
    filters.openNow;

  useEffect(() => {
    if (hasActiveFilters && !hasLoggedFilterUseRef.current) {
      hasLoggedFilterUseRef.current = true;
      logEvent("filters_used", { source: "search" });
    }
  }, [hasActiveFilters]);

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

        {hasActiveFilters && (
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {filters.query ? <FilterChip label={`“${filters.query}”`} /> : null}
            {filters.tags.map(tag => (
              <FilterChip key={`tag-${tag}`} label={tag} selected />
            ))}
            {filters.categories.map(cat => (
              <FilterChip key={`cat-${cat}`} label={cat} selected />
            ))}
            {filters.priceRange.map(price => (
              <FilterChip key={`price-${price}`} label={price === "budget" ? "$" : price === "moderate" ? "$$" : "$$$"} selected />
            ))}
            {filters.maxDistance != null ? (
              <FilterChip label={`<${filters.maxDistance} km`} selected />
            ) : null}
            {filters.minRating > 0 ? (
              <FilterChip label={`${filters.minRating}+`} selected />
            ) : null}
            {filters.openNow ? <FilterChip label="Open now" selected /> : null}
            <FilterChip label="Clear" onPress={resetFilters} />
          </View>
        )}

        <View style={{ gap: 6 }}>
          <Text style={{ fontWeight: "600" }}>Categories</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {CATEGORY_FILTERS.map(filter => (
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
            {TAG_FILTERS.map(filter => (
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
            {PRICE_FILTERS.map(filter => (
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
            {DISTANCE_OPTIONS.map(option => (
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

        <View style={{ gap: 6 }}>
          <Text style={{ fontWeight: "600" }}>Rating</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {RATING_OPTIONS.map(option => (
              <FilterChip
                key={String(option.id)}
                label={option.label}
                selected={filters.minRating === option.id}
                onPress={() => setMinRating(option.id)}
              />
            ))}
          </View>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text style={{ fontWeight: "600" }}>Open now</Text>
          <Switch value={filters.openNow} onValueChange={toggleOpenNow} />
        </View>
      </View>
      <View style={{ padding: 16, gap: 12 }}>
        {places.map(place => (
          <PlaceCard
            key={place.id}
            place={place}
            onPress={() => {
              const elapsedMs = Date.now() - sessionStartRef.current;
              logEvent("place_opened", {
                source: "search",
                filterUsed: hasActiveFilters,
                elapsedMs,
              });
              // Navigate using PlaceCard default handler
            }}
          />
        ))}
      </View>
    </ScrollView>
  );
}
