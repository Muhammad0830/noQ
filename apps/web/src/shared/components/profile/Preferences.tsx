import React from "react";
import ProfileRow from "./ProfileRow";
import { Bell, HelpCircle, Languages } from "lucide-react";
import { useRouter } from "next/navigation";
import platformConfig, { SupportedLocalesType } from "@/config/platform";
import { useLocale, useTranslations } from "use-intl";

export default function Preferences({
  setIsLanguageModalOpen,
}: {
  setIsLanguageModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const t = useTranslations();
  const locale = useLocale() as SupportedLocalesType;
  const router = useRouter();

  return (
    <>
      <p className="text-base font-semibold text-slate-900">
        {t("profile.appPreferences")}
      </p>

      <div className="overflow-hidden rounded-2xl border border-[#f1c894] bg-white shadow-sm">
        <ProfileRow
          icon={<Bell className="h-4 w-4" />}
          title={t("profile.notifications")}
          subtitle={t("profile.notificationsSubtitle")}
          onClick={() => router.push("/profile/notifications")}
          bordered
        />

        <ProfileRow
          icon={<Languages className="h-4 w-4" />}
          title={t("profile.language")}
          subtitle={
            platformConfig.supportedLocales[locale] || t("profile.language")
          }
          trailing={
            <span className="rounded-md px-2 py-1 text-xs font-medium text-slate-500">
              {t("profile.change")}
            </span>
          }
          onClick={() => setIsLanguageModalOpen(true)}
          bordered
        />

        <ProfileRow
          icon={<HelpCircle className="h-4 w-4" />}
          title={t("profile.helpSupport")}
          subtitle={t("profile.helpSupportSubtitle")}
          onClick={() => router.push("/profile/support")}
          bordered
        />
      </div>
    </>
  );
}
