"use client";

import { Bell, Menu } from "lucide-react";

type AdminDashboardHeaderProps = {
  currentShopName: string;
  isShopNameLoading: boolean;
  onOpenSidebar: () => void;
  panelLabel: string;
};

export default function AdminDashboardHeader({
  currentShopName,
  isShopNameLoading,
  onOpenSidebar,
  panelLabel,
}: AdminDashboardHeaderProps) {
  return (
    <div className="sticky top-0 z-40 w-full">
      <div className="mx-auto flex w-full max-w-360 items-center justify-between border-b bg-orange-50 p-3 md:bg-white md:px-5 md:py-4 lg:px-6 lg:py-5">
        <div className="flex items-center gap-3 md:gap-4 lg:gap-4">
          {isShopNameLoading ? (
            <div className="h-12 w-12 animate-pulse rounded-full bg-gray-200 md:h-11 md:w-11 lg:h-12 lg:w-12" />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-600 md:h-11 md:w-11 lg:h-12 lg:w-12">
              {(currentShopName || "A")
                .split(" ")
                .map((segment) => segment[0])
                .slice(0, 2)
                .join("")}
            </div>
          )}

          <div>
            {isShopNameLoading ? (
              <div className="h-4 w-28 rounded-full bg-gray-200 md:w-32 lg:w-36" />
            ) : (
              <div className="text-sm font-semibold md:text-base lg:text-lg">
                {currentShopName}
              </div>
            )}
            <div className="text-xs font-semibold uppercase text-orange-400 md:text-[13px] lg:text-sm">
              {panelLabel}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full border bg-white text-gray-600 shadow md:h-10 md:w-10 lg:h-11 lg:w-11"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={onOpenSidebar}
            className="flex h-9 w-9 items-center justify-center rounded-full border bg-white text-gray-600 shadow md:h-10 md:w-10 lg:h-11 lg:w-11"
            aria-label="Open admin sidebar"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
