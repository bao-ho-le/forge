import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  FadeInDown,
} from "react-native-reanimated";
import { useTheme } from "../contexts/ThemeContext";
import { Typography } from "../constants/typography";
import DayCircleSelector from "./DayCircleSelector";
import TimePicker from "./TimePicker";
import LocationInput from "./LocationInput";

type AddWorkoutModalProps = {
  visible: boolean;
  defaultDay: number;
  onClose: () => void;
  onAdd: (workout: {
    title: string;
    day: number;
    time: string;
    location: string;
  }) => void;
};

export default function AddWorkoutModal({
  visible,
  defaultDay,
  onClose,
  onAdd,
}: AddWorkoutModalProps) {
  const { colors, isDark } = useTheme();
  const [title, setTitle] = useState("");
  const [selectedDay, setSelectedDay] = useState(defaultDay);
  const [selectedTime, setSelectedTime] = useState("06:30");
  const [location, setLocation] = useState("Iron Temple Gym");

  const handleSubmit = () => {
    if (!title.trim()) return;
    onAdd({
      title: title.trim(),
      day: selectedDay,
      time: selectedTime,
      location: location.trim() || "Iron Temple Gym",
    });
    setTitle("");
    setSelectedDay(defaultDay);
    setSelectedTime("06:30");
    setLocation("Iron Temple Gym");
    onClose();
  };

  const scale = useSharedValue(1);
  const submitAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      transparent={false}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        style={{ backgroundColor: colors.background }}
      >
        <ScrollView
          contentContainerStyle={{
            paddingTop: 60,
            paddingBottom: 40,
            paddingHorizontal: 24,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between mb-8">
            <Text
              style={[
                Typography.heading,
                { color: colors.textPrimary, letterSpacing: -0.5 },
              ]}
            >
              New Workout
            </Text>
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

          {/* A. Workout Title */}
          <Animated.View
            entering={FadeInDown.delay(100).duration(400)}
            className="mb-7"
          >
            <Text
              className="mb-2.5"
              style={[
                Typography.overline,
                { color: colors.textSecondary, letterSpacing: 0.8 },
              ]}
            >
              WORKOUT TITLE
            </Text>
            <View
              className="rounded-2xl px-4 py-0.5"
              style={{ backgroundColor: colors.surface }}
            >
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="Workout Title"
                placeholderTextColor={colors.textSecondary}
                className="py-3.5"
                style={[Typography.body, { color: colors.textPrimary }]}
              />
            </View>
          </Animated.View>

          {/* B. Day Selector */}
          <Animated.View
            entering={FadeInDown.delay(150).duration(400)}
            className="mb-7"
          >
            <Text
              className="mb-3.5"
              style={[
                Typography.overline,
                { color: colors.textSecondary, letterSpacing: 0.8 },
              ]}
            >
              DAY
            </Text>
            <DayCircleSelector
              selectedDay={selectedDay}
              onSelectDay={setSelectedDay}
            />
          </Animated.View>

          {/* C. Time Selector */}
          <Animated.View
            entering={FadeInDown.delay(200).duration(400)}
            className="mb-7"
          >
            <Text
              className="mb-3.5"
              style={[
                Typography.overline,
                { color: colors.textSecondary, letterSpacing: 0.8 },
              ]}
            >
              TIME
            </Text>
            <TimePicker
              selectedTime={selectedTime}
              onSelectTime={setSelectedTime}
            />
          </Animated.View>

          {/* D. Gym Location */}
          <Animated.View
            entering={FadeInDown.delay(250).duration(400)}
            className="mb-10"
          >
            <Text
              className="mb-2.5"
              style={[
                Typography.overline,
                { color: colors.textSecondary, letterSpacing: 0.8 },
              ]}
            >
              GYM LOCATION
            </Text>
            <LocationInput
              value={location}
              onChangeText={setLocation}
              placeholder="Enter gym address"
            />
          </Animated.View>

          {/* Submit Button */}
          <Animated.View style={submitAnimatedStyle}>
            <Pressable
              onPress={handleSubmit}
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
                backgroundColor: colors.primary,
                opacity: pressed ? 0.9 : 1,
              })}
            >
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
      </KeyboardAvoidingView>
    </Modal>
  );
}
