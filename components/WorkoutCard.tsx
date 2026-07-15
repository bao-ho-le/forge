import React from "react";
import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useTheme } from "../contexts/ThemeContext";
import { useTranslation } from "./Localization/LanguageProvider";
import { Typography } from "../constants/typography";
import { IconSize } from "../constants/iconSizes";
import AppIcon from "./Icon/AppIcon";

type WorkoutCardProps = {
  name: string;
  status: string;
  time: string;
  location: string;
};

export default function WorkoutCard({
  name,
  status,
  time,
  location,
}: WorkoutCardProps) {
  const { colors, isDark } = useTheme();
  const { t } = useTranslation();
  const scale = useSharedValue(1);
  const secondaryScale = useSharedValue(1);

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const secondaryButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: secondaryScale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withTiming(0.95, { duration: 80 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 120 });
  };

  const handleSecPressIn = () => {
    secondaryScale.value = withTiming(0.93, { duration: 80 });
  };

  const handleSecPressOut = () => {
    secondaryScale.value = withTiming(1, { duration: 120 });
  };

  return (
    <Animated.View
      className="rounded-3xl p-5"
      style={{
        backgroundColor: colors.surface,
        shadowColor: isDark ? "#000" : "#2C3E5B",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isDark ? 0.3 : 0.08,
        shadowRadius: 12,
        elevation: 4,
      }}
    >
      {/* Top Row: Icon + Name + Status */}
      <View className="flex-row items-center mb-4">
        {/* Icon container - 48x48, rounded 16px */}
        <View
          className="w-12 h-12 rounded-2xl justify-center items-center mr-3.5"
          style={{ backgroundColor: colors.primaryContainer }}
        >
          <AppIcon
            name="dumbbell"
            size={IconSize.lg}
            color={colors.primary}
            strokeWidth={2}
          />
        </View>

        {/* Name */}
        <View className="flex-1">
          <Text
            style={[
              Typography.title,
              { color: colors.textPrimary, letterSpacing: -0.3 },
            ]}
          >
            {name}
          </Text>
        </View>

        {/* Status Badge */}
        <View
          className="px-3 py-[5px] rounded-[20px]"
          style={{ backgroundColor: colors.infoContainer }}
        >
          <Text style={[Typography.overline, { color: colors.info }]}>
            {status}
          </Text>
        </View>
      </View>

      {/* Second Row: Info */}
      <View className="flex-row items-center mb-5 gap-5">
        <View className="flex-row items-center gap-1.5">
          <AppIcon
            name="clock"
            size={IconSize.sm}
            color={colors.textSecondary}
            strokeWidth={2}
          />
          <Text style={[Typography.label, { color: colors.textSecondary }]}>
            {time}
          </Text>
        </View>
        <View className="flex-row items-center gap-1.5">
          <AppIcon
            name="mapPin"
            size={IconSize.sm}
            color={colors.textSecondary}
            strokeWidth={2}
          />
          <Text style={[Typography.label, { color: colors.textSecondary }]}>
            {location}
          </Text>
        </View>
      </View>

      {/* Bottom Row: Buttons */}
      <View className="flex-row gap-3">
        <Animated.View className="flex-1" style={buttonAnimatedStyle}>
          <Pressable
            onPress={() => router.push("/verify-workout")}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={({ pressed }) => ({
              paddingVertical: 14,
              borderRadius: 16,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              gap: 8,
              backgroundColor: colors.primary,
              opacity: pressed ? 0.9 : 1,
            })}
          >
            <AppIcon
              name="play"
              size={IconSize.sm}
              color={colors.onPrimary}
              strokeWidth={2.5}
            />
            <Text
              style={[
                Typography.bodyLarge,
                { color: colors.onPrimary, letterSpacing: 0.5 },
              ]}
            >
              {t("startWorkout")}
            </Text>
          </Pressable>
        </Animated.View>

        <Animated.View style={[secondaryButtonStyle, { alignSelf: "stretch" }]}>
          <Pressable
            onPress={() => router.push("/calendar")}
            onPressIn={handleSecPressIn}
            onPressOut={handleSecPressOut}
            style={({ pressed }) => ({
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              paddingHorizontal: 18,
              paddingVertical: 14,
              borderRadius: 16,
              backgroundColor: colors.surfaceMuted,
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <AppIcon
              name="calendar"
              size={IconSize.sm}
              color={colors.primary}
              strokeWidth={2}
            />
            <Text style={[Typography.overline, { color: colors.textSecondary }]}>
              {t("schedule")}
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    </Animated.View>
  );
}
