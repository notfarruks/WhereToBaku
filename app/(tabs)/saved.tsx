import React from "react";
import { ScrollView, Text, View } from "react-native";
import { Header } from "../../components/Header";
import { PlaceCard } from "../../components/PlaceCard";
import { useFavorites } from "../../hooks/useFavorites";
import { usePlaces } from "../../hooks/usePlaces";

const SavedScreen = () => {
  const { favorites: favoriteIds } = useFavorites();
  const { places } = usePlaces();
  const favoritePlaces = places.filter((place) => favoriteIds.includes(place.id));

  return (
    <ScrollView>
      <Header title="Saved places" />
      <View style={{ padding: 16, gap: 12 }}>
        {favoritePlaces.length === 0 ? (
          <Text style={{ opacity: 0.7 }}>You have no saved places yet.</Text>
        ) : (
          favoritePlaces.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))
        )}
      </View>
    </ScrollView>
  );
};

export default SavedScreen;

