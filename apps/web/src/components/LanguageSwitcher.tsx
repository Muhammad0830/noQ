"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Languages } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

type LanguageCode = "uz-latn" | "uz-cyrl" | "ru";

export default function LanguageSwitcher({
  className = "",
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const options = useMemo(
    () =>
      [
        { code: "uz-latn", label: "O'zbek (Latn)", short: "UZ", flag: "🇺🇿" },
        { code: "uz-cyrl", label: "Ўзбек (Кирил)", short: "ЎЗ", flag: "🇺🇿" },
        { code: "ru", label: "Русский", short: "RU", flag: "🇷🇺" },
      ] as const,
    [],
  );

  const current = options.find((item) => item.code === language) ?? options[0];

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(event.target as Node)) setOpen(false);
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <div ref={rootRef} className={`relative inline-flex ${className}`}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Change language"
        onClick={() => setOpen((value) => !value)}
        className={`inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F49B33]/30 ${compact ? "h-10 px-2.5 text-xs" : "h-11 px-3 text-sm"}`}
      >
        <span className={`inline-flex items-center justify-center rounded-full bg-[#fff3e6] text-[#F49B33] ${compact ? "h-5 w-5" : "h-6 w-6"}`}>
          <Languages className={compact ? "h-3 w-3" : "h-3.5 w-3.5"} />
        </span>
        <span className="flex items-center gap-1.5">
          {!compact && <span className="text-base leading-none">{current.flag}</span>}
          <span className={compact ? "text-xs leading-none" : "hidden sm:inline"}>{current.short}</span>
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_60px_-20px_rgba(15,23,42,0.35)] ring-1 ring-black/5">
          <div className="p-2">
            {options.map((item) => {
              const isActive = item.code === language;

              return (
                <button
                  key={item.code}
                  type="button"
                  role="menuitemradio"
                  aria-checked={isActive}
                  onClick={() => {
                    setLanguage(item.code as LanguageCode);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition ${
                    isActive
                      ? "text-[#8a5620]"
                      : "text-slate-700 hover:text-slate-900"
                  }`}
                >
                  <span className="flex flex-col leading-tight">
                    <span className="text-sm font-medium">{item.label}</span>
                    <span className="text-xs text-slate-500">
                      {item.short}
                    </span>
                  </span>

                  <span className="flex h-5 w-5 items-center justify-center">
                    {isActive ? (
                      <Check className="h-4 w-4 text-[#F49B33]" />
                    ) : null}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
