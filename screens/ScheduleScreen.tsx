import React, { useState } from "react";
import { View, Text, ScrollView, StatusBar, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useTheme } from "../contexts/ThemeContext";
import { Typography } from "../constants/typography";
import { IconSize } from "../constants/iconSizes";
import WeekSelector, { DAYS } from "../components/WeekSelector";
import WorkoutScheduleCard from "../components/WorkoutScheduleCard";
import BottomTabBar from "../components/BottomTabBar";
import { navigateToTab } from "../constants/tabNavigation";
import AddWorkoutModal from "../components/AddWorkoutModal";
import AppIcon from "../components/Icon/AppIcon";

// Mock data: workouts keyed by day index
const MOCK_WORKOUTS: Record<
  number,
  { name: string; time: string; location: string }[]
> = {
  0: [{ name: "Chest Day", time: "07:00", location: "Iron Temple Gym" }],
  2: [{ name: "Upper Body", time: "06:30", location: "Iron Temple Gym" }],
  4: [{ name: "Leg Day", time: "06:00", location: "Iron Temple Gym" }],
};

export default function ScheduleScreen() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const today = new Date().getDay();
  const mappedToday = today === 0 ? 6 : today - 1; // Convert Sun=0 to index 6
  const [selectedDay, setSelectedDay] = useState(mappedToday);
  const [showModal, setShowModal] = useState(false);
  const [workouts, setWorkouts] = useState(MOCK_WORKOUTS);

  const scale = useSharedValue(1);
  const addButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const dayWorkouts = workouts[selectedDay] || [];

  const handleAddWorkout = (workout: {
    title: string;
    day: number;
    time: string;
    location: string;
  }) => {
    setWorkouts((prev) => {
      const updated = { ...prev };
      const list = [...(updated[workout.day] || [])];
      list.push({
        name: workout.title,
        time: workout.time,
        location: workout.location,
      });
      updated[workout.day] = list;
      return updated;
    });
  };

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
          paddingBottom: 32,
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
            Schedule
          </Text>
        </View>

        {/* ===== WEEK SELECTOR ===== */}
        <View className="mb-6">
          <WeekSelector
            selectedDay={selectedDay}
            onSelectDay={setSelectedDay}
          />
        </View>

        {/* ===== WORKOUT LIST ===== */}
        {dayWorkouts.length > 0 ? (
          <View>
            <Text
              className="mb-3.5"
              style={[
                Typography.overline,
                { color: colors.textSecondary, letterSpacing: 1.2 },
              ]}
            >
              {DAYS[selectedDay].toUpperCase()}
            </Text>
            {dayWorkouts.map((workout, index) => (
              <WorkoutScheduleCard
                key={workout.name + index}
                name={workout.name}
                time={workout.time}
                location={workout.location}
              />
            ))}
          </View>
        ) : (
          <Animated.View
            className="rounded-[20px] p-8 items-center justify-center"
            style={{
              backgroundColor: colors.surface,
              shadowColor: isDark ? "#000" : "#2C3E5B",
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: isDark ? 0.25 : 0.06,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <View
              className="w-16 h-16 rounded-full justify-center items-center mb-4"
              style={{ backgroundColor: colors.primaryContainer }}
            >
              <AppIcon
                name="calendarEmpty"
                size={IconSize.xl}
                color={colors.textSecondary}
                strokeWidth={1.5}
              />
            </View>
            <Text
              className="text-center"
              style={[Typography.bodyLarge, { color: colors.textSecondary }]}
            >
              No workout scheduled
            </Text>
            <Text
              className="text-center mt-1"
              style={[Typography.label, { color: colors.textSecondary }]}
            >
              Tap the button below to add one
            </Text>
          </Animated.View>
        )}

        {/* ===== ADD WORKOUT BUTTON ===== */}
        <Animated.View style={[addButtonStyle, { marginTop: 20 }]}>
          <Pressable
            onPress={() => setShowModal(true)}
            onPressIn={() => {
              scale.value = withTiming(0.95, { duration: 80 });
            }}
            onPressOut={() => {
              scale.value = withTiming(1, { duration: 120 });
            }}
            style={({ pressed }) => ({
              paddingVertical: 16,
              borderRadius: 16,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              gap: 8,
              backgroundColor: colors.primary,
              opacity: pressed ? 0.9 : 1,
            })}
          >
            <Text
              className="mt-[-1px]"
              style={[Typography.body, { color: colors.onPrimary }]}
            >
              +
            </Text>
            <Text
              style={[
                Typography.bodyLarge,
                { color: colors.onPrimary, letterSpacing: 0.5 },
              ]}
            >
              Add Workout
            </Text>
          </Pressable>
        </Animated.View>
      </ScrollView>

      {/* ===== ADD WORKOUT MODAL ===== */}
      <AddWorkoutModal
        visible={showModal}
        defaultDay={selectedDay}
        onClose={() => setShowModal(false)}
        onAdd={handleAddWorkout}
      />

      {/* ===== BOTTOM TAB BAR ===== */}
      <BottomTabBar
        activeTab="calendar"
        onTabPress={(tab) => navigateToTab("calendar", tab)}
      />
    </View>
  );
}
