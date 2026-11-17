"use client";

import type { Route } from "next";
import Link from "next/link";
import {
  Users,
  PlusCircle,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { ADMIN_NAV_ITEMS } from "@/shared/utils/navigation";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "./ui/drawer";
import { usePathname } from "@/i18n/navigation";
import { cn } from "cn";

interface AdminSidebarProps {
  shopName: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({
  shopName,
  isOpen,
  onClose,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const t = useTranslations();

  const isActive = (patterns: string[]) => {
    return patterns.some((pattern) => {
      const regex = new RegExp(pattern);
      return regex.test(pathname);
    });
  };

  return (
    <>
      <Drawer direction="left" open={isOpen} onOpenChange={onClose}>
        <DrawerContent className="rounded-r-xl!">
          <DrawerHeader>
            <DrawerTitle className="flex items-center justify-between gap-2">
              <div>
                <span>{t("admin.sidebar.admin_panel")}</span>

                <div className="text-xs text-gray-500">{shopName}</div>
              </div>

              <button
                onClick={onClose}
                className="h-9 w-9 rounded-full bg-white border shadow flex items-center justify-center text-gray-600"
                aria-label="Close admin sidebar"
              >
                <X className="w-4 h-4" />
              </button>
            </DrawerTitle>
          </DrawerHeader>

          <div className="flex-1 flex flex-col gap-2 justify-between px-3 py-4 overflow-y-auto scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <div className="space-y-2">
              {ADMIN_NAV_ITEMS.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href as Route}
                    onClick={onClose}
                    className={cn(
                      "flex items-center justify-between rounded-2xl px-2 py-1.5 transition",
                      isActive(item.activePatterns) ? "bg-[#f49b33] text-white shadow-md" : "bg-white text-gray-700 hover:bg-orange-50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn("flex h-10 w-10 items-center justify-center rounded-full transition-all duration-150",
                          isActive(item.activePatterns) ? "bg-white/20 rounded-xl" : "bg-orange-100 text-[#f49b33]"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </div>

                      <span className="text-sm font-semibold">
                        {t(item.labelKey)}
                      </span>
                    </div>
                  </Link>
                );
              })}

              <Link
                href={"/admin/staff" as Route}
                onClick={onClose}
                className={cn(
                  "flex items-center justify-between rounded-2xl px-2 py-1.5 transition",
                  isActive(["^/admin/staff"]) ? "bg-[#f49b33] text-white shadow-md" : "bg-white text-gray-700 hover:bg-orange-50"
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn("flex h-10 w-10 items-center justify-center rounded-full transition-all duration-150",
                      isActive(["^/admin/staff"]) ? "bg-white/20 rounded-xl" : "bg-orange-100 text-[#f49b33]"
                    )}
                  >
                    <Users className="h-4 w-4" />
                  </div>

                  <span className="text-sm font-semibold">
                    {t("admin.dashboard.staff")}
                  </span>
                </div>
              </Link>
            </div>

            <div>
              <Link
                href={"/admin/bookings/new" as Route}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-2xl bg-[#f49b33] px-1.5 py-1.5 text-white font-semibold",
                  isActive(["^/admin/bookings/new"]) ? "bg-[#f49b33] text-white shadow-md" : "bg-white text-gray-700 hover:bg-orange-50 border border-[#f49b33]",
                )}
              >
                <div
                  className={cn("flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-150",
                    isActive(["^/admin/bookings/new"]) ? "bg-white/20 rounded-xl" : "bg-orange-100 text-[#f49b33]"
                  )}
                >
                  <PlusCircle className="h-4 w-4" />
                </div>

                <span className="text-sm font-semibold">{t("admin.dashboard.newAppointment")}</span>
              </Link>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  )
}
