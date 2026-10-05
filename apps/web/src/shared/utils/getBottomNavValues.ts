import { 
  Home, 
  Search, 
  History, 
  User, 
  LayoutDashboard, 
  Scissors, 
  BarChart2, 
  type LucideIcon 
} from "lucide-react";
import { Route } from "next";

export type NavItem = {
  href: Route;
  labelKey: string;
  defaultLabel?: string;
  icon: LucideIcon;
  activePatterns: string[];
};

export const ADMIN_NAV_ITEMS: NavItem[] = [
  {
    href: "/admin",
    labelKey: "bottomNav.panel",
    defaultLabel: "Dash",
    icon: LayoutDashboard,
    activePatterns: ["^/admin$"],
  },
  {
    href: "/admin/services",
    labelKey: "bottomNav.services",
    icon: Scissors,
    activePatterns: ["^/admin/services"],
  },
    {
    href: "/admin/history",
    labelKey: "bottomNav.history",
    defaultLabel: "History",
    icon: History,
    activePatterns: ["^/admin/history"],
    },
  {
    href: "/admin/analytics",
    labelKey: "bottomNav.analytics",
    defaultLabel: "Analytics",
    icon: BarChart2,
      activePatterns: ["^/admin/analytics"],
  },
      {
    href: "/profile",
    labelKey: "bottomNav.profile",
    defaultLabel: "Profile",
    icon: User,
    activePatterns: ["^/profile"],
    },
];

export const USER_NAV_ITEMS: NavItem[] = [
    {
    href: "/user",
    labelKey: "bottomNav.home",
    defaultLabel: "Home",
    icon: Home,
    activePatterns: ["^/user$", "^/user/home"],
  },
      {
    href: "/user/discover",
    labelKey: "bottomNav.discover",
    defaultLabel: "Home",
    icon: Search,
    activePatterns: ["^/user/discover"],
  },
        {
    href: "/user/bookings",
    labelKey: "bottomNav.history",
    defaultLabel: "Home",
    icon: History,
    activePatterns: ["^/user/bookings"],
  },
        {
    href: "/profile",
    labelKey: "bottomNav.profile",
    defaultLabel: "Profile",
    icon: User,
    activePatterns: ["^/profile", "^/user/settings"],
  },
]