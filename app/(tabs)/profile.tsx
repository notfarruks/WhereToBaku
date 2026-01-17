import React from "react";
import { Linking, Pressable, ScrollView, Switch, Text, View } from "react-native";
import { Header } from "../../components/Header";
import { FilterChip } from "../../components/FilterChip";
import { useOnboardingPreferences } from "../../hooks/useOnboardingPreferences";
import { useFavorites } from "../../hooks/useFavorites";
import { useAppSettings } from "../../hooks/useAppSettings";
import type { PlaceCategory, PriceRange } from "../../features/places/placeTypes";

const TAG_OPTIONS: { id: string; label: string }[] = [
  { id: "romantic", label: "Romantic" },
  { id: "family-friendly", label: "Family friendly" },
  { id: "historical", label: "Historical" },
  { id: "museum", label: "Museums" },
  { id: "park", label: "Parks" },
  { id: "restaurant", label: "Restaurants" },
  { id: "cafe", label: "Cafes" },
  { id: "nightlife", label: "Nightlife" },
];

const CATEGORY_OPTIONS: { id: PlaceCategory; label: string }[] = [
  { id: "restaurant", label: "Restaurant" },
  { id: "cafe", label: "Cafe" },
  { id: "bar", label: "Bar" },
  { id: "park", label: "Park" },
  { id: "museum", label: "Museum" },
  { id: "landmark", label: "Landmark" },
  { id: "shopping", label: "Shopping" },
];

const PRICE_OPTIONS: { id: PriceRange; label: string }[] = [
  { id: "budget", label: "$" },
  { id: "moderate", label: "$$" },
  { id: "expensive", label: "$$$" },
];

export default function ProfileScreen() {
  const { preferences, toggleTag, togglePriceRange, toggleCategory, resetPreferences } =
    useOnboardingPreferences();
  const { clearFavorites, favorites } = useFavorites();
  const { settings, toggleLocation } = useAppSettings();

  return (
    <ScrollView>
      <Header title="Profile" />
      <View style={{ padding: 16, gap: 18 }}>
        <View style={{ gap: 12 }}>
          <Text style={{ fontWeight: "700", fontSize: 16 }}>Preferences</Text>
          <Text style={{ color: "#6B7280" }}>Tell us what to recommend.</Text>

          <View style={{ gap: 6 }}>
            <Text style={{ fontWeight: "600" }}>Favorite categories</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {CATEGORY_OPTIONS.map((option) => (
                <FilterChip
                  key={option.id}
                  label={option.label}
                  selected={preferences.categories.includes(option.id)}
                  onPress={() => toggleCategory(option.id)}
                />
              ))}
            </View>
          </View>

          <View style={{ gap: 6 }}>
            <Text style={{ fontWeight: "600" }}>Vibe tags</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {TAG_OPTIONS.map((option) => (
                <FilterChip
                  key={option.id}
                  label={option.label}
                  selected={preferences.tags.includes(option.id)}
                  onPress={() => toggleTag(option.id)}
                />
              ))}
            </View>
          </View>

          <View style={{ gap: 6 }}>
            <Text style={{ fontWeight: "600" }}>Price range</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {PRICE_OPTIONS.map((option) => (
                <FilterChip
                  key={option.id}
                  label={option.label}
                  selected={preferences.priceRanges.includes(option.id)}
                  onPress={() => togglePriceRange(option.id)}
                />
              ))}
            </View>
          </View>

        </View>

        <View style={{ gap: 12 }}>
          <Text style={{ fontWeight: "700", fontSize: 16 }}>Location</Text>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <View>
              <Text style={{ fontWeight: "600" }}>Use device location</Text>
              <Text style={{ color: "#6B7280", fontSize: 12 }}>
                Improves “Near you” and distance sorting.
              </Text>
            </View>
            <Switch value={settings.locationEnabled} onValueChange={toggleLocation} />
          </View>
          <View>
            <Text style={{ fontWeight: "600" }}>Distance unit</Text>
            <Text style={{ color: "#6B7280", fontSize: 12 }}>Kilometers</Text>
          </View>
        </View>

        <View style={{ gap: 12 }}>
          <Text style={{ fontWeight: "700", fontSize: 16 }}>Saved & data</Text>
          <Text style={{ color: "#6B7280" }}>Manage your local data.</Text>
          <Pressable
            onPress={clearFavorites}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 10,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: "#0F766E",
              backgroundColor: "#FFFFFF",
            }}
          >
            <Text style={{ color: "#0F766E", fontWeight: "700" }}>
              Clear saved places ({favorites.length})
            </Text>
          </Pressable>
          <Pressable
            onPress={resetPreferences}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 10,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: "#E5E7EB",
              backgroundColor: "#FFFFFF",
            }}
          >
            <Text style={{ color: "#111827", fontWeight: "700" }}>Reset preferences</Text>
          </Pressable>
        </View>

        <View style={{ gap: 12 }}>
          <Text style={{ fontWeight: "700", fontSize: 16 }}>Support</Text>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <Pressable
              onPress={() => Linking.openURL("mailto:feedback@wheretobaku.example?subject=Feedback")}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 10,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: "#0F766E",
                backgroundColor: "#ECFEFF",
              }}
            >
              <Text style={{ color: "#0F766E", fontWeight: "700" }}>Send feedback</Text>
            </Pressable>
            <Pressable
              onPress={() => Linking.openURL("mailto:report@wheretobaku.example?subject=Report a place")}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 10,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: "#E5E7EB",
                backgroundColor: "#FFFFFF",
              }}
            >
              <Text style={{ color: "#111827", fontWeight: "700" }}>Report a place</Text>
            </Pressable>
          </View>
        </View>

        <View style={{ gap: 6 }}>
          <Text style={{ fontWeight: "700", fontSize: 16 }}>About</Text>
          <Text style={{ color: "#6B7280" }}>
            WhereToBaku · Local-only MVP. Sync and multi-device coming with Supabase.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

