"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useProviderMode } from "@/contexts/ProviderModeContext";
import LogoutConfirmModal from "@/components/LogoutConfirmModal";
import LanguageChangeModal from "@/shared/components/profile/LanguageChangeModal";
import InfoModal from "@/shared/components/profile/InfoModal";
import PanelChangeAccordion from "@/shared/components/profile/PanelChangeAccordion";
import ProfileAvatarSection from "@/shared/components/profile/ProfileAvatarSection";
import AccountSettings from "@/shared/components/profile/AccountSettings";
import Preferences from "@/shared/components/profile/Preferences";
import { Loader2, LogOut } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { ConditionalBottomNav, Header } from "@/shared/components";

type ProfileField = {
  label: string;
  value: string;
};

type InfoFormState = {
  name: string;
  phoneNumber: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading, isProfileUpdating, isAuthenticated, updateProfile, logout } = useAuth();
  const t = useTranslations();
  const locale = useLocale();
  const { providerMode, setProviderMode } = useProviderMode();

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [infoSaveError, setInfoSaveError] = useState("");
  const [infoForm, setInfoForm] = useState<InfoFormState>({
    name: "",
    phoneNumber: "",
  });
  const [selectedShopId] = useState<string | null>(() => typeof window !== 'undefined'
    ? window.localStorage.getItem("selected_shop_id") : null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, router, isAuthenticated]);

  const profileFields = useMemo<ProfileField[]>(() => {
    if (!user) return [];

    return [{ label: t("profile.field.role"), value: user.role }];
  }, [t, user]);

  const memberSince = user?.createdAt
    ? `${t("profile.memberSince")} ${new Date(
      user.createdAt,
    ).toLocaleDateString(locale, {
      month: "numeric",
      year: "numeric",
      day: "numeric",
    })}`
    : t("profile.memberSinceUnknown");

  const initials = (() => {
    if (!user?.name) return "U";

    const parts = user.name.split(" ").filter(Boolean);
    if (parts.length === 1) return parts[0][0]?.toUpperCase() || "U";

    return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
  })();

  const isAdmin = user?.role === "ADMIN";

  const visibleAdminShops = useMemo(() => {
    if (!providerMode || !selectedShopId) return user?.shops ?? [];
    return user?.shops?.filter((shop) => shop.id !== selectedShopId) ?? [];
  }, [user, providerMode, selectedShopId]);

  const handleSaveImage = async () => {
    if (!user || !file || isLoading || isProfileUpdating) return;

    await updateProfile({ file });

    setFile(null);
    setPreview(null);
  };

  const handleSavePersonalInfo = async () => {
    if (!user || isProfileUpdating || isLoading) return;

    setInfoSaveError("");

    try {
      await updateProfile({
        name: infoForm.name.trim(),
        phoneNumber: infoForm.phoneNumber.trim(),
      });
    } catch (error) {
      setInfoSaveError(
        error instanceof Error
          ? error.message
          : "Ma'lumotlarni saqlashda xatolik yuz berdi",
      );
    }
  };

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();

      setFile(e.target.files[0]);

      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };

      reader.readAsDataURL(e.target.files[0]);
    } else {
      setFile(null);
      setPreview(null);
    }
  }

  const handleLogoutConfirm = () => {
    logout();
    router.replace("/login");
  }

  if (!user || isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-700">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium shadow-sm">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>{t("common.loading")}</span>
        </div>
      </main>
    );
  }

  return (
    <div className="flex-1 bg-slate-50">
      <Header />

      <main className="h-full pt-6 overflow-y-auto relative pb-20">
        <div
          className="mx-auto w-full px-3 sm:px-6"
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleChangeFile}
            className="hidden"
            id="profile-image-input"
          />

          <section className="relative border-slate-200 pb-6 text-center dark:border-white/10">
            <ProfileAvatarSection
              user={user}
              preview={preview}
              isLoading={isLoading}
              initials={initials}
              memberSince={memberSince}
              providerMode={providerMode}
              setPreview={setPreview}
              handleSaveImage={handleSaveImage}
              isImageUpdating={isProfileUpdating}
              setFile={setFile}
            />
          </section>

          <PanelChangeAccordion
            isAdmin={isAdmin}
            providerMode={providerMode}
            setProviderMode={setProviderMode}
            visibleAdminShops={visibleAdminShops}
            isLoadingShops={isLoading}
          />

          <section className="mb-6">
            <AccountSettings setIsInfoModalOpen={setIsInfoModalOpen} />
          </section>

          <section className="mb-8">
            <Preferences setIsLanguageModalOpen={setIsLanguageModalOpen} />
          </section>

          <button
            type="button"
            onClick={() => setIsLogoutConfirmOpen(true)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-400 bg-white py-3 font-semibold text-red-400 transition hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            {t("profile.logout")}
          </button>
        </div>

        {isInfoModalOpen && (
          <InfoModal
            setIsOpen={setIsInfoModalOpen}
            setIsEditingInfo={setIsEditingInfo}
            setInfoSaveError={setInfoSaveError}
            handleSavePersonalInfo={handleSavePersonalInfo}
            setInfoForm={setInfoForm}
            isOpen={isInfoModalOpen}
            isSavingInfo={isProfileUpdating}
            user={user}
            infoForm={infoForm}
            isEditingInfo={isEditingInfo}
            infoSaveError={infoSaveError}
            profileFields={profileFields} />
        )}

        <LanguageChangeModal
          isOpen={isLanguageModalOpen}
          setIsOpen={setIsLanguageModalOpen} />

        <LogoutConfirmModal
          isOpen={isLogoutConfirmOpen}
          setIsOpen={setIsLogoutConfirmOpen}
          onConfirm={handleLogoutConfirm} />
      </main>

      <ConditionalBottomNav />
    </div>
  );
}
