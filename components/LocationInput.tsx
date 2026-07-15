import React from "react";
import { View, TextInput } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { Typography } from "../constants/typography";

type LocationInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

export default function LocationInput({
  value,
  onChangeText,
  placeholder = "Enter gym address",
}: LocationInputProps) {
  const { colors } = useTheme();

  return (
    <View
      className="rounded-2xl px-4 py-0.5"
      style={{ backgroundColor: colors.surface }}
    >
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        className="py-3.5"
        style={[Typography.body, { color: colors.textPrimary }]}
      />
    </View>
  );
}
