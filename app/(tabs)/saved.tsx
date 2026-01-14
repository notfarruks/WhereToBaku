import React from "react";
import { ScrollView, Text, View } from "react-native";
import { Header } from "../../components/Header";
import { PlaceCard } from "../../components/PlaceCard";
import { useFavorites } from "../../hooks/useFavorites";

export default function SavedScreen() {
  const { favorites } = useFavorites();

  return (
    <ScrollView>
      <Header title="Saved places" />
      <View style={{ padding: 16, gap: 12 }}>
        {favorites.length === 0 ? (
          <Text style={{ opacity: 0.7 }}>You have no saved places yet.</Text>
        ) : (
          favorites.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))
        )}
      </View>
    </ScrollView>
  );
}

