import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View, Text, ScrollView, StatusBar, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { useTranslation } from "../components/Localization/LanguageProvider";
import { Typography } from "../constants/typography";
import DayScheduleCard from "../components/DayScheduleCard";
import DayEditSheet from "../components/DayEditSheet";
import ScheduleViewMenu from "../components/ScheduleViewMenu";
import ScheduleCardSkeleton from "../components/Skeleton/ScheduleCardSkeleton";
import { TAB_BAR_HEIGHT } from "../constants/tabNavigation";
import { useScheduleViewMode } from "../hooks/useScheduleViewMode";
import {
  fetchActiveSchedules,
  fetchGyms,
  generateUpcomingSessions,
  getTodayDayOfWeek,
  deleteScheduleDay,
  type WorkoutSchedule,
  type Gym,
} from "../lib/scheduleService";
import { getCached, setCached } from "../lib/dataCache";

// Rolling week starting from a given weekday, e.g. startDay=4 -> [4,5,6,0,1,2,3].
function rollingWeek(startDay: number): number[] {
  return Array.from({ length: 7 }, (_, i) => (startDay + i) % 7);
}

// Monday(1) through Sunday(0), matching the day_of_week convention where
// 0 = Sunday.
const MONDAY_TO_SUNDAY = [1, 2, 3, 4, 5, 6, 0];

type ScheduleSection = { title?: string; days: number[] };

// Keep in sync with HomeScreen's CACHE_TTL_MS: any schedule edit clears both
// via invalidateCache(), so the two only need to agree on the "too long, go
// refetch" window for plain tab-switch navigation.
const CACHE_TTL_MS = 5 * 60 * 1000;

// Placeholder count while loading, independent of the real (always 7-day)
// rolling week list.
const SKELETON_CARD_COUNT = 5;

type ScheduleCacheData = {
  schedules: WorkoutSchedule[];
  gyms: Gym[];
  today: number;
};

export default function ScheduleScreen() {
  const { colors, isDark } = useTheme();
  const { t } = useTranslation();
  const { session } = useAuth();
  const userId = session?.user?.id;
  const insets = useSafeAreaInsets();

  const params = useLocalSearchParams<{ openDayOfWeek?: string }>();
  const { viewMode, setViewMode } = useScheduleViewMode();

  const [schedulesByDay, setSchedulesByDay] = useState<Map<number, WorkoutSchedule>>(
    new Map(),
  );
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [todayDayOfWeek, setTodayDayOfWeek] = useState<number | null>(null);
  // When navigating from HomeScreen's empty Today Workout card with an
  // openDayOfWeek param, set sheetDay immediately on first render so the
  // bottom sheet is open from the start — no useEffect delay needed.
  const [sheetDay, setSheetDay] = useState<number | null>(() => {
    const param = params.openDayOfWeek;
    if (param) {
      const day = parseInt(param, 10);
      if (!isNaN(day) && day >= 0 && day <= 6) return day;
    }
    return null;
  });
  // Lazily seeded from the cache so a cache hit never flashes a skeleton on
  // the first paint - only a genuine network fetch flips this to true.
  const [loading, setLoading] = useState(() =>
    userId ? getCached<ScheduleCacheData>(`schedule:${userId}`, CACHE_TTL_MS) === null : true,
  );

  const loadData = useCallback(async () => {
    if (!userId) return;
    const cacheKey = `schedule:${userId}`;
    const cached = getCached<ScheduleCacheData>(cacheKey, CACHE_TTL_MS);
    if (cached) {
      setSchedulesByDay(new Map(cached.schedules.map((s) => [s.day_of_week, s])));
      setGyms(cached.gyms);
      setTodayDayOfWeek(cached.today);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      await generateUpcomingSessions(userId);
    } catch (err) {
      console.error("generateUpcomingSessions failed", err);
    }
    const [scheduleList, gymList, today] = await Promise.all([
      fetchActiveSchedules(userId),
      fetchGyms(userId),
      getTodayDayOfWeek(userId),
    ]);
    setSchedulesByDay(new Map(scheduleList.map((s) => [s.day_of_week, s])));
    setGyms(gymList);
    setTodayDayOfWeek(today);
    setCached<ScheduleCacheData>(cacheKey, { schedules: scheduleList, gyms: gymList, today });
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const sheetSchedule = sheetDay !== null ? schedulesByDay.get(sheetDay) ?? null : null;

  const handleDeleteDay = useCallback(
    (schedule: WorkoutSchedule) => {
      if (!userId) return;
      Alert.alert(t("deleteScheduleTitle"), t("deleteScheduleMessage"), [
        { text: t("cancel"), style: "cancel" },
        {
          text: t("delete"),
          style: "destructive",
          onPress: async () => {
            await deleteScheduleDay(schedule.id, userId);
            loadData();
          },
        },
      ]);
    },
    [userId, t, loadData],
  );

  const sections = useMemo<ScheduleSection[]>(() => {
    if (viewMode === "weekStart") {
      return [{ days: MONDAY_TO_SUNDAY }];
    }
    if (viewMode === "grouped") {
      // Already-scheduled workout days float to the top of the Workout Days
      // group, with not-yet-configured days (no row at all) below them.
      const scheduledWorkoutDays = MONDAY_TO_SUNDAY.filter(
        (day) => schedulesByDay.has(day) && !schedulesByDay.get(day)?.is_rest_day,
      );
      const unconfiguredDays = MONDAY_TO_SUNDAY.filter((day) => !schedulesByDay.has(day));
      const restDays = MONDAY_TO_SUNDAY.filter(
        (day) => schedulesByDay.get(day)?.is_rest_day,
      );
      return [
        { title: t("workoutDaysGroupLabel"), days: [...scheduledWorkoutDays, ...unconfiguredDays] },
        { title: t("restDaysGroupLabel"), days: restDays },
      ].filter((section) => section.days.length > 0);
    }
    return [{ days: rollingWeek(todayDayOfWeek ?? 0) }];
  }, [viewMode, todayDayOfWeek, schedulesByDay, t]);

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
        <View className="flex-row items-start justify-between mb-6">
          <View className="flex-1 mr-3">
            <Text
              style={[
                Typography.heading,
                { color: colors.textPrimary, letterSpacing: -0.5 },
              ]}
            >
              {t("schedule")}
            </Text>
            {!loading && schedulesByDay.size > 0 && (
              <Text
                className="mt-1"
                style={[Typography.label, { color: colors.textSecondary }]}
              >
                {t("scheduleHelper")}
              </Text>
            )}
          </View>
          <ScheduleViewMenu value={viewMode} onChange={setViewMode} />
        </View>

        {/* ===== WEEKLY ROUTINE (ordered/grouped per the selected View mode) ===== */}
        {loading
          ? Array.from({ length: SKELETON_CARD_COUNT }).map((_, index) => (
              <ScheduleCardSkeleton key={index} />
            ))
          : sections.map((section, sectionIndex) => (
              <View key={section.title ?? sectionIndex}>
                {section.title && (
                  <Text
                    className={sectionIndex === 0 ? "mb-3" : "mt-2 mb-3"}
                    style={[
                      Typography.overline,
                      { color: colors.textSecondary, letterSpacing: 1.2 },
                    ]}
                  >
                    {section.title}
                  </Text>
                )}
                {section.days.map((dayOfWeek) => {
                  const daySchedule = schedulesByDay.get(dayOfWeek) ?? null;
                  return (
                    <DayScheduleCard
                      key={dayOfWeek}
                      dayOfWeek={dayOfWeek}
                      schedule={daySchedule}
                      isToday={todayDayOfWeek === dayOfWeek}
                      onPress={() => setSheetDay(dayOfWeek)}
                      onDelete={
                        daySchedule ? () => handleDeleteDay(daySchedule) : undefined
                      }
                    />
                  );
                })}
              </View>
            ))}
      </ScrollView>

      {/* ===== DAY EDIT BOTTOM SHEET =====
          Always mounted (not gated on sheetDay !== null) so the sheet's own
          `visible` transition drives its backdrop fade-out animation instead
          of the whole component vanishing from the tree mid-animation. */}
      {userId && (
        <DayEditSheet
          visible={sheetDay !== null}
          userId={userId}
          dayOfWeek={sheetDay ?? 0}
          gyms={gyms}
          existingSchedule={sheetSchedule}
          schedulesByDay={schedulesByDay}
          onClose={() => setSheetDay(null)}
          onSaved={loadData}
        />
      )}
    </View>
  );
}
