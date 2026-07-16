import React from "react";
import { View, Text } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { Typography } from "../constants/typography";
import { IconSize } from "../constants/iconSizes";
import AppIcon, { type IconName } from "./Icon/AppIcon";

type EmptyStateCardProps = {
  message: string;
  description?: string;
  icon?: IconName;
};

export default function EmptyStateCard({
  message,
  description,
  icon = "calendarEmpty",
}: EmptyStateCardProps) {
  const { colors, isDark } = useTheme();

  return (
    <View
      className="rounded-[20px] p-6 items-center justify-center"
      style={{
        backgroundColor: colors.surface,
        shadowColor: isDark ? "#000" : "#2C3E5B",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: isDark ? 0.25 : 0.06,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      <View
        className="w-14 h-14 rounded-full justify-center items-center mb-3"
        style={{ backgroundColor: colors.primaryContainer }}
      >
        <AppIcon
          name={icon}
          size={IconSize.lg}
          color={colors.textSecondary}
          strokeWidth={1.5}
        />
      </View>
      <Text
        className="text-center"
        style={[Typography.bodyLarge, { color: colors.textSecondary }]}
      >
        {message}
      </Text>
      {description && (
        <Text
          className="text-center mt-1"
          style={[Typography.label, { color: colors.textSecondary }]}
        >
          {description}
        </Text>
      )}
    </View>
  );
}
