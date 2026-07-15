import React from "react";
import { View, Text } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { Typography } from "../constants/typography";

export default function ProfileHeader() {
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
          Le Vo
        </Text>

        <View className="flex-1" />

        <View
          className="px-3 py-1 rounded-xl"
          style={{ backgroundColor: colors.premiumContainer }}
        >
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
