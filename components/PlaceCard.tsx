import React from "react";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { Place } from "../features/places/placeTypes";
import { RatingStars } from "./RatingStars";
import { TagBadge } from "./TagBadge";
import { useFavorites } from "../hooks/useFavorites";

type Props = {
  place: Place;
  distanceKm?: number;
  onPress?: () => void | boolean;
};

export const PlaceCard: React.FC<Props> = ({ place, distanceKm, onPress }) => {
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(place.id);
  const status =
    place.openNow == null
      ? null
      : {
          label: place.openNow ? "Open" : "Closed",
          color: place.openNow ? "#065F46" : "#B91C1C",
          bg: place.openNow ? "#DCFCE7" : "#FEE2E2",
        };

  return (
    <Pressable
      onPress={() => {
        const result = onPress ? onPress() : undefined;
        if (result === false) return;
        router.push(`/place/${place.id}`);
      }}
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
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <RatingStars rating={place.rating} />
        {status && (
          <Text
            style={{
              fontSize: 12,
              color: status.color,
              backgroundColor: status.bg,
              paddingHorizontal: 8,
              paddingVertical: 2,
              borderRadius: 999,
            }}
          >
            {status.label}
          </Text>
        )}
      </View>
      <Text style={{ opacity: 0.7 }}>
        {place.address}
        {typeof distanceKm === "number" ? ` · ${distanceKm.toFixed(1)} km away` : ""}
      </Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
        {place.tags.map((tag) => (
          <TagBadge key={tag} label={tag} />
        ))}
      </View>
    </Pressable>
  );
};

