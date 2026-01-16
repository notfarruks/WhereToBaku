import React from "react";
import { useLocalSearchParams } from "expo-router";
import { Linking, Platform, Pressable, ScrollView, Text, View, Image } from "react-native";
import { Header } from "../../components/Header";
import { usePlaces } from "../../hooks/usePlaces";
import { RatingStars } from "../../components/RatingStars";
import { TagBadge } from "../../components/TagBadge";
import { useFavorites } from "../../hooks/useFavorites";

export default function PlaceDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { places } = usePlaces();
  const { toggleFavorite, isFavorite } = useFavorites();
  const place = places.find((p) => p.id === id);

  if (!place) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Place not found.</Text>
      </View>
    );
  }

  const openMaps = () => {
    const label = encodeURIComponent(place.name);
    const { lat, lng } = place.location;
    const url = Platform.select({
      ios: `http://maps.apple.com/?ll=${lat},${lng}&q=${label}`,
      default: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
    });
    if (url) Linking.openURL(url);
  };

  const callPlace = () => {
    if (!place.phone) return;
    Linking.openURL(`tel:${place.phone}`);
  };

  const openWebsite = () => {
    if (place.website) Linking.openURL(place.website);
  };

  const openInstagram = () => {
    if (!place.instagram) return;
    const handle = place.instagram.startsWith("@")
      ? place.instagram.slice(1)
      : place.instagram.replace("https://www.instagram.com/", "").replace("/", "");
    Linking.openURL(`https://www.instagram.com/${handle}`);
  };

  const favorite = isFavorite(place.id);

  return (
    <ScrollView>
      <Header title={place.name} />
      <View style={{ gap: 12 }}>
        {place.images?.[0] && (
          <Image
            source={{ uri: place.images[0] }}
            style={{ width: "100%", height: 220, backgroundColor: "#E5E7EB" }}
            resizeMode="cover"
          />
        )}
        <View style={{ padding: 16, gap: 12 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View style={{ gap: 4 }}>
              <Text style={{ fontSize: 22, fontWeight: "700" }}>{place.name}</Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <RatingStars rating={place.rating} />
                <Text style={{ fontSize: 13, color: "#6B7280" }}>{place.category}</Text>
              </View>
            </View>
            <Pressable
              onPress={() => toggleFavorite(place.id)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: favorite ? "#0F766E" : "#E5E7EB",
                backgroundColor: favorite ? "#CCFBF1" : "#FFFFFF",
              }}
            >
              <Text style={{ color: "#0F766E", fontWeight: "600" }}>
                {favorite ? "Saved" : "Save"}
              </Text>
            </Pressable>
          </View>

          <View style={{ gap: 6 }}>
            <Text style={{ opacity: 0.7 }}>{place.address}</Text>
            <Pressable onPress={openMaps}>
              <Text style={{ color: "#2563EB", fontWeight: "600" }}>Open in Maps</Text>
            </Pressable>
          </View>

          <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
            {place.tags.map((tag) => (
              <TagBadge key={tag} label={tag} />
            ))}
          </View>

          <View style={{ gap: 4 }}>
            <Text>{place.description}</Text>
            {place.hours && (
              <Text style={{ color: "#374151" }}>
                Hours: {place.hours} {place.openNow != null && `• ${place.openNow ? "Open now" : "Closed"}`}
              </Text>
            )}
          </View>

          <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
            {place.phone && (
              <Pressable
                onPress={callPlace}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  borderRadius: 10,
                  backgroundColor: "#0EA5E9",
                }}
              >
                <Text style={{ color: "#FFFFFF", fontWeight: "600" }}>Call</Text>
              </Pressable>
            )}
            {place.website && (
              <Pressable
                onPress={openWebsite}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  borderRadius: 10,
                  backgroundColor: "#111827",
                }}
              >
                <Text style={{ color: "#FFFFFF", fontWeight: "600" }}>Website</Text>
              </Pressable>
            )}
            {place.instagram && (
              <Pressable
                onPress={openInstagram}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: "#E5E7EB",
                }}
              >
                <Text style={{ color: "#111827", fontWeight: "600" }}>Instagram</Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
