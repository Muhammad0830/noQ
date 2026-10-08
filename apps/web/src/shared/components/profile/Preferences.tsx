import React from "react";
import ProfileRowButton from "./ProfileRowButton";
import { HelpCircle, Languages, Settings } from "lucide-react";
import platformConfig, { SupportedLocalesType } from "@/config/platform";
import { useLocale, useTranslations } from "use-intl";
import ProfileRowLink from "./ProfileRowLink";

export default function Preferences({
  setIsLanguageModalOpen,
}: {
  setIsLanguageModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const t = useTranslations();
  const locale = useLocale() as SupportedLocalesType;

  return (
    <>
      <p className="text-base font-semibold text-slate-900">
        {t("profile.appPreferences")}
      </p>

      <div className="overflow-hidden rounded-2xl border border-[#f1c894] bg-white shadow-sm">
        <ProfileRowLink
          icon={<Settings className="h-4 w-4" />}
          title={t("profile.settings")}
          subtitle={t("profile.settingsSubtitle")}
          href={"/settings"}
          bordered
        />

        <ProfileRowButton
          icon={<Languages className="h-4 w-4" />}
          title={t("profile.language")}
          subtitle={
            platformConfig.supportedLocales[locale] || t("profile.language")
          }
          trailing={
            <span className="text-xs font-medium text-slate-500">
              {t("profile.change")}
            </span>
          }
          onClick={() => setIsLanguageModalOpen(true)}
          bordered
        />

        <ProfileRowLink
          icon={<HelpCircle className="h-4 w-4" />}
          title={t("profile.helpSupport")}
          subtitle={t("profile.helpSupportSubtitle")}
          href="/profile/support"
          bordered
        />
      </div>
    </>
  );
}
