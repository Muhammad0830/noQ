"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import ConditionalBottomNav from "@/components/ConditionalBottomNav";

type AppShellProps = {
  children: React.ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/forgot-password");
  const isShopHistoryPage = pathname === "/admin/history";
  const isStaffManagePage = pathname.startsWith("/admin/staff");
  const isAdminServicePage = pathname.startsWith("/admin/services");

  const mainClassName = isAuthPage
    ? "min-h-screen"
    : isShopHistoryPage || isStaffManagePage || isAdminServicePage
      ? "min-h-dvh pb-16 md:pb-0"
      : "min-h-[calc(100dvh-8rem)] md:min-h-[calc(100dvh-4rem)] pb-16 md:pb-0";

  return (
    <div className={isAuthPage ? "overflow-hidden" : ""}>
      {!isShopHistoryPage && !isStaffManagePage && !isAdminServicePage && (
        <Header />
      )}
      <main className={mainClassName}>{children}</main>
      <ConditionalBottomNav />
    </div>
  );
}
