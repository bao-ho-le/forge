import React, { useEffect } from "react";
import { ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  interpolateColor,
  ReduceMotion,
} from "react-native-reanimated";
import { useTheme } from "../../contexts/ThemeContext";

type SkeletonBoneProps = {
  width?: number | `${number}%`;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
};

export default function SkeletonBone({
  width = "100%",
  height = 16,
  borderRadius = 8,
  style,
}: SkeletonBoneProps) {
  const { colors } = useTheme();
  const progress = useSharedValue(0);

  useEffect(() => {
    // Explicitly opt out of the OS "reduce motion" setting: this pulse is
    // subtle (a color shift, not movement) and is how the skeleton
    // communicates "loading", so it should always play.
    const timingConfig = {
      duration: 750,
      easing: Easing.inOut(Easing.ease),
      reduceMotion: ReduceMotion.Never,
    };
    progress.value = withRepeat(
      withSequence(withTiming(1, timingConfig), withTiming(0, timingConfig)),
      -1,
      false,
      undefined,
      ReduceMotion.Never,
    );
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [colors.surfaceMuted, colors.border],
    ),
  }));

  return (
    <Animated.View
      style={[{ width, height, borderRadius }, animatedStyle, style]}
    />
  );
}
