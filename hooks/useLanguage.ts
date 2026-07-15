import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import vi from "../locales/vi";
import en from "../locales/en";
import type { Translations } from "../locales/vi";

const STORAGE_KEY = "@discipline_language";
export type LanguageCode = "vi" | "en";

const translations: Record<LanguageCode, Translations> = { vi, en };

export function useLanguage() {
  const [language, setLanguageState] = useState<LanguageCode>("vi");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored === "en" || stored === "vi") {
        setLanguageState(stored);
      }
      setLoaded(true);
    });
  }, []);

  const setLanguage = useCallback((lang: LanguageCode) => {
    setLanguageState(lang);
    AsyncStorage.setItem(STORAGE_KEY, lang);
  }, []);

  const t = useCallback(
    (key: keyof Translations): string => {
      return translations[language][key] ?? key;
    },
    [language]
  );

  return { language, setLanguage, t, loaded };
}
