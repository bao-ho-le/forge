import React, { useState, useRef } from "react";
import { View, Text, TextInput, Pressable, StatusBar, Keyboard } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useTheme } from "../contexts/ThemeContext";
import { useTranslation } from "../components/Localization/LanguageProvider";
import { Typography } from "../constants/typography";
import { IconSize } from "../constants/iconSizes";
import AppIcon from "../components/Icon/AppIcon";

export default function RecoveryWorkoutSettingsScreen() {
  const { colors, isDark } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [reps, setReps] = useState(20);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("20");
  const inputRef = useRef<TextInput>(null);

  const decrease = () => {
    if (reps > 5) setReps((p) => p - 5);
  };
  const increase = () => {
    if (reps < 100) setReps((p) => p + 5);
  };

  const startEditing = () => {
    setEditValue(String(reps));
    setIsEditing(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const finishEditing = () => {
    const val = parseInt(editValue, 10);
    if (!isNaN(val) && val >= 5 && val <= 100) {
      setReps(val);
    } else {
      setEditValue(String(reps));
    }
    setIsEditing(false);
  };

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />

      <Pressable
        className="flex-1 px-5"
        style={{ paddingTop: insets.top + 16 }}
        onPress={Keyboard.dismiss}
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
            {t("recoveryWorkoutManage")}
          </Text>
        </View>

        <Text
          className="mb-6 px-0.5"
          style={[Typography.caption, { color: colors.textSecondary }]}
        >
          {t("recoveryWorkoutHint")}
        </Text>

        {/* Push-up Target Card */}
        <View
          className="rounded-[20px] p-6 items-center"
          style={{
            backgroundColor: colors.surface,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.04,
            shadowRadius: 6,
            elevation: 2,
          }}
        >
          <View
            className="w-12 h-12 rounded-[14px] justify-center items-center mb-4"
            style={{ backgroundColor: colors.primaryContainer }}
          >
            <AppIcon
              name="shieldRecovery"
              size={IconSize.md}
              color={colors.primary}
              strokeWidth={1.8}
            />
          </View>

          {/* Label row */}
          <View className="flex-row items-center mb-4">
            <Text
              style={[
                Typography.overline,
                { color: colors.textSecondary, letterSpacing: 1.2 },
              ]}
            >
              Push-up reps
            </Text>
          </View>

          {/* Stepper */}
          <View className="flex-row items-center gap-6">
            <Pressable
              onPress={decrease}
              style={({ pressed }) => ({
                width: 48,
                height: 48,
                borderRadius: 9999,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: colors.surfaceMuted,
                opacity: pressed ? 0.7 : 1,
                transform: [{ scale: pressed ? 0.92 : 1 }],
              })}
            >
              <Text
                className="mt-[-2px]"
                style={[Typography.title, { color: colors.textPrimary }]}
              >
                −
              </Text>
            </Pressable>

            {isEditing ? (
              <TextInput
                ref={inputRef}
                value={editValue}
                onChangeText={setEditValue}
                keyboardType="number-pad"
                keyboardAppearance="light"
                selectTextOnFocus
                onBlur={finishEditing}
                onSubmitEditing={finishEditing}
                maxLength={3}
                style={[
                  Typography.display,
                  {
                    color: colors.primary,
                    letterSpacing: -1,
                    width: 80,
                    textAlign: "center",
                    paddingVertical: 0,
                  },
                ]}
              />
            ) : (
              <Pressable
                onPress={startEditing}
                style={({ pressed }) => ({
                  width: 80,
                  opacity: pressed ? 0.7 : 1,
                  transform: [{ scale: pressed ? 0.92 : 1 }],
                })}
              >
                <Text
                  style={[
                    Typography.display,
                    { color: colors.primary, letterSpacing: -1, textAlign: "center" },
                  ]}
                >
                  {reps}
                </Text>
              </Pressable>
            )}

            <Pressable
              onPress={increase}
              style={({ pressed }) => ({
                width: 48,
                height: 48,
                borderRadius: 9999,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: colors.surfaceMuted,
                opacity: pressed ? 0.7 : 1,
                transform: [{ scale: pressed ? 0.92 : 1 }],
              })}
            >
              <Text
                className="mt-[-2px]"
                style={[Typography.title, { color: colors.textPrimary }]}
              >
                +
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Save Button */}
        <Pressable
          style={({ pressed }) => ({
            alignSelf: "stretch",
            paddingVertical: 16,
            borderRadius: 20,
            alignItems: "center",
            justifyContent: "center",
            marginTop: 24,
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
            {t("save")}
          </Text>
        </Pressable>
      </Pressable>

    </View>
  );
}
