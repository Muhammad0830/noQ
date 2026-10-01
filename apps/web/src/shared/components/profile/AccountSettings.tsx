import React from "react";
import ProfileRow from "./ProfileRow";
import { CreditCard, Shield, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function AccountSettings({
  setIsInfoModalOpen,
}: {
  setIsInfoModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const t = useTranslations();
  const router = useRouter();

  return (
    <>
      <p className="text-base font-semibold text-slate-900">
        {t("profile.accountSettings")}
      </p>

      <div className="overflow-hidden rounded-2xl border border-[#f1c894] bg-white shadow-sm">
        <ProfileRow
          icon={<User className="h-4 w-4" />}
          title={t("profile.personalInfo")}
          subtitle={t("profile.personalInfoSubtitle")}
          onClick={() => setIsInfoModalOpen(true)}
        />

        <ProfileRow
          icon={<Shield className="h-4 w-4" />}
          title={t("profile.security")}
          subtitle={t("profile.securitySubtitle")}
          onClick={() => router.push("/profile/security")}
          bordered
        />

        <ProfileRow
          icon={<CreditCard className="h-4 w-4" />}
          title={t("profile.paymentMethods")}
          subtitle={t("profile.paymentMethodsSubtitle")}
          onClick={() => router.push("/profile/payments")}
          bordered
        />
      </div>
    </>
  );
}
