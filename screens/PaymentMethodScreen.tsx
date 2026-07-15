import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StatusBar, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useTheme } from "../contexts/ThemeContext";
import { useTranslation } from "../components/Localization/LanguageProvider";
import { Typography } from "../constants/typography";
import { IconSize } from "../constants/iconSizes";
import AppIcon from "../components/Icon/AppIcon";
import CardBrandIcons from "../components/CardBrandIcons";

export default function PaymentMethodScreen() {
  const { colors, isDark } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const [fullName, setFullName] = useState("Le Vo");
  const [country, setCountry] = useState("Vietnam");
  const [address, setAddress] = useState("");
  const [cardNumber, setCardNumber] = useState("4242 4242 4242 4242");
  const [expDate, setExpDate] = useState("12/26");
  const [secCode, setSecCode] = useState("");

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
          paddingBottom: 32,
          paddingHorizontal: 20,
        }}
        showsVerticalScrollIndicator={false}
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
            {t("paymentMethodManage")}
          </Text>
        </View>

        {/* ===== BILLING INFORMATION ===== */}
        <Text
          className="mb-3 px-0.5"
          style={[
            Typography.overline,
            { color: colors.textSecondary, letterSpacing: 1.2 },
          ]}
        >
          BILLING INFORMATION
        </Text>

        <View
          className="rounded-[20px] p-4 mb-7"
          style={{
            backgroundColor: colors.surface,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.04,
            shadowRadius: 6,
            elevation: 2,
          }}
        >
          {/* Full Name */}
          <View className="mb-4">
            <Text
              className="mb-1.5"
              style={[Typography.overline, { color: colors.textSecondary }]}
            >
              Full Name
            </Text>
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              placeholder="Full Name"
              placeholderTextColor={colors.textSecondary}
              className="rounded-xl py-3 px-4"
              style={[Typography.body, { backgroundColor: isDark ? colors.surfaceMuted : colors.surface, color: colors.textPrimary, borderWidth: isDark ? 0 : 1, borderColor: colors.border }]}
            />
          </View>

          {/* Country */}
          <View className="mb-4">
            <Text
              className="mb-1.5"
              style={[Typography.overline, { color: colors.textSecondary }]}
            >
              Country
            </Text>
            <TextInput
              value={country}
              onChangeText={setCountry}
              placeholder="Country"
              placeholderTextColor={colors.textSecondary}
              className="rounded-xl py-3 px-4"
              style={[Typography.body, { backgroundColor: isDark ? colors.surfaceMuted : colors.surface, color: colors.textPrimary, borderWidth: isDark ? 0 : 1, borderColor: colors.border }]}
            />
          </View>

          {/* Address Line 1 */}
          <View>
            <Text
              className="mb-1.5"
              style={[Typography.overline, { color: colors.textSecondary }]}
            >
              Address Line 1
            </Text>
            <TextInput
              value={address}
              onChangeText={setAddress}
              placeholder="Enter your address"
              placeholderTextColor={colors.textSecondary}
              className="rounded-xl py-3 px-4"
              style={[Typography.body, { backgroundColor: isDark ? colors.surfaceMuted : colors.surface, color: colors.textPrimary, borderWidth: isDark ? 0 : 1, borderColor: colors.border }]}
            />
          </View>
        </View>

        {/* ===== PAYMENT METHOD ===== */}
        <Text
          className="mb-3 px-0.5"
          style={[
            Typography.overline,
            { color: colors.textSecondary, letterSpacing: 1.2 },
          ]}
        >
          PAYMENT METHOD
        </Text>

        <View
          className="rounded-[20px] p-4 mb-7"
          style={{
            backgroundColor: colors.surface,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.04,
            shadowRadius: 6,
            elevation: 2,
          }}
        >
          {/* Card Number */}
          <View className="mb-4">
            <Text
              className="mb-1.5"
              style={[Typography.overline, { color: colors.textSecondary }]}
            >
              Card Number
            </Text>
            <View style={{ justifyContent: "center" }}>
              <TextInput
                value={cardNumber}
                onChangeText={setCardNumber}
                placeholder="0000 0000 0000 0000"
                placeholderTextColor={colors.textSecondary}
                keyboardType="number-pad"
                className="rounded-xl py-3 pl-4"
                style={[
                  Typography.body,
                  {
                    paddingRight: 74,
                    backgroundColor: isDark ? colors.surfaceMuted : colors.surface,
                    color: colors.textPrimary,
                    borderWidth: isDark ? 0 : 1,
                    borderColor: colors.border,
                  },
                ]}
              />
              <View style={{ position: "absolute", right: 12 }}>
                <CardBrandIcons />
              </View>
            </View>
          </View>

          {/* Expiration Date & Security Code */}
          <View className="flex-row gap-3">
            <View className="flex-1">
              <Text
                className="mb-1.5"
                style={[Typography.overline, { color: colors.textSecondary }]}
              >
                Expiration Date
              </Text>
              <TextInput
                value={expDate}
                onChangeText={setExpDate}
                placeholder="MM/YY"
                placeholderTextColor={colors.textSecondary}
                className="rounded-xl py-3 px-4"
                style={[Typography.body, { backgroundColor: isDark ? colors.surfaceMuted : colors.surface, color: colors.textPrimary, borderWidth: isDark ? 0 : 1, borderColor: colors.border }]}
              />
            </View>

            <View className="flex-1">
              <Text
                className="mb-1.5"
                style={[Typography.overline, { color: colors.textSecondary }]}
              >
                Security Code
              </Text>
              <TextInput
                value={secCode}
                onChangeText={setSecCode}
                placeholder="CVC"
                placeholderTextColor={colors.textSecondary}
                keyboardType="number-pad"
                secureTextEntry
                className="rounded-xl py-3 px-4"
                style={[Typography.body, { backgroundColor: isDark ? colors.surfaceMuted : colors.surface, color: colors.textPrimary, borderWidth: isDark ? 0 : 1, borderColor: colors.border }]}
              />
            </View>
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
            Save
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
