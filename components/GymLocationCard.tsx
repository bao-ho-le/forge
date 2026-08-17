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
        <>
          <Text
            className="mb-4"
            style={[Typography.label, { color: colors.textSecondary }]}
          >
            {t("gymLocationHelper")}
          </Text>
          <Pressable
            onPress={() => setSheetVisible(true)}
            style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
          >
            <View
              className="rounded-[20px] p-4"
              style={{
                backgroundColor: colors.surface,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.06,
                shadowRadius: 8,
                elevation: 3,
              }}
            >
              <View className="flex-row items-center">
                <View
                  className="w-11 h-11 rounded-xl justify-center items-center mr-3.5"
                  style={{ backgroundColor: colors.primaryContainer }}
                >
                  <AppIcon
                    name="mapPin"
                    size={IconSize.md}
                    color={colors.primary}
                    strokeWidth={2}
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
                  <Text style={[Typography.label, { color: colors.textSecondary }]}>
                    {t("verificationRadius")}: {gym.radius_meters} m
                  </Text>
                </View>
              </View>
            </View>
          </Pressable>
        </>
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
