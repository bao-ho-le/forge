import React from "react";
import { View, Text } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { Typography } from "../constants/typography";
import { IconSize } from "../constants/iconSizes";
import AppIcon from "./Icon/AppIcon";

type ProfileHeaderProps = {
  name: string;
};

export default function ProfileHeader({ name }: ProfileHeaderProps) {
  const { colors } = useTheme();

  return (
    <View
      className="rounded-3xl mb-6 py-5 px-5"
      style={{
        backgroundColor: colors.surface,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      <View className="flex-row items-center">
        <Text
          style={[
            Typography.title,
            { color: colors.textPrimary, letterSpacing: -0.3 },
          ]}
        >
          {name}
        </Text>

        <View className="flex-1" />

        <View
          className="flex-row items-center gap-1 px-3 py-1 rounded-xl"
          style={{
            backgroundColor: colors.premiumContainer,
            borderWidth: 1,
            borderColor: colors.premium,
          }}
        >
          <AppIcon
            name="crown"
            size={IconSize.sm}
            color={colors.premium}
            strokeWidth={2}
          />
          <Text
            style={[
              Typography.overline,
              { color: colors.premium, letterSpacing: 0.3 },
            ]}
          >
            Premium Member
          </Text>
        </View>
      </View>
    </View>
  );
}
