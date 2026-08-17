import React from "react";
import { View, Text, Pressable, TextInput } from "react-native";
import { Dumbbell } from "lucide-react-native";
import { useTheme } from "../contexts/ThemeContext";
import { useTranslation } from "./Localization/LanguageProvider";
import { Typography } from "../constants/typography";
import { IconSize } from "../constants/iconSizes";
import {
  UpperBodyIcon,
  LowerBodyIcon,
  ChestIcon,
  BackIcon,
  LegIcon,
  ArmIcon,
  CardioIcon,
  FullBodyIcon,
  type WorkoutTypeIconProps,
} from "./icons/WorkoutTypeIcons";
import type { Translations } from "../locales/vi";

// Fixed row groups (not flex-wrap) so the layout always breaks exactly here,
// regardless of how wide each label renders in a given locale.
const PRESET_ROWS: (keyof Translations)[][] = [
  ["presetUpperBody", "presetLowerBody"],
  ["presetChest", "presetBack", "presetLegs", "presetArm"],
  ["presetCardio", "presetFullBody"],
  ["presetGeneral"],
];

// Same icon set as the schedule cards (WORKOUT_TYPE_ICON_MAP), keyed by
// preset key instead of translated label since the key is known directly
// here. General/custom have no bespoke icon and fall back to Dumbbell.
const PRESET_ICON_MAP: Partial<Record<keyof Translations, React.ComponentType<WorkoutTypeIconProps>>> = {
  presetUpperBody: UpperBodyIcon,
  presetLowerBody: LowerBodyIcon,
  presetChest: ChestIcon,
  presetBack: BackIcon,
  presetLegs: LegIcon,
  presetArm: ArmIcon,
  presetCardio: CardioIcon,
  presetFullBody: FullBodyIcon,
};

type WorkoutTypePickerProps = {
  title: string;
  isCustom: boolean;
  onSelectPreset: (label: string) => void;
  onSelectCustom: () => void;
  onChangeCustomText: (text: string) => void;
};

export default function WorkoutTypePicker({
  title,
  isCustom,
  onSelectPreset,
  onSelectCustom,
  onChangeCustomText,
}: WorkoutTypePickerProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const renderChip = (
    key: string,
    label: string,
    isSelected: boolean,
    onPress: () => void,
    Icon: React.ComponentType<WorkoutTypeIconProps> = Dumbbell,
  ) => (
    <Pressable
      key={key}
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: isSelected ? colors.primary : colors.surface,
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <Icon
        size={IconSize.sm}
        color={isSelected ? colors.onPrimary : colors.textSecondary}
        strokeWidth={2}
      />
      <Text
        style={[
          Typography.label,
          {
            fontWeight: isSelected ? "700" : "500",
            color: isSelected ? colors.onPrimary : colors.textPrimary,
          },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );

  return (
    <View>
      {PRESET_ROWS.map((row, rowIndex) => (
        <View
          key={rowIndex}
          style={{
            flexDirection: "row",
            gap: 8,
            marginBottom: rowIndex < PRESET_ROWS.length - 1 ? 8 : 0,
          }}
        >
          {row.map((key) => {
            const label = t(key);
            return renderChip(
              key,
              label,
              !isCustom && title === label,
              () => onSelectPreset(label),
              PRESET_ICON_MAP[key],
            );
          })}
          {rowIndex === PRESET_ROWS.length - 1 &&
            renderChip("custom", t("customTitleOption"), isCustom, onSelectCustom)}
        </View>
      ))}

      {isCustom && (
        <TextInput
          value={title}
          onChangeText={onChangeCustomText}
          placeholder={t("customTitlePlaceholder")}
          placeholderTextColor={colors.textSecondary}
          keyboardAppearance="light"
          className="rounded-2xl py-3 px-4 mt-3"
          style={[Typography.body, { backgroundColor: colors.surface, color: colors.textPrimary }]}
        />
      )}
    </View>
  );
}
