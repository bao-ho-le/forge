import React from "react";
import { View, Text, Pressable } from "react-native";
import { useTheme } from "../contexts/ThemeContext";

const SHORT_DAYS = ["M", "T", "W", "T", "F", "S", "S"];

type DayCircleSelectorProps = {
  selectedDay: number;
  onSelectDay: (index: number) => void;
};

export default function DayCircleSelector({
  selectedDay,
  onSelectDay,
}: DayCircleSelectorProps) {
  const { colors, isDark } = useTheme();

  return (
    <View style={{ flexDirection: "row", gap: 8 }}>
      {SHORT_DAYS.map((letter, index) => {
        const isSelected = selectedDay === index;
        return (
          <Pressable
            key={index}
            onPress={() => onSelectDay(index)}
            style={({ pressed }) => ({
              width: 38,
              height: 38,
              borderRadius: 19,
              backgroundColor: isSelected ? colors.primary : colors.surface,
              justifyContent: "center",
              alignItems: "center",
              opacity: pressed ? 0.7 : 1,
              transform: [{ scale: pressed ? 0.92 : 1 }],
            })}
          >
            <Text
              style={{
                fontSize: 13,
                fontWeight: isSelected ? "700" : "600",
                color: isSelected ? colors.onPrimary : colors.textSecondary,
              }}
            >
              {letter}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
