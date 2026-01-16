import React from "react";
import { ScrollView, View } from "react-native";
import { Header } from "../../components/Header";
import { PlaceCard } from "../../components/PlaceCard";
import { PLACES } from "../../src/data/places";

export default function HomeScreen() {
  return (
    <ScrollView>
      <Header title="Where to in Baku?" />
      <View style={{ padding: 16, gap: 12 }}>
        {PLACES.map((place) => (
          <PlaceCard key={place.id} place={place} />
        ))}
      </View>
    </ScrollView>
  );
}

