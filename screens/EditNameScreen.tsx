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

export default function EditNameScreen() {
  const { colors, isDark } = useTheme();
  const { t } = useTranslation();
  const { profile, updateFullName } = useAuth();
  const insets = useSafeAreaInsets();
  const [name, setName] = useState(profile?.full_name ?? "");
  const [nameError, setNameError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  useEffect(() => {
    setName(profile?.full_name ?? "");
  }, [profile?.full_name]);

  useEffect(() => {
    // Focus once the push transition actually finishes, so the keyboard's
    // own slide-up animation isn't fighting the screen transition.
    const unsubscribe = navigation.addListener("transitionEnd", () => {
      inputRef.current?.focus();
    });
    return unsubscribe;
  }, [navigation]);

  const handleSave = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setNameError(t("nameRequired"));
      return;
    }
    setNameError(null);
    setFormError(null);
    setIsSubmitting(true);
    const { error } = await updateFullName(trimmed);
    setIsSubmitting(false);

    if (error) {
      setFormError(error);
      return;
    }
    router.back();
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
            {t("editName")}
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
            <AppIcon name="user" size={14} color={colors.primary} strokeWidth={2} />
            <Text
              style={[
                Typography.overline,
                { color: colors.textSecondary, letterSpacing: 1 },
              ]}
            >
              {t("currentName")}
            </Text>
          </View>
          <TextInput
            ref={inputRef}
            value={name}
            onChangeText={(value) => {
              setName(value);
              if (nameError) setNameError(null);
            }}
            placeholder={t("enterName")}
            keyboardAppearance="light"
            className="rounded-xl py-3 px-4"
            style={[
              Typography.body,
              {
                backgroundColor: isDark ? colors.surfaceMuted : colors.surface,
                color: colors.textPrimary,
                borderWidth: nameError ? 1 : isDark ? 0 : 1,
                borderColor: nameError ? colors.error : colors.border,
              },
            ]}
            placeholderTextColor={colors.textSecondary}
          />
          {nameError ? (
            <Text
              className="mt-1.5 px-0.5"
              style={[Typography.caption, { color: colors.error }]}
            >
              {nameError}
            </Text>
          ) : null}
        </View>

        {/* Save Button */}
        <Pressable
          onPress={handleSave}
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
              {t("save")}
            </Text>
          )}
        </Pressable>
      </View>
    </View>
    </TouchableWithoutFeedback>
  );
}
