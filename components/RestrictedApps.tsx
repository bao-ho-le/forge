import React from "react";
import { View, Text, ScrollView } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useTheme } from "../contexts/ThemeContext";
import { Typography } from "../constants/typography";
import { IconSize } from "../constants/iconSizes";
import AppIcon from "./Icon/AppIcon";

const APPS = [
  { name: "TikTok", icon: "music" as const },
  { name: "Instagram", icon: "image" as const },
  { name: "YouTube", icon: "play" as const },
  { name: "Games", icon: "gameController" as const },
];

export default function RestrictedApps() {
  const { colors } = useTheme();

  return (
    <Animated.View entering={FadeInDown.delay(400).duration(500)} className="mb-7">
      <View className="flex-row items-center gap-1.5 mb-3.5 px-0.5">
        <AppIcon
          name="lock"
          size={IconSize.sm}
          color={colors.textSecondary}
          strokeWidth={2}
        />
        <Text style={[Typography.overline, { color: colors.textSecondary, letterSpacing: 1.2 }]}>
          RESTRICTED APPS
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12 }}
      >
        {APPS.map((app) => (
          <View key={app.name} className="w-20 items-center pt-1">
            {/* App icon area with lock at bottom-right */}
            <View className="relative mb-2">
              <View
                className="w-14 h-14 rounded-2xl justify-center items-center"
                style={{ backgroundColor: colors.surface }}
              >
                <AppIcon
                  name={app.icon}
                  size={IconSize.lg}
                  color={colors.textSecondary}
                  strokeWidth={1.8}
                />
              </View>
              {/* Lock indicator at bottom-right */}
              <View
                className="absolute -bottom-0.5 -right-0.5 w-[18px] h-[18px] rounded-[9px] justify-center items-center"
                style={{ backgroundColor: colors.surfaceMuted }}
              >
                <AppIcon
                  name="lock"
                  size={IconSize.xs}
                  color={colors.warning}
                  strokeWidth={2.5}
                />
              </View>
            </View>

            <Text
              className="text-center"
              style={[Typography.caption, { color: colors.textPrimary }]}
            >
              {app.name}
            </Text>
          </View>
        ))}
      </ScrollView>
    </Animated.View>
  );
}
