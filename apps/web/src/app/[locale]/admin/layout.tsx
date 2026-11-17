'use client';
import AdminDashboardHeader from "@/components/admin/dashboard/AdminDashboardHeader";
import { useShop } from "@/contexts/ShopContext";
import { AdminSidebar, ConditionalBottomNav } from "@/shared/components";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useState } from "react"

export default function Layout({ children }: {
    children: React.ReactNode
}) {
    const t = useTranslations();
    const { shop, isShopLoading } = useShop();

    const [sideBarOpen, setSideBarOpen] = useState(false);

    if (isShopLoading) {
        return (
            <div className="w-screen h-screen flex items-center justify-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-slate-100 px-4 py-1 text-sm font-medium shadow-sm">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>{t("common.loading")}</span>
                </div>
            </div>
        );
    }

    return <div className="flex-1">
        <AdminDashboardHeader
            currentShopName={shop?.name ?? "Shop not found"}
            onOpenSidebar={() => setSideBarOpen(true)}
            panelLabel={t("admin.dashboard.panel")}
        />

        <div>{children}</div>

        <ConditionalBottomNav />

        <AdminSidebar
            shopName={shop?.name ?? "Shop not found"}
            isOpen={sideBarOpen}
            onClose={() => setSideBarOpen(false)}
        />
    </div>
}