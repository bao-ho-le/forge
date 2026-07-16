import React, { useEffect, useRef, useState } from "react";
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
import { router, useNavigation } from "expo-router";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { useTranslation } from "../components/Localization/LanguageProvider";
import { Typography } from "../constants/typography";
import { IconSize } from "../constants/iconSizes";
import AppIcon from "../components/Icon/AppIcon";
import { suggestEmailDomain } from "../lib/emailTypo";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function EditEmailScreen() {
  const { colors, isDark } = useTheme();
  const { t } = useTranslation();
  const { session, updateEmail } = useAuth();
  const insets = useSafeAreaInsets();
  const currentEmail = session?.user?.email ?? "";
  const [email, setEmail] = useState(currentEmail);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailSuggestion, setEmailSuggestion] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pending, setPending] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  useEffect(() => {
    setEmail(currentEmail);
  }, [currentEmail]);

  useEffect(() => {
    // Focus once the push transition actually finishes, so the keyboard's
    // own slide-up animation isn't fighting the screen transition.
    const unsubscribe = navigation.addListener("transitionEnd", () => {
      inputRef.current?.focus();
    });
    return unsubscribe;
  }, [navigation]);

  const trimmedEmail = email.trim();
  const isSameAsCurrent =
    trimmedEmail.length > 0 &&
    trimmedEmail.toLowerCase() === currentEmail.toLowerCase();
  const isValidFormat = EMAIL_REGEX.test(trimmedEmail);
  const canSubmit = isValidFormat && !isSameAsCurrent && !isSubmitting;

  const handleSave = async () => {
    if (!isValidFormat) {
      setEmailError(t("invalidEmail"));
      return;
    }
    if (isSameAsCurrent) {
      setEmailError(t("emailSameAsCurrent"));
      return;
    }
    setEmailError(null);
    setFormError(null);
    setIsSubmitting(true);
    const { error } = await updateEmail(trimmedEmail);
    setIsSubmitting(false);

    if (error) {
      setFormError(error);
      return;
    }
    setPending(true);
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
            {t("editEmail")}
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

        {pending ? (
          <View
            className="rounded-2xl px-4 py-3 mb-5 flex-row items-start"
            style={{ backgroundColor: colors.infoContainer }}
          >
            <AppIcon
              name="checkCircle"
              size={IconSize.sm}
              color={colors.info}
              strokeWidth={2}
            />
            <View className="flex-1 ml-2.5">
              <Text style={[Typography.label, { color: colors.info }]}>
                {t("emailChangePendingTitle")}
              </Text>
              <Text
                className="mt-1"
                style={[Typography.caption, { color: colors.info }]}
              >
                {t("emailChangePendingDesc")}
              </Text>
            </View>
          </View>
        ) : null}

        {/* Input */}
        <View
          className="rounded-2xl p-4 mb-6"
          style={{
            backgroundColor: colors.surface,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.04,
            shadowRadius: 6,
            elevation: 2,
          }}
        >
          <View className="flex-row items-center gap-1.5 mb-2">
            <AppIcon name="mail" size={14} color={colors.primary} strokeWidth={2} />
            <Text
              style={[
                Typography.overline,
                { color: colors.textSecondary, letterSpacing: 1 },
              ]}
            >
              {t("currentEmail")}
            </Text>
          </View>
          <TextInput
            ref={inputRef}
            value={email}
            onChangeText={(value) => {
              setEmail(value);
              if (emailError) setEmailError(null);
              if (emailSuggestion) setEmailSuggestion(null);
              if (pending) setPending(false);
            }}
            onBlur={() => setEmailSuggestion(suggestEmailDomain(email.trim()))}
            placeholder={t("enterEmail")}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardAppearance="light"
            className="rounded-xl py-3 px-4"
            style={[
              Typography.body,
              {
                backgroundColor: isDark ? colors.surfaceMuted : colors.surface,
                color: colors.textPrimary,
                borderWidth: emailError ? 1 : isDark ? 0 : 1,
                borderColor: emailError ? colors.error : colors.border,
              },
            ]}
            placeholderTextColor={colors.textSecondary}
          />
          {emailError ? (
            <Text
              className="mt-1.5 px-0.5"
              style={[Typography.caption, { color: colors.error }]}
            >
              {emailError}
            </Text>
          ) : null}
          {!emailError && emailSuggestion ? (
            <Pressable
              className="mt-1.5 px-0.5"
              onPress={() => {
                setEmail(emailSuggestion);
                setEmailSuggestion(null);
              }}
            >
              <Text style={[Typography.caption, { color: colors.textSecondary }]}>
                {t("emailDidYouMean")}{" "}
                <Text style={{ color: colors.primary, fontWeight: "700" }}>
                  {emailSuggestion}
                </Text>
                ?
              </Text>
            </Pressable>
          ) : null}
        </View>

        {/* Save Button */}
        <Pressable
          onPress={handleSave}
          disabled={!canSubmit}
          style={({ pressed }) => ({
            alignSelf: "stretch",
            paddingVertical: 16,
            borderRadius: 20,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: colors.primary,
            opacity: !canSubmit ? 0.5 : pressed ? 0.85 : 1,
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
              {t("save")}
            </Text>
          )}
        </Pressable>
      </View>
    </View>
    </TouchableWithoutFeedback>
  );
}
