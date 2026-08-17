import React from "react";
import { View, Text, Pressable, ScrollView } from "react-native";

import { useTheme } from "../contexts/ThemeContext";
import { useTranslation } from "./Localization/LanguageProvider";
import { Typography } from "../constants/typography";
import { IconSize } from "../constants/iconSizes";
import AppIcon from "./Icon/AppIcon";
import type { Gym } from "../lib/scheduleService";

type GymPickerProps = {
  gyms: Gym[];
  selectedGymId: string | null;
  onSelectGym: (gymId: string | null) => void;
  onPressAddGym?: () => void;
};

export default function GymPicker({
  gyms,
  selectedGymId,
  onSelectGym,
  onPressAddGym,
}: GymPickerProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  if (gyms.length === 0) {
    return (
      <Pressable
        onPress={onPressAddGym}
        className="rounded-2xl px-4 py-3.5 flex-row items-center"
        style={{ backgroundColor: colors.surface }}
      >
        <Text
          className="flex-1"
          style={[Typography.body, { color: colors.textSecondary }]}
        >
          {t("noGymHint")}
        </Text>
        <View
          className="w-8 h-8 rounded-2xl justify-center items-center ml-3"
          style={{ backgroundColor: colors.surfaceMuted }}
        >
          <AppIcon
            name="chevronRight"
            size={IconSize.sm}
            color={colors.textSecondary}
            strokeWidth={2.5}
          />
        </View>
      </Pressable>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8 }}
    >
      {gyms.map((gym) => {
        const isSelected = selectedGymId === gym.id;
        return (
          <Pressable
            key={gym.id}
            onPress={() => onSelectGym(isSelected ? null : gym.id)}
            style={({ pressed }) => ({
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderRadius: 20,
              backgroundColor: isSelected ? colors.primary : colors.surface,
              opacity: pressed ? 0.85 : 1,
            })}
          >
            <Text
              style={[
                Typography.label,
                {
                  fontWeight: isSelected ? "700" : "500",
                  color: isSelected ? colors.onPrimary : colors.textPrimary,
                },
              ]}
            >
              {gym.name}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
