import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useTheme } from "../contexts/ThemeContext";
import { useTranslation } from "../components/Localization/LanguageProvider";
import { Typography } from "../constants/typography";
import { IconSize } from "../constants/iconSizes";
import AppIcon from "../components/Icon/AppIcon";

export default function AccountSecurityScreen() {
  const { colors, isDark } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />

      <View className="flex-1 px-5" style={{ paddingTop: insets.top + 16 }}>
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
            {t("accountSecurityManage")}
          </Text>
        </View>

        {/* Change Password Card */}
        <View
          className="rounded-[20px] p-5"
          style={{
            backgroundColor: colors.surface,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.04,
            shadowRadius: 6,
            elevation: 2,
          }}
        >
          <View className="flex-row items-center gap-2.5 mb-5">
            <View
              className="w-9 h-9 rounded-[10px] justify-center items-center"
              style={{ backgroundColor: colors.primaryContainer }}
            >
              <AppIcon
                name="lock"
                size={IconSize.sm}
                color={colors.primary}
                strokeWidth={1.8}
              />
            </View>
            <Text style={[Typography.bodyLarge, { color: colors.textPrimary }]}>
              {t("changePassword")}
            </Text>
          </View>

          {/* Current Password */}
          <View className="mb-4">
            <Text
              className="mb-1.5"
              style={[Typography.overline, { color: colors.textSecondary }]}
            >
              {t("currentPassword")}
            </Text>
            <TextInput
              value={currentPw}
              onChangeText={setCurrentPw}
              secureTextEntry
              placeholder="••••••••"
              placeholderTextColor={colors.textSecondary}
              className="rounded-xl py-3 px-4"
              style={[Typography.body, { backgroundColor: isDark ? colors.surfaceMuted : colors.surface, color: colors.textPrimary, borderWidth: isDark ? 0 : 1, borderColor: colors.border }]}
            />
          </View>

          {/* New Password */}
          <View className="mb-4">
            <Text
              className="mb-1.5"
              style={[Typography.overline, { color: colors.textSecondary }]}
            >
              {t("newPassword")}
            </Text>
            <TextInput
              value={newPw}
              onChangeText={setNewPw}
              secureTextEntry
              placeholder="••••••••"
              placeholderTextColor={colors.textSecondary}
              className="rounded-xl py-3 px-4"
              style={[Typography.body, { backgroundColor: isDark ? colors.surfaceMuted : colors.surface, color: colors.textPrimary, borderWidth: isDark ? 0 : 1, borderColor: colors.border }]}
            />
          </View>

          {/* Confirm Password */}
          <View className="mb-2">
            <Text
              className="mb-1.5"
              style={[Typography.overline, { color: colors.textSecondary }]}
            >
              {t("confirmPassword")}
            </Text>
            <TextInput
              value={confirmPw}
              onChangeText={setConfirmPw}
              secureTextEntry
              placeholder="••••••••"
              placeholderTextColor={colors.textSecondary}
              className="rounded-xl py-3 px-4"
              style={[Typography.body, { backgroundColor: isDark ? colors.surfaceMuted : colors.surface, color: colors.textPrimary, borderWidth: isDark ? 0 : 1, borderColor: colors.border }]}
            />
          </View>

          {/* Update Button */}
          <Pressable
            style={({ pressed }) => ({
              paddingVertical: 14,
              borderRadius: 16,
              alignItems: "center",
              justifyContent: "center",
              marginTop: 8,
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
              {t("updatePassword")}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
