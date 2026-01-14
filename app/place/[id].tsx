import React from "react";
import { useLocalSearchParams } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { Header } from "../../components/Header";
import { usePlaces } from "../../hooks/usePlaces";
import { RatingStars } from "../../components/RatingStars";
import { TagBadge } from "../../components/TagBadge";

export default function PlaceDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { places } = usePlaces();
  const place = places.find((p) => p.id === id);

  if (!place) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Place not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <Text style={{ padding: 16 }}>Hello</Text>
      <Header title={place.name} />
      <View style={{ padding: 16, gap: 12 }}>
        <RatingStars rating={place.rating} />
        <Text style={{ opacity: 0.7 }}>{place.address}</Text>
        <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
          {place.tags.map((tag) => (
            <TagBadge key={tag} label={tag} />
          ))}
        </View>
        <Text>{place.description}</Text>
      </View>
    </ScrollView>
  );
}

