import { router } from "expo-router";

export const TAB_ORDER = ["home", "calendar", "profile"] as const;

export type TabKey = (typeof TAB_ORDER)[number];

// Fixed height of BottomTabBar's own content (excludes safe-area inset,
// which callers must add separately via useSafeAreaInsets().bottom).
export const TAB_BAR_HEIGHT = 80;

const TAB_ROUTES: Record<TabKey, string> = {
  home: "/",
  calendar: "/calendar",
  profile: "/profile",
};

export function navigateToTab(current: TabKey, target: TabKey) {
  if (target === current) return;

  const tabDirection =
    TAB_ORDER.indexOf(target) < TAB_ORDER.indexOf(current) ? "left" : "right";

  router.push({
    pathname: TAB_ROUTES[target],
    params: { tabDirection },
  });
}
