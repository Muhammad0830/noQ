"use client";

import { usePathname } from "next/navigation";

import Header from "@/components/layouts/Header";
import ConditionalBottomNav from "@/components/layouts/ConditionalBottomNav";
import { LogInDialogProvider } from "@/contexts/LogInDialogContext";
import { useLocale } from "next-intl";

type MainClassNameOptions = {
  isAuthPage: boolean;
  isShopHistoryPage: boolean;
  isStaffManagePage: boolean;
  isAdminServicePage: boolean;
  isAddBusinessFlowPage: boolean;
};

type AppShellProps = {
  children: React.ReactNode;
};

const PATHS = {
  auth: ["/login", "/signup", "/forgot-password"],
  shopHistory: "/admin/history",
  staffManage: "/admin/staff",
  adminServices: "/admin/services",
  addBusiness: "/profile/add-business",
} as const;

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const locale = useLocale()

  const isAuthPage = PATHS.auth.some((path) => pathname.startsWith(`${locale}${path}`));
  const isShopHistoryPage = pathname.startsWith(`${locale}${PATHS.shopHistory}`);
  const isStaffManagePage = pathname.startsWith(`${locale}${PATHS.staffManage}`);
  const isAdminServicePage = pathname.startsWith(`${locale}${PATHS.adminServices}`);
  const isAddBusinessFlowPage = pathname.startsWith(`${locale}${PATHS.addBusiness}`);

  const headerIsVisible =
    isShopHistoryPage ||
    isStaffManagePage ||
    isAdminServicePage ||
    isAddBusinessFlowPage;

  console.log('pathname', pathname)
  console.log('headerVisible', headerIsVisible)

  const mainClassName = getMainClassName({
    isAuthPage,
    isShopHistoryPage,
    isStaffManagePage,
    isAdminServicePage,
    isAddBusinessFlowPage,
  });

  return (
    <LogInDialogProvider>
      <div className={isAuthPage ? "overflow-hidden" : undefined}>
        {headerIsVisible && <Header />}

        <main className={mainClassName}>{children}</main>

        <ConditionalBottomNav />
      </div>
    </LogInDialogProvider>
  );
}

const getMainClassName = ({
  isAuthPage,
  isShopHistoryPage,
  isStaffManagePage,
  isAdminServicePage,
  isAddBusinessFlowPage,
}: MainClassNameOptions) => {
  if (isAuthPage) {
    return "min-h-screen";
  }

  if (isAddBusinessFlowPage) {
    return "min-h-dvh";
  }

  if (isShopHistoryPage) {
    return "h-dvh overflow-hidden";
  }

  if (isStaffManagePage || isAdminServicePage) {
    return "min-h-dvh pb-16 md:pb-0";
  }

  return "min-h-[calc(100dvh-8rem)] md:min-h-[calc(100dvh-4rem)] pb-16 md:pb-0";
}