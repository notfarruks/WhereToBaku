import React from "react";
import { Text, View } from "react-native";

type HeaderProps = {
  title: string;
};

export const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <View style={{ paddingHorizontal: 16, paddingTop: 24, paddingBottom: 12 }}>
      <Text style={{ fontSize: 24, fontWeight: "700" }}>{title}</Text>
    </View>
  );
};

