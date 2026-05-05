"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Home, Search, History, User } from "lucide-react";
import { useProviderMode } from "@/contexts/ProviderModeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthPrompt } from "@/contexts/AuthPromptContext";
import { Scissors, BarChart2, History as HistoryIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  activePatterns: string[];
}

// eslint-disable-next-line
const adminNavItems = (t: any) => {
  return [
    {
      href: "/admin",
      label: t("bottomNav.adminDash") || "Dash",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          className="w-6 h-6"
        >
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
      ),
      activePatterns: ["^/admin$"],
    },
    {
      href: "/admin/services",
      label: t("bottomNav.services"),
      icon: <Scissors className="w-6 h-6" />,
      activePatterns: ["^/admin/services"],
    },
    {
      href: "/admin/history",
      label: t("bottomNav.history"),
      icon: <HistoryIcon className="w-6 h-6" />,
      activePatterns: ["^/admin/history"],
    },
    {
      href: "/admin/analytics",
      label: t("bottomNav.adminAnalytics") || "Analytics",
      icon: <BarChart2 className="w-6 h-6" />,
      activePatterns: ["^/admin/analytics"],
    },
    {
      href: "/profile",
      label: t("bottomNav.profile"),
      icon: <User className="w-6 h-6" />,
      activePatterns: ["^/profile"],
    },
  ];
};

// eslint-disable-next-line
const navItems = (t: any) => {
  return [
    {
      href: "/user",
      label: t("bottomNav.home"),
      icon: <Home className="w-6 h-6" />,
      activePatterns: ["^/user$", "^/user/home"],
    },
    {
      href: "/user/discover",
      label: t("bottomNav.search"),
      icon: <Search className="w-6 h-6" />,
      activePatterns: ["^/user/discover"],
    },
    {
      href: "/user/bookings",
      label: t("bottomNav.history"),
      icon: <History className="w-6 h-6" />,
      activePatterns: ["^/user/bookings"],
    },
    {
      href: "/profile",
      label: t("bottomNav.profile"),
      icon: <User className="w-6 h-6" />,
      activePatterns: ["^/profile", "^/user/settings"],
    },
  ] as NavItem[];
};

export default function BottomNav() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { openAuthPrompt } = useAuthPrompt();
  const { providerMode } = useProviderMode();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [persistedShopId, setPersistedShopId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setPersistedShopId(window.localStorage.getItem("selected_shop_id"));
  }, [pathname]);

  const activeAdminShopId = useMemo(() => {
    return searchParams.get("shopId") || persistedShopId;
  }, [searchParams, persistedShopId]);

  const isAdminUser = user?.role === "ADMIN";
  const isOnAdminRoute = pathname.startsWith("/admin");
  const isOnProfileRoute = pathname.startsWith("/profile");
  const useAdmin =
    isAdminUser && (isOnAdminRoute || (providerMode && isOnProfileRoute));
  const protectedRoutes = new Set(["/user/bookings", "/profile"]);

  const getAdminHref = (href: string) => {
    if (!href.startsWith("/admin") || !activeAdminShopId) return href;
    return `${href}?shopId=${encodeURIComponent(activeAdminShopId)}`;
  };

  const isActive = (patterns: string[]) => {
    return patterns.some((pattern) => {
      const regex = new RegExp(pattern);
      return regex.test(pathname);
    });
  };

  const navItemsArray = navItems(t);
  const adminNavItemsArray = adminNavItems(t);

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 md:hidden">
      <div className="relative h-16 overflow-hidden">
        {/* two stacked bars: user (top) and admin (above) - animate translateY */}
        {(() => {
          const userClass = `absolute inset-0 flex h-16 transition-transform duration-300 ease-in-out items-center ${
            useAdmin
              ? "translate-y-full opacity-0 pointer-events-none"
              : "translate-y-0 opacity-100"
          }`;

          const adminClass = `absolute inset-0 flex h-16 transition-transform duration-300 ease-in-out items-center ${
            useAdmin
              ? "translate-y-0 opacity-100"
              : "translate-y-full opacity-0 pointer-events-none"
          }`;

          return (
            <>
              <div className={userClass} aria-hidden={useAdmin}>
                {navItemsArray.map((item) => {
                  const active = isActive(item.activePatterns);
                  const shouldPromptLogin =
                    !user && protectedRoutes.has(item.href);

                  if (shouldPromptLogin) {
                    return (
                      <button
                        key={item.href}
                        type="button"
                        onClick={openAuthPrompt}
                        className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 px-1 transition-colors ${
                          active
                            ? "text-blue-600"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        <div
                          className={
                            active ? "text-blue-600" : ""
                          }
                        >
                          {item.icon}
                        </div>
                        <span className="text-xs font-medium whitespace-nowrap">
                          {item.label}
                        </span>
                      </button>
                    );
                  }

                  return (
                    <Link
                      key={item.href}
                      href={getAdminHref(item.href)}
                      className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 px-1 transition-colors ${
                        active
                          ? "text-blue-600"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <div
                        className={
                          active ? "text-blue-600" : ""
                        }
                      >
                        {item.icon}
                      </div>
                      <span className="text-xs font-medium whitespace-nowrap">
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </div>

              <div className={adminClass} aria-hidden={!useAdmin}>
                {adminNavItemsArray.map((item) => {
                  const active = isActive(item.activePatterns);
                  return (
                    <Link
                      key={item.href}
                      href={getAdminHref(item.href)}
                      className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 px-1 transition-colors ${
                        active
                          ? "text-blue-600"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <div
                        className={
                          active ? "text-blue-600" : ""
                        }
                      >
                        {item.icon}
                      </div>
                      <span className="text-xs font-medium whitespace-nowrap">
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </>
          );
        })()}
      </div>
    </nav>
  );
}
