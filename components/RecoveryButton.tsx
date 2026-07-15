import React from "react";
import { Text, Pressable } from "react-native";
import { router } from "expo-router";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  FadeInDown,
} from "react-native-reanimated";
import { useTheme } from "../contexts/ThemeContext";
import { Typography } from "../constants/typography";
import { IconSize } from "../constants/iconSizes";
import AppIcon from "./Icon/AppIcon";

export default function RecoveryButton() {
  const { colors } = useTheme();
  const scale = useSharedValue(1);

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View entering={FadeInDown.delay(600).duration(500)} className="mb-6">
      <Animated.View style={buttonStyle}>
        <Pressable
          onPress={() => router.push("/recovery-workout")}
          onPressIn={() => {
            scale.value = withTiming(0.95, { duration: 80 });
          }}
          onPressOut={() => {
            scale.value = withTiming(1, { duration: 120 });
          }}
          style={({ pressed }) => ({
            paddingVertical: 18,
            borderRadius: 20,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            backgroundColor: colors.warning,
            opacity: pressed ? 0.9 : 1,
          })}
        >
          <Text
            style={[
              Typography.bodyLarge,
              { color: colors.onWarning, letterSpacing: 0.3 },
            ]}
          >
            Start Recovery Workout
          </Text>
          <AppIcon
            name="arrowRight"
            size={IconSize.sm}
            color={colors.onWarning}
            strokeWidth={2.5}
          />
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}
