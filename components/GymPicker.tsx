import React from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { useTranslation } from "./Localization/LanguageProvider";
import { Typography } from "../constants/typography";
import type { Gym } from "../lib/scheduleService";

type GymPickerProps = {
  gyms: Gym[];
  selectedGymId: string | null;
  onSelectGym: (gymId: string | null) => void;
};

export default function GymPicker({
  gyms,
  selectedGymId,
  onSelectGym,
}: GymPickerProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  if (gyms.length === 0) {
    return (
      <View
        className="rounded-2xl px-4 py-3.5"
        style={{ backgroundColor: colors.surface }}
      >
        <Text style={[Typography.body, { color: colors.textSecondary }]}>
          {t("noGymHint")}
        </Text>
      </View>
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
