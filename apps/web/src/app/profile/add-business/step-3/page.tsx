"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AddBusinessStepThreePlaceholderPage() {
  const router = useRouter();
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-[#f4f5f8] px-4 py-5 text-slate-900 dark:bg-[#211201] dark:text-white">
      <div className="mx-auto w-full" style={{ maxWidth: 540 }}>
        <header className="relative mb-6 flex items-center justify-center">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label={t("common.back")}
            className="absolute left-0 inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white/80"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-semibold">{t("newShop.step3.pageTitle")}</h1>
        </header>

        <div className="rounded-2xl border border-dashed border-[#F49B33]/50 bg-white p-5 text-center text-sm text-slate-600 dark:border-[#F49B33]/40 dark:bg-white/5 dark:text-white/70">
          {t("newShop.step3.placeholder")}
        </div>
      </div>
    </main>
  );
}
