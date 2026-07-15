import React from "react";
import { View, Text } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { Typography } from "../constants/typography";

type ProfileSectionProps = {
  title: string;
  children: React.ReactNode;
};

export default function ProfileSection({
  title,
  children,
}: ProfileSectionProps) {
  const { colors } = useTheme();

  return (
    <View className="mb-7">
      <Text
        className="mb-3 px-0.5"
        style={[
          Typography.overline,
          { color: colors.textSecondary, letterSpacing: 1.2 },
        ]}
      >
        {title}
      </Text>
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
        {children}
      </View>
    </View>
  );
}
