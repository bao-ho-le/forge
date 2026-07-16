import React from "react";
import { View } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import SkeletonBone from "./SkeletonBone";

// Mirrors RecoveryCard's layout 1:1 so the loaded card never shifts size.
export default function RecoveryCardSkeleton() {
  const { colors } = useTheme();

  return (
    <View
      className="rounded-[20px] p-[18px] mt-2 mb-4"
      style={{
        backgroundColor: colors.surfaceSecondary,
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
          <SkeletonBone width="60%" height={17} borderRadius={6} />
          <SkeletonBone width="85%" height={13} borderRadius={6} />
        </View>
        <SkeletonBone width={32} height={32} borderRadius={16} style={{ marginLeft: 12 }} />
      </View>
    </View>
  );
}
