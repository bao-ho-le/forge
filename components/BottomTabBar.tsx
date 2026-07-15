import React from "react";
import { View, Text, Pressable } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { useTranslation } from "./Localization/LanguageProvider";
import { Typography } from "../constants/typography";
import { IconSize } from "../constants/iconSizes";
import AppIcon from "./Icon/AppIcon";
import type { IconName } from "./Icon/AppIcon";
import type { Translations } from "../locales/vi";

type TabName = "home" | "calendar" | "profile";

type BottomTabBarProps = {
  activeTab: TabName;
  onTabPress?: (tab: TabName) => void;
};

export default function BottomTabBar({
  activeTab = "home",
  onTabPress,
}: BottomTabBarProps) {
  const { colors, isDark } = useTheme();
  const { t } = useTranslation();

  const tabs: { key: TabName; icon: IconName; labelKey: keyof Translations }[] =
    [
      { key: "home", icon: "home", labelKey: "home" },
      { key: "calendar", icon: "calendar", labelKey: "schedule" },
      { key: "profile", icon: "user", labelKey: "profile" },
    ];

  return (
    <View
      className="absolute bottom-0 left-0 right-0 flex-row rounded-t-3xl pt-3 pb-7 px-5"
      style={{
        backgroundColor: colors.surface,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: isDark ? 0.3 : 0.06,
        shadowRadius: 12,
        elevation: 8,
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <Pressable
            key={tab.key}
            onPress={() => onTabPress?.(tab.key)}
            style={({ pressed }) => ({
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 6,
              opacity: pressed ? 0.6 : 1,
              transform: [{ scale: pressed ? 0.95 : 1 }],
            })}
          >
            <View
              className="mb-1"
              style={{ opacity: isActive ? 1 : 0.4 }}
            >
              <AppIcon
                name={tab.icon}
                size={IconSize.md}
                color={isActive ? colors.primary : colors.textSecondary}
                strokeWidth={1.8}
              />
            </View>
            <Text
              style={[
                isActive ? Typography.overline : Typography.caption,
                {
                  color: isActive ? colors.textPrimary : colors.textSecondary,
                  letterSpacing: 0.2,
                },
              ]}
            >
              {t(tab.labelKey)}
            </Text>
            {isActive && (
              <View
                className="absolute top-[-4px] w-5 h-[3px] rounded-[1.5px]"
                style={{ backgroundColor: colors.primary }}
              />
            )}
          </Pressable>
        );
      })}
    </View>
  );
}
