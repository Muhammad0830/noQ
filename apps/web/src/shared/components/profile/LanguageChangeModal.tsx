import React from "react";
import ModalShell from "./ModalShell";
import { useLanguage } from "@/contexts/LanguageContext";
import { Language } from "@shared/types/general_types";
import platformConfig from "@/config/platform";

interface Props {
  setIsLanguageModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function LanguageChangeModal({ setIsLanguageModalOpen }: Props) {
  const { language, setLanguage, t } = useLanguage();
  return (
    <ModalShell
      title={t("profile.languageModalTitle")}
      closeLabel={t("profile.closeModal")}
      onClose={() => setIsLanguageModalOpen(false)}
    >
      <div className="space-y-2">
        {Object.entries(platformConfig.supportedLocales).map(([key, value]) => {
          const isActive = key === language;

          return (
            <button
              key={key}
              type="button"
              onClick={() => {
                setLanguage(key as Language);
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
