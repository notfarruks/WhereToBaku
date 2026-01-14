import React from "react";
import { ScrollView, Text, View } from "react-native";
import { Header } from "../../components/Header";

export default function ProfileScreen() {
  return (
    <ScrollView>
      <Header title="Your profile" />
      <View style={{ padding: 16, gap: 12 }}>
        <Text>Preferences and user settings will live here.</Text>
      </View>
    </ScrollView>
  );
}

