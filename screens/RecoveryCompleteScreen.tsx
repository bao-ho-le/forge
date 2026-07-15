import React from "react";
import { View, Text, Pressable, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import { useTheme } from "../contexts/ThemeContext";
import { Typography } from "../constants/typography";
import { IconSize } from "../constants/iconSizes";
import AppIcon from "../components/Icon/AppIcon";

export default function RecoveryCompleteScreen() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />

      <View
        className="flex-1 justify-center items-center px-8"
        style={{
          paddingTop: insets.top,
          paddingBottom: insets.bottom + 32,
        }}
      >
        {/* Success Icon */}
        <Animated.View entering={FadeIn.duration(600)}>
          <View
            className="w-[120px] h-[120px] rounded-full justify-center items-center mb-7"
            style={{ backgroundColor: colors.successContainer }}
          >
            <AppIcon
              name="check"
              size={IconSize.hero}
              color={colors.success}
              strokeWidth={3}
            />
          </View>
        </Animated.View>

        {/* Title */}
        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <Text
            className="text-center mb-2.5"
            style={[
              Typography.heading,
              { color: colors.textPrimary, letterSpacing: -0.5 },
            ]}
          >
            Recovery Complete
          </Text>
        </Animated.View>

        {/* Subtitle */}
        <Animated.View entering={FadeInDown.delay(300).duration(500)}>
          <Text
            className="text-center mb-12"
            style={[Typography.body, { color: colors.success }]}
          >
            Access Restored
          </Text>
        </Animated.View>

        {/* Back to Home Button */}
        <Animated.View
          entering={FadeInDown.delay(400).duration(500)}
          className="self-stretch"
        >
          <Pressable
            onPress={() => router.push("/")}
            style={({ pressed }) => ({
              alignSelf: "stretch",
              paddingVertical: 18,
              borderRadius: 20,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: colors.primary,
              opacity: pressed ? 0.85 : 1,
              transform: [{ scale: pressed ? 0.97 : 1 }],
            })}
          >
            <Text
              style={[
                Typography.bodyLarge,
                { color: colors.onPrimary, letterSpacing: 0.3 },
              ]}
            >
              Back to Home
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}
