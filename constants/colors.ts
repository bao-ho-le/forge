export const Colors = {
  light: {
    background: "#EAE6DF",
    surface: "#FFFFFF",
    surfaceMuted: "#F2EDE8",
    border: "#D8D2C7",
    textPrimary: "#1C1C1E",
    textSecondary: "#6B6B68",

    primary: "#607E1B",
    onPrimary: "#FFFFFF",
    primaryContainer: "#E2E8D6",
    onPrimaryContainer: "#35450F",

    success: "#3F6B4A",
    successContainer: "#DCE1DA",
    warning: "#F03059",
    onWarning: "#FFFFFF",
    warningContainer: "#F6DFE4",
    premium: "#D9B34A",
    premiumText: "#4A3510",
    premiumContainer: "#E6E1D8",
    info: "#2F5D8A",
    infoContainer: "#D9DFE3",

    surfaceSecondary: "#EFEEEA",
  },
  dark: {
    background: "#0A0A0A",
    surface: "#201F20",
    surfaceMuted: "#2E2E30",
    border: "#333133",
    textPrimary: "#F5F5F4",
    textSecondary: "#9C9C99",

    primary: "#C6F135",
    onPrimary: "#14171A",
    primaryContainer: "#333B1D",

    success: "#6FA37D",
    successContainer: "#29322D",
    warning: "#FF4D6D",
    onWarning: "#FFFFFF",
    warningContainer: "#441D25",
    premium: "#E8C468",
    premiumText: "#3D2B0A",
    premiumContainer: "#38322C",
    info: "#7BA7D1",
    infoContainer: "#2B323B",

    surfaceSecondary: "#242426",
  },
} as const;

export type ThemeColors = (typeof Colors)[ThemeName];
export type ThemeName = "light" | "dark";
