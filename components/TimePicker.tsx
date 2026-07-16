import React, { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  TouchableWithoutFeedback,
} from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useTheme } from "../contexts/ThemeContext";

type TimePickerProps = {
  selectedTime: string; // 24h format "HH:MM"
  onSelectTime: (time: string) => void;
};

// Preset quick-pick times, 24h value paired with its plain (no AM/PM) label.
const PRESET_TIMES: { value: string; label: string }[] = [
  { value: "17:30", label: "5:30" },
  { value: "06:00", label: "6:00" },
  { value: "18:00", label: "18:00" },
  { value: "18:30", label: "18:30" },
];

// Custom picker data
const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));
const ITEM_HEIGHT = 44;
const VISIBLE_ITEMS = 5;

function WheelItem({
  item,
  index,
  scrollY,
  isSelected,
  colors,
}: {
  item: string;
  index: number;
  scrollY: SharedValue<number>;
  isSelected: boolean;
  colors: any;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    const distance = Math.abs(index - scrollY.value / ITEM_HEIGHT);
    return {
      opacity: interpolate(distance, [0, 1, 2, 3], [1, 0.65, 0.3, 0.15], Extrapolation.CLAMP),
      transform: [
        { scale: interpolate(distance, [0, 1, 2, 3], [1, 0.88, 0.76, 0.7], Extrapolation.CLAMP) },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        { height: ITEM_HEIGHT, justifyContent: "center", alignItems: "center" },
        animatedStyle,
      ]}
    >
      <Text
        style={{
          fontSize: isSelected ? 20 : 16,
          fontWeight: isSelected ? "700" : "400",
          color: colors.textPrimary,
        }}
      >
        {item}
      </Text>
    </Animated.View>
  );
}

function WheelColumn({
  data,
  selectedValue,
  onSelect,
  colors,
}: {
  data: string[];
  selectedValue: string;
  onSelect: (val: string) => void;
  colors: any;
}) {
  const flatListRef = useRef<Animated.FlatList<string>>(null);
  const startIdx = Math.max(0, data.indexOf(selectedValue));
  // Driven entirely on the UI thread so item scale/opacity track the
  // gesture at native frame rate instead of waiting on JS-thread re-renders.
  const scrollY = useSharedValue(startIdx * ITEM_HEIGHT);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollY.value = e.contentOffset.y;
    },
  });

  const onMomentumEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const y = e.nativeEvent.contentOffset.y;
      const index = Math.round(y / ITEM_HEIGHT);
      const clamped = Math.max(0, Math.min(index, data.length - 1));
      onSelect(data[clamped]);
      flatListRef.current?.scrollToIndex({ index: clamped, animated: true });
    },
    [data, onSelect]
  );

  return (
    <View style={{ flex: 1, height: ITEM_HEIGHT * VISIBLE_ITEMS, overflow: "hidden" }}>
      <View
        style={{
          position: "absolute",
          top: ITEM_HEIGHT * 2,
          left: 0,
          right: 0,
          height: ITEM_HEIGHT,
          borderWidth: 1.5,
          borderColor: colors.primary,
          borderRadius: 8,
          zIndex: 1,
        }}
      />
      <Animated.FlatList
        ref={flatListRef}
        data={data}
        keyExtractor={(item) => item}
        renderItem={({ item, index }) => (
          <WheelItem
            item={item}
            index={index}
            scrollY={scrollY}
            isSelected={item === selectedValue}
            colors={colors}
          />
        )}
        onMomentumScrollEnd={onMomentumEnd}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: ITEM_HEIGHT * 2,
          paddingBottom: ITEM_HEIGHT * 2,
        }}
        getItemLayout={(_, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
        initialScrollIndex={startIdx}
      />
    </View>
  );
}

export default function TimePicker({
  selectedTime,
  onSelectTime,
}: TimePickerProps) {
  const { colors, isDark } = useTheme();
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const translateY = useSharedValue(400);

  const openPicker = () => {
    setShowCustomPicker(true);
    translateY.value = withTiming(0, { duration: 200 });
  };

  const closePicker = () => {
    translateY.value = withTiming(400, { duration: 200 });
    setTimeout(() => setShowCustomPicker(false), 200);
  };

  const [hour, minute] = selectedTime.split(":");

  const handlePresetSelect = (time: string) => {
    onSelectTime(time);
  };

  const handleCustomHour = (h: string) => {
    onSelectTime(`${h}:${minute}`);
  };

  const handleCustomMinute = (m: string) => {
    onSelectTime(`${hour}:${m}`);
  };

  const handleDone = () => {
    closePicker();
  };

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <View>
      {/* ===== PRESET TIMES (single row) ===== */}
      <View
        style={{
          flexDirection: "row",
          gap: 8,
          marginBottom: 10,
        }}
      >
        {PRESET_TIMES.map(({ value, label }) => {
          const isSelected = selectedTime === value;
          return (
            <Pressable
              key={value}
              onPress={() => handlePresetSelect(value)}
              style={({ pressed }) => ({
                flex: 1,
                alignItems: "center",
                paddingVertical: 10,
                borderRadius: 20,
                backgroundColor: isSelected ? colors.primary : colors.surface,
                opacity: pressed ? 0.7 : 1,
                transform: [{ scale: pressed ? 0.95 : 1 }],
              })}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: isSelected ? "700" : "500",
                  color: isSelected ? colors.onPrimary : colors.textPrimary,
                }}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Custom time button sits directly under the presets, as one block */}
      <Pressable
        onPress={openPicker}
        style={({ pressed }) => ({
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.surface,
          borderRadius: 16,
          paddingVertical: 14,
          gap: 4,
          opacity: pressed ? 0.7 : 1,
        })}
      >
        <Text
          style={{
            fontSize: 28,
            fontWeight: "700",
            color: colors.textPrimary,
            letterSpacing: 2,
          }}
        >
          {hour}
        </Text>
        <Text
          style={{
            fontSize: 28,
            fontWeight: "300",
            color: colors.textSecondary,
            marginHorizontal: 4,
          }}
        >
          :
        </Text>
        <Text
          style={{
            fontSize: 28,
            fontWeight: "700",
            color: colors.textPrimary,
            letterSpacing: 2,
          }}
        >
          {minute}
        </Text>
      </Pressable>

      {/* ===== CUSTOM PICKER BOTTOM SHEET ===== */}
      {showCustomPicker && (
        <Modal transparent animationType="none" visible={showCustomPicker}>
          <TouchableWithoutFeedback onPress={closePicker}>
            <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)" }} />
          </TouchableWithoutFeedback>
          <Animated.View
            style={[
              sheetStyle,
              {
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: colors.surface,
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                paddingTop: 20,
                paddingBottom: 34,
                paddingHorizontal: 20,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: -4 },
                shadowOpacity: 0.1,
                shadowRadius: 12,
                elevation: 10,
              },
            ]}
          >
            {/* Handle bar */}
            <View
              style={{
                width: 40,
                height: 4,
                borderRadius: 2,
                backgroundColor: colors.border,
                alignSelf: "center",
                marginBottom: 16,
              }}
            />

            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: colors.textPrimary,
                textAlign: "center",
                marginBottom: 16,
              }}
            >
              Select Time
            </Text>

            {/* Dual wheels */}
            <View
              style={{
                flexDirection: "row",
                gap: 12,
                paddingHorizontal: 20,
              }}
            >
              <WheelColumn
                data={HOURS}
                selectedValue={hour}
                onSelect={handleCustomHour}
                colors={colors}
              />
              <WheelColumn
                data={MINUTES}
                selectedValue={minute}
                onSelect={handleCustomMinute}
                colors={colors}
              />
            </View>

            {/* Done button */}
            <Pressable
              onPress={handleDone}
              style={({ pressed }) => ({
                backgroundColor: colors.primary,
                paddingVertical: 14,
                borderRadius: 16,
                alignItems: "center",
                justifyContent: "center",
                marginTop: 20,
                marginHorizontal: 20,
                opacity: pressed ? 0.85 : 1,
              })}
            >
              <Text
                style={{
                  color: colors.onPrimary,
                  fontSize: 16,
                  fontWeight: "700",
                  letterSpacing: 0.5,
                }}
              >
                Done
              </Text>
            </Pressable>
          </Animated.View>
        </Modal>
      )}
    </View>
  );
}
