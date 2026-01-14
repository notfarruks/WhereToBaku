import React from "react";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { Place } from "../features/places/placeTypes";
import { RatingStars } from "./RatingStars";
import { TagBadge } from "./TagBadge";

type Props = {
  place: Place;
};

export const PlaceCard: React.FC<Props> = ({ place }) => {
  const router = useRouter();

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
      <Text style={{ fontWeight: "600", fontSize: 16 }}>{place.name}</Text>
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

