"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { User, LogIn, LogOut, Bell, MapPin, ChevronDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { getImageUrl } from "@/lib/supabaseClient";

export default function Header() {
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [locationMenuOpen, setLocationMenuOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] =
    useState("Downtown Manhab an");

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

          {/* Location Selector */}
          <div className="relative min-w-0 flex-1 max-w-40 sm:max-w-64 md:max-w-80">
            <button
              onClick={() => setLocationMenuOpen(!locationMenuOpen)}
              className="flex w-full items-center gap-2 rounded-xl border border-transparent px-2 py-1.5 transition-colors hover:border-gray-200 hover:bg-gray-50 dark:hover:border-gray-700 dark:hover:bg-gray-800"
            >
              <MapPin className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
              <div className="min-w-0 flex-1 text-left">
                <span className="hidden text-[11px] font-medium leading-none text-gray-500 dark:text-gray-400 sm:block">
                  Location
                </span>
                <div className="flex items-center gap-1">
                  <span className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                    {selectedLocation}
                  </span>
                  <ChevronDown className="h-3 w-3 shrink-0 text-gray-600 dark:text-gray-300" />
                </div>
              </div>
            </button>

            {locationMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setLocationMenuOpen(false)}
                />
                <div className="absolute left-0 right-0 z-20 mt-2 rounded-lg border border-gray-200 bg-white py-2 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                  <div className="border-b border-gray-200 px-3 py-2 dark:border-gray-700">
                    <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                      Select Location
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedLocation("Downtown Manhab an");
                      setLocationMenuOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-sm transition-colors ${
                      selectedLocation === "Downtown Manhab an"
                        ? "bg-blue-50 font-medium text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    }`}
                  >
                    Downtown Manhab an
                  </button>
                  <button
                    onClick={() => {
                      setSelectedLocation("Tashkent City");
                      setLocationMenuOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-sm transition-colors ${
                      selectedLocation === "Tashkent City"
                        ? "bg-blue-50 font-medium text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    }`}
                  >
                    Tashkent City
                  </button>
                  <button
                    onClick={() => {
                      setSelectedLocation("Samarqand");
                      setLocationMenuOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-sm transition-colors ${
                      selectedLocation === "Samarqand"
                        ? "bg-blue-50 font-medium text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    }`}
                  >
                    Samarqand
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            {/* Auth Buttons / Profile */}
            {isLoading ? (
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full sm:h-11 sm:w-11" />
                <Skeleton className="h-10 w-10 rounded-full sm:h-11 sm:w-11" />
              </div>
            ) : isAuthenticated ? (
              <div className="flex items-center gap-3">
                <button
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 sm:h-11 sm:w-11"
                  aria-label="Notifications"
                >
                  <Bell className="h-5 w-5" />
                </button>
                <div className="relative">
                  <button
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-amber-100 dark:bg-amber-900/30 sm:h-11 sm:w-11"
                    aria-label="Profile menu"
                  >
                    {avatarImageSrc ? (
                      <img
                        src={avatarImageSrc}
                        alt={user?.name || "User avatar"}
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
                          <span>Profile</span>
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
                            <span>Chiqish</span>
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
                <span>Sign in</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
