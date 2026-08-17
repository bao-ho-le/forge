import React from "react";
import {
  Shirt,
  Bike,
  HeartPulse,
  ArrowUpToLine,
  Footprints,
  BicepsFlexed,
  Flame,
  Zap,
} from "lucide-react-native";
import type { LucideIcon } from "lucide-react-native";

export type WorkoutTypeIconProps = {
  size?: number;
  color: string;
  strokeWidth?: number;
};

function fromLucide(Icon: LucideIcon) {
  return function WorkoutTypeIcon({ size = 22, color, strokeWidth = 2 }: WorkoutTypeIconProps) {
    return <Icon size={size} color={color} strokeWidth={strokeWidth} />;
  };
}

export const UpperBodyIcon = fromLucide(Shirt);
export const LowerBodyIcon = fromLucide(Bike);
export const ChestIcon = fromLucide(HeartPulse);
export const BackIcon = fromLucide(ArrowUpToLine);
export const LegIcon = fromLucide(Footprints);
export const ArmIcon = fromLucide(BicepsFlexed);
export const CardioIcon = fromLucide(Flame);
export const FullBodyIcon = fromLucide(Zap);

// `workout_name` is persisted as the literal preset label shown at save time
// (see WorkoutTypePicker), so it's whatever the active locale's translation
// was — both the English and Vietnamese strings for each preset must resolve
// here regardless of the app's current language. Presets without a bespoke
// icon (General) and any free-typed custom title have no entry; callers fall
// back to the plain Dumbbell icon from lucide-react-native.
export const WORKOUT_TYPE_ICON_MAP: Record<string, React.ComponentType<WorkoutTypeIconProps>> = {
  "Upper Body": UpperBodyIcon,
  "Thân Trên": UpperBodyIcon,
  "Lower Body": LowerBodyIcon,
  "Thân Dưới": LowerBodyIcon,
  Chest: ChestIcon,
  Ngực: ChestIcon,
  Back: BackIcon,
  Lưng: BackIcon,
  Legs: LegIcon,
  Chân: LegIcon,
  Arm: ArmIcon,
  Tay: ArmIcon,
  Cardio: CardioIcon,
  "Full Body": FullBodyIcon,
  "Toàn Thân": FullBodyIcon,
};
