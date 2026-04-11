"use client";

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { language, setLanguage } = useLanguage();

  const langs: Array<typeof language> = ["uz-latn", "uz-cyrl", "ru"];

  return (
    <details className={`relative ${className}`}>
      <summary
        className="list-none cursor-pointer rounded-md border px-2 py-1 text-xs bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600"
        aria-label="Change language"
      >
        {language === "uz-latn" ? "UZ" : language === "uz-cyrl" ? "ЎЗ" : "RU"}
      </summary>

      <div className="absolute right-0 z-50 mt-2 w-28 rounded-md border bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
        {langs.map((lng) => (
          <button
            key={lng}
            type="button"
            onClick={() => setLanguage(lng)}
            className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
              lng === language ? "font-semibold" : ""
            }`}
          >
            {lng === "uz-latn" ? "O'zbek (Latn)" : lng === "uz-cyrl" ? "Ўзбек (Кирил)" : "Русский"}
          </button>
        ))}
      </div>
    </details>
  );
}
