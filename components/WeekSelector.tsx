import React, { useEffect } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useTheme } from "../contexts/ThemeContext";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type WeekSelectorProps = {
  selectedDay: number;
  onSelectDay: (index: number) => void;
};

function DayPill({
  day,
  isSelected,
  onPress,
  isDark,
  colors,
}: {
  day: string;
  isSelected: boolean;
  onPress: () => void;
  isDark: boolean;
  colors: any;
}) {
  const scale = useSharedValue(isSelected ? 1 : 0.95);

  useEffect(() => {
    scale.value = withTiming(isSelected ? 1 : 0.95, {
      duration: 180,
      easing: Easing.out(Easing.cubic),
    });
  }, [isSelected]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress}
        style={{
          width: 48,
          height: 48,
          borderRadius: 999,
          backgroundColor: isSelected ? colors.primary : colors.surface,
          justifyContent: "center",
          alignItems: "center",
          marginHorizontal: 4,
          shadowColor: isDark ? "#000" : "#2C3E5B",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isSelected ? (isDark ? 0.3 : 0.1) : 0,
          shadowRadius: 4,
          elevation: isSelected ? 3 : 0,
        }}
      >
        <Text
          style={{
            fontSize: 13,
            fontWeight: isSelected ? "700" : "500",
            color: isSelected ? colors.onPrimary : colors.textPrimary,
            letterSpacing: 0.2,
          }}
        >
          {day}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

export default function WeekSelector({
  selectedDay,
  onSelectDay,
}: WeekSelectorProps) {
  const { colors, isDark } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 2,
        paddingVertical: 4,
      }}
    >
      {DAYS.map((day, index) => (
        <DayPill
          key={day}
          day={day}
          isSelected={selectedDay === index}
          onPress={() => onSelectDay(index)}
          isDark={isDark}
          colors={colors}
        />
      ))}
    </ScrollView>
  );
}

export { DAYS };
