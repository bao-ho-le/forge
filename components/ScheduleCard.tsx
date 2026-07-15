import React from "react";
import { View, Text } from "react-native";
import Animated from "react-native-reanimated";
import { useTheme } from "../contexts/ThemeContext";
import { Typography } from "../constants/typography";


type ScheduleCardProps = {
  day: string;
  info: string;
  dateNumber?: number;
};

export default function ScheduleCard({
  day,
  info,
  dateNumber,
}: ScheduleCardProps) {
  const { colors, isDark } = useTheme();

  return (
    <Animated.View
      className="rounded-2xl p-4 mb-2.5"
      style={{
        backgroundColor: colors.surface,
        shadowColor: isDark ? "#000" : "#2C3E5B",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.2 : 0.05,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <View className="flex-row items-center">
        {/* Date number container */}
        <View
          className="w-12 h-12 rounded-xl justify-center items-center mr-3.5"
          style={{ backgroundColor: colors.primaryContainer }}
        >
          <Text
            style={[
              Typography.title,
              { color: colors.primary },
            ]}
          >
            {dateNumber}
          </Text>
        </View>

        {/* Info */}
        <View className="flex-1">
          <Text
            className="mb-0.5"
            style={[Typography.bodyLarge, { color: colors.textPrimary }]}
          >
            {day}
          </Text>
          <Text style={[Typography.label, { color: colors.textSecondary }]}>
            {info}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}
