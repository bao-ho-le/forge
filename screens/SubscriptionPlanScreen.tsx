import React, { useState } from "react";
import { View, Text, Pressable, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useTheme } from "../contexts/ThemeContext";
import { useTranslation } from "../components/Localization/LanguageProvider";
import { Typography } from "../constants/typography";
import { IconSize } from "../constants/iconSizes";
import AppIcon from "../components/Icon/AppIcon";

const PLANS = [
  {
    id: "free",
    nameKey: "free" as const,
    price: "$0",
    features: ["Basic workout tracking", "Standard schedule"],
  },
  {
    id: "basic",
    nameKey: "basic" as const,
    price: "$4.99",
    features: ["All Free features", "Discipline Mode", "Recovery workouts"],
  },
  {
    id: "premium",
    nameKey: "premium" as const,
    price: "$9.99",
    features: ["All Basic features", "Locked apps", "Priority support", "Advanced analytics"],
  },
];

export default function SubscriptionPlanScreen() {
  const { colors, isDark } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [selectedPlan, setSelectedPlan] = useState("premium");

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
            {t("subscriptionPlanManage")}
          </Text>
        </View>

        {/* Current Plan Badge */}
        <View className="flex-row items-center gap-2 mb-5 px-1">
          <AppIcon
            name="crown"
            size={IconSize.sm}
            color={colors.premium}
            strokeWidth={2}
          />
          <Text style={[Typography.overline, { color: colors.textSecondary }]}>
            {t("currentPlan")}: {t("premium")}
          </Text>
        </View>

        {/* Plan Cards */}
        {PLANS.map((plan) => {
          const isSelected = selectedPlan === plan.id;
          const isCurrent = plan.id === "premium";

          return (
            <Pressable
              key={plan.id}
              onPress={() => setSelectedPlan(plan.id)}
              style={({ pressed }) => ({
                borderRadius: 20,
                padding: 20,
                marginBottom: 12,
                borderWidth: 2,
                backgroundColor: colors.surface,
                borderColor: isSelected ? colors.primary : "transparent",
                opacity: pressed ? 0.9 : 1,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.04,
                shadowRadius: 6,
                elevation: 2,
              })}
            >
              <View className="flex-row justify-between items-start">
                <View className="flex-1">
                  <View className="flex-row items-center gap-2">
                    <Text
                      style={[Typography.bodyLarge, { color: colors.textPrimary }]}
                    >
                      {t(plan.nameKey)}
                    </Text>
                    {isCurrent && (
                      <View
                        className="px-2 py-0.5 rounded-lg"
                        style={{ backgroundColor: colors.premiumContainer }}
                      >
                        <Text
                          style={[Typography.overline, { color: colors.premium }]}
                        >
                          Current
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text
                    className="mt-2"
                    style={[Typography.title, { color: colors.textPrimary }]}
                  >
                    {plan.price}
                    <Text
                      style={[Typography.label, { color: colors.textSecondary }]}
                    >
                      /month
                    </Text>
                  </Text>
                </View>

                {/* Radio indicator */}
                <View
                  className="w-[22px] h-[22px] rounded-full border-2 justify-center items-center"
                  style={{
                    borderColor: isSelected ? colors.primary : colors.border,
                  }}
                >
                  {isSelected && (
                    <View
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: colors.primary }}
                    />
                  )}
                </View>
              </View>

              {/* Features */}
              <View className="mt-3 gap-1.5">
                {plan.features.map((feature, i) => (
                  <View key={i} className="flex-row items-center gap-2">
                    <AppIcon
                      name="check"
                      size={IconSize.sm}
                      color={colors.primary}
                      strokeWidth={3}
                    />
                    <Text style={[Typography.label, { color: colors.textSecondary }]}>
                      {feature}
                    </Text>
                  </View>
                ))}
              </View>
            </Pressable>
          );
        })}

        {/* Change Plan Button */}
        <Pressable
          style={({ pressed }) => ({
            alignSelf: "stretch",
            paddingVertical: 16,
            borderRadius: 20,
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
            {t("changePlan")}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
