import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@discipline_schedule_view_mode";

export type ScheduleViewMode = "rolling" | "weekStart" | "grouped";

const VALID_MODES: ScheduleViewMode[] = ["rolling", "weekStart", "grouped"];

export function useScheduleViewMode() {
  const [viewMode, setViewModeState] = useState<ScheduleViewMode>("rolling");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored && VALID_MODES.includes(stored as ScheduleViewMode)) {
        setViewModeState(stored as ScheduleViewMode);
      }
      setLoaded(true);
    });
  }, []);

  const setViewMode = useCallback((mode: ScheduleViewMode) => {
    setViewModeState(mode);
    AsyncStorage.setItem(STORAGE_KEY, mode);
  }, []);

  return { viewMode, setViewMode, loaded };
}
