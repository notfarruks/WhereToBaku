import React from "react";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { Place } from "../features/places/placeTypes";
import { RatingStars } from "./RatingStars";
import { TagBadge } from "./TagBadge";
import { useFavorites } from "../hooks/useFavorites";

type Props = {
  place: Place;
};

export const PlaceCard: React.FC<Props> = ({ place }) => {
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(place.id);

  return (
    <Pressable
      onPress={() => router.push(`/place/${place.id}`)}
      style={{
        borderRadius: 12,
        backgroundColor: "#FFFFFF",
        padding: 12,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
        gap: 6,
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ fontWeight: "600", fontSize: 16, flex: 1 }}>{place.name}</Text>
        <Pressable
          onPress={(event) => {
            event.stopPropagation?.();
            toggleFavorite(place.id);
          }}
          style={{
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 999,
          }}
          accessibilityRole="button"
          accessibilityLabel={favorite ? "Remove from saved" : "Save place"}
        >
          <Text style={{ fontSize: 18, color: favorite ? "#DC2626" : "#9CA3AF" }}>
            {favorite ? "♥" : "♡"}
          </Text>
        </Pressable>
      </View>
      <RatingStars rating={place.rating} />
      <Text style={{ opacity: 0.7 }}>{place.address}</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
        {place.tags.map((tag) => (
          <TagBadge key={tag} label={tag} />
        ))}
      </View>
    </Pressable>
  );
};

