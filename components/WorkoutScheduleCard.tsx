import React from "react";
import { View, Text } from "react-native";
import Animated from "react-native-reanimated";
import { useTheme } from "../contexts/ThemeContext";
import { Typography } from "../constants/typography";
import { IconSize } from "../constants/iconSizes";
import AppIcon from "./Icon/AppIcon";

type WorkoutScheduleCardProps = {
  name: string;
  time: string;
  location: string;
};

export default function WorkoutScheduleCard({
  name,
  time,
  location,
}: WorkoutScheduleCardProps) {
  const { colors, isDark } = useTheme();

  return (
    <Animated.View
      className="rounded-[20px] p-4 mb-2.5"
      style={{
        backgroundColor: colors.surface,
        shadowColor: isDark ? "#000" : "#2C3E5B",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: isDark ? 0.25 : 0.06,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      <View className="flex-row items-center">
        {/* Icon container */}
        <View
          className="w-11 h-11 rounded-xl justify-center items-center mr-3.5"
          style={{ backgroundColor: colors.primaryContainer }}
        >
          <AppIcon
            name="dumbbell"
            size={IconSize.md}
            color={colors.primary}
            strokeWidth={2}
          />
        </View>

        {/* Info */}
        <View className="flex-1">
          <Text
            className="mb-1"
            style={[Typography.bodyLarge, { color: colors.textPrimary }]}
          >
            {name}
          </Text>
          <View className="flex-row items-center gap-3">
            <View className="flex-row items-center gap-1">
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
            <View className="flex-row items-center gap-1">
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
        </View>
      </View>
    </Animated.View>
  );
}
