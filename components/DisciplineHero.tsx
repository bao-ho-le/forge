import React from "react";
import { View, Text } from "react-native";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import { useTheme } from "../contexts/ThemeContext";
import { Typography } from "../constants/typography";
import { IconSize } from "../constants/iconSizes";
import AppIcon from "./Icon/AppIcon";

export default function DisciplineHero() {
  const { colors, isDark } = useTheme();

  return (
    <View className="items-center py-6">
      {/* Hero Icon */}
      <Animated.View
        entering={FadeIn.duration(600)}
        className="w-[120px] h-[120px] rounded-[32px] justify-center items-center mb-6"
        style={{ backgroundColor: colors.warningContainer }}
      >
        <AppIcon
          name="shieldAlert"
          size={IconSize.hero}
          color={colors.warning}
          strokeWidth={1.8}
        />
      </Animated.View>

      {/* Title */}
      <Animated.View entering={FadeInDown.delay(200).duration(500)}>
        <Text
          className="text-center mb-3"
          style={[
            Typography.heading,
            { color: colors.textPrimary, letterSpacing: -0.5 },
          ]}
        >
          Discipline Mode Activated
        </Text>
      </Animated.View>

      {/* Subtitle */}
      <Animated.View entering={FadeInDown.delay(300).duration(500)}>
        <Text
          className="text-center px-4"
          style={[
            Typography.body,
            { color: colors.textSecondary, lineHeight: 22 },
          ]}
        >
          You missed your workout commitment. Your entertainment apps are
          temporarily restricted.
        </Text>
      </Animated.View>
    </View>
  );
}
