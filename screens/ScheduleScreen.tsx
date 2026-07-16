import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View, Text, ScrollView, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { useTranslation } from "../components/Localization/LanguageProvider";
import { Typography } from "../constants/typography";
import DayScheduleCard from "../components/DayScheduleCard";
import DayEditSheet from "../components/DayEditSheet";
import ScheduleCardSkeleton from "../components/Skeleton/ScheduleCardSkeleton";
import { TAB_BAR_HEIGHT } from "../constants/tabNavigation";
import {
  fetchActiveSchedules,
  fetchGyms,
  generateUpcomingSessions,
  getTodayDayOfWeek,
  type WorkoutSchedule,
  type Gym,
} from "../lib/scheduleService";
import { getCached, setCached } from "../lib/dataCache";

// Rolling week starting from a given weekday, e.g. startDay=4 -> [4,5,6,0,1,2,3].
function rollingWeek(startDay: number): number[] {
  return Array.from({ length: 7 }, (_, i) => (startDay + i) % 7);
}

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

  const [schedulesByDay, setSchedulesByDay] = useState<Map<number, WorkoutSchedule>>(
    new Map(),
  );
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [todayDayOfWeek, setTodayDayOfWeek] = useState<number | null>(null);
  const [sheetDay, setSheetDay] = useState<number | null>(null);
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
  const weekDays = useMemo(
    () => rollingWeek(todayDayOfWeek ?? 0),
    [todayDayOfWeek],
  );

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
        <View className="mb-6">
          <Text
            style={[
              Typography.heading,
              { color: colors.textPrimary, letterSpacing: -0.5 },
            ]}
          >
            {t("schedule")}
          </Text>
        </View>

        {/* ===== WEEKLY ROUTINE (always 7 days, rolling from today) ===== */}
        {loading
          ? Array.from({ length: SKELETON_CARD_COUNT }).map((_, index) => (
              <ScheduleCardSkeleton key={index} />
            ))
          : weekDays.map((dayOfWeek) => (
              <DayScheduleCard
                key={dayOfWeek}
                dayOfWeek={dayOfWeek}
                schedule={schedulesByDay.get(dayOfWeek) ?? null}
                isToday={todayDayOfWeek === dayOfWeek}
                onPress={() => setSheetDay(dayOfWeek)}
              />
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
