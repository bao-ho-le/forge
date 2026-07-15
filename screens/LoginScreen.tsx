import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StatusBar,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { useTranslation } from "../components/Localization/LanguageProvider";
import { Typography } from "../constants/typography";
import { IconSize } from "../constants/iconSizes";
import AppIcon from "../components/Icon/AppIcon";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen() {
  const { colors, isDark } = useTheme();
  const { signIn } = useAuth();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignIn = async () => {
    const trimmedEmail = email.trim();
    const nextEmailError = EMAIL_REGEX.test(trimmedEmail)
      ? null
      : t("invalidEmail");
    const nextPasswordError =
      password.length >= 6 ? null : t("passwordTooShort");

    setEmailError(nextEmailError);
    setPasswordError(nextPasswordError);
    setFormError(null);

    if (nextEmailError || nextPasswordError) return;

    setIsSubmitting(true);
    const { error } = await signIn(trimmedEmail, password);
    setIsSubmitting(false);

    if (error) setFormError(error);
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      style={{ backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: insets.top + 64,
          paddingBottom: insets.bottom + 32,
          paddingHorizontal: 24,
        }}
      >
        <View className="mb-10">
          <Text
            style={[
              Typography.heading,
              { color: colors.textPrimary, letterSpacing: -0.5 },
            ]}
          >
            {t("welcomeBack")}
          </Text>
          <Text
            className="mt-2"
            style={[Typography.body, { color: colors.textSecondary }]}
          >
            {t("signInToContinue")}
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

        <View className="mb-4">
          <Text
            className="mb-2 px-0.5"
            style={[Typography.overline, { color: colors.textSecondary }]}
          >
            {t("email")}
          </Text>
          <View
            className="flex-row items-center rounded-2xl px-4"
            style={{
              backgroundColor: colors.surface,
              borderWidth: emailError ? 1 : isDark ? 0 : 1,
              borderColor: emailError ? colors.error : colors.border,
            }}
          >
            <AppIcon
              name="mail"
              size={IconSize.sm}
              color={colors.textSecondary}
              strokeWidth={2}
            />
            <TextInput
              value={email}
              onChangeText={(value) => {
                setEmail(value);
                if (emailError) setEmailError(null);
              }}
              placeholder={t("enterEmail")}
              placeholderTextColor={colors.textSecondary}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              className="flex-1 ml-3 py-3.5"
              style={[Typography.body, { color: colors.textPrimary }]}
            />
          </View>
          {emailError ? (
            <Text
              className="mt-1.5 px-0.5"
              style={[Typography.caption, { color: colors.error }]}
            >
              {emailError}
            </Text>
          ) : null}
        </View>

        <View className="mb-6">
          <Text
            className="mb-2 px-0.5"
            style={[Typography.overline, { color: colors.textSecondary }]}
          >
            {t("password")}
          </Text>
          <View
            className="flex-row items-center rounded-2xl px-4"
            style={{
              backgroundColor: colors.surface,
              borderWidth: passwordError ? 1 : isDark ? 0 : 1,
              borderColor: passwordError ? colors.error : colors.border,
            }}
          >
            <AppIcon
              name="lock"
              size={IconSize.sm}
              color={colors.textSecondary}
              strokeWidth={2}
            />
            <TextInput
              value={password}
              onChangeText={(value) => {
                setPassword(value);
                if (passwordError) setPasswordError(null);
              }}
              placeholder={t("enterPassword")}
              placeholderTextColor={colors.textSecondary}
              autoCapitalize="none"
              secureTextEntry
              className="flex-1 ml-3 py-3.5"
              style={[Typography.body, { color: colors.textPrimary }]}
            />
          </View>
          {passwordError ? (
            <Text
              className="mt-1.5 px-0.5"
              style={[Typography.caption, { color: colors.error }]}
            >
              {passwordError}
            </Text>
          ) : null}
        </View>

        <Pressable
          onPress={handleSignIn}
          disabled={isSubmitting}
          style={({ pressed }) => ({
            alignSelf: "stretch",
            paddingVertical: 16,
            borderRadius: 20,
            alignItems: "center",
            justifyContent: "center",
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
              {t("signIn")}
            </Text>
          )}
        </Pressable>

        <View className="flex-row justify-center mt-6">
          <Text style={[Typography.label, { color: colors.textSecondary }]}>
            {t("dontHaveAccount")}{" "}
          </Text>
          <Pressable
            onPress={() => router.replace("/(auth)/signup")}
            hitSlop={8}
          >
            <Text
              style={[
                Typography.label,
                { color: colors.primary, fontWeight: "700" },
              ]}
            >
              {t("signUp")}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
