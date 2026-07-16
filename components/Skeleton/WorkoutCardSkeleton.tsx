import React from "react";
import { View } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import SkeletonBone from "./SkeletonBone";

// Mirrors WorkoutCard's layout 1:1 so the loaded card never shifts size.
export default function WorkoutCardSkeleton() {
  const { colors, isDark } = useTheme();

  return (
    <View
      className="rounded-3xl p-5"
      style={{
        backgroundColor: colors.surface,
        shadowColor: isDark ? "#000" : "#2C3E5B",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isDark ? 0.3 : 0.08,
        shadowRadius: 12,
        elevation: 4,
      }}
    >
      {/* Top Row: Icon + Title */}
      <View className="flex-row items-center mb-4">
        <SkeletonBone
          width={48}
          height={48}
          borderRadius={16}
          style={{ marginRight: 14 }}
        />
        <SkeletonBone width="55%" height={22} borderRadius={6} />
      </View>

      {/* Second Row: Time + Location */}
      <View className="flex-row items-center mb-5 gap-5">
        <View className="flex-row items-center gap-1.5">
          <SkeletonBone width={16} height={16} borderRadius={4} />
          <SkeletonBone width={48} height={14} borderRadius={6} />
        </View>
        <View className="flex-row items-center gap-1.5">
          <SkeletonBone width={16} height={16} borderRadius={4} />
          <SkeletonBone width={72} height={14} borderRadius={6} />
        </View>
      </View>

      {/* Bottom Row: Buttons */}
      <View className="flex-row gap-3">
        <SkeletonBone height={48} borderRadius={16} style={{ flex: 1 }} />
        <SkeletonBone width={110} height={48} borderRadius={16} />
      </View>
    </View>
  );
}
