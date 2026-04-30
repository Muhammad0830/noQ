import { useRef, useState, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { BarChart3, CalendarDays, ClipboardList, CircleUser, History, Scissors, Users } from "lucide-react";

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
  const { t } = useLanguage();

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

  const adminNavItems = useMemo<AdminNavItem[]>(
    () => [
      {
        title: t("admin.dashboard.panel"),
        href: getAdminHrefWithShopId("/admin"),
        icon: BarChart3,
        exact: true,
      },
      {
        title: t("admin.analytics.title") || "Analytics",
        href: getAdminHrefWithShopId("/admin/analytics"),
        icon: ClipboardList,
      },
      {
        title: t("admin.schedule.title") || "Schedule",
        href: getAdminHrefWithShopId("/admin/schedule"),
        icon: CalendarDays,
      },
      {
        title: t("services.title") || "Services",
        href: getAdminHrefWithShopId("/admin/services"),
        icon: Scissors,
      },
      {
        title: t("admin.history.title") || "History",
        href: getAdminHrefWithShopId("/admin/history"),
        icon: History,
      },
      {
        title: t("admin.staff.title") || "Staff",
        href: getAdminHrefWithShopId("/admin/staff"),
        icon: Users,
      },
      {
        title: t("nav.profile") || "Profile",
        href: "/profile",
        icon: CircleUser,
      },
    ],
    [activeShopId, t],
  );

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
