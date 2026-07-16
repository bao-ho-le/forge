import React from "react";
import { View, Text, Pressable } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { useTranslation } from "./Localization/LanguageProvider";
import { Typography } from "../constants/typography";
import { IconSize } from "../constants/iconSizes";
import AppIcon from "./Icon/AppIcon";
import { getWeekdayName, type WorkoutSchedule } from "../lib/scheduleService";

type DayScheduleCardProps = {
  dayOfWeek: number;
  schedule: WorkoutSchedule | null;
  isToday: boolean;
  onPress: () => void;
};

function toDisplayTime(time24: string): string {
  const [h, m] = time24.split(":").map(Number);
  const hour = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hour}:${String(m).padStart(2, "0")}`;
}

export default function DayScheduleCard({
  dayOfWeek,
  schedule,
  isToday,
  onPress,
}: DayScheduleCardProps) {
  const { colors, isDark } = useTheme();
  const { t, language } = useTranslation();
  const locale = language === "vi" ? "vi-VN" : "en-US";
  const weekdayName = getWeekdayName(dayOfWeek, locale);

  const isRestDay = schedule?.is_rest_day ?? false;
  const isWorkoutDay = !!schedule && !isRestDay;

  const iconName = isWorkoutDay ? "dumbbell" : isRestDay ? "moon" : "plusCircle";
  const iconBg = isWorkoutDay
    ? colors.primaryContainer
    : colors.surfaceMuted;
  const iconColor = isWorkoutDay ? colors.primary : colors.textSecondary;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
    >
      <View
        className="rounded-[20px] p-4 mb-2.5"
        style={{
          backgroundColor: colors.surface,
          borderWidth: isToday ? 1.5 : 1,
          borderColor: isToday ? colors.primary : "transparent",
          shadowColor: isDark ? "#000" : "#2C3E5B",
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: isDark ? 0.25 : 0.06,
          shadowRadius: 8,
          elevation: 3,
        }}
      >
        <View className="flex-row items-center">
          <View
            className="w-11 h-11 rounded-xl justify-center items-center mr-3.5"
            style={{ backgroundColor: iconBg }}
          >
            <AppIcon name={iconName} size={IconSize.md} color={iconColor} strokeWidth={2} />
          </View>

          <View className="flex-1">
            <Text style={[Typography.bodyLarge, { color: colors.textPrimary }]}>
              {weekdayName}
            </Text>

            {isWorkoutDay && (
              <>
                <Text
                  className="mb-1"
                  style={[Typography.label, { color: colors.textSecondary }]}
                >
                  {schedule!.workout_name}
                </Text>
                <View className="flex-row items-center gap-3">
                  <View className="flex-row items-center gap-1">
                    <AppIcon
                      name="clock"
                      size={IconSize.sm}
                      color={colors.textSecondary}
                      strokeWidth={2}
                    />
                    <Text style={[Typography.label, { color: colors.textSecondary }]}>
                      {toDisplayTime((schedule!.time_of_day as string).slice(0, 5))}
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-1">
                    <AppIcon
                      name="mapPin"
                      size={IconSize.sm}
                      color={colors.textSecondary}
                      strokeWidth={2}
                    />
                    <Text style={[Typography.label, { color: colors.textSecondary }]}>
                      {schedule!.gyms?.name ?? t("noGymSelected")}
                    </Text>
                  </View>
                </View>
              </>
            )}

            {isRestDay && (
              <Text style={[Typography.label, { color: colors.textSecondary }]}>
                {t("restDay")}
              </Text>
            )}

            {!schedule && (
              <Text style={[Typography.label, { color: colors.textSecondary }]}>
                {t("addWorkoutState")}
              </Text>
            )}
          </View>
        </View>
      </View>
    </Pressable>
  );
}
