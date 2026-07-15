import { router } from "expo-router";

export const TAB_ORDER = ["home", "calendar", "profile"] as const;

export type TabKey = (typeof TAB_ORDER)[number];

const TAB_ROUTES: Record<TabKey, string> = {
  home: "/",
  calendar: "/calendar",
  profile: "/profile",
};

export function navigateToTab(current: TabKey, target: TabKey) {
  const tabDirection =
    TAB_ORDER.indexOf(target) < TAB_ORDER.indexOf(current) ? "left" : "right";

  router.push({
    pathname: TAB_ROUTES[target],
    params: { tabDirection },
  });
}
