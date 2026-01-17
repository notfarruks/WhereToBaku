import React from "react";
import { useLocalSearchParams } from "expo-router";
import { Linking, Platform, Pressable, ScrollView, Share, Text, View, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { Header } from "../../components/Header";
import { usePlaces } from "../../hooks/usePlaces";
import { RatingStars } from "../../components/RatingStars";
import { TagBadge } from "../../components/TagBadge";
import { useFavorites } from "../../hooks/useFavorites";
import type { PriceRange } from "../../features/places/placeTypes";

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

  const { lat, lng } = place.location;
  const mapUrl = Platform.select({
    ios: `http://maps.apple.com/?ll=${lat},${lng}&q=${encodeURIComponent(place.name)}`,
    default: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
  });

  const openMaps = () => {
    if (mapUrl) Linking.openURL(mapUrl);
  };

  const callPlace = () => {
    if (!place.phone) return;
    Linking.openURL(`tel:${place.phone}`);
  };

  const openWebsite = () => {
    if (place.website) Linking.openURL(place.website);
  };

  const openMenu = () => {
    if (place.menuUrl) Linking.openURL(place.menuUrl);
  };

  const openInstagram = () => {
    if (!place.instagram) return;
    const handle = place.instagram.startsWith("@")
      ? place.instagram.slice(1)
      : place.instagram.replace("https://www.instagram.com/", "").replace("/", "");
    Linking.openURL(`https://www.instagram.com/${handle}`);
  };

  const sharePlace = async () => {
    const line1 = `${place.name} - ${place.address}`;
    const link = place.website || mapUrl || "";
    const message = link ? `${line1}\n${link}` : line1;
    try {
      await Share.share({ message });
    } catch (error) {
      console.error("Error sharing place:", error);
    }
  };

  const favorite = isFavorite(place.id);
  const status =
    place.openNow == null
      ? null
      : {
          label: place.openNow ? "Open now" : "Closed",
          color: place.openNow ? "#065F46" : "#B91C1C",
          bg: place.openNow ? "#DCFCE7" : "#FEE2E2",
        };

  const priceLabels: Record<PriceRange, string> = {
    budget: "$",
    moderate: "$$",
    expensive: "$$$",
  };

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
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <RatingStars rating={place.rating} />
                <Text style={{ fontSize: 13, color: "#6B7280" }}>
                  {priceLabels[place.priceRange || "moderate"]} · {place.category}
                </Text>
                {status && (
                  <Text
                    style={{
                      fontSize: 12,
                      color: status.color,
                      backgroundColor: status.bg,
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                      borderRadius: 999,
                    }}
                  >
                    {status.label}
                  </Text>
                )}
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
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <Text style={{ opacity: 0.7, flexShrink: 1 }}>{place.address}</Text>
              <Pressable
                onPress={() => Clipboard.setStringAsync(place.address)}
                style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
              >
                <Ionicons name="copy-outline" size={14} color="#0F766E" />
                <Text style={{ color: "#0F766E", fontSize: 12 }}>Copy</Text>
              </Pressable>
            </View>
            <Pressable onPress={openMaps} style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Ionicons name="map-outline" size={16} color="#2563EB" />
              <Text style={{ color: "#2563EB", fontWeight: "600" }}>Directions</Text>
            </Pressable>
          </View>

          {place.tags.length > 0 && (
            <View style={{ gap: 6 }}>
              <Text style={{ fontWeight: "600" }}>Highlights</Text>
              <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
                {place.tags.map((tag) => (
                  <TagBadge key={tag} label={tag} />
                ))}
              </View>
            </View>
          )}

          <View style={{ gap: 4 }}>
            <Text>{place.description}</Text>
            {place.hours && (
              <Text style={{ color: "#374151" }}>
                Hours: {place.hours}
                {place.openNow != null ? ` - ${place.openNow ? "Open now" : "Closed"}` : ""}
              </Text>
            )}
            {place.priceRange && (
              <Text style={{ color: "#374151" }}>Price range: {priceLabels[place.priceRange]}</Text>
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
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <Ionicons name="call-outline" size={16} color="#FFFFFF" />
                  <Text style={{ color: "#FFFFFF", fontWeight: "600" }}>Call</Text>
                </View>
              </Pressable>
            )}
            {place.phone && (
              <Pressable
                onPress={() => Clipboard.setStringAsync(place.phone!)}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: "#E5E7EB",
                  backgroundColor: "#FFFFFF",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <Ionicons name="copy-outline" size={16} color="#0F172A" />
                  <Text style={{ color: "#0F172A", fontWeight: "600" }}>Copy phone</Text>
                </View>
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
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                    <Ionicons name="globe-outline" size={16} color="#FFFFFF" />
                    <Text style={{ color: "#FFFFFF", fontWeight: "600" }}>Website</Text>
                  </View>
                </Pressable>
            )}
            {place.menuUrl && (
              <Pressable
                onPress={openMenu}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  borderRadius: 10,
                  backgroundColor: "#10B981",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <Ionicons name="restaurant-outline" size={16} color="#FFFFFF" />
                  <Text style={{ color: "#FFFFFF", fontWeight: "600" }}>Menu</Text>
                </View>
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
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <Ionicons name="logo-instagram" size={16} color="#111827" />
                  <Text style={{ color: "#111827", fontWeight: "600" }}>Instagram</Text>
                </View>
              </Pressable>
            )}
            <Pressable
              onPress={sharePlace}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 10,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: "#0F766E",
                backgroundColor: "#FFFFFF",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Ionicons name="share-outline" size={16} color="#0F766E" />
                <Text style={{ color: "#0F766E", fontWeight: "600" }}>Share place</Text>
              </View>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
