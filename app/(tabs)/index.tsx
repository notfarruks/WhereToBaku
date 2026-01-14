import React from "react";
import { ScrollView, View } from "react-native";
import { Header } from "../../components/Header";
import { PlaceCard } from "../../components/PlaceCard";
import { usePlaces } from "../../hooks/usePlaces";

export default function HomeScreen() {
  const { places } = usePlaces();

  return (
    <ScrollView>
      <Header title="Where to in Baku?" />
      <View style={{ padding: 16, gap: 12 }}>
        {places.map((place) => (
          <PlaceCard key={place.id} place={place} />
        ))}
      </View>
    </ScrollView>
  );
}

