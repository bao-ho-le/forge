import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  ActivityIndicator,
  Alert,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../contexts/ThemeContext";
import { useTranslation } from "./Localization/LanguageProvider";
import { Typography } from "../constants/typography";
import TimePicker from "./TimePicker";
import GymPicker from "./GymPicker";
import WorkoutTypePicker from "./WorkoutTypePicker";
import WeekDaySelector from "./WeekDaySelector";
import ThemedSwitch from "./ThemedSwitch";
import AppIcon from "./Icon/AppIcon";
import {
  saveScheduleDay,
  deleteScheduleDay,
  getWeekdayName,
  type Gym,
  type WorkoutSchedule,
} from "../lib/scheduleService";
import type { Translations } from "../locales/vi";

const BACKDROP_FADE_MS = 200;
const SHEET_SLIDE_MS = 300;
// Comfortably taller than the sheet can ever be (capped at 85% of screen
// height), used as the off-screen starting/ending translateY for its slide.
const SHEET_OFFSCREEN_Y = Dimensions.get("window").height;

const PRESET_TITLE_KEYS: (keyof Translations)[] = [
  "presetUpperBody",
  "presetLowerBody",
  "presetChest",
  "presetBack",
  "presetLegs",
  "presetArm",
  "presetCardio",
  "presetFullBody",
  "presetGeneral",
];

type DayEditSheetProps = {
  visible: boolean;
  userId: string;
  dayOfWeek: number;
  gyms: Gym[];
  existingSchedule: WorkoutSchedule | null;
  schedulesByDay: Map<number, WorkoutSchedule>;
  onClose: () => void;
  onSaved: () => void;
};

export default function DayEditSheet({
  visible,
  userId,
  dayOfWeek,
  gyms,
  existingSchedule,
  schedulesByDay,
  onClose,
  onSaved,
}: DayEditSheetProps) {
  const { colors } = useTheme();
  const { t, language } = useTranslation();
  const insets = useSafeAreaInsets();
  const locale = language === "vi" ? "vi-VN" : "en-US";
  const weekdayName = getWeekdayName(dayOfWeek, locale);

  const [selectedDays, setSelectedDays] = useState<number[]>([dayOfWeek]);
  const [showDayError, setShowDayError] = useState(false);
  const [showDaysSection, setShowDaysSection] = useState(false);
  const [showReminderSection, setShowReminderSection] = useState(false);
  const [isRestDay, setIsRestDay] = useState(false);
  const [title, setTitle] = useState("");
  const [isCustomTitle, setIsCustomTitle] = useState(false);
  const [selectedTime, setSelectedTime] = useState("18:00");
  const [selectedGymId, setSelectedGymId] = useState<string | null>(null);
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [showTitleError, setShowTitleError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Height of the workout-only fields (title/time/gym/reminder), captured
  // while they're visible. When Rest Day is on, those fields unmount so the
  // Save/Delete buttons move straight up under the toggle, but a spacer of
  // this height is added after the buttons so the sheet's total height (and
  // therefore its top edge) doesn't suddenly jump.
  const [workoutSectionHeight, setWorkoutSectionHeight] = useState(0);
  // Modal stays mounted a beat after `visible` goes false so the backdrop
  // fade-out and sheet slide-down can finish. The Modal itself uses
  // animationType="none" — on "slide" RN animates the WHOLE modal (backdrop
  // included), which is why the backdrop used to slide up instead of fading.
  // Driving both by hand decouples them: backdrop fades, sheet slides.
  const [modalVisible, setModalVisible] = useState(visible);
  const backdropOpacity = useSharedValue(0);
  const sheetTranslateY = useSharedValue(SHEET_OFFSCREEN_Y);

  useEffect(() => {
    if (visible) {
      setModalVisible(true);
      backdropOpacity.value = withTiming(1, { duration: BACKDROP_FADE_MS });
      sheetTranslateY.value = withTiming(0, { duration: SHEET_SLIDE_MS });
    } else {
      backdropOpacity.value = withTiming(0, { duration: BACKDROP_FADE_MS });
      sheetTranslateY.value = withTiming(
        SHEET_OFFSCREEN_Y,
        { duration: SHEET_SLIDE_MS },
        (finished) => {
          if (finished) runOnJS(setModalVisible)(false);
        },
      );
    }
  }, [visible]);

  const backdropStyle = useAnimatedStyle(() => ({ opacity: backdropOpacity.value }));
  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: sheetTranslateY.value }],
  }));

  useEffect(() => {
    if (!visible) return;
    setSelectedDays([dayOfWeek]);
    setShowDaysSection(false);
    setShowReminderSection(false);
    if (existingSchedule) {
      const presetLabels = PRESET_TITLE_KEYS.map(t);
      const existingTitle = existingSchedule.workout_name ?? "";
      setIsRestDay(existingSchedule.is_rest_day);
      setTitle(existingTitle);
      setIsCustomTitle(existingTitle !== "" && !presetLabels.includes(existingTitle));
      setSelectedTime(existingSchedule.time_of_day?.slice(0, 5) ?? "18:00");
      setSelectedGymId(existingSchedule.gym_id);
      setReminderEnabled(existingSchedule.reminder_enabled);
    } else {
      setIsRestDay(false);
      setTitle(t("presetGeneral"));
      setIsCustomTitle(false);
      setSelectedTime("18:00");
      const defaultGym = gyms.find((g) => g.is_primary);
      setSelectedGymId(defaultGym?.id ?? null);
      setReminderEnabled(true);
    }
    setShowDayError(false);
    setShowTitleError(false);
    setError(null);
  }, [visible, existingSchedule, dayOfWeek]);

  const toggleDay = (day: number) => {
    setShowDayError(false);
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const handleSelectPreset = (label: string) => {
    setShowTitleError(false);
    setIsCustomTitle(false);
    setTitle(label);
  };

  const handleSelectCustom = () => {
    setShowTitleError(false);
    setIsCustomTitle(true);
    setTitle("");
  };

  const handleSubmit = async () => {
    if (selectedDays.length === 0) {
      setShowDayError(true);
      return;
    }
    if (!isRestDay && title.trim() === "") {
      setShowTitleError(true);
      return;
    }

    setSaving(true);
    setError(null);

    const input = {
      isRestDay,
      workoutName: isRestDay ? null : title.trim(),
      timeOfDay: isRestDay ? null : `${selectedTime}:00`,
      gymId: isRestDay ? null : selectedGymId,
      reminderEnabled,
    };

    // Sequential, not Promise.all: each save also regenerates upcoming
    // sessions, so running them one at a time avoids redundant concurrent
    // regeneration races across the selected days.
    let saveError: Error | null = null;
    for (const day of selectedDays) {
      const result = await saveScheduleDay(
        userId,
        day,
        schedulesByDay.get(day)?.id ?? null,
        input,
      );
      if (result.error) {
        saveError = result.error;
        break;
      }
    }

    setSaving(false);

    if (saveError) {
      setError(saveError.message);
      return;
    }

    onSaved();
    onClose();
  };

  const handleDelete = () => {
    if (!existingSchedule) return;
    Alert.alert(t("deleteScheduleTitle"), t("deleteScheduleMessage"), [
      { text: t("cancel"), style: "cancel" },
      {
        text: t("delete"),
        style: "destructive",
        onPress: async () => {
          setDeleting(true);
          await deleteScheduleDay(existingSchedule.id, userId);
          setDeleting(false);
          onSaved();
          onClose();
        },
      },
    ]);
  };

  return (
    <Modal visible={modalVisible} animationType="none" transparent onRequestClose={onClose}>
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        {/* Backdrop: a plain absolute-fill View behind the sheet, not a
            parent wrapping it — nesting the sheet's ScrollView inside a
            Pressable made the gesture responder fight the backdrop's tap
            handler, causing the sheet to lag and refuse to scroll/swipe.
            animationType is "none" on the Modal itself and both the
            backdrop's fade and the sheet's slide below are driven by hand —
            "slide" would otherwise animate the whole modal as one unit,
            sliding the backdrop up along with the sheet instead of fading. */}
        <Animated.View
          style={[
            {
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
            },
            backdropStyle,
          ]}
        >
          <Pressable onPress={onClose} style={{ flex: 1 }} />
        </Animated.View>
        <Animated.View
          style={[
            {
              backgroundColor: colors.background,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              maxHeight: "85%",
            },
            sheetStyle,
          ]}
        >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
              scrollEnabled={!isRestDay}
              contentContainerStyle={{
                paddingTop: 20,
                paddingBottom: insets.bottom + 32,
                paddingHorizontal: 24,
              }}
              showsVerticalScrollIndicator={false}
            >
              {/* Grabber */}
              <View
                className="self-center rounded-full mb-5"
                style={{ width: 40, height: 4, backgroundColor: colors.border }}
              />

              {/* Header */}
              <View className="flex-row items-start justify-between mb-6">
                <View>
                  <Text
                    style={[
                      Typography.heading,
                      { color: colors.textPrimary, letterSpacing: -0.5 },
                    ]}
                  >
                    {weekdayName}
                  </Text>
                </View>
                <Pressable
                  onPress={onClose}
                  style={({ pressed }) => ({
                    width: 36,
                    height: 36,
                    borderRadius: 9999,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: colors.surfaceMuted,
                    opacity: pressed ? 0.7 : 1,
                  })}
                >
                  <Text style={[Typography.bodyLarge, { color: colors.textSecondary }]}>
                    ✕
                  </Text>
                </Pressable>
              </View>

              {/* Rest Day toggle */}
              <View
                className="flex-row items-center justify-between rounded-2xl px-4 py-3.5 mb-7"
                style={{ backgroundColor: colors.surface }}
              >
                <View>
                  <Text style={[Typography.bodyLarge, { color: colors.textPrimary }]}>
                    {t("restDay")}
                  </Text>
                  <Text style={[Typography.label, { color: colors.textSecondary }]}>
                    {t("restDayDesc")}
                  </Text>
                </View>
                <ThemedSwitch
                  value={isRestDay}
                  onValueChange={(value) => {
                    setIsRestDay(value);
                    if (!value && title.trim() === "") {
                      setIsCustomTitle(false);
                      setTitle(t("presetGeneral"));
                    }
                  }}
                />
              </View>

              {/* Always mounted (even when Rest Day is on) so its height is
                  measured on the very first render regardless of which kind
                  of day is opened first — otherwise workoutSectionHeight
                  could still be its initial 0 the first time a day that's
                  already a Rest Day is opened, collapsing the spacer below
                  and shrinking the sheet. Positioned absolutely + hidden
                  while Rest Day is on so it takes no space in the flow. */}
              <View
                onLayout={(e) => setWorkoutSectionHeight(e.nativeEvent.layout.height)}
                pointerEvents={isRestDay ? "none" : "auto"}
                style={isRestDay ? { position: "absolute", left: 0, right: 0, opacity: 0 } : undefined}
              >
                  {/* Workout Title */}
                  <View className="mb-2">
                    <View className="flex-row items-center gap-1.5 mb-3.5">
                      <AppIcon name="dumbbell" size={14} color={colors.primary} strokeWidth={2} />
                      <Text
                        style={[
                          Typography.overline,
                          { color: colors.textSecondary, letterSpacing: 0.8 },
                        ]}
                      >
                        {t("workoutTitleLabel")}
                      </Text>
                    </View>
                    <WorkoutTypePicker
                      title={title}
                      isCustom={isCustomTitle}
                      onSelectPreset={handleSelectPreset}
                      onSelectCustom={handleSelectCustom}
                      onChangeCustomText={(text) => {
                        setShowTitleError(false);
                        setTitle(text);
                      }}
                    />
                  </View>
                  {showTitleError && (
                    <Text
                      className="mb-5"
                      style={[Typography.label, { color: colors.error }]}
                    >
                      {t("mustSelectTitleError")}
                    </Text>
                  )}
                  {!showTitleError && <View className="mb-7" />}

                  {/* Time */}
                  <View className="mb-7">
                    <View className="flex-row items-center gap-1.5 mb-3.5">
                      <AppIcon name="clock" size={14} color={colors.primary} strokeWidth={2} />
                      <Text
                        style={[
                          Typography.overline,
                          { color: colors.textSecondary, letterSpacing: 0.8 },
                        ]}
                      >
                        {t("timeLabel")}
                      </Text>
                    </View>
                    <TimePicker selectedTime={selectedTime} onSelectTime={setSelectedTime} />
                  </View>

                  {/* Gym */}
                  <View className="mb-7">
                    <View className="flex-row items-center gap-1.5 mb-2.5">
                      <AppIcon name="mapPin" size={14} color={colors.primary} strokeWidth={2} />
                      <Text
                        style={[
                          Typography.overline,
                          { color: colors.textSecondary, letterSpacing: 0.8 },
                        ]}
                      >
                        {t("gymSectionLabel")}
                      </Text>
                    </View>
                    <GymPicker
                      gyms={gyms}
                      selectedGymId={selectedGymId}
                      onSelectGym={setSelectedGymId}
                      onPressAddGym={() => {
                        onClose();
                        router.push("/gym-location");
                      }}
                    />
                  </View>

                  {/* Reminder: collapsible section, same pattern as Apply
                      to other days below (title press toggles the switch
                      row, collapsed by default each time the sheet opens). */}
                  <Pressable
                    onPress={() => setShowReminderSection((prev) => !prev)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    className="flex-row items-center gap-1.5 mb-3.5"
                  >
                    <AppIcon name="bell" size={14} color={colors.primary} strokeWidth={2} />
                    <Text
                      style={[
                        Typography.overline,
                        { color: colors.textSecondary, letterSpacing: 0.8 },
                      ]}
                    >
                      {t("reminderLabel")}
                    </Text>
                    <View
                      className="ml-1.5"
                      style={{
                        transform: [{ rotate: showReminderSection ? "180deg" : "0deg" }],
                      }}
                    >
                      <AppIcon name="chevronDown" size={14} color={colors.textSecondary} />
                    </View>
                  </Pressable>
                  {showReminderSection && (
                    <View
                      className="flex-row items-center justify-between rounded-2xl px-4 py-3.5 mb-7"
                      style={{ backgroundColor: colors.surface }}
                    >
                      <Text
                        style={[
                          Typography.body,
                          { color: colors.textPrimary, flex: 1, marginRight: 12 },
                        ]}
                      >
                        {t("reminderDesc")}
                      </Text>
                      <ThemedSwitch value={reminderEnabled} onValueChange={setReminderEnabled} />
                    </View>
                  )}
                  {!showReminderSection && <View className="mb-7" />}
                </View>

              {/* Apply to other days: optional, collapsed by default. Sits
                  after the workout fields (or their spacer) so it renders
                  identically whether or not Rest Day is on. */}
              <Pressable
                onPress={() => setShowDaysSection((prev) => !prev)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                className="flex-row items-center gap-1.5 mb-3.5"
              >
                <AppIcon name="calendar" size={14} color={colors.primary} strokeWidth={2} />
                <Text
                  style={[
                    Typography.overline,
                    { color: colors.textSecondary, letterSpacing: 0.8 },
                  ]}
                >
                  {t("applyToOtherDays")}
                </Text>
                <View
                  className="ml-1.5"
                  style={{
                    transform: [{ rotate: showDaysSection ? "180deg" : "0deg" }],
                  }}
                >
                  <AppIcon name="chevronDown" size={14} color={colors.textSecondary} />
                </View>
              </Pressable>
              {showDaysSection && (
                <View className="mb-2">
                  <WeekDaySelector selectedDays={selectedDays} onToggleDay={toggleDay} />
                </View>
              )}
              {showDayError && (
                <Text
                  className="mb-5"
                  style={[Typography.label, { color: colors.error }]}
                >
                  {t("mustSelectDayError")}
                </Text>
              )}
              {!showDayError && <View className="mb-7" />}

              {error && (
                <Text
                  className="mb-4 text-center"
                  style={[Typography.label, { color: colors.error }]}
                >
                  {error}
                </Text>
              )}

              {/* Save */}
              <Pressable
                onPress={handleSubmit}
                disabled={saving || deleting}
                style={({ pressed }) => ({
                  paddingVertical: 16,
                  borderRadius: 16,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: colors.primary,
                  opacity: pressed || saving || deleting ? 0.7 : 1,
                  marginBottom: existingSchedule ? 12 : 0,
                })}
              >
                {saving ? (
                  <ActivityIndicator color={colors.onPrimary} />
                ) : (
                  <Text
                    style={[
                      Typography.bodyLarge,
                      { color: colors.onPrimary, letterSpacing: 0.5 },
                    ]}
                  >
                    {t("saveSchedule")}
                  </Text>
                )}
              </Pressable>

              {/* Delete (only for an already-configured day) */}
              {existingSchedule && (
                <Pressable
                  onPress={handleDelete}
                  disabled={saving || deleting}
                  style={({ pressed }) => ({
                    paddingVertical: 16,
                    borderRadius: 16,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: colors.surfaceMuted,
                    opacity: pressed || saving || deleting ? 0.6 : 1,
                  })}
                >
                  {deleting ? (
                    <ActivityIndicator color={colors.error} />
                  ) : (
                    <Text style={[Typography.bodyLarge, { color: colors.error }]}>
                      {t("delete")}
                    </Text>
                  )}
                </Pressable>
              )}

              {isRestDay && <View style={{ height: workoutSectionHeight }} />}
          </ScrollView>
        </KeyboardAvoidingView>
        </Animated.View>
      </View>
    </Modal>
  );
}
