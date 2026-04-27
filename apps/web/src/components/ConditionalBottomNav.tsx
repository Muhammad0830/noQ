"use client";

import { usePathname } from "next/navigation";
import BottomNav from "./BottomNav";

export default function ConditionalBottomNav() {
  const pathname = usePathname();

  // Hide BottomNav on auth pages
  const hideOnPaths = [
    "/login",
    "/signup",
    "/forgot-password",
    "/admin/services/new",
    "/profile/add-business",
  ];
  const shouldHide = hideOnPaths.some((path) => pathname.startsWith(path));

  if (shouldHide) {
    return null;
  }

  return <BottomNav />;
}
