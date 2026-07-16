import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StatusBar,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { useTranslation } from "../components/Localization/LanguageProvider";
import { Typography } from "../constants/typography";
import { IconSize } from "../constants/iconSizes";
import AppIcon from "../components/Icon/AppIcon";

export default function AccountSecurityScreen() {
  const { colors, isDark } = useTheme();
  const { t } = useTranslation();
  const { updatePassword } = useAuth();
  const insets = useSafeAreaInsets();
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [currentPwError, setCurrentPwError] = useState<string | null>(null);
  const [newPwError, setNewPwError] = useState<string | null>(null);
  const [confirmPwError, setConfirmPwError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdatePassword = async () => {
    const nextCurrentPwError =
      currentPw.length > 0 ? null : t("currentPasswordRequired");
    const nextNewPwError = newPw.length >= 6 ? null : t("passwordTooShort");
    const nextConfirmPwError =
      confirmPw === newPw ? null : t("passwordMismatch");

    setCurrentPwError(nextCurrentPwError);
    setNewPwError(nextNewPwError);
    setConfirmPwError(nextConfirmPwError);
    setFormError(null);
    setSuccessMessage(null);

    if (nextCurrentPwError || nextNewPwError || nextConfirmPwError) return;

    setIsSubmitting(true);
    const { error } = await updatePassword(currentPw, newPw);
    setIsSubmitting(false);

    if (error) {
      setFormError(error);
      return;
    }

    setCurrentPw("");
    setNewPw("");
    setConfirmPw("");
    setSuccessMessage(t("passwordUpdated"));
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
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

        {formError ? (
          <View
            className="rounded-2xl px-4 py-3 mb-5"
            style={{ backgroundColor: colors.errorContainer }}
          >
            <Text style={[Typography.label, { color: colors.error }]}>
              {formError}
            </Text>
          </View>
        ) : null}

        {successMessage ? (
          <View
            className="rounded-2xl px-4 py-3 mb-5"
            style={{ backgroundColor: colors.infoContainer }}
          >
            <Text style={[Typography.label, { color: colors.info }]}>
              {successMessage}
            </Text>
          </View>
        ) : null}

        {/* ===== CHANGE PASSWORD ===== */}
        <Text
          className="mb-3 px-0.5"
          style={[
            Typography.overline,
            { color: colors.textSecondary, letterSpacing: 1.2 },
          ]}
        >
          {t("changePassword").toUpperCase()}
        </Text>

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
          {/* Current Password */}
          <View className="mb-4">
            <View className="flex-row items-center gap-1.5 mb-1.5">
              <AppIcon name="lock" size={14} color={colors.primary} strokeWidth={2} />
              <Text style={[Typography.overline, { color: colors.textSecondary }]}>
                {t("currentPassword")}
              </Text>
            </View>
            <View style={{ justifyContent: "center" }}>
              <TextInput
                value={currentPw}
                onChangeText={(value) => {
                  setCurrentPw(value);
                  if (currentPwError) setCurrentPwError(null);
                }}
                secureTextEntry={!showCurrentPw}
                keyboardAppearance="light"
                placeholder="••••••••"
                placeholderTextColor={colors.textSecondary}
                className="rounded-xl py-3 pl-4"
                style={[Typography.body, { paddingRight: 44, backgroundColor: isDark ? colors.surfaceMuted : colors.surface, color: colors.textPrimary, borderWidth: currentPwError ? 1 : isDark ? 0 : 1, borderColor: currentPwError ? colors.error : colors.border }]}
              />
              <Pressable
                onPress={() => setShowCurrentPw((prev) => !prev)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={{ position: "absolute", right: 14 }}
              >
                <AppIcon
                  name={showCurrentPw ? "eyeOff" : "eye"}
                  size={IconSize.sm}
                  color={colors.textSecondary}
                  strokeWidth={2}
                />
              </Pressable>
            </View>
            {currentPwError ? (
              <Text
                className="mt-1.5 px-0.5"
                style={[Typography.caption, { color: colors.error }]}
              >
                {currentPwError}
              </Text>
            ) : null}
          </View>

          {/* New Password */}
          <View className="mb-4">
            <View className="flex-row items-center gap-1.5 mb-1.5">
              <AppIcon name="lock" size={14} color={colors.primary} strokeWidth={2} />
              <Text style={[Typography.overline, { color: colors.textSecondary }]}>
                {t("newPassword")}
              </Text>
            </View>
            <View style={{ justifyContent: "center" }}>
              <TextInput
                value={newPw}
                onChangeText={(value) => {
                  setNewPw(value);
                  if (newPwError) setNewPwError(null);
                }}
                secureTextEntry={!showNewPw}
                keyboardAppearance="light"
                placeholder="••••••••"
                placeholderTextColor={colors.textSecondary}
                className="rounded-xl py-3 pl-4"
                style={[Typography.body, { paddingRight: 44, backgroundColor: isDark ? colors.surfaceMuted : colors.surface, color: colors.textPrimary, borderWidth: newPwError ? 1 : isDark ? 0 : 1, borderColor: newPwError ? colors.error : colors.border }]}
              />
              <Pressable
                onPress={() => setShowNewPw((prev) => !prev)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={{ position: "absolute", right: 14 }}
              >
                <AppIcon
                  name={showNewPw ? "eyeOff" : "eye"}
                  size={IconSize.sm}
                  color={colors.textSecondary}
                  strokeWidth={2}
                />
              </Pressable>
            </View>
            {newPwError ? (
              <Text
                className="mt-1.5 px-0.5"
                style={[Typography.caption, { color: colors.error }]}
              >
                {newPwError}
              </Text>
            ) : null}
          </View>

          {/* Confirm Password */}
          <View className="mb-2">
            <View className="flex-row items-center gap-1.5 mb-1.5">
              <AppIcon name="lock" size={14} color={colors.primary} strokeWidth={2} />
              <Text style={[Typography.overline, { color: colors.textSecondary }]}>
                {t("confirmPassword")}
              </Text>
            </View>
            <View style={{ justifyContent: "center" }}>
              <TextInput
                value={confirmPw}
                onChangeText={(value) => {
                  setConfirmPw(value);
                  if (confirmPwError) setConfirmPwError(null);
                }}
                secureTextEntry={!showConfirmPw}
                keyboardAppearance="light"
                placeholder="••••••••"
                placeholderTextColor={colors.textSecondary}
                className="rounded-xl py-3 pl-4"
                style={[Typography.body, { paddingRight: 44, backgroundColor: isDark ? colors.surfaceMuted : colors.surface, color: colors.textPrimary, borderWidth: confirmPwError ? 1 : isDark ? 0 : 1, borderColor: confirmPwError ? colors.error : colors.border }]}
              />
              <Pressable
                onPress={() => setShowConfirmPw((prev) => !prev)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={{ position: "absolute", right: 14 }}
              >
                <AppIcon
                  name={showConfirmPw ? "eyeOff" : "eye"}
                  size={IconSize.sm}
                  color={colors.textSecondary}
                  strokeWidth={2}
                />
              </Pressable>
            </View>
            {confirmPwError ? (
              <Text
                className="mt-1.5 px-0.5"
                style={[Typography.caption, { color: colors.error }]}
              >
                {confirmPwError}
              </Text>
            ) : null}
          </View>

          {/* Update Button */}
          <Pressable
            onPress={handleUpdatePassword}
            disabled={isSubmitting}
            style={({ pressed }) => ({
              paddingVertical: 14,
              borderRadius: 16,
              alignItems: "center",
              justifyContent: "center",
              marginTop: 8,
              backgroundColor: colors.primary,
              opacity: isSubmitting ? 0.7 : pressed ? 0.85 : 1,
              transform: [{ scale: pressed ? 0.97 : 1 }],
            })}
          >
            {isSubmitting ? (
              <ActivityIndicator color={colors.onPrimary} />
            ) : (
              <Text
                style={[
                  Typography.bodyLarge,
                  { color: colors.onPrimary, letterSpacing: 0.3 },
                ]}
              >
                {t("updatePassword")}
              </Text>
            )}
          </Pressable>
        </View>
      </View>
    </View>
    </TouchableWithoutFeedback>
  );
}
