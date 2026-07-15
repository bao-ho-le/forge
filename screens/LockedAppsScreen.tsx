import React, { useState } from "react";
import { View, Text, Pressable, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useTheme } from "../contexts/ThemeContext";
import { useTranslation } from "../components/Localization/LanguageProvider";
import { Typography } from "../constants/typography";
import { IconSize } from "../constants/iconSizes";
import AppIcon, { type IconName } from "../components/Icon/AppIcon";
import ThemedSwitch from "../components/ThemedSwitch";

const AVAILABLE_APPS: { name: string; icon: IconName }[] = [
  { name: "TikTok", icon: "music" },
  { name: "Instagram", icon: "image" },
  { name: "YouTube", icon: "play" },
  { name: "Games", icon: "gameController" },
  { name: "Netflix", icon: "play" },
  { name: "Twitter", icon: "music" },
  { name: "Snapchat", icon: "image" },
  { name: "Reddit", icon: "music" },
];

export default function LockedAppsScreen() {
  const { colors, isDark } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [lockedApps, setLockedApps] = useState<Set<string>>(
    new Set(["TikTok", "Instagram", "YouTube", "Games"])
  );

  const toggleApp = (name: string) => {
    setLockedApps((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
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
            {t("lockedAppsManage")}
          </Text>
        </View>

        {/* Description */}
        <Text
          className="mb-5 px-1"
          style={[Typography.label, { color: colors.textSecondary, lineHeight: 20 }]}
        >
          Select apps to restrict during Discipline Mode.
        </Text>

        {/* App List */}
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
          {AVAILABLE_APPS.map((app, index) => {
            const isLocked = lockedApps.has(app.name);
            const isLast = index === AVAILABLE_APPS.length - 1;
            return (
              <View
                key={app.name}
                className="flex-row items-center py-3.5 px-4"
                style={{
                  borderBottomWidth: isLast ? 0 : 1,
                  borderBottomColor: colors.border,
                }}
              >
                <View
                  className="w-9 h-9 rounded-[10px] justify-center items-center mr-3.5"
                  style={{
                    backgroundColor: isLocked
                      ? colors.primaryContainer
                      : colors.surfaceMuted,
                  }}
                >
                  <AppIcon
                    name={app.icon}
                    size={IconSize.sm}
                    color={isLocked ? colors.primary : colors.textSecondary}
                    strokeWidth={1.8}
                  />
                </View>
                <Text
                  className="flex-1"
                  style={[Typography.body, { color: colors.textPrimary }]}
                >
                  {app.name}
                </Text>
                <ThemedSwitch
                  value={isLocked}
                  onValueChange={() => toggleApp(app.name)}
                />
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}
