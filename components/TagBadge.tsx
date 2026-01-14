import React from "react";
import { Text, View } from "react-native";

type Props = {
  label: string;
};

export const TagBadge: React.FC<Props> = ({ label }) => {
  return (
    <View
      style={{
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
        backgroundColor: "#F3F4F6",
      }}
    >
      <Text style={{ fontSize: 12, color: "#374151" }}>{label}</Text>
    </View>
  );
};

