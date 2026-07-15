import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useTheme } from "../contexts/ThemeContext";
import { useTranslation } from "../components/Localization/LanguageProvider";
import { Typography } from "../constants/typography";
import { IconSize } from "../constants/iconSizes";
import AppIcon from "../components/Icon/AppIcon";

export default function GymLocationScreen() {
  const { colors, isDark } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [location, setLocation] = useState("Iron Temple Gym");

  const handleSave = () => {
    router.back();
  };

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />

      <View className="flex-1 px-5" style={{ paddingTop: insets.top + 16 }}>
        {/* Top Bar */}
        <View className="flex-row items-center mb-6">
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => ({
              width: 40,
              height: 40,
              borderRadius: 9999,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: colors.surfaceMuted,
              opacity: pressed ? 0.6 : 1,
            })}
          >
            <AppIcon
              name="chevronLeft"
              size={IconSize.md}
              color={colors.textPrimary}
              strokeWidth={2}
            />
          </Pressable>

          <Text
            className="ml-3"
            style={[
              Typography.heading,
              { color: colors.textPrimary, letterSpacing: -0.5 },
            ]}
          >
            {t("gymLocationManage")}
          </Text>
        </View>

        {/* Current Location */}
        <View
          className="rounded-2xl p-4 mb-6"
          style={{
            backgroundColor: colors.surface,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.04,
            shadowRadius: 6,
            elevation: 2,
          }}
        >
          <Text
            className="mb-2"
            style={[
              Typography.overline,
              { color: colors.textSecondary, letterSpacing: 1 },
            ]}
          >
            {t("currentGym")}
          </Text>
          <View className="flex-row items-center gap-2.5 mb-3">
            <View
              className="w-10 h-10 rounded-[10px] justify-center items-center"
              style={{ backgroundColor: colors.primaryContainer }}
            >
              <AppIcon
                name="mapPin"
                size={IconSize.md}
                color={colors.primary}
                strokeWidth={1.8}
              />
            </View>
            <Text style={[Typography.bodyLarge, { color: colors.textPrimary }]}>
              {location}
            </Text>
          </View>
          <TextInput
            value={location}
            onChangeText={setLocation}
            placeholder={t("gymLocationManage")}
            placeholderTextColor={colors.textSecondary}
            className="rounded-xl py-3 px-4"
            style={[Typography.body, { backgroundColor: isDark ? colors.surfaceMuted : colors.surface, color: colors.textPrimary, borderWidth: isDark ? 0 : 1, borderColor: colors.border }]}
          />
        </View>

        {/* Save Button */}
        <Pressable
          onPress={handleSave}
          style={({ pressed }) => ({
            alignSelf: "stretch",
            paddingVertical: 16,
            borderRadius: 20,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: colors.primary,
            opacity: pressed ? 0.85 : 1,
            transform: [{ scale: pressed ? 0.97 : 1 }],
          })}
        >
          <Text
            style={[
              Typography.bodyLarge,
              { color: colors.onPrimary, letterSpacing: 0.3 },
            ]}
          >
            {t("save")}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
