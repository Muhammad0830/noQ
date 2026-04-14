"use client";

import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";

export default function SecurityPasswordPage() {
  const router = useRouter();
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-[#211201] px-4 py-6 text-white">
      <div className="mx-auto w-full" style={{ maxWidth: 650 }}>
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-4 rounded-md border border-white/15 px-3 py-1.5 text-sm text-white/90"
        >
          {t('common.back')}
        </button>

        <h1 className="text-xl font-semibold">{t('profile.paymentsPageTitle')}</h1>
        <p className="mt-2 text-sm text-white/70">
          {t('profile.paymentsPageDesc')}
        </p>
      </div>
    </main>
  );
}
