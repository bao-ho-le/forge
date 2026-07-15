import "../global.css";
import { Stack } from "expo-router";
import type { RouteProp } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "../contexts/ThemeContext";
import { LanguageProvider } from "../components/Localization/LanguageProvider";

function tabScreenOptions({ route }: { route: RouteProp<any> }) {
  const tabDirection = (route.params as { tabDirection?: string })
    ?.tabDirection;
  return {
    animation:
      tabDirection === "left"
        ? ("slide_from_left" as const)
        : ("slide_from_right" as const),
  };
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <LanguageProvider>
          <Stack screenOptions={{ headerShown: false, animationDuration: 300 }}>
            <Stack.Screen name="index" options={tabScreenOptions} />
            <Stack.Screen name="calendar" options={tabScreenOptions} />
            <Stack.Screen name="profile" options={tabScreenOptions} />
            <Stack.Screen name="discipline" />
            <Stack.Screen name="recovery-workout" />
            <Stack.Screen name="recovery-complete" />
            <Stack.Screen name="verify-workout" />
            <Stack.Screen name="edit-name" />
            <Stack.Screen name="edit-email" />
            <Stack.Screen name="payment-method" />
            <Stack.Screen name="subscription-plan" />
            <Stack.Screen name="account-security" />
            <Stack.Screen name="gym-location" />
            <Stack.Screen name="recovery-workout-settings" />
            <Stack.Screen name="locked-apps" />
          </Stack>
        </LanguageProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
