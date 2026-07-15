import React from "react";
import { View, Text, ScrollView, StatusBar, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useTheme } from "../contexts/ThemeContext";
import { useTranslation } from "../components/Localization/LanguageProvider";
import { Typography } from "../constants/typography";
import { IconSize } from "../constants/iconSizes";
import WorkoutCard from "../components/WorkoutCard";
import ScheduleCard from "../components/ScheduleCard";
import RecoveryCard from "../components/RecoveryCard";
import ThemeToggle from "../components/ThemeToggle";
import AppIcon from "../components/Icon/AppIcon";
import BottomTabBar from "../components/BottomTabBar";
import { navigateToTab } from "../constants/tabNavigation";

export default function HomeScreen() {
  const { colors, isDark } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  // Mock data with translated values
  const WORKOUT = {
    name: t("workoutName"),
    status: t("statusUpcoming"),
    time: t("timeAm"),
    location: t("location"),
  };

  const SCHEDULE_ITEMS = [
    {
      day: t("wednesday"),
      info: `${t("timeAm")} · ${t("location")}`,
      dateNumber: 16,
    },
    {
      day: t("friday"),
      info: `${t("timeAm2")} · ${t("location")}`,
      dateNumber: 18,
    },
  ];

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />

      {/* Scrollable Content */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingBottom: 8,
          paddingHorizontal: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* ===== HEADER SECTION ===== */}
        <View className="flex-row items-center justify-between mb-7">
          {/* Left: Greeting */}
          <View>
            <Text
              style={[
                Typography.heading,
                { color: colors.textPrimary, letterSpacing: -0.5 },
              ]}
            >
              {t("greeting")}
            </Text>
          </View>

          {/* Right: Controls */}
          <View className="flex-row items-center gap-2">
            <Pressable
              onPress={() => router.push("/subscription-plan")}
              style={({ pressed }) => ({
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 16,
                backgroundColor: colors.premium,
                opacity: pressed ? 0.8 : 1,
                transform: [{ scale: pressed ? 0.95 : 1 }],
              })}
            >
              <AppIcon
                name="crown"
                size={IconSize.sm}
                color={colors.premiumContainer}
                strokeWidth={2.5}
              />
              <Text
                style={[
                  Typography.overline,
                  { color: colors.premiumContainer, letterSpacing: 0.3 },
                ]}
              >
                Upgrade
              </Text>
            </Pressable>
            <ThemeToggle />
          </View>
        </View>

        {/* ===== TODAY WORKOUT SECTION ===== */}
        <View className="mb-6">
          <Text
            className="mb-3.5"
            style={[
              Typography.overline,
              { color: colors.textSecondary, letterSpacing: 1.2 },
            ]}
          >
            {t("todayWorkout")}
          </Text>

          <WorkoutCard
            name={WORKOUT.name}
            status={WORKOUT.status}
            time={WORKOUT.time}
            location={WORKOUT.location}
          />
        </View>

        {/* ===== UPCOMING SCHEDULE SECTION ===== */}
        <View className="mb-4">
          <Text
            className="mb-3.5"
            style={[
              Typography.overline,
              { color: colors.textSecondary, letterSpacing: 1.2 },
            ]}
          >
            {t("upcomingSchedule")}
          </Text>

          {SCHEDULE_ITEMS.map((item) => (
            <ScheduleCard
              key={item.day}
              day={item.day}
              info={item.info}
              dateNumber={item.dateNumber}
            />
          ))}
        </View>

        {/* ===== RECOVERY SECTION ===== */}
        <RecoveryCard />

        {/* Spacer at bottom for tab bar */}
        <View className="h-5" />
      </ScrollView>

      {/* ===== BOTTOM TAB BAR ===== */}
      <BottomTabBar
        activeTab="home"
        onTabPress={(tab) => navigateToTab("home", tab)}
      />
    </View>
  );
}
