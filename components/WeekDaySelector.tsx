import React from "react";
import { View, Text, Pressable } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { useTranslation } from "./Localization/LanguageProvider";
import { getWeekdayName } from "../lib/scheduleService";

const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6]; // Sunday -> Saturday, matches day_of_week

type WeekDaySelectorProps = {
  selectedDays: number[];
  onToggleDay: (dayOfWeek: number) => void;
};

export default function WeekDaySelector({
  selectedDays,
  onToggleDay,
}: WeekDaySelectorProps) {
  const { colors } = useTheme();
  const { language } = useTranslation();
  const locale = language === "vi" ? "vi-VN" : "en-US";

  return (
    <View style={{ flexDirection: "row", gap: 8 }}>
      {ALL_DAYS.map((dayOfWeek) => {
        const isSelected = selectedDays.includes(dayOfWeek);
        return (
          <Pressable
            key={dayOfWeek}
            onPress={() => onToggleDay(dayOfWeek)}
            style={({ pressed }) => ({
              flex: 1,
              height: 44,
              borderRadius: 12,
              backgroundColor: isSelected ? colors.primary : colors.surface,
              justifyContent: "center",
              alignItems: "center",
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <Text
              style={{
                fontSize: 13,
                fontWeight: isSelected ? "700" : "600",
                color: isSelected ? colors.onPrimary : colors.textSecondary,
              }}
            >
              {getWeekdayName(dayOfWeek, locale, "short")}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
