import React, { useState } from "react";
import { View, Text, Pressable, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useTheme } from "../contexts/ThemeContext";
import { useTranslation } from "../components/Localization/LanguageProvider";
import { Typography } from "../constants/typography";
import { IconSize } from "../constants/iconSizes";
import AppIcon from "../components/Icon/AppIcon";
import ThemedSwitch from "../components/ThemedSwitch";
import AddAppsSheet, { type MockApp } from "../components/AddAppsSheet";

const APPS_CATALOG: MockApp[] = [
  { name: "TikTok", initial: "T" },
  { name: "Instagram", initial: "I" },
  { name: "YouTube", initial: "Y" },
  { name: "Facebook", initial: "F" },
  { name: "Messenger", initial: "M" },
  { name: "Discord", initial: "D" },
  { name: "Reddit", initial: "R" },
  { name: "Netflix", initial: "N" },
  { name: "Spotify", initial: "S" },
  { name: "X (Twitter)", initial: "X" },
];

const DEFAULT_ADDED_APPS = ["TikTok", "Instagram", "YouTube"];

export default function LockedAppsScreen() {
  const { colors, isDark } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const [addedApps, setAddedApps] = useState<string[]>(DEFAULT_ADDED_APPS);
  const [enabledMap, setEnabledMap] = useState<Record<string, boolean>>(
    Object.fromEntries(DEFAULT_ADDED_APPS.map((name) => [name, true])),
  );
  const [sheetVisible, setSheetVisible] = useState(false);

  const addedSet = new Set(addedApps);

  const addApp = (name: string) => {
    setAddedApps((prev) => (prev.includes(name) ? prev : [...prev, name]));
    setEnabledMap((prev) => ({ ...prev, [name]: true }));
  };

  const removeApp = (name: string) => {
    setAddedApps((prev) => prev.filter((app) => app !== name));
    setEnabledMap((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const toggleApp = (name: string) => {
    setEnabledMap((prev) => ({ ...prev, [name]: !prev[name] }));
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
          {addedApps.map((name, index) => {
            const app = APPS_CATALOG.find((a) => a.name === name);
            const isEnabled = !!enabledMap[name];
            const isLast = index === addedApps.length - 1;
            return (
              <View
                key={name}
                className="flex-row items-center py-3.5 px-4"
                style={{
                  borderBottomWidth: isLast ? 0 : 1,
                  borderBottomColor: colors.border,
                }}
              >
                <View
                  className="w-9 h-9 rounded-[10px] justify-center items-center mr-3.5"
                  style={{
                    backgroundColor: isEnabled
                      ? colors.primaryContainer
                      : colors.surfaceMuted,
                  }}
                >
                  <Text
                    style={[
                      Typography.label,
                      {
                        color: isEnabled ? colors.primary : colors.textSecondary,
                        fontWeight: "700",
                      },
                    ]}
                  >
                    {app?.initial ?? name.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <Text
                  className="flex-1"
                  style={[Typography.body, { color: colors.textPrimary }]}
                >
                  {name}
                </Text>
                <Pressable
                  onPress={() => removeApp(name)}
                  style={({ pressed }) => ({
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 4,
                    marginRight: 12,
                    paddingHorizontal: 14,
                    paddingVertical: 7,
                    borderRadius: 9999,
                    borderWidth: 1.5,
                    borderColor: colors.border,
                    opacity: pressed ? 0.6 : 1,
                  })}
                >
                  <Text
                    style={[
                      Typography.label,
                      { color: colors.textSecondary, fontWeight: "700" },
                    ]}
                  >
                    ✕ {t("removeAction")}
                  </Text>
                </Pressable>
                <ThemedSwitch value={isEnabled} onValueChange={() => toggleApp(name)} />
              </View>
            );
          })}
        </View>

        {/* Add Apps Button */}
        <Pressable
          onPress={() => setSheetVisible(true)}
          style={({ pressed }) => ({
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            marginTop: 16,
            paddingVertical: 16,
            borderRadius: 16,
            backgroundColor: colors.primary,
            opacity: pressed ? 0.85 : 1,
            transform: [{ scale: pressed ? 0.97 : 1 }],
          })}
        >
          <AppIcon name="plusCircle" size={IconSize.sm} color={colors.onPrimary} strokeWidth={2} />
          <Text style={[Typography.bodyLarge, { color: colors.onPrimary, letterSpacing: 0.3 }]}>
            {t("addApps")}
          </Text>
        </Pressable>
      </View>

      <AddAppsSheet
        visible={sheetVisible}
        catalog={APPS_CATALOG}
        addedApps={addedSet}
        onAdd={addApp}
        onRemove={removeApp}
        onClose={() => setSheetVisible(false)}
      />
    </View>
  );
}
