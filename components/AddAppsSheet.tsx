import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../contexts/ThemeContext";
import { useTranslation } from "./Localization/LanguageProvider";
import { Typography } from "../constants/typography";
import AppIcon from "./Icon/AppIcon";
import { IconSize } from "../constants/iconSizes";

const BACKDROP_FADE_MS = 200;
const SHEET_SLIDE_MS = 300;
const SHEET_OFFSCREEN_Y = Dimensions.get("window").height;

export type MockApp = { name: string; initial: string };

type AddAppsSheetProps = {
  visible: boolean;
  catalog: MockApp[];
  addedApps: Set<string>;
  onAdd: (name: string) => void;
  onRemove: (name: string) => void;
  onClose: () => void;
};

export default function AddAppsSheet({
  visible,
  catalog,
  addedApps,
  onAdd,
  onRemove,
  onClose,
}: AddAppsSheetProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const [query, setQuery] = useState("");

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

  useEffect(() => {
    if (visible) setQuery("");
  }, [visible]);

  const backdropStyle = useAnimatedStyle(() => ({ opacity: backdropOpacity.value }));
  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: sheetTranslateY.value }],
  }));

  const filteredApps = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return catalog;
    return catalog.filter((app) => app.name.toLowerCase().includes(normalized));
  }, [catalog, query]);

  return (
    <Modal visible={modalVisible} animationType="none" transparent onRequestClose={onClose}>
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
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
              height: "85%",
            },
            sheetStyle,
          ]}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={{ flex: 1 }}
          >
            <View style={{ paddingTop: 20, paddingHorizontal: 24 }}>
              {/* Grabber */}
              <View
                className="self-center rounded-full mb-5"
                style={{ width: 40, height: 4, backgroundColor: colors.border }}
              />

              {/* Header */}
              <View className="flex-row items-start justify-between mb-5">
                <Text
                  style={[
                    Typography.heading,
                    { color: colors.textPrimary, letterSpacing: -0.5 },
                  ]}
                >
                  {t("addApps")}
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

              {/* Search bar */}
              <View
                className="flex-row items-center rounded-2xl px-4 mb-2"
                style={{ backgroundColor: colors.surface }}
              >
                <TextInput
                  value={query}
                  onChangeText={setQuery}
                  placeholder={t("searchAppsPlaceholder")}
                  placeholderTextColor={colors.textSecondary}
                  keyboardAppearance="light"
                  autoCapitalize="none"
                  autoCorrect={false}
                  className="flex-1 py-3.5"
                  style={[Typography.body, { color: colors.textPrimary }]}
                />
                <AppIcon name="search" size={IconSize.md} color={colors.textSecondary} strokeWidth={2} />
              </View>
            </View>

            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{
                paddingTop: 4,
                paddingBottom: insets.bottom + 32,
                paddingHorizontal: 24,
              }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {filteredApps.length === 0 ? (
                <Text
                  className="text-center mt-6"
                  style={[Typography.label, { color: colors.textSecondary }]}
                >
                  {t("noAppsFound")}
                </Text>
              ) : (
                filteredApps.map((app, index) => {
                  const isAdded = addedApps.has(app.name);
                  const isLast = index === filteredApps.length - 1;
                  return (
                    <View
                      key={app.name}
                      className="flex-row items-center py-3"
                      style={{
                        borderBottomWidth: isLast ? 0 : 1,
                        borderBottomColor: colors.border,
                      }}
                    >
                      <View
                        className="w-9 h-9 rounded-[10px] justify-center items-center mr-3.5"
                        style={{ backgroundColor: colors.primaryContainer }}
                      >
                        <Text
                          style={[
                            Typography.label,
                            { color: colors.primary, fontWeight: "700" },
                          ]}
                        >
                          {app.initial}
                        </Text>
                      </View>
                      <Text
                        className="flex-1"
                        style={[Typography.body, { color: colors.textPrimary }]}
                      >
                        {app.name}
                      </Text>
                      {isAdded ? (
                        <Pressable
                          onPress={() => onRemove(app.name)}
                          hitSlop={8}
                          style={({ pressed }) => ({
                            width: 31,
                            height: 31,
                            borderRadius: 9999,
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: colors.surfaceMuted,
                            opacity: pressed ? 0.7 : 1,
                          })}
                        >
                          <Text style={{ fontSize: 13, fontWeight: "700", color: colors.textSecondary }}>
                            ✕
                          </Text>
                        </Pressable>
                      ) : (
                        <Pressable
                          onPress={() => onAdd(app.name)}
                          hitSlop={8}
                          style={({ pressed }) => ({
                            width: 31,
                            height: 31,
                            borderRadius: 9999,
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: colors.primary,
                            opacity: pressed ? 0.85 : 1,
                          })}
                        >
                          <Text
                            style={{
                              fontSize: 20,
                              fontWeight: "600",
                              lineHeight: 22,
                              textAlign: "center",
                              color: colors.onPrimary,
                            }}
                          >
                            +
                          </Text>
                        </Pressable>
                      )}
                    </View>
                  );
                })
              )}
            </ScrollView>
          </KeyboardAvoidingView>
        </Animated.View>
      </View>
    </Modal>
  );
}
