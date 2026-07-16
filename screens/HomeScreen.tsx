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
import ThemeToggle from "../components/ThemeToggle";
import AppIcon from "../components/Icon/AppIcon";
import WorkoutCardSkeleton from "../components/Skeleton/WorkoutCardSkeleton";
import UpcomingScheduleSkeleton from "../components/Skeleton/UpcomingScheduleSkeleton";
import RecoveryCardSkeleton from "../components/Skeleton/RecoveryCardSkeleton";
import SkeletonBone from "../components/Skeleton/SkeletonBone";
import { TAB_BAR_HEIGHT } from "../constants/tabNavigation";
import {
  fetchScheduleForDay,
  fetchUpcomingSessionsPreview,
  generateUpcomingSessions,
  getTodayDayOfWeek,
  getTodayDate,
  addDays,
  type WorkoutSchedule,
  type UpcomingSessionPreview,
} from "../lib/scheduleService";
import { getCached, setCached } from "../lib/dataCache";

// How long a tab switch can reuse the last fetch before going back to
// Supabase. Long enough that Home<->Schedule flipping feels instant, short
// enough that the day naturally rolls over during a single foreground session.
const CACHE_TTL_MS = 5 * 60 * 1000;

type HomeCacheData = {
  todaySchedule: WorkoutSchedule | null;
  upcomingPreview: UpcomingSessionPreview[];
  tomorrowDate: string;
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

// Preview is bounded to the next 7 days (see fetchUpcomingSessionsPreview),
// so each weekday can appear at most once — a bare weekday name is safe.
function formatShortWeekday(dateStr: string, locale: string): string {
  const date = new Date(`${dateStr}T00:00:00Z`);
  return new Intl.DateTimeFormat(locale, {
    weekday: "short",
    timeZone: "UTC",
  }).format(date);
}

export default function HomeScreen() {
  const { colors, isDark } = useTheme();
  const { t, language } = useTranslation();
  const { session } = useAuth();
  const userId = session?.user?.id;
  const insets = useSafeAreaInsets();
  const locale = language === "vi" ? "vi-VN" : "en-US";

  const [todaySchedule, setTodaySchedule] = useState<WorkoutSchedule | null>(null);
  const [upcomingPreview, setUpcomingPreview] = useState<UpcomingSessionPreview[]>([]);
  const [tomorrowDate, setTomorrowDate] = useState<string | null>(null);
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
      setUpcomingPreview(cached.upcomingPreview);
      setTomorrowDate(cached.tomorrowDate);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      await generateUpcomingSessions(userId);
    } catch (err) {
      console.error("generateUpcomingSessions failed", err);
    }
    const [todayDow, today] = await Promise.all([
      getTodayDayOfWeek(userId),
      getTodayDate(userId),
    ]);
    const [schedule, preview] = await Promise.all([
      fetchScheduleForDay(userId, todayDow),
      fetchUpcomingSessionsPreview(userId, 3),
    ]);
    const tomorrowDate = addDays(today, 1);
    setTodaySchedule(schedule);
    setUpcomingPreview(preview);
    setTomorrowDate(tomorrowDate);
    setCached<HomeCacheData>(cacheKey, {
      todaySchedule: schedule,
      upcomingPreview: preview,
      tomorrowDate,
    });
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const isRestDay = todaySchedule?.is_rest_day ?? false;
  const isWorkoutDay = !!todaySchedule && !isRestDay;

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
            <EmptyStateCard
              message={t("noTodayWorkout")}
              description={t("noTodayWorkoutDesc")}
            />
          )}
        </View>

        {/* ===== UPCOMING SCHEDULE SECTION ===== */}
        <View className="mb-6">
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

              {upcomingPreview.length > 0 ? (
                <View
                  className="rounded-[20px] px-4 py-1"
                  style={{
                    backgroundColor: colors.surface,
                    shadowColor: isDark ? "#000" : "#2C3E5B",
                    shadowOffset: { width: 0, height: 3 },
                    shadowOpacity: isDark ? 0.25 : 0.06,
                    shadowRadius: 8,
                    elevation: 3,
                  }}
                >
                  {upcomingPreview.map((item, index) => {
                    const dayLabel =
                      item.scheduled_date === tomorrowDate
                        ? t("tomorrow")
                        : formatShortWeekday(item.scheduled_date, locale);
                    return (
                      <View
                        key={item.id}
                        className="flex-row py-3"
                        style={{
                          borderTopWidth: index === 0 ? 0 : 1,
                          borderTopColor: colors.border,
                        }}
                      >
                        <Text
                          style={[
                            Typography.body,
                            { color: colors.textPrimary, fontWeight: "600" },
                          ]}
                        >
                          {dayLabel}
                        </Text>
                        <Text style={[Typography.body, { color: colors.textSecondary }]}>
                          {"  —  "}
                          {item.title ?? t("workoutName")}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              ) : (
                <EmptyStateCard
                  message={t("noUpcomingWorkout")}
                  description={t("noUpcomingWorkoutDesc")}
                />
              )}
            </>
          )}
        </View>

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
