import React from "react";
import { View, Text, Pressable } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { Typography } from "../constants/typography";
import { IconSize } from "../constants/iconSizes";
import AppIcon from "./Icon/AppIcon";
import type { IconName } from "./Icon/AppIcon";

type ProfileSettingRowProps = {
  icon: IconName;
  title: string;
  value?: string;
  showArrow?: boolean;
  isLast?: boolean;
  onPress?: () => void;
  statusBadge?: {
    label: string;
    color: string;
  };
};

export default function ProfileSettingRow({
  icon,
  title,
  value,
  showArrow = true,
  isLast = false,
  onPress,
  statusBadge,
}: ProfileSettingRowProps) {
  const { colors } = useTheme();

  const Content = () => (
    <View
      className="flex-row items-center py-3.5 px-4"
      style={{
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: colors.border,
      }}
    >
      {/* Icon Container */}
      <View
        className="w-9 h-9 rounded-[10px] justify-center items-center mr-3.5"
        style={{ backgroundColor: colors.primaryContainer }}
      >
        <AppIcon
          name={icon}
          size={IconSize.sm}
          color={colors.primary}
          strokeWidth={1.8}
        />
      </View>

      {/* Title */}
      <Text
        className="flex-1"
        style={[Typography.body, { color: colors.textPrimary }]}
      >
        {title}
      </Text>

      {/* Status Badge */}
      {statusBadge && (
        <View
          className="px-2.5 py-[3px] rounded-[10px] mr-2"
          style={{ backgroundColor: colors.primaryContainer }}
        >
          <Text style={[Typography.overline, { color: colors.primary }]}>
            {statusBadge.label}
          </Text>
        </View>
      )}

      {/* Value */}
      {value && (
        <Text
          className="mr-2"
          style={[Typography.label, { color: colors.textSecondary }]}
        >
          {value}
        </Text>
      )}

      {/* Arrow */}
      {showArrow && (
        <View className="ml-1">
          <AppIcon
            name="chevronRight"
            size={IconSize.sm}
            color={colors.border}
            strokeWidth={3}
          />
        </View>
      )}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => ({
          opacity: pressed ? 0.6 : 1,
        })}
      >
        <Content />
      </Pressable>
    );
  }

  return <Content />;
}
