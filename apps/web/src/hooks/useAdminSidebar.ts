import { useRef, useState } from "react";
import {
  BarChart3,
  CalendarDays,
  ClipboardList,
  CircleUser,
  History,
  Scissors,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";

type AdminNavItem = {
  title: string;
  href: string;
  icon: typeof BarChart3;
  exact?: boolean;
};

export function useAdminSidebar(activeShopId: string | null) {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isSidebarClosing, setIsSidebarClosing] = useState(false);
  const sidebarCloseTimerRef = useRef<number | null>(null);
  const t = useTranslations();

  const getAdminHrefWithShopId = (path: string) => {
    if (!activeShopId) return path;
    return `${path}?shopId=${encodeURIComponent(activeShopId)}`;
  };

  const openSidebar = () => {
    if (sidebarCloseTimerRef.current) {
      window.clearTimeout(sidebarCloseTimerRef.current);
      sidebarCloseTimerRef.current = null;
    }
    setIsSidebarVisible(true);
    setIsSidebarClosing(false);
  };

  const closeSidebar = () => {
    if (!isSidebarVisible || isSidebarClosing) return;
    setIsSidebarClosing(true);
    sidebarCloseTimerRef.current = window.setTimeout(() => {
      setIsSidebarVisible(false);
      setIsSidebarClosing(false);
      sidebarCloseTimerRef.current = null;
    }, 280);
  };

  const adminNavItems: AdminNavItem[] = [
    {
      title: t("bottomNav.panel"),
      href: getAdminHrefWithShopId("/admin"),
      icon: BarChart3,
      exact: true,
    },
    {
      title: t("bottomNav.analytics"),
      href: getAdminHrefWithShopId("/admin/analytics"),
      icon: ClipboardList,
    },
    {
      title: t("bottomNav.schedule"),
      href: getAdminHrefWithShopId("/admin/schedule"),
      icon: CalendarDays,
    },
    {
      title: t("bottomNav.services"),
      href: getAdminHrefWithShopId("/admin/services"),
      icon: Scissors,
    },
    {
      title: t("bottomNav.history"),
      href: getAdminHrefWithShopId("/admin/history"),
      icon: History,
    },
    {
      title: t("bottomNav.staff"),
      href: getAdminHrefWithShopId("/admin/staff"),
      icon: Users,
    },
    {
      title: t("bottomNav.profile"),
      href: "/profile",
      icon: CircleUser,
    },
  ];

  return {
    isSidebarVisible,
    isSidebarClosing,
    sidebarCloseTimerRef,
    openSidebar,
    closeSidebar,
    adminNavItems,
    getAdminHrefWithShopId,
  };
}
