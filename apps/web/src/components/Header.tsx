"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { User, LogIn, LogOut, Bell } from "lucide-react";
import { getImageUrl } from "@/lib/supabaseClient";
import LogoutConfirmModal from "@/components/LogoutConfirmModal";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const { t } = useLanguage();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!profileMenuOpen) return;

    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setProfileMenuOpen(false);
      }
    };

    const handleScrollClose = () => {
      setProfileMenuOpen(false);
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);
    window.addEventListener("scroll", handleScrollClose, true);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
      window.removeEventListener("scroll", handleScrollClose, true);
    };
  }, [profileMenuOpen]);

  const hideHeaderOnPages =
    pathname.startsWith("/book/") ||
    pathname.startsWith("/shop/") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/forgot-password");

  if (hideHeaderOnPages) {
    return null;
  }

  const avatarImageSrc = user?.avatarUrl
    ? user.avatarUrl.startsWith("http")
      ? user.avatarUrl
      : getImageUrl(user.avatarUrl, "user_avatars")
    : null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#f1c894] dark:border-[#4a2e1b] bg-white/88 dark:bg-[#211201]/92 backdrop-blur-md">
      <div
        className={`mx-auto w-full px-4 sm:px-6 lg:px-8 ${
          pathname.startsWith("/profile") ? "max-w-4xl" : "max-w-6xl"
        }`}
      >
        <div className="flex h-16 items-center justify-between gap-2 sm:gap-4">
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F49B33]">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-white sm:text-xl">
              NoQ
            </span>
          </Link>

          {/* Right Side Actions */}
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            {/* Auth Buttons / Profile */}
            {isLoading ? (
              <div className="h-10 w-24 sm:h-11 sm:w-28" aria-hidden="true" />
            ) : isAuthenticated ? (
              <div className="flex items-center gap-3">
                <button
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fff3e6] text-[#F49B33] transition-colors hover:bg-[#fce2c4] dark:bg-[#3a2415] dark:text-[#F49B33] dark:hover:bg-[#4a2e1b] sm:h-11 sm:w-11"
                  aria-label={t("header.notifications")}
                >
                  <Bell className="h-5 w-5" />
                </button>
                <div className="relative" ref={profileMenuRef}>
                  <button
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[#fff3e6] dark:bg-[#3a2415] sm:h-11 sm:w-11"
                    aria-label={t("header.profileMenu")}
                  >
                    {avatarImageSrc ? (
                      <img
                        src={avatarImageSrc}
                        alt={user?.name || t("header.userAvatar")}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-6 h-6 text-[#F49B33] dark:text-[#F49B33]" />
                    )}
                  </button>

                  {profileMenuOpen && (
                    <div className="absolute right-0 z-20 mt-2 w-48 rounded-lg border border-[#f1c894] bg-white py-2 shadow-lg dark:border-[#4a2e1b] dark:bg-[#2b170b]">
                      <Link
                        href="/user/profile"
                        onClick={() => setProfileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-[#8a5620] dark:text-[#ffd4a6] hover:bg-[#fff3e6] dark:hover:bg-[#3a2415] transition-colors"
                      >
                        <User className="w-4 h-4" />
                        <span>{t("nav.profile")}</span>
                      </Link>

                      <div className="border-t border-[#f1c894] dark:border-[#4a2e1b] mt-2 pt-2">
                        <button
                          onClick={() => {
                            setProfileMenuOpen(false);
                            setIsLogoutConfirmOpen(true);
                          }}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-[#fff3e6] dark:hover:bg-[#3a2415] transition-colors w-full"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>{t("profile.logout")}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center space-x-2 rounded-lg bg-[#F49B33] px-3 py-2 text-sm font-medium text-white transition-shadow hover:shadow-lg sm:px-4 sm:text-base"
              >
                <LogIn className="w-4 h-4" />
                <span>{t("nav.signin")}</span>
              </Link>
            )}
          </div>
        </div>
      </div>

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
    </header>
  );
}
