import React from "react";
import ModalShell from "./ModalShell";
import platformConfig, { SupportedLocalesType } from "@/config/platform";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

interface Props {
  setIsLanguageModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function LanguageChangeModal({ setIsLanguageModalOpen }: Props) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const changeLanguage = (newLocale: "uz-latn" | "uz-cyrl" | "ru") => {
    router.replace(pathname, {
      locale: newLocale,
    });
  };

  return (
    <ModalShell
      title={t("profile.languageModalTitle")}
      closeLabel={t("profile.closeModal")}
      onClose={() => setIsLanguageModalOpen(false)}
    >
      <div className="space-y-2">
        {Object.entries(platformConfig.supportedLocales).map(([key, value]) => {
          const isActive = key === locale;

          return (
            <button
              key={key}
              type="button"
              onClick={() => {
                changeLanguage(key as SupportedLocalesType);
                setIsLanguageModalOpen(false);
              }}
              className={`w-full rounded-xl border px-4 py-3 text-left text-sm font-medium transition ${
                isActive
                  ? "border-[#F49B33]/30 bg-[#fff3e6] text-[#F49B33]"
                  : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
              }`}
            >
              {value.toString()}
            </button>
          );
        })}
      </div>
    </ModalShell>
  );
}
