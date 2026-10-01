"use client";

import { usePathname } from "next/navigation";
import { useProviderMode } from "@/contexts/ProviderModeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthPrompt } from "@/contexts/AuthPromptContext";
import UserPanelBottomNav from "./UserPanelBottomNav";
import AdminPanelBottomNav from "./AdminPanelBottomNav";

export default function BottomNav() {
  const pathname = usePathname();

  const { user } = useAuth();
  const { providerMode } = useProviderMode();
  const { openAuthPrompt } = useAuthPrompt();

  const isOnAdminRoute = pathname.startsWith("/admin");
  const isOnProfileRoute = pathname.startsWith("/profile");
  const isAdmin =
    user?.role === "ADMIN" &&
    (isOnAdminRoute || (providerMode && isOnProfileRoute));

  const isActive = (patterns: string[]) => {
    return patterns.some((pattern) => {
      const regex = new RegExp(pattern);
      return regex.test(pathname);
    });
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 md:hidden">
      <div className="relative h-16 overflow-hidden">
        <UserPanelBottomNav
          openAuthPrompt={openAuthPrompt}
          isAdmin={isAdmin}
          isActive={isActive}
          user={user}
        />

        <AdminPanelBottomNav isAdmin={isAdmin} isActive={isActive} />
      </div>
    </nav>
  );
}
