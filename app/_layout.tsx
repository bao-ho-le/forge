import "../global.css";
import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { Stack, useRouter, useSegments } from "expo-router";
import type { RouteProp } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider, useTheme } from "../contexts/ThemeContext";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { LanguageProvider } from "../components/Localization/LanguageProvider";
import BottomTabBar from "../components/BottomTabBar";
import { navigateToTab, type TabKey } from "../constants/tabNavigation";

function getActiveTab(segments: string[]): TabKey | null {
  const first = segments[0];
  if (!first) return "home";
  if (first === "calendar") return "calendar";
  if (first === "profile") return "profile";
  return null;
}

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

function RootLayoutNav() {
  const { session, isLoading } = useAuth();
  const { colors } = useTheme();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!session && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (session && inAuthGroup) {
      router.replace("/");
    }
  }, [session, isLoading, segments, router]);

  if (isLoading) {
    return (
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: colors.background }}
      >
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  const activeTab = getActiveTab(segments as string[]);

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <Stack screenOptions={{ headerShown: false, animationDuration: 300 }}>
        <Stack.Screen name="(auth)" />
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

      {activeTab && (
        <BottomTabBar
          activeTab={activeTab}
          onTabPress={(tab) => navigateToTab(activeTab, tab)}
        />
      )}
    </View>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ThemeProvider>
          <LanguageProvider>
            <RootLayoutNav />
          </LanguageProvider>
        </ThemeProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
