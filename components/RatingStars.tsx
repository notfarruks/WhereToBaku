import React from "react";
import { Text, View } from "react-native";

type Props = {
  rating: number;
  outOf?: number;
};

export const RatingStars: React.FC<Props> = ({ rating, outOf = 5 }) => {
  const fullStars = Math.round(rating);

  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
      <Text>
        {"★".repeat(fullStars)}
        {"☆".repeat(outOf - fullStars)}
      </Text>
      <Text style={{ fontSize: 12, opacity: 0.7 }}>{rating.toFixed(1)}</Text>
    </View>
  );
};

