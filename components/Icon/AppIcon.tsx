import React from "react";
import Svg, { Path, Circle, Rect, Line, G, Text as SvgText } from "react-native-svg";
import { useTheme } from "../../contexts/ThemeContext";

export type IconName =
  | "dumbbell"
  | "clock"
  | "mapPin"
  | "mapPinOff"
  | "calendar"
  | "calendarDate"
  | "lightning"
  | "refresh"
  | "shieldAlert"
  | "shieldRecovery"
  | "home"
  | "user"
  | "moon"
  | "sun"
  | "arrowRight"
  | "arrowUp"
  | "play"
  | "plusCircle"
  | "mail"
  | "creditCard"
  | "crown"
  | "lock"
  | "globe"
  | "edit"
  | "shield"
  | "logOut"
  | "bell"
  | "chevronLeft"
  | "chevronRight"
  | "music"
  | "image"
  | "camera"
  | "gameController"
  | "checkCircle"
  | "check"
  | "calendarEmpty"
  | "chevronDown"
  | "eye"
  | "eyeOff"
  | "ruler"
  | "search";

type AppIconProps = {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
  dateNumber?: number;
};

type IconComponentProps = {
  color: string;
  strokeWidth: number;
  dateNumber?: number;
};

const DEFAULT_SIZE = 24;
const DEFAULT_STROKE = 2;

function strokeProps(strokeWidth?: number) {
  return {
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: strokeWidth ?? DEFAULT_STROKE,
  };
}

function Dumbbell({ color, strokeWidth }: IconComponentProps) {
  const sp = strokeProps(strokeWidth);
  return (
    <G fill="none" {...sp} stroke={color}>
      <Path d="M14.4 14.4 9.6 9.6" />
      <Path d="M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z" />
      <Path d="m21.5 21.5-1.4-1.4" />
      <Path d="M3.9 3.9 2.5 2.5" />
      <Path d="M6.404 12.768a2 2 0 1 1-2.829-2.829l1.768-1.767a2 2 0 1 1-2.828-2.829l2.828-2.828a2 2 0 1 1 2.829 2.828l1.767-1.768a2 2 0 1 1 2.829 2.829z" />
    </G>
  );
}

function Clock({ color, strokeWidth }: IconComponentProps) {
  const sp = strokeProps(strokeWidth);
  return (
    <G fill="none" {...sp} stroke={color}>
      <Circle cx="12" cy="12" r="10" />
      <Line x1="12" y1="6" x2="12" y2="12" />
      <Line x1="12" y1="12" x2="16" y2="14" />
    </G>
  );
}

function MapPin({ color, strokeWidth }: IconComponentProps) {
  const sp = strokeProps(strokeWidth);
  return (
    <G fill="none" {...sp} stroke={color}>
      <Path d="M12 3C8.13 3 5 6.13 5 10c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
      <Circle cx="12" cy="10" r="3" />
    </G>
  );
}

function MapPinOff({ color, strokeWidth }: IconComponentProps) {
  const sp = strokeProps(strokeWidth);
  return (
    <G fill="none" {...sp} stroke={color}>
      <Path d="M12 3C8.13 3 5 6.13 5 10c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
      <Circle cx="12" cy="10" r="3" />
      <Line x1="3" y1="3" x2="21" y2="21" />
    </G>
  );
}

function Calendar({ color, strokeWidth }: IconComponentProps) {
  const sp = strokeProps(strokeWidth);
  return (
    <G fill="none" {...sp} stroke={color}>
      <Rect x="3" y="5" width="18" height="17" rx="2" />
      <Line x1="3" y1="10" x2="21" y2="10" />
      <Line x1="8" y1="2" x2="8" y2="6" />
      <Line x1="16" y1="2" x2="16" y2="6" />
    </G>
  );
}

function CalendarDate({ color, strokeWidth, dateNumber }: IconComponentProps) {
  const sp = strokeProps(strokeWidth);
  const date = dateNumber ?? 16;
  return (
    <G fill="none" {...sp} stroke={color}>
      <Rect x="3" y="4" width="18" height="18" rx="2" />
      <Line x1="3" y1="9" x2="21" y2="9" />
      <Line x1="8" y1="1" x2="8" y2="5" />
      <Line x1="16" y1="1" x2="16" y2="5" />
      <SvgText
        x="12"
        y="20"
        textAnchor="middle"
        fontSize={13}
        fontWeight="800"
        fill={color}
        stroke="none"
      >
        {date}
      </SvgText>
    </G>
  );
}

function Lightning({ color, strokeWidth }: IconComponentProps) {
  const sp = strokeProps(strokeWidth);
  return (
    <G fill="none" {...sp} stroke={color}>
      <Path d="M13 2L8 12h5l-2 10 7-12h-5z" />
    </G>
  );
}

function ShieldAlert({ color, strokeWidth }: IconComponentProps) {
  const sp = strokeProps(strokeWidth);
  return (
    <G fill="none" {...sp} stroke={color}>
      <Path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <Path d="M12 8v4" />
      <Path d="M12 16h.01" />
    </G>
  );
}

function ShieldRecovery({ color, strokeWidth }: IconComponentProps) {
  const { colors } = useTheme();
  const sp = strokeProps(strokeWidth);
  const sw = strokeWidth ?? DEFAULT_STROKE;
  return (
    <G>
      {/* Shield outline + crack */}
      <G fill="none" {...sp} stroke={color}>
        <Path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
        <Path d="M10 8 13 11 10.5 13 14 17" strokeWidth={sw * 0.85} />
      </G>
      {/* Recovery badge - filled, "cut out" against the app background like the lock badge */}
      <Circle
        cx="18"
        cy="18"
        r="6.3"
        fill={color}
        stroke={colors.background}
        strokeWidth={1.3}
      />
      <G
        fill="none"
        stroke={colors.background}
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(13.2,13.2) scale(0.4)"
      >
        <Path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <Path d="M3 3v5h5" />
      </G>
    </G>
  );
}

function Home({ color, strokeWidth }: IconComponentProps) {
  const sp = strokeProps(strokeWidth);
  return (
    <G fill="none" {...sp} stroke={color}>
      <Path d="M3 10l9-8 9 8v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <Path d="M9 22V14h6v8" />
    </G>
  );
}

function User({ color, strokeWidth }: IconComponentProps) {
  const sp = strokeProps(strokeWidth);
  return (
    <G fill="none" {...sp} stroke={color}>
      <Circle cx="12" cy="7" r="4" />
      <Path d="M4 22c0-4.42 3.58-8 8-8s8 3.58 8 8" />
    </G>
  );
}

function Moon({ color, strokeWidth }: IconComponentProps) {
  const sp = strokeProps(strokeWidth);
  return (
    <G fill="none" {...sp} stroke={color}>
      <Path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </G>
  );
}

function Sun({ color, strokeWidth }: IconComponentProps) {
  const sp = strokeProps(strokeWidth);
  return (
    <G fill="none" {...sp} stroke={color}>
      <Circle cx="12" cy="12" r="5" />
      <Line x1="12" y1="1" x2="12" y2="3" />
      <Line x1="12" y1="21" x2="12" y2="23" />
      <Line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <Line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <Line x1="1" y1="12" x2="3" y2="12" />
      <Line x1="21" y1="12" x2="23" y2="12" />
      <Line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <Line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </G>
  );
}

function ArrowRight({ color, strokeWidth }: IconComponentProps) {
  const sp = strokeProps(strokeWidth);
  return (
    <G fill="none" {...sp} stroke={color}>
      <Line x1="5" y1="12" x2="19" y2="12" />
      <Path d="M13 6 L19 12 L13 18" />
    </G>
  );
}

function ArrowUp({ color, strokeWidth }: IconComponentProps) {
  const sp = strokeProps(strokeWidth);
  return (
    <G fill="none" {...sp} stroke={color}>
      <Circle cx="12" cy="12" r="10" />
      <Line x1="12" y1="15.5" x2="12" y2="8.5" />
      <Path d="M8.5 12 L12 8.5 L15.5 12" />
    </G>
  );
}

function Play({ color, strokeWidth }: IconComponentProps) {
  const sp = strokeProps(strokeWidth);
  return (
    <G {...sp} stroke={color}>
      <Path d="M6 4l14 8-14 8z" fill={color} />
    </G>
  );
}

function PlusCircle({ color, strokeWidth }: IconComponentProps) {
  const sp = strokeProps(strokeWidth);
  return (
    <G fill="none" {...sp} stroke={color}>
      <Circle cx="12" cy="12" r="10" />
      <Line x1="12" y1="8" x2="12" y2="16" />
      <Line x1="8" y1="12" x2="16" y2="12" />
    </G>
  );
}

function Mail({ color, strokeWidth }: IconComponentProps) {
  const sp = strokeProps(strokeWidth);
  return (
    <G fill="none" {...sp} stroke={color}>
      <Rect x="2" y="5" width="20" height="14" rx="2" />
      <Path d="M2 7l10 7 10-7" />
    </G>
  );
}

function CreditCard({ color, strokeWidth }: IconComponentProps) {
  const sp = strokeProps(strokeWidth);
  return (
    <G fill="none" {...sp} stroke={color}>
      <Rect x="1" y="5" width="22" height="14" rx="2" />
      <Line x1="1" y1="10" x2="23" y2="10" />
    </G>
  );
}

function Crown({ color, strokeWidth }: IconComponentProps) {
  const sp = strokeProps(strokeWidth);
  return (
    <G fill="none" {...sp} stroke={color}>
      <Path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z" />
      <Path d="M5 21h14" />
    </G>
  );
}

function Lock({ color, strokeWidth }: IconComponentProps) {
  const sp = strokeProps(strokeWidth);
  return (
    <G fill="none" {...sp} stroke={color}>
      <Rect x="5" y="11" width="14" height="10" rx="2" />
      <Path d="M8 11V7a4 4 0 018 0v4" />
    </G>
  );
}

function Globe({ color, strokeWidth }: IconComponentProps) {
  const sp = strokeProps(strokeWidth);
  return (
    <G fill="none" {...sp} stroke={color}>
      <Circle cx="12" cy="12" r="10" />
      <Path d="M2 12h20" />
      <Path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10A15.3 15.3 0 0112 2z" />
    </G>
  );
}

function Edit({ color, strokeWidth }: IconComponentProps) {
  const sp = strokeProps(strokeWidth);
  return (
    <G fill="none" {...sp} stroke={color}>
      <Path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
    </G>
  );
}

function Shield({ color, strokeWidth }: IconComponentProps) {
  const sp = strokeProps(strokeWidth);
  return (
    <G fill="none" {...sp} stroke={color}>
      <Path d="M12 2L4 5v8c0 5.25 8 9 8 9s8-3.75 8-9V5l-8-3z" />
    </G>
  );
}

function LogOut({ color, strokeWidth }: IconComponentProps) {
  const sp = strokeProps(strokeWidth);
  return (
    <G fill="none" {...sp} stroke={color}>
      <Path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
      <Path d="M16 17l5-5-5-5" />
      <Line x1="21" y1="12" x2="9" y2="12" />
    </G>
  );
}

function Bell({ color, strokeWidth }: IconComponentProps) {
  const sp = strokeProps(strokeWidth);
  return (
    <G fill="none" {...sp} stroke={color}>
      <Path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <Path d="M13.73 21a2 2 0 01-3.46 0" />
    </G>
  );
}

function ChevronLeft({ color, strokeWidth }: IconComponentProps) {
  const sp = strokeProps(strokeWidth);
  return (
    <G fill="none" {...sp} stroke={color}>
      <Path d="M15 18l-6-6 6-6" />
    </G>
  );
}

function ChevronRight({ color, strokeWidth }: IconComponentProps) {
  const sp = strokeProps(strokeWidth);
  return (
    <G fill="none" {...sp} stroke={color}>
      <Path d="M9 18l6-6-6-6" />
    </G>
  );
}

function ChevronDown({ color, strokeWidth }: IconComponentProps) {
  const sp = strokeProps(strokeWidth);
  return (
    <G fill="none" {...sp} stroke={color}>
      <Path d="M6 9l6 6 6-6" />
    </G>
  );
}

function Music({ color, strokeWidth }: IconComponentProps) {
  const sp = strokeProps(strokeWidth);
  return (
    <G fill="none" {...sp} stroke={color}>
      <Path d="M9 18V5l12-2v13" />
      <Circle cx="6" cy="18" r="3" />
      <Circle cx="18" cy="16" r="3" />
    </G>
  );
}

function Image({ color, strokeWidth }: IconComponentProps) {
  const sp = strokeProps(strokeWidth);
  return (
    <G fill="none" {...sp} stroke={color}>
      <Rect x="3" y="3" width="18" height="18" rx="2" />
      <Circle cx="8.5" cy="8.5" r="1.5" />
      <Path d="M21 15l-5-5L5 21" />
    </G>
  );
}

function Camera({ color, strokeWidth }: IconComponentProps) {
  const sp = strokeProps(strokeWidth);
  return (
    <G fill="none" {...sp} stroke={color}>
      <Rect x="2" y="5" width="20" height="16" rx="3" />
      <Path d="M8 5 L9 3 L15 3 L16 5" />
      <Circle cx="12" cy="13" r="4" />
    </G>
  );
}

function GameController({ color, strokeWidth }: IconComponentProps) {
  const sp = strokeProps(strokeWidth);
  return (
    <G fill="none" {...sp} stroke={color}>
      <Path d="M6 12h4" />
      <Path d="M8 10v4" />
      <Rect x="2" y="7" width="20" height="10" rx="3" />
      <Circle cx="16" cy="12" r="2" />
      <Circle cx="19" cy="10" r="2" />
    </G>
  );
}

function CheckCircle({ color, strokeWidth }: IconComponentProps) {
  const sp = strokeProps(strokeWidth);
  return (
    <G fill="none" {...sp} stroke={color}>
      <Circle cx="12" cy="12" r="10" />
      <Path d="M8 12l3 3 5-5" />
    </G>
  );
}

function CalendarEmpty({ color, strokeWidth }: IconComponentProps) {
  const sp = strokeProps(strokeWidth);
  return (
    <G fill="none" {...sp} stroke={color}>
      <Rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <Line x1="16" y1="2" x2="16" y2="6" />
      <Line x1="8" y1="2" x2="8" y2="6" />
      <Line x1="3" y1="10" x2="21" y2="10" />
      <Line x1="9" y1="16" x2="15" y2="16" />
    </G>
  );
}

function Check({ color, strokeWidth }: IconComponentProps) {
  const sp = strokeProps(strokeWidth);
  return (
    <G fill="none" {...sp} stroke={color}>
      <Path d="M6 12l4 4 8-8" />
    </G>
  );
}

function Eye({ color, strokeWidth }: IconComponentProps) {
  const sp = strokeProps(strokeWidth);
  return (
    <G fill="none" {...sp} stroke={color}>
      <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <Circle cx="12" cy="12" r="3" />
    </G>
  );
}

function EyeOff({ color, strokeWidth }: IconComponentProps) {
  const sp = strokeProps(strokeWidth);
  return (
    <G fill="none" {...sp} stroke={color}>
      <Path d="M17.94 17.94A10.94 10.94 0 0112 20c-7 0-11-8-11-8a21.85 21.85 0 015.06-6.06" />
      <Path d="M9.9 4.24A10.94 10.94 0 0112 4c7 0 11 8 11 8a21.77 21.77 0 01-3.22 4.44" />
      <Path d="M14.12 14.12a3 3 0 11-4.24-4.24" />
      <Line x1="1" y1="1" x2="23" y2="23" />
    </G>
  );
}

function Ruler({ color, strokeWidth }: IconComponentProps) {
  const sp = strokeProps(strokeWidth);
  return (
    <G fill="none" {...sp} stroke={color}>
      <Path d="M3 8.5 8.5 3l12.5 12.5L16 21z" />
      <Path d="M7.5 8 9 6.5" />
      <Path d="M10.5 11 12 9.5" />
      <Path d="M13.5 14 15 12.5" />
      <Path d="M16.5 17 18 15.5" />
    </G>
  );
}

function Search({ color, strokeWidth }: IconComponentProps) {
  const sp = strokeProps(strokeWidth);
  return (
    <G fill="none" {...sp} stroke={color}>
      <Circle cx="11" cy="11" r="7" />
      <Path d="M21 21l-4.35-4.35" />
    </G>
  );
}

const ICON_MAP: Record<IconName, React.ComponentType<IconComponentProps>> = {
  dumbbell: Dumbbell,
  clock: Clock,
  mapPin: MapPin,
  mapPinOff: MapPinOff,
  calendar: Calendar,
  calendarDate: CalendarDate,
  lightning: Lightning,
  refresh: Lightning,
  shieldAlert: ShieldAlert,
  shieldRecovery: ShieldRecovery,
  home: Home,
  user: User,
  moon: Moon,
  sun: Sun,
  arrowRight: ArrowRight,
  arrowUp: ArrowUp,
  play: Play,
  plusCircle: PlusCircle,
  mail: Mail,
  creditCard: CreditCard,
  crown: Crown,
  lock: Lock,
  globe: Globe,
  edit: Edit,
  shield: Shield,
  logOut: LogOut,
  bell: Bell,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  chevronDown: ChevronDown,
  music: Music,
  image: Image,
  camera: Camera,
  gameController: GameController,
  checkCircle: CheckCircle,
  check: Check,
  calendarEmpty: CalendarEmpty,
  eye: Eye,
  eyeOff: EyeOff,
  ruler: Ruler,
  search: Search,
};

export default function AppIcon({ name, size = DEFAULT_SIZE, color = "#1C1C1E", strokeWidth, dateNumber }: AppIconProps) {
  const IconComponent = ICON_MAP[name];
  if (!IconComponent) return null;

  const sw = strokeWidth ?? Math.max(1.5, size / 12);

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <IconComponent color={color} strokeWidth={sw} dateNumber={dateNumber} />
    </Svg>
  );
}
