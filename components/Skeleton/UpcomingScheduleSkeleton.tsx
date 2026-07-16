import React from "react";
import { View } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import SkeletonBone from "./SkeletonBone";

// Mirrors the "Upcoming Schedule" section in HomeScreen: an overline title
// plus a surface card with two divided rows (day label + workout title).
export default function UpcomingScheduleSkeleton() {
  const { colors, isDark } = useTheme();

  return (
    <>
      <SkeletonBone
        width={140}
        height={12}
        borderRadius={4}
        style={{ marginBottom: 14 }}
      />
      <View
        className="rounded-[20px] px-4 py-1"
        style={{
          backgroundColor: colors.surface,
          shadowColor: isDark ? "#000" : "#2C3E5B",
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: isDark ? 0.25 : 0.06,
          shadowRadius: 8,
          elevation: 3,
        }}
      >
        {[0, 1].map((i) => (
          <View
            key={i}
            className="flex-row items-center py-3"
            style={{
              borderTopWidth: i === 0 ? 0 : 1,
              borderTopColor: colors.border,
            }}
          >
            <SkeletonBone
              width={48}
              height={16}
              borderRadius={6}
              style={{ marginRight: 12 }}
            />
            <SkeletonBone width={140} height={16} borderRadius={6} />
          </View>
        ))}
      </View>
    </>
  );
}
