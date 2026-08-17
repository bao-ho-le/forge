import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Linking,
  Alert,
  ActivityIndicator,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import * as Location from "expo-location";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../contexts/ThemeContext";
import { useTranslation } from "./Localization/LanguageProvider";
import { Typography } from "../constants/typography";
import AppIcon from "./Icon/AppIcon";
import LocationInput from "./LocationInput";import {
  savePrimaryGym,
  deletePrimaryGym,
  type PrimaryGym,
} from "../lib/gymService";

const BACKDROP_FADE_MS = 200;
const SHEET_SLIDE_MS = 300;
const SHEET_OFFSCREEN_Y = Dimensions.get("window").height;

const MIN_RADIUS = 50;
const MAX_RADIUS = 500;
const RADIUS_STEP = 10;

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

type GymLocationSheetProps = {
  visible: boolean;
  userId: string;
  existingGym: PrimaryGym | null;
  onClose: () => void;
  onSaved: () => void;
};

// Combines street number/name (or the place's own name as a fallback) with
// the city, since a raw reverseGeocodeAsync result is too fragmented to show
// directly.
function formatAddress(place: Location.LocationGeocodedAddress): string {
  const street = [place.streetNumber, place.street].filter(Boolean).join(" ");
  const line = street || place.name || "";
  if (place.city && !line.includes(place.city)) {
    return [line, place.city].filter(Boolean).join(", ");
  }
  return line;
}

export default function GymLocationSheet({
  visible,
  userId,
  existingGym,
  onClose,
  onSaved,
}: GymLocationSheetProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const [name, setName] = useState("");
  const [address, setAddress] = useState<string | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [radiusMeters, setRadiusMeters] = useState(50);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [locating, setLocating] = useState(false);
  const [showNameError, setShowNameError] = useState(false);
  const [showLocationError, setShowLocationError] = useState(false);
  const [showRadiusSection, setShowRadiusSection] = useState(false);
  const [sameLocationMessage, setSameLocationMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [modalVisible, setModalVisible] = useState(visible);
  const backdropOpacity = useSharedValue(0);
  const sheetTranslateY = useSharedValue(SHEET_OFFSCREEN_Y);

  useEffect(() => {
    if (visible) {
      setModalVisible(true);
      backdropOpacity.value = withTiming(1, { duration: BACKDROP_FADE_MS });
      sheetTranslateY.value = withTiming(0, { duration: SHEET_SLIDE_MS });
    } else {
      backdropOpacity.value = withTiming(0, { duration: BACKDROP_FADE_MS });
      sheetTranslateY.value = withTiming(
        SHEET_OFFSCREEN_Y,
        { duration: SHEET_SLIDE_MS },
        (finished) => {
          if (finished) runOnJS(setModalVisible)(false);
        },
      );
    }
  }, [visible]);

  const backdropStyle = useAnimatedStyle(() => ({ opacity: backdropOpacity.value }));
  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: sheetTranslateY.value }],
  }));

  useEffect(() => {
    if (!visible) return;
    setName(existingGym?.name ?? "My Gym");
    setAddress(existingGym?.address ?? null);
    setLatitude(existingGym?.latitude ?? null);
    setLongitude(existingGym?.longitude ?? null);
    setRadiusMeters(existingGym?.radius_meters ?? 50);
    setPermissionDenied(false);
    setShowNameError(false);
    setShowLocationError(false);
    setShowRadiusSection(false);
    setSameLocationMessage(null);
    setError(null);
  }, [visible, existingGym]);

  const handleUseCurrentLocation = async () => {
    setLocating(true);
    setSameLocationMessage(null);
    try {
      const { status, canAskAgain } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setPermissionDenied(true);
        if (!canAskAgain) Linking.openSettings();
        return;
      }
      setPermissionDenied(false);
      setShowLocationError(false);
      const position = await Location.getCurrentPositionAsync({});
      const newLat = position.coords.latitude;
      const newLon = position.coords.longitude;
      const [place] = await Location.reverseGeocodeAsync({
        latitude: newLat,
        longitude: newLon,
      });

      if (existingGym) {
        const distance = calculateDistance(
          existingGym.latitude,
          existingGym.longitude,
          newLat,
          newLon,
        );

        if (distance <= radiusMeters) {
          setSameLocationMessage(t("sameLocationMessage"));
          return;
        }

        const confirmed = await new Promise<boolean>((resolve) => {
          Alert.alert(t("updateGymLocationTitle"), t("updateGymLocationMessage"), [
            { text: t("cancel"), style: "cancel", onPress: () => resolve(false) },
            {
              text: t("update"),
              onPress: () => resolve(true),
            },
          ]);
        });

        if (!confirmed) return;
      }

      setLatitude(newLat);
      setLongitude(newLon);
      setAddress(place ? formatAddress(place) : null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLocating(false);
    }
  };

  const decreaseRadius = () => {
    setRadiusMeters((prev) => Math.max(MIN_RADIUS, prev - RADIUS_STEP));
  };
  const increaseRadius = () => {
    setRadiusMeters((prev) => Math.min(MAX_RADIUS, prev + RADIUS_STEP));
  };

  const handleDelete = () => {
    if (!existingGym) return;
    Alert.alert(t("deleteGymTitle"), t("deleteGymMessage"), [
      { text: t("cancel"), style: "cancel" },
      {
        text: t("delete"),
        style: "destructive",
        onPress: async () => {
          setDeleting(true);
          const result = await deletePrimaryGym(existingGym.id);
          setDeleting(false);

          if (result.error) {
            setError(result.error.message);
            return;
          }

          onSaved();
          onClose();
        },
      },
    ]);
  };

  const handleSave = async () => {
    if (name.trim() === "") {
      setShowNameError(true);
      return;
    }
    if (latitude === null || longitude === null) {
      setShowLocationError(true);
      return;
    }

    setSaving(true);
    setError(null);

    const result = await savePrimaryGym(userId, existingGym?.id ?? null, {
      name: name.trim(),
      address: address ?? "",
      latitude,
      longitude,
      radiusMeters,
    });

    setSaving(false);

    if (result.error) {
      setError(result.error.message);
      return;
    }

    onSaved();
    onClose();
  };

  const circleButtonStyle = ({ pressed }: { pressed: boolean }) => ({
    width: 40,
    height: 40,
    borderRadius: 9999,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    backgroundColor: colors.surfaceMuted,
    opacity: pressed ? 0.7 : 1,
    transform: [{ scale: pressed ? 0.92 : 1 }],
  });

  return (
    <Modal visible={modalVisible} animationType="none" transparent onRequestClose={onClose}>
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <Animated.View
          style={[
            {
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
            },
            backdropStyle,
          ]}
        >
          <Pressable onPress={onClose} style={{ flex: 1 }} />
        </Animated.View>
        <Animated.View
          style={[
            {
              backgroundColor: colors.background,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              height: "85%",
            },
            sheetStyle,
          ]}
        >
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{
                flexGrow: 1,
                paddingTop: 20,
                paddingBottom: insets.bottom + 32,
                paddingHorizontal: 24,
              }}
              showsVerticalScrollIndicator={false}
            >
              {/* Grabber */}
              <View
                className="self-center rounded-full mb-5"
                style={{ width: 40, height: 4, backgroundColor: colors.border }}
              />

              {/* Header */}
              <View className="flex-row items-start justify-between mb-6">
                <Text
                  style={[
                    Typography.heading,
                    { color: colors.textPrimary, letterSpacing: -0.5 },
                  ]}
                >
                  {t("gymLocationManage")}
                </Text>
                <Pressable
                  onPress={onClose}
                  style={({ pressed }) => ({
                    width: 36,
                    height: 36,
                    borderRadius: 9999,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: colors.surfaceMuted,
                    opacity: pressed ? 0.7 : 1,
                  })}
                >
                  <Text style={[Typography.bodyLarge, { color: colors.textSecondary }]}>
                    ✕
                  </Text>
                </Pressable>
              </View>

              {/* Gym Name */}
              <View className="mb-7">
                <View className="flex-row items-center gap-1.5 mb-3.5">
                  <AppIcon name="dumbbell" size={14} color={colors.primary} strokeWidth={2} />
                  <Text
                    style={[
                      Typography.overline,
                      { color: colors.textSecondary, letterSpacing: 0.8 },
                    ]}
                  >
                    {t("gymNameLabel")}
                  </Text>
                </View>
                <LocationInput
                  value={name}
                  onChangeText={(text) => {
                    setShowNameError(false);
                    setName(text);
                  }}
                  placeholder={t("gymNamePlaceholder")}
                />
                {showNameError && (
                  <Text
                    className="mt-2"
                    style={[Typography.label, { color: colors.error }]}
                  >
                    {t("gymNameRequiredError")}
                  </Text>
                )}
              </View>

              {/* Location */}
              <View className="mb-7">
                <View className="flex-row items-center gap-1.5 mb-3.5">
                  <AppIcon name="mapPin" size={14} color={colors.primary} strokeWidth={2} />
                  <Text
                    style={[
                      Typography.overline,
                      { color: colors.textSecondary, letterSpacing: 0.8 },
                    ]}
                  >
                    {t("locationSectionLabel")}
                  </Text>
                </View>

                <View
                  className="rounded-2xl p-4"
                  style={{ backgroundColor: colors.surface }}
                >
                  {permissionDenied ? (
                    <Text
                      style={[Typography.body, { color: colors.textPrimary }]}
                    >
                      {t("locationPermissionRequired")}
                    </Text>
                  ) : latitude !== null && longitude !== null ? (
                    <Text style={[Typography.body, { color: colors.textPrimary }]}>
                      {address || t("noLocationSelected")}
                    </Text>
                  ) : (
                    <>
                      <Text
                        className="mb-1"
                        style={[Typography.body, { color: colors.textPrimary }]}
                      >
                        {t("noLocationSelected")}
                      </Text>
                      <Text style={[Typography.label, { color: colors.textSecondary }]}>
                        {t("noLocationSelectedDesc")}
                      </Text>
                    </>
                  )}
                  {sameLocationMessage && (
                    <Text
                      className="mt-2"
                      style={[Typography.label, { color: colors.error }]}
                    >
                      {sameLocationMessage}
                    </Text>
                  )}
                </View>

                <Pressable
                  onPress={handleUseCurrentLocation}
                  disabled={locating}
                  style={({ pressed }) => ({
                    alignItems: "center",
                    justifyContent: "center",
                    paddingVertical: 12,
                    borderRadius: 14,
                    backgroundColor: colors.primary,
                    opacity: pressed || locating ? 0.8 : 1,
                    marginTop: 12,
                  })}
                >
                  {locating ? (
                    <ActivityIndicator color={colors.onPrimary} />
                  ) : (
                    <Text
                      style={[Typography.bodyLarge, { color: colors.onPrimary }]}
                    >
                      {permissionDenied
                        ? t("allowLocationAccess")
                        : t("useCurrentLocation")}
                    </Text>
                  )}
                </Pressable>

                {showLocationError && (
                  <Text
                    className="mt-2"
                    style={[Typography.label, { color: colors.error }]}
                  >
                    {"⚠ "}
                    {t("locationRequiredError")}
                  </Text>
                )}
              </View>

              {/* Verification Radius: collapsible, same pattern as Reminder
                  in DayEditSheet (title press toggles the content, collapsed
                  by default each time the sheet opens). */}
              <Pressable
                onPress={() => setShowRadiusSection((prev) => !prev)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                className="flex-row items-center gap-1.5 mb-3.5"
              >
                <AppIcon name="ruler" size={14} color={colors.primary} strokeWidth={2} />
                <Text
                  style={[
                    Typography.overline,
                    { color: colors.textSecondary, letterSpacing: 0.8 },
                  ]}
                >
                  {t("verificationRadiusLabel")}
                </Text>
                <View
                  className="ml-1.5"
                  style={{
                    transform: [{ rotate: showRadiusSection ? "180deg" : "0deg" }],
                  }}
                >
                  <AppIcon name="chevronDown" size={14} color={colors.textSecondary} />
                </View>
              </Pressable>
              {showRadiusSection && (
                <View className="mb-7">
                  <Text
                    className="mb-3.5"
                    style={[Typography.label, { color: colors.textSecondary }]}
                  >
                    {t("verificationRadiusHint")}
                  </Text>
                  <View
                    className="items-center rounded-2xl py-4"
                    style={{ backgroundColor: colors.surface }}
                  >
                    <View className="flex-row items-center justify-center gap-6">
                      <Pressable onPress={decreaseRadius} style={circleButtonStyle}>
                        <Text style={[Typography.title, { color: colors.textPrimary }]}>
                          −
                        </Text>
                      </Pressable>
                      <Text style={[Typography.title, { color: colors.primary }]}>
                        {radiusMeters} m
                      </Text>
                      <Pressable onPress={increaseRadius} style={circleButtonStyle}>
                        <Text style={[Typography.title, { color: colors.textPrimary }]}>
                          +
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              )}
              {!showRadiusSection && <View className="mb-7" />}

              {error && (
                <Text
                  className="mb-4 text-center"
                  style={[Typography.label, { color: colors.error }]}
                >
                  {error}
                </Text>
              )}

              {/* Save */}
              <Pressable
                onPress={handleSave}
                disabled={saving || deleting}
                style={({ pressed }) => ({
                  paddingVertical: 16,
                  borderRadius: 16,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: colors.primary,
                  opacity: pressed || saving || deleting ? 0.7 : 1,
                })}
              >
                {saving ? (
                  <ActivityIndicator color={colors.onPrimary} />
                ) : (
                  <Text
                    style={[
                      Typography.bodyLarge,
                      { color: colors.onPrimary, letterSpacing: 0.5 },
                    ]}
                  >
                    {t("save")}
                  </Text>
                )}
              </Pressable>

              {/* Delete (only when editing an existing gym) */}
              {existingGym && (
                <Pressable
                  onPress={handleDelete}
                  disabled={saving || deleting}
                  style={({ pressed }) => ({
                    paddingVertical: 16,
                    borderRadius: 16,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: colors.surfaceMuted,
                    opacity: pressed || saving || deleting ? 0.6 : 1,
                    marginTop: 12,
                  })}
                >
                  {deleting ? (
                    <ActivityIndicator color={colors.error} />
                  ) : (
                    <Text style={[Typography.bodyLarge, { color: colors.error }]}>
                      {t("delete")}
                    </Text>
                  )}
                </Pressable>
              )}
            </ScrollView>
          </KeyboardAvoidingView>
        </Animated.View>
      </View>
    </Modal>
  );
}
