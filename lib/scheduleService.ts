import { supabase } from "./supabase";
import { invalidateCache } from "./dataCache";

export type Gym = {
  id: string;
  name: string;
  is_primary: boolean;
};

export type WorkoutSchedule = {
  id: string;
  user_id: string;
  gym_id: string | null;
  day_of_week: number; // 0 = Sunday ... 6 = Saturday (matches DB check constraint)
  time_of_day: string | null; // "HH:MM:SS"
  workout_name: string | null;
  is_rest_day: boolean;
  reminder_enabled: boolean;
  is_active: boolean;
  gyms: { name: string } | null;
};

const DEFAULT_TIMEZONE = "Asia/Ho_Chi_Minh";
const GENERATE_DAYS_AHEAD = 14;

// Timezone-aware date math without a date library: Intl/ICU is built into
// Hermes on Expo 54, so we lean on Intl.DateTimeFormat's `timeZone` option
// instead of adding a dependency like date-fns-tz.
function getTodayInTimezone(timezone: string): string {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(new Date()); // en-CA => "YYYY-MM-DD"
}

function addDays(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

// day_of_week convention: 0 = Sunday ... 6 = Saturday (matches DB check constraint).
function getDayOfWeek(dateStr: string): number {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

// Jan 4 1970 was a Sunday, so Date.UTC(1970,0,4 + dayOfWeek) lands on the
// requested weekday without needing a real reference date or a manually
// translated day-name table in locales/*.
export function getWeekdayName(
  dayOfWeek: number,
  locale: string,
  format: "long" | "short" = "long",
): string {
  const date = new Date(Date.UTC(1970, 0, 4 + dayOfWeek));
  return new Intl.DateTimeFormat(locale, { weekday: format, timeZone: "UTC" }).format(
    date,
  );
}

export async function getTodayDayOfWeek(userId: string): Promise<number> {
  const timezone = await getUserTimezone(userId);
  return getDayOfWeek(getTodayInTimezone(timezone));
}

// "YYYY-MM-DD" for today in the user's timezone. Exposed so the Home preview
// can label an item "Tomorrow" instead of a weekday name.
export async function getTodayDate(userId: string): Promise<string> {
  const timezone = await getUserTimezone(userId);
  return getTodayInTimezone(timezone);
}

export { addDays };

export async function getUserTimezone(userId: string): Promise<string> {
  const { data } = await supabase
    .from("profiles")
    .select("timezone")
    .eq("id", userId)
    .single();
  return data?.timezone || DEFAULT_TIMEZONE;
}

export async function fetchGyms(userId: string): Promise<Gym[]> {
  const { data, error } = await supabase
    .from("gyms")
    .select("id, name, is_primary")
    .eq("user_id", userId)
    .order("is_primary", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

// All active per-day rows for the weekly planner (0-7 rows; a day with no
// row is rendered client-side as "not configured").
export async function fetchActiveSchedules(userId: string): Promise<WorkoutSchedule[]> {
  const { data, error } = await supabase
    .from("workout_schedules")
    .select("*, gyms(name)")
    .eq("user_id", userId)
    .eq("is_active", true);
  if (error) throw error;
  return data ?? [];
}

export async function fetchScheduleForDay(
  userId: string,
  dayOfWeek: number,
): Promise<WorkoutSchedule | null> {
  const { data, error } = await supabase
    .from("workout_schedules")
    .select("*, gyms(name)")
    .eq("user_id", userId)
    .eq("day_of_week", dayOfWeek)
    .eq("is_active", true)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export type ScheduleDayInput = {
  isRestDay: boolean;
  workoutName: string | null;
  timeOfDay: string | null; // "HH:MM:SS", null for a rest day
  gymId: string | null;
  reminderEnabled: boolean;
};

// existingId is the row's id when editing an already-configured day, or null
// when the day previously had no row at all.
export async function saveScheduleDay(
  userId: string,
  dayOfWeek: number,
  existingId: string | null,
  input: ScheduleDayInput,
): Promise<{ error: Error | null }> {
  const payload = {
    user_id: userId,
    day_of_week: dayOfWeek,
    is_active: true,
    is_rest_day: input.isRestDay,
    workout_name: input.isRestDay ? null : input.workoutName,
    time_of_day: input.isRestDay ? null : input.timeOfDay,
    gym_id: input.isRestDay ? null : input.gymId,
    reminder_enabled: input.reminderEnabled,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = existingId
    ? await supabase
        .from("workout_schedules")
        .update(payload)
        .eq("id", existingId)
        .select("id")
        .single()
    : await supabase.from("workout_schedules").insert(payload).select("id").single();

  if (error) return { error };

  await clearPendingFutureSessionsForSchedule(data.id, userId);
  await generateUpcomingSessions(userId);
  invalidateCache();
  return { error: null };
}

export async function deleteScheduleDay(
  scheduleId: string,
  userId: string,
): Promise<{ error: Error | null }> {
  const { error } = await supabase
    .from("workout_schedules")
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq("id", scheduleId);
  if (error) return { error };

  await clearPendingFutureSessionsForSchedule(scheduleId, userId);
  await generateUpcomingSessions(userId);
  invalidateCache();
  return { error: null };
}

// Only removes sessions that never got a real outcome. Sessions already
// verified/missed/recovered are historical record and must survive a
// schedule edit or soft-delete.
async function clearPendingFutureSessionsForSchedule(scheduleId: string, userId: string) {
  const timezone = await getUserTimezone(userId);
  const today = getTodayInTimezone(timezone);

  const { error } = await supabase
    .from("workout_sessions")
    .delete()
    .eq("schedule_id", scheduleId)
    .eq("status", "pending")
    .gte("scheduled_date", today);
  if (error) throw error;
}

// Client-side generation (MVP decision, no pg_cron/Edge Function): called on
// Home/Schedule mount and right after schedule CRUD. Must never touch a
// session that already exists for a date, since that session may already
// carry a real verify result. Rest days and unconfigured days never produce
// sessions — there's nothing to verify on those days.
export async function generateUpcomingSessions(userId: string): Promise<void> {
  const timezone = await getUserTimezone(userId);
  const today = getTodayInTimezone(timezone);

  const schedules = await fetchActiveSchedules(userId);
  const workoutDays = schedules.filter(
    (s) => !s.is_rest_day && s.workout_name && s.time_of_day,
  );
  if (workoutDays.length === 0) return;

  const candidatesByDate = new Map<
    string,
    {
      user_id: string;
      schedule_id: string;
      gym_id: string | null;
      scheduled_date: string;
      scheduled_time: string;
      title: string | null;
    }
  >();

  for (let offset = 0; offset < GENERATE_DAYS_AHEAD; offset++) {
    const date = addDays(today, offset);
    const dow = getDayOfWeek(date);
    const schedule = workoutDays.find((s) => s.day_of_week === dow);
    if (!schedule) continue;
    candidatesByDate.set(date, {
      user_id: userId,
      schedule_id: schedule.id,
      gym_id: schedule.gym_id,
      scheduled_date: date,
      scheduled_time: schedule.time_of_day as string,
      // Copied at generation time (not read live from the schedule) so
      // editing a schedule's title later doesn't rewrite the label on
      // sessions that already happened.
      title: schedule.workout_name,
    });
  }

  const candidates = Array.from(candidatesByDate.values());
  if (candidates.length === 0) return;

  // upsert + ignoreDuplicates instead of select-then-filter: avoids a
  // race window between the read and the write when Home and Schedule both
  // call this on mount around the same time, and never updates a row that
  // already exists (so real verify results are never overwritten).
  const { error } = await supabase
    .from("workout_sessions")
    .upsert(candidates, {
      onConflict: "user_id,scheduled_date",
      ignoreDuplicates: true,
    });
  if (error) throw error;
}
