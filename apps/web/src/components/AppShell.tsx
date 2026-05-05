"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import ConditionalBottomNav from "@/components/ConditionalBottomNav";
import { AuthPromptProvider } from "@/contexts/AuthPromptContext";

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
  const isAdminServiceNewPage = pathname.startsWith("/admin/services/new");
  const isAdminServicePage = pathname.startsWith("/admin/services");
  const isAddBusinessFlowPage = pathname.startsWith("/profile/add-business");

  const mainClassName = isAuthPage
    ? "min-h-screen"
    : isAdminServiceNewPage || isAddBusinessFlowPage
      ? "min-h-dvh"
      : isShopHistoryPage
        ? "h-dvh overflow-hidden"
        : isStaffManagePage || isAdminServicePage
          ? "min-h-dvh pb-16 md:pb-0"
          : "min-h-[calc(100dvh-8rem)] md:min-h-[calc(100dvh-4rem)] pb-16 md:pb-0";

  return (
    <AuthPromptProvider>
      <div className={isAuthPage ? "overflow-hidden" : ""}>
        {!isShopHistoryPage &&
          !isStaffManagePage &&
          !isAdminServicePage &&
          !isAddBusinessFlowPage && <Header />}
        <main className={mainClassName}>{children}</main>
        <ConditionalBottomNav />
      </div>
    </AuthPromptProvider>
  );
}
