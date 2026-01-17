import React, { useCallback, useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Header } from "../../components/Header";
import { FilterChip } from "../../components/FilterChip";
import { PlaceCard } from "../../components/PlaceCard";
import { calculateDistance, calculateRelevanceScore } from "../../features/places/placeUtils";
import type { PriceRange } from "../../features/places/placeTypes";
import { useLocation } from "../../hooks/useLocation";
import { useOnboardingPreferences } from "../../hooks/useOnboardingPreferences";
import { PLACES } from "../../src/data/places";

const TAG_OPTIONS: { id: string; label: string }[] = [
  { id: "romantic", label: "Romantic" },
  { id: "family-friendly", label: "Family friendly" },
  { id: "historical", label: "Historical" },
  { id: "museum", label: "Museums" },
  { id: "park", label: "Parks" },
  { id: "restaurant", label: "Restaurants" },
  { id: "cafe", label: "Cafes" },
];

const PRICE_OPTIONS: { id: PriceRange; label: string }[] = [
  { id: "budget", label: "$" },
  { id: "moderate", label: "$$" },
  { id: "expensive", label: "$$$" },
];

const PRICE_LABELS: Record<PriceRange, string> = {
  budget: "$",
  moderate: "$$",
  expensive: "$$$",
};

export default function HomeScreen() {
  const router = useRouter();
  const location = useLocation();
  const {
    preferences,
    loading: prefsLoading,
    toggleTag,
    togglePriceRange,
    saveAndComplete,
    setCompleted,
  } = useOnboardingPreferences();
  const [editingPrefs, setEditingPrefs] = useState(false);
  const [prefCardHidden, setPrefCardHidden] = useState(false);

  const userLocation = useMemo(
    () => ({
      lat: location.latitude,
      lng: location.longitude,
    }),
    [location.latitude, location.longitude]
  );

  const handleSavePreferences = useCallback(async () => {
    await saveAndComplete();
    setEditingPrefs(false);
    setPrefCardHidden(true);
  }, [saveAndComplete]);

  const handleSkip = useCallback(async () => {
    await setCompleted(true);
    setEditingPrefs(false);
    setPrefCardHidden(true);
  }, [setCompleted]);

  const reopenPreferences = useCallback(() => {
    setPrefCardHidden(false);
    setEditingPrefs(true);
  }, []);

  const showPreferences = (!prefCardHidden && !preferences.completed) || editingPrefs;

  const nearYou = useMemo(() => {
    return [...PLACES]
      .map((place) => ({
        place,
        distance: calculateDistance(
          userLocation.lat,
          userLocation.lng,
          place.location.lat,
          place.location.lng
        ),
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 5);
  }, [userLocation.lat, userLocation.lng]);

  const suggestedForYou = useMemo(() => {
    const nearTopIds = new Set(nearYou.slice(0, 2).map((item) => item.place.id));

    return PLACES.map((place) => {
      const baseScore = calculateRelevanceScore(
        place,
        userLocation.lat,
        userLocation.lng,
        preferences.tags,
        0
      );
      const matchingTags = preferences.tags.filter((tag) => place.tags.includes(tag)).length;
      const tagBoost = matchingTags * 0.8;
      const categoryBoost = preferences.categories.includes(place.category) ? 0.8 : 0;
      const priceBoost =
        preferences.priceRanges.length === 0
          ? 0
          : place.priceRange && preferences.priceRanges.includes(place.priceRange)
          ? 1
          : -0.5;
      const diversityPenalty = nearTopIds.has(place.id) ? 0.8 : 0;

      return { place, score: baseScore + tagBoost + categoryBoost + priceBoost - diversityPenalty };
    })
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((item) => item.place);
  }, [nearYou, preferences.categories, preferences.priceRanges, preferences.tags, userLocation.lat, userLocation.lng]);

  const openNow = useMemo(() => {
    return PLACES.filter((place) => place.openNow).slice(0, 5);
  }, []);

  const goToSearchWithPrefs = useCallback(() => {
    router.push({
      pathname: "/(tabs)/search",
      params: {
        tags: preferences.tags.join(","),
        prices: preferences.priceRanges.join(","),
        openNow: preferences.completed ? "false" : "false",
      },
    });
  }, [preferences.priceRanges, preferences.tags, preferences.completed, router]);

  return (
    <ScrollView>
      <Header title="Where to in Baku?" />
      <View style={{ padding: 16, gap: 18 }}>
        {!prefCardHidden || editingPrefs || !preferences.completed ? (
          <View
            style={{
              backgroundColor: "#ECFEFF",
              borderColor: "#67E8F9",
              borderWidth: 1,
              borderRadius: 14,
              padding: 14,
              gap: 10,
            }}
          >
            {prefsLoading ? (
              <Text style={{ fontWeight: "600" }}>Loading your preferences...</Text>
            ) : showPreferences ? (
              <>
                <View style={{ gap: 4 }}>
                  <Text style={{ fontWeight: "700", fontSize: 16 }}>Make it personal</Text>
                  <Text style={{ color: "#0F172A" }}>
                    Pick a couple of tags and price ranges to tailor suggestions.
                  </Text>
                </View>
                <View style={{ gap: 6 }}>
                  <Text style={{ fontWeight: "600" }}>Tags</Text>
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
                  <Text style={{ fontWeight: "600" }}>Price</Text>
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
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <Pressable
                    onPress={handleSavePreferences}
                    style={{
                      flex: 1,
                      backgroundColor: "#0F766E",
                      paddingVertical: 10,
                      borderRadius: 10,
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ color: "#FFFFFF", fontWeight: "700" }}>Save</Text>
                  </Pressable>
                  {!preferences.completed && (
                    <Pressable
                      onPress={handleSkip}
                      style={{
                        paddingVertical: 10,
                        paddingHorizontal: 12,
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: "#0F766E",
                        backgroundColor: "#FFFFFF",
                      }}
                    >
                      <Text style={{ color: "#0F766E", fontWeight: "600" }}>Skip</Text>
                    </Pressable>
                  )}
                  {preferences.completed && (
                    <Pressable
                      onPress={() => {
                        setEditingPrefs(false);
                        setPrefCardHidden(true);
                      }}
                      style={{
                        paddingVertical: 10,
                        paddingHorizontal: 12,
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: "#E5E7EB",
                        backgroundColor: "#FFFFFF",
                      }}
                    >
                      <Text style={{ color: "#111827", fontWeight: "600" }}>Hide</Text>
                    </Pressable>
                  )}
                </View>
              </>
            ) : (
              <View style={{ gap: 8 }}>
                <Text style={{ fontWeight: "700", fontSize: 16 }}>Preferences saved</Text>
                <Text style={{ color: "#0F172A" }}>
                  Tags: {preferences.tags.length ? preferences.tags.join(", ") : "Any"} | Price:{" "}
                  {preferences.priceRanges.length
                    ? preferences.priceRanges.map((p) => PRICE_LABELS[p]).join(", ")
                    : "Any"}
                </Text>
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <Pressable
                    onPress={() => setEditingPrefs(true)}
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: "#0F766E",
                      backgroundColor: "#FFFFFF",
                    }}
                  >
                    <Text style={{ color: "#0F766E", fontWeight: "600" }}>Edit</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setPrefCardHidden(true)}
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: "#E5E7EB",
                      backgroundColor: "#FFFFFF",
                    }}
                  >
                    <Text style={{ color: "#111827", fontWeight: "600" }}>Hide</Text>
                  </Pressable>
                </View>
              </View>
            )}
          </View>
        ) : null}

        {preferences.completed && prefCardHidden && (
          <Pressable
            onPress={reopenPreferences}
            style={{ alignSelf: "flex-start", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1, borderColor: "#0F766E" }}
          >
            <Text style={{ color: "#0F766E", fontWeight: "600" }}>Edit preferences</Text>
          </Pressable>
        )}

        <Pressable
          onPress={goToSearchWithPrefs}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            padding: 12,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "#0F766E",
            backgroundColor: "#ECFEFF",
          }}
        >
          <Text style={{ color: "#0F766E", fontWeight: "700" }}>Search with my picks</Text>
        </Pressable>

        <View style={{ gap: 10 }}>
          <Text style={{ fontWeight: "700", fontSize: 18 }}>Near you</Text>
          <View style={{ gap: 12 }}>
            {nearYou.length > 0 ? (
              nearYou.map(({ place, distance }) => (
                <PlaceCard key={place.id} place={place} distanceKm={distance} />
              ))
            ) : (
              <Text style={{ color: "#6B7280" }}>No nearby places yet.</Text>
            )}
          </View>
        </View>

        <View style={{ gap: 10 }}>
          <Text style={{ fontWeight: "700", fontSize: 18 }}>Suggested for you</Text>
          <View style={{ gap: 12 }}>
            {suggestedForYou.length > 0 ? (
              suggestedForYou.map((place) => (
                <PlaceCard key={place.id} place={place} />
              ))
            ) : (
              <Text style={{ color: "#6B7280" }}>No suggestions yet.</Text>
            )}
          </View>
        </View>

        <View style={{ gap: 10 }}>
          <Text style={{ fontWeight: "700", fontSize: 18 }}>Open now</Text>
          <View style={{ gap: 12 }}>
            {openNow.length > 0 ? (
              openNow.map((place) => (
                <PlaceCard key={place.id} place={place} />
              ))
            ) : (
              <Text style={{ color: "#6B7280" }}>No places are open right now.</Text>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
