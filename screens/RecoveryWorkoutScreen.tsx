import React, { useState, useEffect, useRef } from "react";
import { View, Text, Pressable, StatusBar } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
} from "react-native-reanimated";
import { useTheme } from "../contexts/ThemeContext";
import { Typography } from "../constants/typography";
import { IconSize } from "../constants/iconSizes";
import AppIcon from "../components/Icon/AppIcon";

const REP_MESSAGES: Record<number, string> = {
  0: "Get into push up position",
  5: "Keep going",
  10: "Stay focused",
  15: "Almost there",
};

function getMessage(reps: number): string {
  const thresholds = Object.keys(REP_MESSAGES)
    .map(Number)
    .sort((a, b) => b - a);
  for (const t of thresholds) {
    if (reps >= t) return REP_MESSAGES[t];
  }
  return REP_MESSAGES[0];
}

const TOTAL_REPS = 20;
const CIRCLE_SIZE = 110;
const STROKE_WIDTH = 6;
const RADIUS = (CIRCLE_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function RecoveryWorkoutScreen() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [reps, setReps] = useState(0);

  // Auto-complete simulation
  useEffect(() => {
    if (reps >= TOTAL_REPS) {
      const timer = setTimeout(() => {
        router.replace("/recovery-complete");
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [reps]);

  const [progressOffset, setProgressOffset] = useState(CIRCUMFERENCE);
  const animRef = useRef(CIRCUMFERENCE);
  const progress = reps / TOTAL_REPS;

  useEffect(() => {
    const target = CIRCUMFERENCE * (1 - progress);
    const startVal = animRef.current;
    const diff = target - startVal;
    if (Math.abs(diff) < 0.5) {
      animRef.current = target;
      setProgressOffset(target);
      return;
    }
    const duration = 300;
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = startVal + diff * eased;
      animRef.current = current;
      setProgressOffset(current);
      if (t >= 1) clearInterval(interval);
    }, 16);
    return () => clearInterval(interval);
  }, [reps, progress]);

  const handleAddRep = () => {
    if (reps < TOTAL_REPS) {
      setReps((prev) => prev + 1);
    }
  };

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />

      <View
        className="flex-1 px-5"
        style={{ paddingTop: insets.top + 16 }}
      >
        {/* Top Bar */}
        <View className="flex-row items-center mb-4">
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => ({
              width: 40,
              height: 40,
              borderRadius: 9999,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: colors.surfaceMuted,
              opacity: pressed ? 0.6 : 1,
            })}
          >
            <AppIcon
              name="chevronLeft"
              size={IconSize.md}
              color={colors.textPrimary}
              strokeWidth={2}
            />
          </Pressable>

          <Text
            className="ml-3"
            style={[
              Typography.heading,
              { color: colors.textPrimary, letterSpacing: -0.5 },
            ]}
          >
            Recovery Workout
          </Text>
        </View>

        {/* Subtitle */}
        <Animated.View entering={FadeInDown.duration(400)}>
          <View className="mb-5">
            <Text style={[Typography.body, { color: colors.textSecondary }]}>
              Do 20 push-ups to recover
            </Text>
          </View>
        </Animated.View>

        {/* Camera Placeholder */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)}>
          <View
            className="rounded-3xl h-[220px] justify-center items-center mb-7 overflow-hidden"
            style={{
              backgroundColor: colors.surface,
              shadowColor: isDark ? "#000" : "#2C3E5B",
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: isDark ? 0.25 : 0.06,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            {/* Skeleton camera frame */}
            <View
              className="w-16 h-16 rounded-[32px] justify-center items-center mb-3"
              style={{ backgroundColor: colors.surfaceMuted }}
            >
              <AppIcon
                name="play"
                size={IconSize.lg}
                color={colors.textSecondary}
                strokeWidth={1.8}
              />
            </View>
            <Text style={[Typography.label, { color: colors.textSecondary }]}>
              Camera tracking area
            </Text>
          </View>
        </Animated.View>

        {/* Rep Counter */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(500)}
          className="items-center mb-6"
        >
          {/* Large number */}
          <Text
            className="mb-3"
            style={[
              Typography.display,
              { color: colors.textPrimary, letterSpacing: -2 },
            ]}
          >
            {reps}
          </Text>

          {/* Circular Progress - SVG */}
          <View className="w-[126px] h-[126px] justify-center items-center mb-2">
            <Svg
              width={CIRCLE_SIZE + 10}
              height={CIRCLE_SIZE + 10}
              viewBox={`0 0 ${CIRCLE_SIZE + 10} ${CIRCLE_SIZE + 10}`}
            >
              {/* Background circle */}
              <Circle
                cx={(CIRCLE_SIZE + 10) / 2}
                cy={(CIRCLE_SIZE + 10) / 2}
                r={RADIUS}
                stroke={colors.border}
                strokeWidth={STROKE_WIDTH}
                fill="none"
              />
              {/* Progress circle */}
              <Circle
                cx={(CIRCLE_SIZE + 10) / 2}
                cy={(CIRCLE_SIZE + 10) / 2}
                r={RADIUS}
                stroke={colors.warning}
                strokeWidth={STROKE_WIDTH}
                strokeLinecap="round"
                fill="none"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={progressOffset}
                transform={`rotate(-90, ${(CIRCLE_SIZE + 10) / 2}, ${(CIRCLE_SIZE + 10) / 2})`}
              />
            </Svg>
            {/* Inner text */}
            <Text
              className="absolute"
              style={[Typography.bodyLarge, { color: colors.textSecondary }]}
            >
              {reps} / {TOTAL_REPS} reps
            </Text>
          </View>
        </Animated.View>

        {/* Motivational Text */}
        <Animated.View
          key={getMessage(reps)}
          entering={FadeIn.duration(400)}
          exiting={FadeOut.duration(200)}
          className="items-center mb-8"
        >
          <Text
            className="text-center italic"
            style={[Typography.bodyLarge, { color: colors.warning }]}
          >
            "{getMessage(reps)}"
          </Text>
        </Animated.View>

        {/* Add Rep Button (mock camera trigger) */}
        <Animated.View entering={FadeInDown.delay(300).duration(500)}>
          <Pressable
            onPress={handleAddRep}
            disabled={reps >= TOTAL_REPS}
            style={({ pressed }) => ({
              paddingVertical: 18,
              borderRadius: 20,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: colors.warning,
              opacity: pressed ? 0.85 : reps >= TOTAL_REPS ? 0.4 : 1,
            })}
          >
            <Text
              style={[
                Typography.bodyLarge,
                { color: colors.onWarning, letterSpacing: 0.3 },
              ]}
            >
              {reps >= TOTAL_REPS ? "Complete!" : "MOCK REP +1"}
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}
