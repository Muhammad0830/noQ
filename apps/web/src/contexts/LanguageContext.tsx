"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { Language } from "@shared/types/general_types";
import { I18nextProvider } from "react-i18next";
import i18n from "@/i18n";
import { translations } from "@/lib/translations";

type TranslationParams = Record<string, string | number>;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  locale: string;
  t: (key: string, params?: TranslationParams) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

const supportedLanguages: Language[] = ["uz-latn", "uz-cyrl", "ru"];
const fallbackLanguage: Language = "uz-latn";

const localeByLanguage: Record<Language, string> = {
  "uz-latn": "uz-UZ",
  "uz-cyrl": "uz-Cyrl-UZ",
  ru: "ru-RU",
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("uz-latn");
  const [mounted, setMounted] = useState(false);
  const [, setI18nTick] = useState(0);

  // ✅ mount bo‘lishini kutamiz
  useEffect(() => {
    // eslint-disable-next-line
    setMounted(true);
  }, []);

  // ✅ localStorage + i18n sync
  useEffect(() => {
    const savedLang = localStorage.getItem("language") as Language | null;

    if (savedLang && supportedLanguages.includes(savedLang)) {
      // eslint-disable-next-line
      setLanguageState(savedLang);
      if (i18n.language !== savedLang) {
        void i18n.changeLanguage(savedLang);
      }
    } else {
      const current = i18n.language as Language;
      if (supportedLanguages.includes(current)) {
        setLanguageState(current);
      }
    }
  }, []);

  // ✅ i18n eventlar
  useEffect(() => {
    const onLanguageChanged = (lng: string) => {
      if (supportedLanguages.includes(lng as Language)) {
        setLanguageState(lng as Language);
      }
    };

    const onI18nReady = () => {
      setI18nTick((prev) => prev + 1);
    };

    i18n.on("languageChanged", onLanguageChanged);
    i18n.on("initialized", onI18nReady);
    i18n.on("loaded", onI18nReady);

    return () => {
      i18n.off("languageChanged", onLanguageChanged);
      i18n.off("initialized", onI18nReady);
      i18n.off("loaded", onI18nReady);
    };
  }, []);

  // ✅ html lang sync
  useEffect(() => {
    const htmlLangMap: Record<Language, string> = {
      "uz-latn": "uz-Latn",
      "uz-cyrl": "uz-Cyrl",
      ru: "ru",
    };

    document.documentElement.lang = htmlLangMap[language];
  }, [language]);

  const setLanguage = (lang: Language) => {
    localStorage.setItem("language", lang);
    void i18n.changeLanguage(lang);
    setLanguageState(lang);
  };

  const t = (key: string, params?: TranslationParams): string => {
    const message = i18n.t(
      key,
      params as Record<string, string | number> | undefined,
    );

    if (typeof message === "string" && message !== key) {
      return message;
    }

    const dictionaryMessage =
      translations[language]?.[key] ??
      translations[fallbackLanguage]?.[key] ??
      key;

    if (!params) return dictionaryMessage;

    return Object.entries(params).reduce((acc, [paramKey, paramValue]) => {
      const pattern = new RegExp(`{{\\s*${paramKey}\\s*}}`, "g");
      return acc.replace(pattern, String(paramValue));
    }, dictionaryMessage);
  };

  const locale = localeByLanguage[language];

  // ❗ ENG MUHIM QATOR
  if (!mounted) return null;

  return (
    <I18nextProvider i18n={i18n}>
      <LanguageContext.Provider value={{ language, setLanguage, locale, t }}>
        {children}
      </LanguageContext.Provider>
    </I18nextProvider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
