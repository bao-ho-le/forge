import React, { createContext, useContext, useMemo } from "react";
import { useLanguage, LanguageCode } from "../../hooks/useLanguage";
import type { Translations } from "../../locales/vi";

type LanguageContextType = {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: keyof Translations) => string;
  loaded: boolean;
};

const LanguageContext = createContext<LanguageContextType>({
  language: "vi",
  setLanguage: () => {},
  t: (key) => key,
  loaded: true,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { language, setLanguage, t, loaded } = useLanguage();

  const value = useMemo(
    () => ({ language, setLanguage, t, loaded }),
    [language, setLanguage, t, loaded]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  return useContext(LanguageContext);
}
