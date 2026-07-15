import React, { useState } from "react";
import { View, Text, Pressable, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import Animated, {
  FadeInDown,
  FadeOut,
} from "react-native-reanimated";
import { useTheme } from "../contexts/ThemeContext";
import { Typography } from "../constants/typography";
import { IconSize } from "../constants/iconSizes";
import AppIcon from "../components/Icon/AppIcon";

type Step = 1 | 2 | 3;

export default function VerifyWorkoutScreen() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<Step>(1);
  const [photoCaptured, setPhotoCaptured] = useState(false);

  const steps = [
    { label: "Location", step: 1 },
    { label: "Photo", step: 2 },
    { label: "Complete", step: 3 },
  ];

  const renderStepIndicator = () => (
    <View className="mb-8">
      {/* Progress Bar: Independent Segments */}
      <View className="flex-row gap-1.5">
        {steps.map((s) => {
          const isActive = step === s.step;
          const isCompleted = step > s.step;
          const showFill = isActive || isCompleted;

          return (
            <View
              key={s.step}
              className="flex-1 h-2 rounded"
              style={{
                backgroundColor: showFill ? colors.primary : colors.border,
              }}
            />
          );
        })}
      </View>

      {/* Labels */}
      <View className="flex-row mt-2">
        {steps.map((s) => {
          const isActive = step === s.step;
          const isCompleted = step > s.step;
          const isHighlighted = isActive || isCompleted;

          return (
            <View key={s.step} className="flex-1 items-start">
              <Text
                style={[
                  isHighlighted ? Typography.overline : Typography.caption,
                  {
                    color: isHighlighted
                      ? colors.textPrimary
                      : colors.textSecondary,
                  },
                ]}
                numberOfLines={1}
              >
                {s.label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );

  const renderLocationStep = () => (
    <Animated.View
      key="step1"
      entering={FadeInDown.duration(400)}
      exiting={FadeOut.duration(200)}
      className="items-center pt-4"
    >
      <Text
        className="text-center mb-1.5"
        style={[Typography.title, { color: colors.textPrimary }]}
      >
        Location Verification
      </Text>
      <Text
        className="text-center mb-10"
        style={[Typography.body, { color: colors.textSecondary }]}
      >
        Confirm you're at the gym
      </Text>

      <View
        className="w-[120px] h-[120px] rounded-full justify-center items-center mb-10"
        style={{ backgroundColor: colors.successContainer }}
      >
        <AppIcon
          name="check"
          size={IconSize.hero}
          color={colors.success}
          strokeWidth={3}
        />
      </View>

      <Pressable
        onPress={() => setStep(2)}
        style={({ pressed }) => ({
          alignSelf: "stretch",
          paddingVertical: 16,
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
          Continue
        </Text>
      </Pressable>
    </Animated.View>
  );

  const renderPhotoStep = () => (
    <Animated.View
      key="step2"
      entering={FadeInDown.duration(400)}
      exiting={FadeOut.duration(200)}
      className="items-center pt-4"
    >
      <Text
        className="text-center mb-1.5"
        style={[Typography.title, { color: colors.textPrimary }]}
      >
        Photo Verification
      </Text>
      <Text
        className="text-center mb-6"
        style={[Typography.body, { color: colors.textSecondary }]}
      >
        Take a photo of your gym
      </Text>

      <View
        className="w-full aspect-square rounded-3xl justify-center items-center mb-6 overflow-hidden"
        style={{
          backgroundColor: colors.surface,
          shadowColor: isDark ? "#000" : "#2C3E5B",
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: isDark ? 0.25 : 0.06,
          shadowRadius: 8,
          elevation: 3,
        }}
      >
        {photoCaptured ? (
          <View className="items-center">
            <View
              className="w-14 h-14 rounded-full justify-center items-center mb-2"
              style={{ backgroundColor: colors.successContainer }}
            >
              <AppIcon
                name="check"
                size={IconSize.lg}
                color={colors.success}
                strokeWidth={3}
              />
            </View>
            <Text style={[Typography.overline, { color: colors.textPrimary }]}>
              Photo Captured
            </Text>
          </View>
        ) : (
          <>
            <View
              className="w-14 h-14 rounded-full justify-center items-center mb-2"
              style={{ backgroundColor: colors.surfaceMuted }}
            >
              <AppIcon
                name="image"
                size={IconSize.md}
                color={colors.textSecondary}
                strokeWidth={1.8}
              />
            </View>
            <Text style={[Typography.label, { color: colors.textSecondary }]}>
              Camera Ready
            </Text>
          </>
        )}
      </View>

      {photoCaptured ? (
        <View className="w-full flex-row gap-3">
          <Pressable
            onPress={() => setPhotoCaptured(false)}
            style={({ pressed }) => ({
              flex: 1,
              paddingVertical: 16,
              borderRadius: 20,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: colors.surfaceMuted,
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Text style={[Typography.bodyLarge, { color: colors.textSecondary }]}>
              Retake
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setStep(3)}
            style={({ pressed }) => ({
              flex: 1,
              paddingVertical: 16,
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
              Continue
            </Text>
          </Pressable>
        </View>
      ) : (
        <Pressable
          onPress={() => setPhotoCaptured(true)}
          style={({ pressed }) => ({
            alignSelf: "stretch",
            paddingVertical: 16,
            borderRadius: 20,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            gap: 10,
            backgroundColor: colors.primary,
            opacity: pressed ? 0.85 : 1,
            transform: [{ scale: pressed ? 0.97 : 1 }],
          })}
        >
          <AppIcon
            name="camera"
            size={IconSize.md}
            color={colors.onPrimary}
            strokeWidth={2}
          />
          <Text
            style={[
              Typography.bodyLarge,
              { color: colors.onPrimary, letterSpacing: 0.3 },
            ]}
          >
            Capture Photo
          </Text>
        </Pressable>
      )}
    </Animated.View>
  );

  const renderCompleteStep = () => (
    <Animated.View
      key="step3"
      entering={FadeInDown.duration(400)}
      exiting={FadeOut.duration(200)}
      className="items-center pt-4"
    >
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

      <Text
        className="text-center mb-3"
        style={[
          Typography.heading,
          { color: colors.textPrimary, letterSpacing: -0.5 },
        ]}
      >
        Workout Complete
      </Text>

      <Text
        className="text-center mb-10 px-5"
        style={[Typography.body, { color: colors.textSecondary, lineHeight: 22 }]}
      >
        Great work showing up. Your commitment is fulfilled for today.
      </Text>

      <Pressable
        onPress={() => router.push("/")}
        style={({ pressed }) => ({
          alignSelf: "stretch",
          paddingVertical: 16,
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
  );

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
        <View className="flex-row items-center mb-6">
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
            Verify Workout
          </Text>
        </View>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Step Content */}
        {step === 1 && renderLocationStep()}
        {step === 2 && renderPhotoStep()}
        {step === 3 && renderCompleteStep()}
      </View>
    </View>
  );
}
