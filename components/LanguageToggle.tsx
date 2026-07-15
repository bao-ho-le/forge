import React from "react";
import { View, Text, Pressable, LayoutAnimation, Platform, UIManager } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { useTranslation } from "./Localization/LanguageProvider";
import { Typography } from "../constants/typography";

// Enable LayoutAnimation on Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function LanguageToggle() {
  const { colors, isDark } = useTheme();
  const { language, setLanguage } = useTranslation();

  const handleLanguageChange = (lang: "en" | "vi") => {
    LayoutAnimation.configureNext({
      duration: 200,
      create: { type: "easeInEaseOut", property: "opacity" },
      update: { type: "easeInEaseOut" },
      delete: { type: "easeInEaseOut", property: "opacity" },
    });
    setLanguage(lang);
  };

  return (
    <View
      className="flex-row rounded-full p-0.5"
      style={{ backgroundColor: colors.surfaceMuted }}
    >
      {(["EN", "VI"] as const).map((lang) => {
        const isActive = language === lang.toLowerCase();
        return (
          <Pressable
            key={lang}
            onPress={() => handleLanguageChange(lang.toLowerCase() as "en" | "vi")}
            style={({ pressed }) => ({
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 18,
              backgroundColor: isActive ? colors.primary : "transparent",
              opacity: pressed ? 0.7 : 1,
              transform: [{ scale: pressed ? 0.95 : 1 }],
            })}
          >
            <Text
              style={[
                Typography.overline,
                {
                  color: isActive ? colors.onPrimary : colors.textSecondary,
                  letterSpacing: 0.3,
                },
              ]}
            >
              {lang}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
