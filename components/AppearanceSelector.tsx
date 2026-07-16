import React from "react";
import { View, Text, Pressable } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { useTranslation } from "./Localization/LanguageProvider";
import { Typography } from "../constants/typography";
import { IconSize } from "../constants/iconSizes";
import LanguageToggle from "./LanguageToggle";
import AppIcon from "./Icon/AppIcon";

export default function AppearanceSelector() {
  const { colors, isDark, theme, setTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <View
      className="rounded-[20px] overflow-hidden"
      style={{
        backgroundColor: colors.surface,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 2,
      }}
    >
      {/* Theme Row */}
      <View
        className="flex-row items-center justify-between py-3.5 px-4 border-b"
        style={{ borderBottomColor: colors.border }}
      >
        <View className="flex-row items-center gap-2.5">
          <View
            className="w-9 h-9 rounded-[10px] justify-center items-center"
            style={{ backgroundColor: colors.primaryContainer }}
          >
            <AppIcon
              name={isDark ? "moon" : "sun"}
              size={IconSize.sm}
              color={colors.primary}
              strokeWidth={2}
            />
          </View>
          <Text style={[Typography.body, { color: colors.textPrimary }]}>
            {t("theme")}
          </Text>
        </View>

        <View
          className="flex-row rounded-2xl p-0.5"
          style={{ backgroundColor: colors.surfaceMuted }}
        >
          {(["light", "dark"] as const).map((mode) => {
            const isActive = theme === mode;
            return (
              <Pressable
                key={mode}
                onPress={() => setTheme(mode)}
                style={({ pressed }) => ({
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 14,
                  backgroundColor: isActive ? colors.primary : "transparent",
                  opacity: pressed ? 0.7 : 1,
                  transform: [{ scale: pressed ? 0.95 : 1 }],
                })}
              >
                <Text
                  style={[
                    isActive ? Typography.overline : Typography.label,
                    {
                      color: isActive ? colors.onPrimary : colors.textSecondary,
                      letterSpacing: 0.2,
                    },
                  ]}
                >
                  {mode === "light" ? t("light") : t("dark")}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Language Row */}
      <View className="flex-row items-center justify-between py-3.5 px-4">
        <View className="flex-row items-center gap-2.5">
          <View
            className="w-9 h-9 rounded-[10px] justify-center items-center"
            style={{ backgroundColor: colors.primaryContainer }}
          >
            <AppIcon
              name="globe"
              size={IconSize.sm}
              color={colors.primary}
              strokeWidth={2}
            />
          </View>
          <Text style={[Typography.body, { color: colors.textPrimary }]}>
            {t("language")}
          </Text>
        </View>

        <LanguageToggle />
      </View>
    </View>
  );
}
