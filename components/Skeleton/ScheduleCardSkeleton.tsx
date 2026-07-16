import React from "react";
import { View } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import SkeletonBone from "./SkeletonBone";

// Mirrors DayScheduleCard's layout 1:1 so the loaded card never shifts size.
export default function ScheduleCardSkeleton() {
  const { colors, isDark } = useTheme();

  return (
    <View
      className="rounded-[20px] p-4 mb-2.5"
      style={{
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: "transparent",
        shadowColor: isDark ? "#000" : "#2C3E5B",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: isDark ? 0.25 : 0.06,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      <View className="flex-row items-center">
        <SkeletonBone
          width={44}
          height={44}
          borderRadius={12}
          style={{ marginRight: 14 }}
        />
        <View className="flex-1" style={{ gap: 6 }}>
          <SkeletonBone width={90} height={17} borderRadius={6} />
          <SkeletonBone width={70} height={13} borderRadius={6} />
          <View className="flex-row items-center gap-3">
            <SkeletonBone width={50} height={13} borderRadius={6} />
            <SkeletonBone width={80} height={13} borderRadius={6} />
          </View>
        </View>
      </View>
    </View>
  );
}
