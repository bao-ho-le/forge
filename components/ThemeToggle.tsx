import React, { useEffect } from "react";
import { Pressable, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useTheme } from "../contexts/ThemeContext";
import { IconSize } from "../constants/iconSizes";
import AppIcon from "./Icon/AppIcon";

export default function ThemeToggle() {
  const { colors, isDark, toggleTheme } = useTheme();
  const spin = useSharedValue(0);
  const scale = useSharedValue(1);
  const sunOpacity = useSharedValue(isDark ? 0 : 1);
  const moonOpacity = useSharedValue(isDark ? 1 : 0);

  useEffect(() => {
    // Spin a full turn (360deg) so the icon always settles back at its
    // natural, upright orientation - the moon glyph isn't symmetric like
    // the sun, so resting at 180deg pushed its crescent into a corner.
    spin.value = withTiming(spin.value + 360, {
      duration: 280,
      easing: Easing.out(Easing.cubic),
    });
    sunOpacity.value = withTiming(isDark ? 0 : 1, { duration: 200 });
    moonOpacity.value = withTiming(isDark ? 1 : 0, { duration: 200 });
  }, [isDark, spin, sunOpacity, moonOpacity]);

  const spinStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${spin.value}deg` }, { scale: scale.value }],
  }));
  const sunStyle = useAnimatedStyle(() => ({ opacity: sunOpacity.value }));
  const moonStyle = useAnimatedStyle(() => ({ opacity: moonOpacity.value }));

  const handlePressIn = () => {
    scale.value = withTiming(0.85, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 150 });
  };

  return (
    <Pressable
      onPress={toggleTheme}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={({ pressed }) => ({
        width: 38,
        height: 38,
        borderRadius: 19,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.surface,
        opacity: pressed ? 0.8 : 1,
      })}
    >
      <Animated.View style={spinStyle}>
        <View style={{ width: IconSize.sm, height: IconSize.sm }}>
          <Animated.View style={[{ position: "absolute" }, sunStyle]}>
            <AppIcon name="sun" size={IconSize.sm} color={colors.primary} strokeWidth={2} />
          </Animated.View>
          <Animated.View style={[{ position: "absolute" }, moonStyle]}>
            <AppIcon name="moon" size={IconSize.sm} color={colors.primary} strokeWidth={2} />
          </Animated.View>
        </View>
      </Animated.View>
    </Pressable>
  );
}
