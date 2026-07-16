import React, { useCallback, useEffect, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { useTranslation } from "./Localization/LanguageProvider";
import { Typography } from "../constants/typography";
import { IconSize } from "../constants/iconSizes";
import AppIcon from "./Icon/AppIcon";
import EmptyStateCard from "./EmptyStateCard";
import GymLocationSheet from "./GymLocationSheet";
import { fetchPrimaryGym, type PrimaryGym } from "../lib/gymService";

export default function GymLocationCard({ userId }: { userId: string }) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const [gym, setGym] = useState<PrimaryGym | null>(null);
  const [loading, setLoading] = useState(true);
  const [sheetVisible, setSheetVisible] = useState(false);

  const loadGym = useCallback(async () => {
    const data = await fetchPrimaryGym(userId);
    setGym(data);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    loadGym();
  }, [loadGym]);

  if (loading) return null;

  return (
    <>
      {gym ? (
        <View
          className="rounded-[20px] p-4"
          style={{
            backgroundColor: colors.surface,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.04,
            shadowRadius: 6,
            elevation: 2,
          }}
        >
          <View className="flex-row items-center gap-2.5 mb-3">
            <View
              className="w-9 h-9 rounded-[10px] justify-center items-center"
              style={{ backgroundColor: colors.primaryContainer }}
            >
              <AppIcon
                name="mapPin"
                size={IconSize.sm}
                color={colors.primary}
                strokeWidth={1.8}
              />
            </View>
            <View className="flex-1">
              <Text style={[Typography.bodyLarge, { color: colors.textPrimary }]}>
                {gym.name}
              </Text>
              {!!gym.address && (
                <Text style={[Typography.label, { color: colors.textSecondary }]}>
                  {gym.address}
                </Text>
              )}
            </View>
          </View>

          <View
            className="flex-row items-center justify-between border-t pt-3"
            style={{ borderTopColor: colors.border }}
          >
            <Text style={[Typography.label, { color: colors.textSecondary }]}>
              {t("verificationRadius")}
            </Text>
            <Text style={[Typography.body, { color: colors.textPrimary }]}>
              {gym.radius_meters} m
            </Text>
          </View>

          <Pressable
            onPress={() => setSheetVisible(true)}
            className="self-end mt-3"
            style={({ pressed }) => ({
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
              opacity: pressed ? 0.6 : 1,
            })}
          >
            <AppIcon name="edit" size={14} color={colors.primary} strokeWidth={2} />
            <Text style={[Typography.label, { color: colors.primary, fontWeight: "600" }]}>
              {t("edit")}
            </Text>
          </Pressable>
        </View>
      ) : (
        <>
          <EmptyStateCard
            icon="mapPinOff"
            message={t("gymLocationEmptyTitle")}
            description={t("gymLocationEmptyDesc")}
          />

          <Pressable
            onPress={() => setSheetVisible(true)}
            style={({ pressed }) => ({
              marginTop: 16,
              paddingVertical: 16,
              borderRadius: 16,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: colors.primary,
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Text
              style={[
                Typography.bodyLarge,
                { color: colors.onPrimary, letterSpacing: 0.5 },
              ]}
            >
              {t("addGym")}
            </Text>
          </Pressable>
        </>
      )}

      <GymLocationSheet
        visible={sheetVisible}
        userId={userId}
        existingGym={gym}
        onClose={() => setSheetVisible(false)}
        onSaved={loadGym}
      />
    </>
  );
}
