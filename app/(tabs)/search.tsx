import React from "react";
import { ScrollView, Text, View } from "react-native";
import { Header } from "../../components/Header";
import { FilterChip } from "../../components/FilterChip";
import { PlaceCard } from "../../components/PlaceCard";
import { usePlaces } from "../../hooks/usePlaces";
import { useFilters } from "../../hooks/useFilters";

export default function SearchScreen() {
  const { filters, availableFilters, toggleFilter } = useFilters();
  const { places } = usePlaces(filters);

  return (
    <ScrollView>
      <Header title="Search places" />
      <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
        <Text style={{ fontWeight: "600", marginBottom: 8 }}>Filters</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {availableFilters.map((f) => (
            <FilterChip
              key={f.id}
              label={f.label}
              selected={filters.includes(f.id)}
              onPress={() => toggleFilter(f.id)}
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

