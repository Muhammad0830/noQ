import React from "react";
import { CreditCard, Shield, User } from "lucide-react";
import { useTranslations } from "next-intl";
import ProfileRowButton from "./ProfileRowButton";
import ProfileRowLink from "./ProfileRowLink";

export default function AccountSettings({
  setIsInfoModalOpen,
}: {
  setIsInfoModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const t = useTranslations();

  return (
    <>
      <p className="text-base font-semibold text-slate-900">
        {t("profile.accountSettings")}
      </p>

      <div className="overflow-hidden rounded-2xl border border-[#f1c894] bg-white shadow-sm">
        <ProfileRowButton
          icon={<User className="h-4 w-4" />}
          title={t("profile.personalInfo")}
          subtitle={t("profile.personalInfoSubtitle")}
          onClick={() => setIsInfoModalOpen(true)}
          trailing={<span className="text-xs font-medium text-slate-500">{t('profile.personalInfoTrailing')}</span>}
        />

        <ProfileRowLink
          icon={<Shield className="h-4 w-4" />}
          title={t("profile.security")}
          subtitle={t("profile.securitySubtitle")}
          href="/profile/security"
          bordered
        />

        <ProfileRowLink
          icon={<CreditCard className="h-4 w-4" />}
          title={t("profile.paymentMethods")}
          subtitle={t("profile.paymentMethodsSubtitle")}
          href="/profile/payments"
          bordered
        />
      </div>
    </>
  );
}
