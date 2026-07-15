import React from "react";
import { View, Text, ScrollView, StatusBar, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useTheme } from "../contexts/ThemeContext";
import { Typography } from "../constants/typography";
import { IconSize } from "../constants/iconSizes";
import AppIcon from "../components/Icon/AppIcon";
import DisciplineHero from "../components/DisciplineHero";
import RestrictedApps from "../components/RestrictedApps";
import DisciplineRecoveryCard from "../components/DisciplineRecoveryCard";
import RecoveryButton from "../components/RecoveryButton";

export default function DisciplineModeScreen() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingTop: insets.top + 8,
          paddingBottom: 32,
          paddingHorizontal: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* ===== TOP BAR ===== */}
        <View className="flex-row items-center mb-2">
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
        </View>

        {/* ===== HERO SECTION ===== */}
        <DisciplineHero />

        {/* ===== RESTRICTED APPS ===== */}
        <RestrictedApps />

        {/* ===== RECOVERY CARD ===== */}
        <DisciplineRecoveryCard />

        {/* ===== ACTION BUTTON ===== */}
        <RecoveryButton />

        {/* ===== FOOTER MESSAGE ===== */}
        <Text
          className="text-center px-5 mb-3"
          style={[Typography.label, { color: colors.textSecondary, lineHeight: 20 }]}
        >
          This isn't punishment. It's a reminder of the commitment you made to
          yourself.
        </Text>
      </ScrollView>
    </View>
  );
}
