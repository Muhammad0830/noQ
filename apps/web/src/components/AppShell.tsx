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

  const mainClassName = isAuthPage
    ? "min-h-[calc(100dvh-4rem)]"
    : "min-h-[calc(100dvh-8rem)] md:min-h-[calc(100dvh-4rem)] pb-16 md:pb-0";

  return (
    <>
      <Header />
      <main className={mainClassName}>{children}</main>
      <ConditionalBottomNav />
    </>
  );
}
