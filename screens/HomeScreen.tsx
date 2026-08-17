import React, { useCallback, useEffect, useState } from "react";
import { View, Text, ScrollView, StatusBar, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { useTranslation } from "../components/Localization/LanguageProvider";
import { Typography } from "../constants/typography";
import { IconSize } from "../constants/iconSizes";
import WorkoutCard from "../components/WorkoutCard";
import RecoveryCard from "../components/RecoveryCard";
import EmptyStateCard from "../components/EmptyStateCard";
import DayScheduleCard from "../components/DayScheduleCard";
import ThemeToggle from "../components/ThemeToggle";
import AppIcon from "../components/Icon/AppIcon";
import WorkoutCardSkeleton from "../components/Skeleton/WorkoutCardSkeleton";
import UpcomingScheduleSkeleton from "../components/Skeleton/UpcomingScheduleSkeleton";
import RecoveryCardSkeleton from "../components/Skeleton/RecoveryCardSkeleton";
import SkeletonBone from "../components/Skeleton/SkeletonBone";
import { TAB_BAR_HEIGHT } from "../constants/tabNavigation";
import {
  fetchScheduleForDay,
  fetchActiveSchedules,
  generateUpcomingSessions,
  getTodayDayOfWeek,
  type WorkoutSchedule,
} from "../lib/scheduleService";
import { getCached, setCached } from "../lib/dataCache";

// How long a tab switch can reuse the last fetch before going back to
// Supabase. Long enough that Home<->Schedule flipping feels instant, short
// enough that the day naturally rolls over during a single foreground session.
const CACHE_TTL_MS = 5 * 60 * 1000;

type HomeCacheData = {
  todaySchedule: WorkoutSchedule | null;
  schedules: WorkoutSchedule[];
  todayDayOfWeek: number;
};

function formatTodayLabel(locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());
}

function toDisplayTime(time24: string): string {
  const [h, m] = time24.split(":").map(Number);
  const hour = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hour}:${String(m).padStart(2, "0")}`;
}

export default function HomeScreen() {
  const { colors, isDark } = useTheme();
  const { t, language } = useTranslation();
  const { session } = useAuth();
  const userId = session?.user?.id;
  const insets = useSafeAreaInsets();
  const locale = language === "vi" ? "vi-VN" : "en-US";

  const [todaySchedule, setTodaySchedule] = useState<WorkoutSchedule | null>(null);
  const [schedulesByDay, setSchedulesByDay] = useState<Map<number, WorkoutSchedule>>(
    new Map(),
  );
  const [todayDayOfWeek, setTodayDayOfWeek] = useState<number | null>(null);
  // Lazily seeded from the cache so a cache hit never flashes a skeleton on
  // the first paint - only a genuine network fetch flips this to true.
  const [loading, setLoading] = useState(() =>
    userId ? getCached<HomeCacheData>(`home:${userId}`, CACHE_TTL_MS) === null : true,
  );

  const loadData = useCallback(async () => {
    if (!userId) return;
    const cacheKey = `home:${userId}`;
    const cached = getCached<HomeCacheData>(cacheKey, CACHE_TTL_MS);
    if (cached) {
      setTodaySchedule(cached.todaySchedule);
      setSchedulesByDay(new Map(cached.schedules.map((s) => [s.day_of_week, s])));
      setTodayDayOfWeek(cached.todayDayOfWeek);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      await generateUpcomingSessions(userId);
    } catch (err) {
      console.error("generateUpcomingSessions failed", err);
    }
    const todayDow = await getTodayDayOfWeek(userId);
    const [schedule, scheduleList] = await Promise.all([
      fetchScheduleForDay(userId, todayDow),
      fetchActiveSchedules(userId),
    ]);
    setTodaySchedule(schedule);
    setSchedulesByDay(new Map(scheduleList.map((s) => [s.day_of_week, s])));
    setTodayDayOfWeek(todayDow);
    setCached<HomeCacheData>(cacheKey, {
      todaySchedule: schedule,
      schedules: scheduleList,
      todayDayOfWeek: todayDow,
    });
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const isRestDay = todaySchedule?.is_rest_day ?? false;
  const isWorkoutDay = !!todaySchedule && !isRestDay;
  // Up to the next 3 configured days after today (workout or rest day only —
  // days with no schedule at all are skipped), scanning the rest of the
  // rolling week to find them. Today's Workout already covers today, so the
  // scan starts at +1.
  const upcomingDays = (() => {
    if (todayDayOfWeek === null) return [];
    const days: number[] = [];
    for (let i = 1; i <= 6 && days.length < 3; i++) {
      const day = (todayDayOfWeek + i) % 7;
      if (schedulesByDay.has(day)) days.push(day);
    }
    return days;
  })();

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />

      {/* Scrollable Content */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + TAB_BAR_HEIGHT + 8,
          paddingHorizontal: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* ===== HEADER SECTION ===== */}
        <View className="flex-row items-center justify-between mb-7">
          {/* Left: Greeting */}
          <View>
            <Text
              style={[
                Typography.heading,
                { color: colors.textPrimary, letterSpacing: -0.5 },
              ]}
            >
              {formatTodayLabel(locale)}
            </Text>
          </View>

          {/* Right: Controls */}
          <View className="flex-row items-center gap-2">
            <Pressable
              onPress={() => router.push("/subscription-plan")}
              style={({ pressed }) => ({
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 16,
                backgroundColor: colors.premium,
                borderWidth: 1,
                borderColor: colors.premiumContainer,
                opacity: pressed ? 0.8 : 1,
                transform: [{ scale: pressed ? 0.95 : 1 }],
              })}
            >
              <AppIcon
                name="arrowUp"
                size={IconSize.sm}
                color={colors.premiumContainer}
                strokeWidth={2.5}
              />
              <Text
                style={[
                  Typography.overline,
                  { color: colors.premiumContainer, letterSpacing: 0.3 },
                ]}
              >
                Upgrade
              </Text>
            </Pressable>
            <ThemeToggle />
          </View>
        </View>

        {/* ===== TODAY WORKOUT SECTION ===== */}
        <View className="mb-6">
          {loading ? (
            <SkeletonBone
              width={140}
              height={12}
              borderRadius={4}
              style={{ marginBottom: 14 }}
            />
          ) : (
            <Text
              className="mb-3.5"
              style={[
                Typography.overline,
                { color: colors.textSecondary, letterSpacing: 1.2 },
              ]}
            >
              {t("todayWorkout")}
            </Text>
          )}

          {loading ? (
            <WorkoutCardSkeleton />
          ) : isWorkoutDay ? (
            <WorkoutCard
              name={todaySchedule!.workout_name ?? t("workoutName")}
              time={toDisplayTime((todaySchedule!.time_of_day as string).slice(0, 5))}
              location={todaySchedule!.gyms?.name ?? t("noGymSelected")}
            />
          ) : isRestDay ? (
            <EmptyStateCard
              icon="moon"
              message={t("restDay")}
              description={t("restDayDesc")}
            />
          ) : (
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/calendar",
                  params: {
                    openDayOfWeek: String(todayDayOfWeek ?? 0),
                    tabDirection: "right",
                  },
                })
              }
              style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
            >
              <View
                className="rounded-[20px] p-6"
                style={{
                  backgroundColor: colors.surface,
                  shadowColor: isDark ? "#000" : "#2C3E5B",
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: isDark ? 0.25 : 0.06,
                  shadowRadius: 8,
                  elevation: 3,
                }}
              >
                <View className="items-center">
                  <View
                    className="rounded-full justify-center items-center mb-3"
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 30,
                      backgroundColor: colors.primaryContainer,
                    }}
                  >
                    <AppIcon
                      name="calendarEmpty"
                      size={IconSize.lg}
                      color={colors.textSecondary}
                      strokeWidth={1.5}
                    />
                  </View>
                  <Text
                    className="text-center"
                    style={[Typography.bodyLarge, { color: colors.textSecondary }]}
                  >
                    {t("noTodayWorkout")}
                  </Text>
                  <Text
                    className="text-center mt-1"
                    style={[Typography.label, { color: colors.textSecondary }]}
                  >
                    {t("tapToAddTodayWorkout")}
                  </Text>
                </View>
              </View>
            </Pressable>
          )}
        </View>

        {/* ===== UPCOMING SCHEDULE SECTION =====
            mb-2 here, not mb-6: the last DayScheduleCard already carries its
            own mb-4 (used for spacing between cards), so 8+16=24 matches the
            24px gap after Today Workout (whose card has no built-in margin). */}
        {(loading || upcomingDays.length > 0) && (
          <View className="mb-2">
            {loading ? (
              <UpcomingScheduleSkeleton />
            ) : (
              <>
                <Text
                  className="mb-3.5"
                  style={[
                    Typography.overline,
                    { color: colors.textSecondary, letterSpacing: 1.2 },
                  ]}
                >
                  {t("upcomingSchedule")}
                </Text>

                {upcomingDays.map((day) => (
                  <DayScheduleCard
                    key={day}
                    dayOfWeek={day}
                    schedule={schedulesByDay.get(day) ?? null}
                    isToday={false}
                    onPress={() =>
                      router.push({
                        pathname: "/calendar",
                        params: {
                          openDayOfWeek: String(day),
                          tabDirection: "right",
                        },
                      })
                    }
                  />
                ))}
              </>
            )}
          </View>
        )}

        {/* ===== RECOVERY SECTION ===== */}
        <View>
          {loading ? (
            <SkeletonBone
              width={140}
              height={12}
              borderRadius={4}
              style={{ marginBottom: 14 }}
            />
          ) : (
            <Text
              className="mb-3.5"
              style={[
                Typography.overline,
                { color: colors.textSecondary, letterSpacing: 1.2 },
              ]}
            >
              {t("disciplineModeSection")}
            </Text>
          )}

          {loading ? <RecoveryCardSkeleton /> : <RecoveryCard />}
        </View>

      </ScrollView>
    </View>
  );
}
