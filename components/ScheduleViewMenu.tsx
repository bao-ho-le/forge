import React, { useEffect, useRef, useState } from "react";
import { View, Text, Pressable, Modal, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { useTheme } from "../contexts/ThemeContext";
import { useTranslation } from "./Localization/LanguageProvider";
import { Typography } from "../constants/typography";
import AppIcon from "./Icon/AppIcon";
import type { ScheduleViewMode } from "../hooks/useScheduleViewMode";
import type { Translations } from "../locales/vi";

const VIEW_MODE_OPTIONS: { value: ScheduleViewMode; labelKey: keyof Translations }[] = [
  { value: "rolling", labelKey: "scheduleViewRollingWeek" },
  { value: "weekStart", labelKey: "scheduleViewMondayToSunday" },
  { value: "grouped", labelKey: "scheduleViewWorkoutRestDays" },
];

// Matches the "Schedule" heading's rendered line height so the button's
// background doesn't look taller than the title next to it.
const BUTTON_HEIGHT = 36;
const OPEN_MS = 120;
const CLOSE_MS = 90;

type ScheduleViewMenuProps = {
  value: ScheduleViewMode;
  onChange: (mode: ScheduleViewMode) => void;
};

export default function ScheduleViewMenu({ value, onChange }: ScheduleViewMenuProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [anchor, setAnchor] = useState<{ top: number; right: number } | null>(null);
  const anchorRef = useRef<View>(null);

  const menuOpacity = useSharedValue(0);
  const menuScale = useSharedValue(0.96);

  useEffect(() => {
    if (open) {
      setModalVisible(true);
      menuOpacity.value = withTiming(1, { duration: OPEN_MS });
      menuScale.value = withTiming(1, { duration: OPEN_MS });
    } else {
      menuOpacity.value = withTiming(0, { duration: CLOSE_MS }, (finished) => {
        if (finished) runOnJS(setModalVisible)(false);
      });
      menuScale.value = withTiming(0.96, { duration: CLOSE_MS });
    }
  }, [open]);

  const menuStyle = useAnimatedStyle(() => ({
    opacity: menuOpacity.value,
    transform: [{ scale: menuScale.value }],
  }));

  const openMenu = () => {
    anchorRef.current?.measureInWindow((x, y, width, height) => {
      setAnchor({
        top: y + height + 8,
        right: Dimensions.get("window").width - (x + width),
      });
      setOpen(true);
    });
  };

  return (
    <>
      <View ref={anchorRef} collapsable={false}>
        <Pressable
          onPress={openMenu}
          style={({ pressed }) => ({
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            height: BUTTON_HEIGHT,
            paddingHorizontal: 14,
            borderRadius: 14,
            backgroundColor: colors.surfaceMuted,
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <Text style={[Typography.label, { color: colors.textPrimary, fontWeight: "600" }]}>
            {t("scheduleViewLabel")}
          </Text>
          <AppIcon name="chevronDown" size={12} color={colors.textSecondary} strokeWidth={2} />
        </Pressable>
      </View>

      {/* Backdrop and menu card are siblings, not parent/child — nesting the
          option Pressables inside a full-screen backdrop Pressable makes the
          gesture responder fight between the two (same issue noted in
          DayEditSheet's backdrop). animationType is "none": the Reanimated
          opacity/scale below drives a quicker, custom transition instead of
          the OS's fixed-duration modal fade. */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="none"
        onRequestClose={() => setOpen(false)}
      >
        <View style={{ flex: 1 }}>
          <Pressable
            style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
            onPress={() => setOpen(false)}
          />
          {anchor && (
            <Animated.View
              className="rounded-2xl overflow-hidden"
              style={[
                {
                  position: "absolute",
                  top: anchor.top,
                  right: anchor.right,
                  minWidth: 230,
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.border,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.18,
                  shadowRadius: 12,
                  elevation: 8,
                },
                menuStyle,
              ]}
            >
              {VIEW_MODE_OPTIONS.map((option, index) => {
                const isSelected = option.value === value;
                return (
                  <Pressable
                    key={option.value}
                    onPress={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}
                    style={({ pressed }) => ({
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 12,
                      paddingHorizontal: 16,
                      paddingVertical: 14,
                      borderTopWidth: index === 0 ? 0 : 1,
                      borderTopColor: colors.border,
                      backgroundColor: pressed ? colors.surfaceMuted : "transparent",
                    })}
                  >
                    <Text
                      style={[
                        Typography.body,
                        {
                          color: isSelected ? colors.primary : colors.textPrimary,
                          fontWeight: isSelected ? "600" : "400",
                        },
                      ]}
                    >
                      {t(option.labelKey)}
                    </Text>
                    {isSelected && (
                      <AppIcon name="check" size={16} color={colors.primary} strokeWidth={2.5} />
                    )}
                  </Pressable>
                );
              })}
            </Animated.View>
          )}
        </View>
      </Modal>
    </>
  );
}
