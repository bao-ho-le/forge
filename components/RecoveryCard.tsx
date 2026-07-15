import React from "react";
import { View, Text, Pressable } from "react-native";
import Animated from "react-native-reanimated";
import { router } from "expo-router";
import { useTheme } from "../contexts/ThemeContext";
import { useTranslation } from "./Localization/LanguageProvider";
import { Typography } from "../constants/typography";
import { IconSize } from "../constants/iconSizes";
import AppIcon from "./Icon/AppIcon";

export default function RecoveryCard() {
  const { colors, isDark } = useTheme();
  const { t } = useTranslation();

  return (
    <Pressable
      onPress={() => router.push("/discipline")}
      style={({ pressed }) => ({
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <Animated.View
        className="rounded-[20px] p-[18px] mt-2 mb-4 border"
        style={{
          backgroundColor: colors.surfaceSecondary,
          borderColor: isDark
            ? "rgba(255,77,109,0.1)"
            : "rgba(240,48,89,0.2)",
        }}
      >
        <View className="flex-row items-center">
          {/* Left icon - soft container */}
          <View
            className="w-11 h-11 rounded-xl justify-center items-center mr-3.5"
            style={{ backgroundColor: colors.warningContainer }}
          >
            <AppIcon
              name="shieldRecovery"
              size={IconSize.md}
              color={colors.warning}
              strokeWidth={2}
            />
          </View>

          {/* Content */}
          <View className="flex-1">
            <Text
              className="mb-0.5"
              style={[Typography.bodyLarge, { color: colors.textPrimary }]}
            >
              {t("recoveryWorkout")}
            </Text>
            <Text
              style={[
                Typography.label,
                { color: colors.textSecondary, lineHeight: 18 },
              ]}
            >
              {t("recoveryDescription")}
            </Text>
          </View>

          {/* Arrow right */}
          <View
            className="w-8 h-8 rounded-2xl justify-center items-center"
            style={{ backgroundColor: colors.surfaceMuted }}
          >
            <AppIcon
              name="arrowRight"
              size={IconSize.sm}
              color={colors.textSecondary}
              strokeWidth={2}
            />
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}
