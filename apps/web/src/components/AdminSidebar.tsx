"use client";

import { useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  BarChart3,
  Users,
  PlusCircle,
  CircleUser,
  SquareArrowOutUpRight,
  CalendarDays,
  ClipboardList,
  Scissors,
  History,
  X,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

type AdminNavItem = {
  title: string;
  href: string;
  icon: typeof BarChart3;
  exact?: boolean;
};

interface AdminSidebarProps {
  isVisible: boolean;
  isClosing: boolean;
  currentShopName: string;
  adminNavItems: AdminNavItem[];
  onClose: () => void;
  getAdminHrefWithShopId: (path: string) => string;
}

export default function AdminSidebar({
  isVisible,
  isClosing,
  currentShopName,
  adminNavItems,
  onClose,
  getAdminHrefWithShopId,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const { t } = useLanguage();
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isVisible &&
        !isClosing &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target as Node) &&
        (e.target as Element)?.closest('.fixed.inset-0.z-50')
      ) {
        onClose();
      }
    };

    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isVisible && !isClosing) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = isClosing ? "auto" : "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "auto";
    };
  }, [isVisible, isClosing, onClose]);

  if (!isVisible) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-[2px]"
        style={{
          animation: isClosing
            ? "fadeOut 0.28s ease-in forwards"
            : "fadeIn 0.2s ease-out",
        }}
      >
        <div
          ref={sidebarRef}
          className="h-full w-[320px] md:w-90 lg:w-100 max-w-[88vw] bg-white shadow-2xl border-l border-gray-200 rounded-l-3xl flex flex-col"
          style={{
            animation: isClosing
              ? "slideOutRight 0.28s ease-in forwards"
              : "slideInRight 0.28s ease-out",
          }}
        >
          <div className="mx-3 mt-3 overflow-hidden rounded-3xl border border-orange-100 bg-orange-50">
            <div className="flex items-center justify-between px-4 py-4">
              <div>
                <div className="text-sm font-bold text-gray-900">
                  Admin panel
                </div>
                <div className="text-xs text-gray-500">{currentShopName}</div>
              </div>
              <button
                onClick={onClose}
                className="h-9 w-9 rounded-full bg-white border shadow flex items-center justify-center text-gray-600"
                aria-label="Close admin sidebar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 px-3 py-4 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">

            <div className="space-y-1">
              {adminNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.exact
                  ? pathname === item.href.replace(/\?.*$/, "")
                  : pathname.startsWith(item.href.replace(/\?.*$/, ""));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center justify-between rounded-2xl px-4 py-2.5 transition ${
                      isActive
                        ? "bg-orange-400 text-white shadow-md"
                        : "bg-white text-gray-700 hover:bg-orange-50"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          isActive
                            ? "bg-white/20"
                            : "bg-orange-100 text-orange-500"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="text-sm font-semibold">
                        {item.title}
                      </span>
                    </span>
                    <SquareArrowOutUpRight
                      className={`h-4 w-4 ${
                        isActive ? "text-white" : "text-gray-400"
                      }`}
                    />
                  </Link>
                );
              })}
            </div>

            <div className="mt-4 rounded-3xl border border-dashed border-gray-200 p-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Quick actions
              </div>
              <div className="mt-2 space-y-2">
                <Link
                  href={getAdminHrefWithShopId("/admin/bookings/new")}
                  onClick={onClose}
                  className="flex items-center gap-3 rounded-2xl bg-orange-400 px-4 py-2.5 text-white font-semibold"
                >
                  <PlusCircle className="h-4 w-4" />
                  {t("admin.dashboard.newAppointment")}
                </Link>
                <Link
                  href={getAdminHrefWithShopId("/admin/staff")}
                  onClick={onClose}
                  className="flex items-center gap-3 rounded-2xl bg-gray-50 px-4 py-2.5 text-gray-700 font-semibold"
                >
                  <Users className="h-4 w-4 text-orange-400" />
                  {t("admin.dashboard.staff")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }

        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideOutRight {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}
