import React from "react";
import { ScrollView, Text, View } from "react-native";
import { Header } from "../../components/Header";
import { FilterChip } from "../../components/FilterChip";
import { PlaceCard } from "../../components/PlaceCard";
import { usePlaces } from "../../hooks/usePlaces";
import { useFilters } from "../../hooks/useFilters";

const TAG_FILTERS: { id: string; label: string }[] = [
  { id: "restaurant", label: "Restaurants" },
  { id: "cafe", label: "Cafés" },
  { id: "museum", label: "Museums" },
  { id: "park", label: "Parks" },
  { id: "historical", label: "Historical" },
  { id: "nightlife", label: "Nightlife" },
];

export default function SearchScreen() {
  const { filters, toggleTag } = useFilters();
  const { places } = usePlaces(filters.tags);

  return (
    <ScrollView>
      <Header title="Search places" />
      <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
        <Text style={{ fontWeight: "600", marginBottom: 8 }}>Filters</Text>
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
      <View style={{ padding: 16, gap: 12 }}>
        {places.map((place) => (
          <PlaceCard key={place.id} place={place} />
        ))}
      </View>
    </ScrollView>
  );
}

