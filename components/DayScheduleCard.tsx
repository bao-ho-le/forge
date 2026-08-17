import React from "react";
import { View, Text, Pressable } from "react-native";
import { Clock, MapPin, Dumbbell } from "lucide-react-native";
import { useTheme } from "../contexts/ThemeContext";
import { useTranslation } from "./Localization/LanguageProvider";
import { Typography } from "../constants/typography";
import { IconSize } from "../constants/iconSizes";
import { withAlpha } from "../constants/colors";
import AppIcon from "./Icon/AppIcon";
import { WORKOUT_TYPE_ICON_MAP } from "./icons/WorkoutTypeIcons";
import { getWeekdayName, type WorkoutSchedule } from "../lib/scheduleService";

type DayScheduleCardProps = {
  dayOfWeek: number;
  schedule: WorkoutSchedule | null;
  isToday: boolean;
  onPress: () => void;
  onDelete?: () => void;
};

const ICON_BOX_SIZE = 44;

// Vietnamese weekday abbreviations follow the common T2..T7/CN convention
// (indexed by day_of_week, 0 = Sunday) rather than Intl's "short" format,
// which spells out "Thứ 2" instead of "T2".
const VI_WEEKDAY_SHORT = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

function getWeekdayShortLabel(dayOfWeek: number, language: string, locale: string): string {
  if (language === "vi") return VI_WEEKDAY_SHORT[dayOfWeek];
  return getWeekdayName(dayOfWeek, locale, "short");
}

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
  onDelete,
}: DayScheduleCardProps) {
  const { colors, isDark } = useTheme();
  const { t, language } = useTranslation();
  const locale = language === "vi" ? "vi-VN" : "en-US";
  const weekdayShort = getWeekdayShortLabel(dayOfWeek, language, locale);

  const isRestDay = schedule?.is_rest_day ?? false;
  const isWorkoutDay = !!schedule && !isRestDay;

  // Neutral icon box tint for Rest Day / not-yet-configured — built from
  // textSecondary at low opacity per the design system (no primary/warning
  // here, and no ad-hoc hex), same tint for both so they read as one family.
  const neutralIconBg = withAlpha(colors.textSecondary, 0.14);
  const WorkoutIcon = schedule?.workout_name
    ? WORKOUT_TYPE_ICON_MAP[schedule.workout_name]
    : undefined;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
    >
      <View
        className="rounded-[20px] p-5 mb-4"
        style={{
          backgroundColor: colors.surface,
          borderWidth: isToday ? 1.5 : 0,
          borderColor: isToday ? colors.primary : "transparent",
          shadowColor: isDark ? "#000" : "#2C3E5B",
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: isDark ? 0.25 : 0.06,
          shadowRadius: 8,
          elevation: 3,
        }}
      >
        <View className="flex-row items-center">
          <Text
            numberOfLines={1}
            style={[
              Typography.bodyLarge,
              { width: 44, color: colors.textPrimary },
            ]}
          >
            {weekdayShort}
          </Text>

          <View
            style={{
              width: 1,
              height: 32,
              backgroundColor: colors.border,
              marginRight: 10,
            }}
          />

          <View
            className="rounded-xl items-center justify-center mr-3.5"
            style={{
              width: ICON_BOX_SIZE,
              height: ICON_BOX_SIZE,
              backgroundColor: isWorkoutDay ? colors.primaryContainer : neutralIconBg,
            }}
          >
            {isWorkoutDay ? (
              WorkoutIcon ? (
                <WorkoutIcon size={IconSize.md} color={colors.primary} strokeWidth={2} />
              ) : (
                <Dumbbell size={IconSize.md} color={colors.primary} strokeWidth={2} />
              )
            ) : isRestDay ? (
              <AppIcon name="moon" size={IconSize.md} color={colors.textSecondary} strokeWidth={2} />
            ) : (
              <AppIcon
                name="plusCircle"
                size={IconSize.md}
                color={colors.textSecondary}
                strokeWidth={2}
              />
            )}
          </View>

          <View className="flex-1 justify-center">
            {isWorkoutDay && (
              <>
                <Text style={[Typography.bodyLarge, { color: colors.textPrimary }]}>
                  {schedule!.workout_name}
                </Text>
                <View className="flex-row items-center gap-3 mt-1">
                  <View className="flex-row items-center gap-1">
                    <Clock size={14} color={colors.textSecondary} strokeWidth={2} />
                    <Text style={[Typography.label, { color: colors.textSecondary }]}>
                      {toDisplayTime((schedule!.time_of_day as string).slice(0, 5))}
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-1">
                    <MapPin size={14} color={colors.textSecondary} strokeWidth={2} />
                    <Text style={[Typography.label, { color: colors.textSecondary }]}>
                      {schedule!.gyms?.name ?? t("noGymSelected")}
                    </Text>
                  </View>
                </View>
              </>
            )}

            {isRestDay && (
              <Text style={[Typography.bodyLarge, { color: colors.textSecondary }]}>
                {t("restDay")}
              </Text>
            )}

            {!schedule && (
              <Text style={[Typography.bodyLarge, { color: colors.textSecondary }]}>
                {t("addWorkoutState")}
              </Text>
            )}
          </View>

          {schedule && onDelete && (
            <Pressable
              onPress={onDelete}
              hitSlop={8}
              style={({ pressed }) => ({
                width: 36,
                height: 36,
                borderRadius: 9999,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: colors.surfaceMuted,
                opacity: pressed ? 0.7 : 1,
                marginLeft: 8,
              })}
            >
              <Text style={[Typography.bodyLarge, { color: colors.textSecondary }]}>
                ✕
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </Pressable>
  );
}
