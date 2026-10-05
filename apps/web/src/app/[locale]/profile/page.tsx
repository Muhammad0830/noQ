"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useProviderMode } from "@/contexts/ProviderModeContext";
import useApiQuery from "@/hooks/useApiQuery";
import { API_ENDPOINTS } from "@/lib/api";
import LogoutConfirmModal from "@/components/LogoutConfirmModal";
import AdminSidebar from "@/components/AdminSidebar";
import { useAdminSidebar } from "@/hooks/useAdminSidebar";
import LanguageChangeModal from "@/shared/components/profile/LanguageChangeModal";
import InfoModal from "@/shared/components/profile/InfoModal";
import PanelChangeAccordion from "@/shared/components/profile/PanelChangeAccordion";
import ProfileAvatarSection from "@/shared/components/profile/ProfileAvatarSection";
import AccountSettings from "@/shared/components/profile/AccountSettings";
import Preferences from "@/shared/components/profile/Preferences";
import { Loader2, LogOut } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { SupportedLocalesType } from "@/config/platform";

type ProfileField = {
  label: string;
  value: string;
};

type InfoFormState = {
  name: string;
  phoneNumber: string;
};

type AdminShop = {
  id: string;
  name: string;
  address?: string;
  ownerId?: string;
  isOpen?: boolean;
  category?: { id: string; name: string; icon?: string };
};

type ShopsResponse =
  | AdminShop[]
  | {
      shops?: AdminShop[];
      data?: AdminShop[];
    };

export default function ProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading, updateProfile, logout } = useAuth();
  const t = useTranslations();
  const locale = useLocale();
  const { providerMode, setProviderMode } = useProviderMode();

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSavingImage, setIsSavingImage] = useState(false);

  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isSavingInfo, setIsSavingInfo] = useState(false);
  const [infoSaveError, setInfoSaveError] = useState("");
  const [selectedShopId, setSelectedShopId] = useState<string | null>(null);
  const [infoForm, setInfoForm] = useState<InfoFormState>({
    name: "",
    phoneNumber: "",
  });

  const shopId = searchParams.get("shopId");

  const {
    isSidebarVisible,
    isSidebarClosing,
    adminNavItems,
    openSidebar,
    closeSidebar,
    getAdminHrefWithShopId,
  } = useAdminSidebar(shopId);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setSelectedShopId(window.localStorage.getItem("selected_shop_id"));
  }, []);

  useEffect(() => {
    const handleToggleSidebar = () => {
      if (isSidebarVisible) {
        closeSidebar();
      } else {
        openSidebar();
      }
    };

    window.addEventListener("toggleAdminSidebar", handleToggleSidebar);
    return () => {
      window.removeEventListener("toggleAdminSidebar", handleToggleSidebar);
    };
  }, [isSidebarVisible, openSidebar, closeSidebar]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [isLoading, router, user]);

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  }, [file]);

  const profileFields = useMemo<ProfileField[]>(() => {
    if (!user) return [];

    return [{ label: t("profile.field.role"), value: user.role }];
  }, [t, user]);

  useEffect(() => {
    if (!isInfoModalOpen || !user) {
      return;
    }

    setInfoForm({
      name: user.name || "",
      phoneNumber: user.phoneNumber || "",
    });
    setIsEditingInfo(false);
    setInfoSaveError("");
  }, [isInfoModalOpen, user]);

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
  const { data: shopsResponse, isLoading: isLoadingShops } =
    useApiQuery<ShopsResponse>(isAdmin ? API_ENDPOINTS.shops : null, {
      key: ["admin-shops", user?.id || "guest"],
      enabled: Boolean(
        isAdmin && user?.id && !(user?.shops && user.shops.length > 0),
      ),
      staleTime: 30_000,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    });

  const adminShops = useMemo<AdminShop[]>(() => {
    if (!user?.id) return [];

    if (user.shops && user.shops.length > 0) {
      return user.shops.map((shop) => ({
        id: shop.id,
        name: shop.name,
        address: shop.address,
        ownerId: shop.ownerId,
        isOpen: shop.isOpen,
        category: shop.category,
      }));
    }

    if (!shopsResponse) return [];

    const shops = Array.isArray(shopsResponse)
      ? shopsResponse
      : Array.isArray(shopsResponse.shops)
        ? shopsResponse.shops
        : Array.isArray(shopsResponse.data)
          ? shopsResponse.data
          : [];

    return shops.filter((shop) => shop.ownerId === user.id);
  }, [shopsResponse, user?.id, user?.shops]);

  const visibleAdminShops = useMemo(() => {
    if (!providerMode || !selectedShopId) return adminShops;
    return adminShops.filter((shop) => shop.id !== selectedShopId);
  }, [adminShops, providerMode, selectedShopId]);

  if (!user && !isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-700">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium shadow-sm">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>{t("common.loading")}</span>
        </div>
      </main>
    );
  }

  const handleSaveImage = async () => {
    if (!user || !file || isSavingImage) return;

    setIsSavingImage(true);
    try {
      await updateProfile({
        name: user.name,
        phoneNumber: user.phoneNumber,
        file,
      });

      setFile(null);
      setPreview(null);
    } finally {
      setIsSavingImage(false);
    }
  };

  const handleSavePersonalInfo = async () => {
    if (!user || isSavingInfo) return;

    setInfoSaveError("");
    setIsSavingInfo(true);

    try {
      await updateProfile({
        name: infoForm.name.trim(),
        phoneNumber: infoForm.phoneNumber.trim(),
      });
      setIsEditingInfo(false);
    } catch (error) {
      setInfoSaveError(
        error instanceof Error
          ? error.message
          : "Ma'lumotlarni saqlashda xatolik yuz berdi",
      );
    } finally {
      setIsSavingInfo(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {isAdmin && (
        <AdminSidebar
          isVisible={isSidebarVisible}
          isClosing={isSidebarClosing}
          currentShopName={user?.name || "Profile"}
          adminNavItems={adminNavItems}
          onClose={closeSidebar}
          getAdminHrefWithShopId={getAdminHrefWithShopId}
        />
      )}

      <div
        className="mx-auto w-full px-3 pb-2.25 pt-8 sm:px-6"
        style={{ maxWidth: 650 }}
      >
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files) {
              setFile(e.target.files[0]);
            }
          }}
          className="hidden"
          id="profile-image-input"
        />

        <section className="relative mb-6 border-b border-slate-200 pb-6 text-center dark:border-white/10">
          <ProfileAvatarSection
            user={user}
            preview={preview}
            isLoading={isLoading}
            file={file}
            isSavingImage={isSavingImage}
            initials={initials}
            memberSince={memberSince}
            providerMode={providerMode}
            setPreview={setPreview}
            handleSaveImage={handleSaveImage}
            setFile={setFile}
          />
        </section>

        <PanelChangeAccordion
          isAdmin={isAdmin}
          providerMode={providerMode}
          setProviderMode={setProviderMode}
          visibleAdminShops={visibleAdminShops}
          isLoadingShops={isLoadingShops}
        />

        <section className="mb-6">
          <AccountSettings setIsInfoModalOpen={setIsInfoModalOpen} />
        </section>

        <section className="mb-8">
          <Preferences
            setIsLanguageModalOpen={setIsLanguageModalOpen}
          />
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
          setIsInfoModalOpen={setIsInfoModalOpen}
          setIsEditingInfo={setIsEditingInfo}
          setInfoSaveError={setInfoSaveError}
          handleSavePersonalInfo={handleSavePersonalInfo}
          setInfoForm={setInfoForm}
          isSavingInfo={isSavingInfo}
          user={user}
          infoForm={infoForm}
          isEditingInfo={isEditingInfo}
          infoSaveError={infoSaveError}
          profileFields={profileFields}
        />
      )}

      {isLanguageModalOpen && (
        <LanguageChangeModal setIsLanguageModalOpen={setIsLanguageModalOpen} />
      )}

      <LogoutConfirmModal
        open={isLogoutConfirmOpen}
        title={t("profile.logoutConfirmTitle")}
        message={t("profile.logoutConfirmMessage")}
        cancelText={t("profile.cancel")}
        confirmText={t("profile.logout")}
        onCancel={() => setIsLogoutConfirmOpen(false)}
        onConfirm={() => {
          logout();
          setIsLogoutConfirmOpen(false);
          router.replace("/login");
        }}
      />
    </main>
  );
}
