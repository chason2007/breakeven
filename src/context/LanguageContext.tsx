"use client";

import React, { createContext, useContext, useEffect, useSyncExternalStore } from "react";
import { DICTIONARY, type Language } from "@/lib/i18n";

interface LanguageContextType {
  lang: Language;
  dir: "ltr" | "rtl";
  isArabic: boolean;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: typeof DICTIONARY["en"];
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  dir: "ltr",
  isArabic: false,
  setLang: () => {},
  toggleLang: () => {},
  t: DICTIONARY.en,
});

const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  const onStorage = (e: StorageEvent) => {
    if (e.key === "breakeven_lang") {
      callback();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot(): Language {
  try {
    const saved = localStorage.getItem("breakeven_lang");
    if (saved === "ar" || saved === "en") return saved;
  } catch {
    // ignore
  }
  return "en";
}

function getServerSnapshot(): Language {
  return "en";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const lang = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Synchronize document dir and lang attribute
  useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (next: Language) => {
    try {
      localStorage.setItem("breakeven_lang", next);
    } catch {
      // ignore
    }
    document.documentElement.dir = next === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = next;
    listeners.forEach((listener) => listener());
  };

  const toggleLang = () => {
    setLang(lang === "en" ? "ar" : "en");
  };

  const dir = lang === "ar" ? "rtl" : "ltr";
  const isArabic = lang === "ar";
  const t = DICTIONARY[lang];

  return (
    <LanguageContext.Provider value={{ lang, dir, isArabic, setLang, toggleLang, t }}>
      <div dir={dir} className={isArabic ? "font-sans" : ""}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
