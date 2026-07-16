import React, { useState } from "react";
import { View, Text, ScrollView, StatusBar, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { router } from "expo-router";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { useTranslation } from "../components/Localization/LanguageProvider";
import { Typography } from "../constants/typography";
import { IconSize } from "../constants/iconSizes";
import ProfileHeader from "../components/ProfileHeader";
import ProfileSection from "../components/ProfileSection";
import AppIcon from "../components/Icon/AppIcon";
import ProfileSettingRow from "../components/ProfileSettingRow";
import AppearanceSelector from "../components/AppearanceSelector";
import { TAB_BAR_HEIGHT } from "../constants/tabNavigation";
import ThemedSwitch from "../components/ThemedSwitch";

export default function ProfileScreen() {
  const { colors, isDark } = useTheme();
  const { session, profile, signOut } = useAuth();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const displayName = profile?.full_name || session?.user?.email || "";
  const email = session?.user?.email ?? "";

  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [disciplineModeEnabled, setDisciplineModeEnabled] = useState(true);

  const scale = useSharedValue(1);
  const signOutStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + TAB_BAR_HEIGHT + 32,
          paddingHorizontal: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* ===== HEADER ===== */}
        <View className="mb-6">
          <Text
            style={[
              Typography.heading,
              { color: colors.textPrimary, letterSpacing: -0.5 },
            ]}
          >
            {t("profile")}
          </Text>
        </View>

        {/* ===== USER PROFILE HEADER ===== */}
        <View>
          <ProfileHeader name={displayName} />
        </View>

        {/* ===== PERSONAL INFORMATION ===== */}
        <View>
          <ProfileSection title={t("personalInfo")}>
          <ProfileSettingRow
            icon="user"
            title="Name"
            value={displayName}
            isLast={false}
            onPress={() => router.push("/edit-name")}
          />
          <ProfileSettingRow
            icon="mail"
            title={t("email")}
            value={email}
            isLast={false}
            onPress={() => router.push("/edit-email")}
          />
          <ProfileSettingRow
            icon="creditCard"
            title={t("paymentMethod")}
            value="Visa •••• 4242"
            isLast={false}
            onPress={() => router.push("/payment-method")}
          />
          <ProfileSettingRow
            icon="crown"
            title={t("subscriptionPlan")}
            value="Premium"
            isLast={false}
            onPress={() => router.push("/subscription-plan")}
          />
          <ProfileSettingRow
            icon="shield"
            title={t("accountSecurity")}
            isLast={true}
            onPress={() => router.push("/account-security")}
          />
        </ProfileSection>
        </View>

        {/* ===== COMMITMENT ===== */}
        <View>
          <ProfileSection title={t("commitment")}>
          <ProfileSettingRow
            icon="mapPin"
            title={t("gymLocation")}
            isLast={false}
            onPress={() => router.push("/gym-location")}
          />
          <ProfileSettingRow
            icon="shieldRecovery"
            title={t("recoveryWorkout")}
            value={t("recoveryValue")}
            isLast={true}
            onPress={() => router.push("/recovery-workout-settings")}
          />
        </ProfileSection>
        </View>

        {/* ===== APP RESTRICTION ===== */}
        <View>
          <ProfileSection title={t("appRestriction")}>
          <ProfileSettingRow
            icon="lock"
            title={t("lockedApps")}
            value="3 apps"
            isLast={false}
            onPress={() => router.push("/locked-apps")}
          />
          {/* Discipline Mode as a custom row with toggle */}
          <View className="flex-row items-center py-3.5 px-4">
            <View
              className="w-9 h-9 rounded-[10px] justify-center items-center mr-3.5"
              style={{ backgroundColor: colors.primaryContainer }}
            >
              <AppIcon
                name="shieldAlert"
                size={IconSize.sm}
                color={colors.primary}
                strokeWidth={1.8}
              />
            </View>
            <View className="flex-1">
              <Text style={[Typography.body, { color: colors.textPrimary }]}>
                {t("disciplineModeToggle")}
              </Text>
              <Text
                className="mt-0.5"
                style={[Typography.caption, { color: colors.textSecondary }]}
              >
                {disciplineModeEnabled ? t("enabled") : t("disabled")}
              </Text>
            </View>
            <ThemedSwitch
              value={disciplineModeEnabled}
              onValueChange={setDisciplineModeEnabled}
            />
          </View>
        </ProfileSection>
        </View>

        {/* ===== NOTIFICATIONS ===== */}
        <View>
          <View className="mb-7">
          <Text
            className="mb-3 px-0.5"
            style={[
              Typography.overline,
              { color: colors.textSecondary, letterSpacing: 1.2 },
            ]}
          >
            {t("notifications")}
          </Text>
          <View
            className="rounded-[20px] overflow-hidden"
            style={{
              backgroundColor: colors.surface,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.04,
              shadowRadius: 6,
              elevation: 2,
            }}
          >
            {/* Workout Reminders */}
            <View
              className="flex-row items-center py-3.5 px-4 border-b"
              style={{ borderBottomColor: colors.border }}
            >
              <View
                className="w-9 h-9 rounded-[10px] justify-center items-center mr-3.5"
                style={{ backgroundColor: colors.primaryContainer }}
              >
                <AppIcon
                  name="bell"
                  size={IconSize.sm}
                  color={colors.primary}
                  strokeWidth={1.8}
                />
              </View>
              <View className="flex-1">
                <Text style={[Typography.body, { color: colors.textPrimary }]}>
                  {t("workoutReminders")}
                </Text>
                <Text
                  className="mt-0.5"
                  style={[Typography.caption, { color: colors.textSecondary }]}
                >
                  {t("workoutRemindersDesc")}
                </Text>
              </View>
              <ThemedSwitch
                value={remindersEnabled}
                onValueChange={setRemindersEnabled}
              />
            </View>

            {/* Discipline Mode Alerts */}
            <View className="flex-row items-center py-3.5 px-4">
              <View
                className="w-9 h-9 rounded-[10px] justify-center items-center mr-3.5"
                style={{ backgroundColor: colors.primaryContainer }}
              >
                <AppIcon
                  name="bell"
                  size={IconSize.sm}
                  color={colors.primary}
                  strokeWidth={1.8}
                />
              </View>
              <View className="flex-1">
                <Text style={[Typography.body, { color: colors.textPrimary }]}>
                  {t("disciplineAlerts")}
                </Text>
                <Text
                  className="mt-0.5"
                  style={[Typography.caption, { color: colors.textSecondary }]}
                >
                  {t("disciplineAlertsDesc")}
                </Text>
              </View>
              <ThemedSwitch
                value={alertsEnabled}
                onValueChange={setAlertsEnabled}
              />
            </View>
          </View>
        </View>
        </View>

        {/* ===== APPEARANCE ===== */}
        <View>
          <View className="mb-7">
          <Text
            className="mb-3 px-0.5"
            style={[
              Typography.overline,
              { color: colors.textSecondary, letterSpacing: 1.2 },
            ]}
          >
            {t("appearance")}
          </Text>
          <AppearanceSelector />
        </View>
        </View>

        {/* ===== SIGN OUT BUTTON ===== */}
        <Animated.View style={[signOutStyle, { marginTop: 8 }]}>
          <Pressable
            onPress={signOut}
            onPressIn={() => {
              scale.value = withTiming(0.95, { duration: 80 });
            }}
            onPressOut={() => {
              scale.value = withTiming(1, { duration: 120 });
            }}
            style={({ pressed }) => ({
              paddingVertical: 16,
              borderRadius: 16,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              backgroundColor: colors.surface,
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <AppIcon
              name="logOut"
              size={IconSize.sm}
              color={colors.textPrimary}
              strokeWidth={2}
            />
            <Text
              style={[
                Typography.bodyLarge,
                { color: colors.textPrimary, letterSpacing: 0.3 },
              ]}
            >
              {t("signOut")}
            </Text>
          </Pressable>
        </Animated.View>

      </ScrollView>
    </View>
  );
}
