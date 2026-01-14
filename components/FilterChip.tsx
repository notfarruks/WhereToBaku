import React from "react";
import { Pressable, Text } from "react-native";

type Props = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
};

export const FilterChip: React.FC<Props> = ({ label, selected, onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: selected ? "#0F766E" : "#E5E7EB",
        backgroundColor: selected ? "#CCFBF1" : "#FFFFFF",
      }}
    >
      <Text style={{ fontSize: 13, color: "#111827" }}>{label}</Text>
    </Pressable>
  );
};

