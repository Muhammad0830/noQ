"use client";

import { useEffect, useState } from "react";
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
import { useTranslations } from "next-intl";
import { ConditionalBottomNav, Header } from "@/shared/components";

export default function ProfilePage() {
  const router = useRouter();
  const t = useTranslations();

  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const { providerMode, setProviderMode } = useProviderMode();

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  const [selectedShopId] = useState<string | null>(() => typeof window !== 'undefined'
    ? window.localStorage.getItem("selected_shop_id") : null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, router, isAuthenticated]);

  const visibleAdminShops = !providerMode || !selectedShopId
    ? user?.shops ?? []
    : user?.shops?.filter((shop) => shop.id !== selectedShopId) ?? []

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
    setIsLogoutConfirmOpen(false);
    router.replace("/login");
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-700">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium shadow-sm">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>{t("common.loading")}</span>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-700">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium shadow-sm">
          <span>{t("common.userNotFound")}</span>
        </div>
      </main>
    );
  }

  return (
    <div className="flex-1 bg-slate-50">
      <Header />

      <main className="h-full pt-6 overflow-y-auto relative pb-20 mx-auto w-full px-3 sm:px-6">
        <section className="relative border-slate-200 pb-6 text-center dark:border-white/10">
          <ProfileAvatarSection
            user={user}
            preview={preview}
            providerMode={providerMode}
            file={file}
            setPreview={setPreview}
            setFile={setFile}
            handleChangeFile={handleChangeFile}
          />
        </section>

        <PanelChangeAccordion
          isAdmin={user?.role === "ADMIN"}
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
      </main>

      {isInfoModalOpen && (
        <InfoModal
          setIsOpen={setIsInfoModalOpen}
          isOpen={isInfoModalOpen}
          user={user} />
      )}

      <LanguageChangeModal
        isOpen={isLanguageModalOpen}
        setIsOpen={setIsLanguageModalOpen} />

      <LogoutConfirmModal
        isOpen={isLogoutConfirmOpen}
        setIsOpen={setIsLogoutConfirmOpen}
        onConfirm={handleLogoutConfirm} />

      <ConditionalBottomNav />
    </div>
  );
}
