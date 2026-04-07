"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { User, LogIn, LogOut, Bell } from "lucide-react";
import { getImageUrl } from "@/lib/supabaseClient";

export default function Header() {
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const { t } = useLanguage();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const hideHeaderOnPages =
    pathname.startsWith("/book/") ||
    pathname.startsWith("/shop/") ||
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
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
      <div
        className={`mx-auto w-full px-4 sm:px-6 lg:px-8 ${
          pathname.startsWith("/profile") ? "max-w-4xl" : "max-w-6xl"
        }`}
      >
        <div className="flex h-16 items-center justify-between gap-2 sm:gap-4">
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-blue-600 to-purple-600">
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
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 sm:h-11 sm:w-11"
                  aria-label={t("header.notifications")}
                >
                  <Bell className="h-5 w-5" />
                </button>
                <div className="relative">
                  <button
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-amber-100 dark:bg-amber-900/30 sm:h-11 sm:w-11"
                    aria-label={t("header.profileMenu")}
                  >
                    {avatarImageSrc ? (
                      <img
                        src={avatarImageSrc}
                        alt={user?.name || t("header.userAvatar")}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                    )}
                  </button>

                  {profileMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setProfileMenuOpen(false)}
                      />
                      <div className="absolute right-0 z-20 mt-2 w-48 rounded-lg border border-gray-200 bg-white py-2 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                        <Link
                          href="/profile"
                          onClick={() => setProfileMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <User className="w-4 h-4" />
                          <span>{t("nav.profile")}</span>
                        </Link>

                        <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
                          <button
                            onClick={() => {
                              logout();
                              setProfileMenuOpen(false);
                            }}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors w-full"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>{t("profile.logout")}</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center space-x-2 rounded-lg bg-linear-to-r from-blue-600 to-purple-600 px-3 py-2 text-sm font-medium text-white transition-shadow hover:shadow-lg sm:px-4 sm:text-base"
              >
                <LogIn className="w-4 h-4" />
                  <span>{t("nav.signin")}</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
