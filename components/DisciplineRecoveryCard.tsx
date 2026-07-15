import React from "react";
import { View, Text } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useTheme } from "../contexts/ThemeContext";
import { Typography } from "../constants/typography";
import { IconSize } from "../constants/iconSizes";
import AppIcon from "./Icon/AppIcon";

export default function DisciplineRecoveryCard() {
  const { colors, isDark } = useTheme();

  return (
    <Animated.View
      entering={FadeInDown.delay(500).duration(500)}
      className="rounded-3xl p-5 mb-5"
      style={{
        backgroundColor: colors.surface,
        shadowColor: isDark ? "#000" : "#2C3E5B",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: isDark ? 0.25 : 0.06,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      {/* Header Row */}
      <View className="flex-row items-center mb-4">
        <View
          className="w-9 h-9 rounded-[10px] justify-center items-center mr-3"
          style={{ backgroundColor: colors.warningContainer }}
        >
          <AppIcon
            name="shieldRecovery"
            size={IconSize.sm}
            color={colors.warning}
            strokeWidth={1.8}
          />
        </View>
        <View className="flex-1">
          <Text
            style={[
              Typography.overline,
              { color: colors.warning, letterSpacing: 0.8 },
            ]}
          >
            RECOVERY REQUIRED
          </Text>
          <Text
            className="mt-0.5"
            style={[Typography.label, { color: colors.textSecondary }]}
          >
            Complete to restore access
          </Text>
        </View>
      </View>

      {/* Recovery Workout Card */}
      <View
        className="rounded-[18px] p-4 flex-row items-center"
        style={{
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        <View className="flex-1">
          <Text style={[Typography.title, { color: colors.textPrimary }]}>
            20 Push-ups
          </Text>
          <Text
            className="mt-0.5"
            style={[Typography.label, { color: colors.textSecondary }]}
          >
            Bodyweight recovery workout
          </Text>
        </View>

        {/* Badge */}
        <View
          className="px-3.5 py-2 rounded-[14px]"
          style={{ backgroundColor: colors.warningContainer }}
        >
          <Text style={[Typography.title, { color: colors.warning }]}>20</Text>
        </View>
      </View>
    </Animated.View>
  );
}
