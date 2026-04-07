"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Bell,
  Calendar,
  Camera,
  ChevronRight,
  CreditCard,
  HelpCircle,
  Languages,
  Loader2,
  LogOut,
  Moon,
  Pencil,
  Shield,
  Sun,
  User,
  X,
  Zap,
} from "lucide-react";
import type { Language } from "@shared/types/types";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Skeleton } from "@/components/ui/skeleton";
import { getImageUrl } from "@/lib/supabaseClient";

const LANGUAGES: { code: Language; label: string }[] = [
  { code: "uz-latn", label: "O'zbekcha" },
  { code: "uz-cyrl", label: "Kirilcha" },
  { code: "ru", label: "Russian" },
];

type ProfileField = {
  label: string;
  value: string;
};

type InfoFormState = {
  name: string;
  phoneNumber: string;
};

const LOCALE_BY_LANGUAGE: Record<Language, string> = {
  "uz-latn": "uz-UZ",
  "uz-cyrl": "uz-Cyrl-UZ",
  ru: "ru-RU",
};

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading, updateProfile, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSavingImage, setIsSavingImage] = useState(false);

  const [isProviderModeEnabled, setIsProviderModeEnabled] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isSavingInfo, setIsSavingInfo] = useState(false);
  const [infoSaveError, setInfoSaveError] = useState("");
  const [infoForm, setInfoForm] = useState<InfoFormState>({
    name: "",
    phoneNumber: "",
  });

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

  const activeLanguage =
    LANGUAGES.find((item) => item.code === language)?.label ||
    t("profile.language");

  const profileFields = useMemo<ProfileField[]>(() => {
    if (!user) return [];

    return [{ label: t("profile.field.role"), value: user.role }];
  }, [language, t, user]);

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
      ).toLocaleDateString(LOCALE_BY_LANGUAGE[language], {
        month: "short",
        year: "numeric",
      })}`
    : t("profile.memberSinceUnknown");

  const initials = (() => {
    if (!user?.name) return "U";

    const parts = user.name.split(" ").filter(Boolean);
    if (parts.length === 1) return parts[0][0]?.toUpperCase() || "U";

    return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
  })();

  if (!user && !isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-700 dark:bg-[#060912] dark:text-slate-200">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium shadow-sm dark:border-white/10 dark:bg-white/5">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>{t("common.loading")}</span>
        </div>
      </main>
    );
  }

  const profileImageUrl = user?.avatarUrl
    ? getImageUrl(user.avatarUrl, "user_avatars")
    : null;

  const showUserSkeleton = isLoading && !user;

  const handleSaveImage = async () => {
    if (!user || !file || isSavingImage) return;

    setIsSavingImage(true);
    try {
      await updateProfile({
        name: user.name,
        phoneNumber: user.phoneNumber,
        file,
      });

      // Hide Save/Cancel actions once upload succeeds.
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
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#060912] dark:text-white">
      <div className="mx-auto w-full max-w-162.5 px-3 pb-2.25 pt-4 sm:px-6">
        <header className="mb-6 flex items-center justify-between">
          {/* Theme toggle moved to settings section */}
        </header>

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
          <div className="relative mx-auto mb-4 inline-block">
            <div className="relative h-24 w-24 rounded-full p-0.5 ring-1 ring-[#00e6d0]/60">
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={preview}
                  alt="Profile preview"
                  className="h-full w-full rounded-full object-cover"
                />
              ) : showUserSkeleton ? (
                <Skeleton className="h-full w-full rounded-full" />
              ) : profileImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profileImageUrl}
                  alt={user?.name || "Profile image"}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-200 text-2xl font-bold text-slate-700 dark:bg-[#132235] dark:text-[#9ce9e2]">
                  {initials}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() =>
                document.getElementById("profile-image-input")?.click()
              }
              className="absolute bottom-0 right-0 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#0099ff] text-white shadow-lg transition hover:bg-blue-600 dark:bg-[#00d4ff] dark:text-slate-900 dark:hover:bg-[#00b8dd]"
              aria-label="Update profile image"
              title="Click to change profile image"
            >
              <Camera className="h-4 w-4" />
            </button>
          </div>

          {file && user && (
            <div className="mb-4 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={handleSaveImage}
                disabled={isSavingImage}
                className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-700 dark:bg-[#00e6d0] dark:text-slate-900 dark:hover:bg-[#00c4b0]"
              >
                {isSavingImage ? "Saving..." : "Save Image"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  setPreview(null);
                }}
                disabled={isSavingImage}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:border-white/20 dark:text-white/80 dark:hover:bg-white/10"
              >
                Cancel
              </button>
            </div>
          )}

          {showUserSkeleton ? (
            <div className="space-y-2">
              <Skeleton className="mx-auto h-9 w-52 rounded-md" />
              <Skeleton className="mx-auto h-4 w-40 rounded-md" />
            </div>
          ) : (
            <>
              <h2 className="text-3xl font-semibold leading-tight text-slate-900 dark:text-white">
                {user?.name}
              </h2>
              <p className="mt-1 text-sm font-medium text-teal-600 dark:text-[#00e6d0]">
                {memberSince}
              </p>
            </>
          )}
        </section>

        <section
          className={`mb-5 rounded-2xl border p-4 ${
            theme === "dark"
              ? "border-[#00e6d0]/25 bg-[#071723] shadow-[0_0_0_1px_rgba(0,230,208,0.08)]"
              : "border-teal-200 bg-white shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-base font-semibold text-teal-700 dark:text-[#00e6d0]">
                {t("profile.admin")}
              </p>
              <p className="mt-1 text-xs text-slate-600 dark:text-white/60">
                {t("profile.switchToAdmin")}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsProviderModeEnabled((prev) => !prev)}
              className={`relative h-7 w-12 rounded-full border transition-colors duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent ${
                isProviderModeEnabled
                  ? "border-teal-500 bg-teal-500/40 dark:border-[#00e6d0]/70 dark:bg-[#00e6d0]/35"
                  : "border-slate-300 bg-slate-200 dark:border-white/25 dark:bg-white/10"
              }`}
              aria-label={t("profile.toggleProviderMode")}
              aria-pressed={isProviderModeEnabled}
            >
              <span
                className={`absolute top-0.75 h-5 w-5 rounded-full ring-1 transition-all duration-200 ${
                  isProviderModeEnabled
                    ? "left-6 bg-teal-600 ring-teal-600/60 dark:bg-[#00e6d0] dark:ring-[#00e6d0]/70"
                    : "left-1 bg-white ring-slate-300 dark:bg-slate-100 dark:ring-white/35"
                }`}
              />
            </button>
          </div>
        </section>

        <section
          className={`mb-5 rounded-2xl border p-4 ${
            theme === "dark"
              ? "border-[#00e6d0]/25 bg-[#071723] shadow-[0_0_0_1px_rgba(0,230,208,0.08)]"
              : "border-teal-200 bg-white shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-base font-semibold text-teal-700 dark:text-[#00e6d0]">
                {theme === "dark"
                  ? t("profile.darkMode")
                  : t("profile.lightMode")}
              </p>
              <p className="mt-1 text-xs text-slate-600 dark:text-white/60">
                {theme === "dark"
                  ? t("profile.lightMode")
                  : t("profile.darkMode")}
              </p>
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              className={`relative h-7 w-12 rounded-full border transition-colors duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent ${
                theme === "dark"
                  ? "border-teal-500 bg-teal-500/40 dark:border-[#00e6d0]/70 dark:bg-[#00e6d0]/35"
                  : "border-slate-300 bg-slate-200 dark:border-white/25 dark:bg-white/10"
              }`}
              aria-label={t("profile.toggleTheme")}
              aria-pressed={theme === "dark"}
            >
              <span
                className={`absolute top-0.75 h-5 w-5 rounded-full ring-1 transition-all duration-200 flex items-center justify-center ${
                  theme === "dark"
                    ? "left-6 bg-teal-600 ring-teal-600/60 dark:bg-[#00e6d0] dark:ring-[#00e6d0]/70"
                    : "left-1 bg-white ring-slate-300 dark:bg-slate-100 dark:ring-white/35"
                }`}
              >
                {theme === "dark" ? (
                  <Sun className="h-3 w-3 text-white" />
                ) : (
                  <Moon className="h-3 w-3 text-slate-600" />
                )}
              </span>
            </button>
          </div>
        </section>

        <section className="mb-6">
          <p className="mb-2 px-1 text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-white/45">
            {t("profile.accountSettings")}
          </p>

          <div
            className={`overflow-hidden rounded-2xl border ${
              theme === "dark"
                ? "border-white/10 bg-[#111528]"
                : "border-slate-200 bg-white shadow-sm"
            }`}
          >
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
        </section>

        <section className="mb-8">
          <p className="mb-2 px-1 text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-white/45">
            {t("profile.appPreferences")}
          </p>

          <div
            className={`overflow-hidden rounded-2xl border ${
              theme === "dark"
                ? "border-white/10 bg-[#111528]"
                : "border-slate-200 bg-white shadow-sm"
            }`}
          >
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
              subtitle={activeLanguage}
              trailing={
                <span className="rounded-md px-2 py-1 text-xs font-medium text-slate-500 dark:text-white/70">
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
        </section>

        <button
          type="button"
          onClick={() => setIsLogoutConfirmOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500 bg-red-500 py-3 font-semibold text-white transition hover:bg-red-500/10 hover:text-red-500"
        >
          <LogOut className="h-4 w-4" />
          {t("profile.logout")}
        </button>
      </div>

      {isInfoModalOpen && (
        <ModalShell
          title={t("profile.personalInfoModalTitle")}
          closeLabel={t("profile.closeModal")}
          onClose={() => setIsInfoModalOpen(false)}
          headerAction={
            <button
              type="button"
              onClick={() => {
                setIsEditingInfo((prev) => !prev);
                setInfoSaveError("");
              }}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-600 transition hover:bg-slate-100 dark:border-white/15 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10"
              aria-label="Shaxsiy ma'lumotlarni tahrirlash"
              title="Tahrirlash"
            >
              <Pencil className="h-4 w-4" />
            </button>
          }
        >
          {isEditingInfo ? (
            <div className="space-y-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/5">
                <p className="text-xs uppercase tracking-[0.15em] text-slate-500 dark:text-white/45">
                  {t("profile.field.name")}
                </p>
                <input
                  type="text"
                  value={infoForm.name}
                  onChange={(event) =>
                    setInfoForm((prev) => ({
                      ...prev,
                      name: event.target.value,
                    }))
                  }
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-teal-500 dark:border-white/15 dark:bg-white/10 dark:text-white/90"
                />
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/5">
                <p className="text-xs uppercase tracking-[0.15em] text-slate-500 dark:text-white/45">
                  {t("profile.field.phone")}
                </p>
                <input
                  type="tel"
                  value={infoForm.phoneNumber}
                  onChange={(event) =>
                    setInfoForm((prev) => ({
                      ...prev,
                      phoneNumber: event.target.value,
                    }))
                  }
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-teal-500 dark:border-white/15 dark:bg-white/10 dark:text-white/90"
                />
              </div>

              {infoSaveError && (
                <p className="text-sm text-red-500">{infoSaveError}</p>
              )}

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (!user) return;
                    setInfoForm({
                      name: user.name || "",
                      phoneNumber: user.phoneNumber || "",
                    });
                    setIsEditingInfo(false);
                    setInfoSaveError("");
                  }}
                  disabled={isSavingInfo}
                  className="flex h-12 w-full items-center justify-center rounded-xl border border-slate-300 px-4 text-base font-semibold text-slate-600 transition hover:bg-slate-100 disabled:opacity-60 dark:border-white/20 dark:text-white/80 dark:hover:bg-white/10"
                >
                  Bekor qilish
                </button>
                <button
                  type="button"
                  onClick={handleSavePersonalInfo}
                  disabled={isSavingInfo}
                  className="flex h-12 w-full items-center justify-center rounded-xl bg-teal-600 px-4 text-base font-semibold text-white transition hover:bg-teal-700 disabled:opacity-60 dark:bg-[#00e6d0] dark:text-slate-900 dark:hover:bg-[#00c4b0]"
                >
                  {isSavingInfo ? "Saqlanmoqda..." : "Saqlash"}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/5">
                <p className="text-xs uppercase tracking-[0.15em] text-slate-500 dark:text-white/45">
                  {t("profile.field.name")}
                </p>
                <p className="mt-1 break-all text-sm text-slate-800 dark:text-white/90">
                  {user?.name || "-"}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/5">
                <p className="text-xs uppercase tracking-[0.15em] text-slate-500 dark:text-white/45">
                  {t("profile.field.email")}
                </p>
                <p className="mt-1 break-all text-sm text-slate-800 dark:text-white/90">
                  {user?.email || "-"}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/5">
                <p className="text-xs uppercase tracking-[0.15em] text-slate-500 dark:text-white/45">
                  {t("profile.field.phone")}
                </p>
                <p className="mt-1 break-all text-sm text-slate-800 dark:text-white/90">
                  {user?.phoneNumber || "-"}
                </p>
              </div>

              {profileFields.map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/5"
                >
                  <p className="text-xs uppercase tracking-[0.15em] text-slate-500 dark:text-white/45">
                    {item.label}
                  </p>
                  <p className="mt-1 break-all text-sm text-slate-800 dark:text-white/90">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          )}
        </ModalShell>
      )}

      {isLanguageModalOpen && (
        <ModalShell
          title={t("profile.languageModalTitle")}
          closeLabel={t("profile.closeModal")}
          onClose={() => setIsLanguageModalOpen(false)}
        >
          <div className="space-y-2">
            {LANGUAGES.map((lang) => {
              const isActive = lang.code === language;

              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    setLanguage(lang.code);
                    setIsLanguageModalOpen(false);
                  }}
                  className={`w-full rounded-xl border px-4 py-3 text-left text-sm font-medium transition ${
                    isActive
                      ? "border-teal-300 bg-teal-50 text-teal-700 dark:border-[#00e6d0]/60 dark:bg-[#00e6d0]/10 dark:text-[#8de8df]"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10"
                  }`}
                >
                  {lang.label}
                </button>
              );
            })}
          </div>
        </ModalShell>
      )}

      {isLogoutConfirmOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 dark:bg-black/70"
          onClick={() => setIsLogoutConfirmOpen(false)}
          role="presentation"
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#0d1325]"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={t("profile.logoutConfirmTitle")}
          >
            <div className="mb-4 flex items-center justify-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-500/20">
                <LogOut className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>

            <h3 className="mb-2 text-center text-lg font-semibold text-slate-900 dark:text-white">
              {t("profile.logoutConfirmTitle")}
            </h3>

            <p className="mb-6 text-center text-sm text-slate-600 dark:text-white/70">
              {t("profile.logoutConfirmMessage")}
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setIsLogoutConfirmOpen(false)}
                className="flex h-12 w-full items-center justify-center rounded-xl border border-slate-300 px-4 font-semibold text-slate-600 transition hover:bg-slate-100 dark:border-white/20 dark:text-white/80 dark:hover:bg-white/10"
              >
                {t("profile.cancel")}
              </button>
              <button
                type="button"
                onClick={() => {
                  logout();
                  router.replace("/login");
                }}
                className="flex h-12 w-full items-center justify-center rounded-xl bg-red-600 px-4 font-semibold text-white transition hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
              >
                {t("profile.logout")}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function ProfileRow({
  icon,
  title,
  subtitle,
  onClick,
  trailing,
  bordered = false,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onClick: () => void;
  trailing?: React.ReactNode;
  bordered?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-slate-50 dark:hover:bg-white/5 ${
        bordered ? "border-t border-slate-200 dark:border-white/10" : ""
      }`}
    >
      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-[#18203a] dark:text-[#a5b4d6]">
        {icon}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-slate-900 dark:text-white/95">
          {title}
        </span>
        <span className="block truncate text-xs text-slate-500 dark:text-white/45">
          {subtitle}
        </span>
      </span>

      {trailing || (
        <ChevronRight className="h-4 w-4 shrink-0 text-slate-400 dark:text-white/35" />
      )}
    </button>
  );
}

function ModalShell({
  title,
  closeLabel,
  headerAction,
  children,
  onClose,
}: {
  title: string;
  closeLabel: string;
  headerAction?: React.ReactNode;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 dark:bg-black/70"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="max-h-[calc(100dvh-2rem)] w-full max-w-155 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl dark:border-white/10 dark:bg-[#0d1325]"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            {title}
          </h3>
          <div className="flex items-center gap-2">
            {headerAction}
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-600 transition hover:bg-slate-100 dark:border-white/15 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10"
              aria-label={closeLabel}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="max-h-[calc(100dvh-9rem)] overflow-y-auto pr-1">
          {children}
        </div>
      </div>
    </div>
  );
}
