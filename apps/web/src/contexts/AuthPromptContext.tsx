"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "./LanguageContext";
import AuthRequiredModal from "@/components/AuthRequiredModal";

type AuthPromptContextType = {
  openAuthPrompt: () => void;
  closeAuthPrompt: () => void;
};

const AuthPromptContext = createContext<AuthPromptContextType | undefined>(
  undefined,
);

export function AuthPromptProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useLanguage();
  const [isAuthPromptOpen, setIsAuthPromptOpen] = useState(false);

  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/forgot-password");

  useEffect(() => {
    if (isAuthPage) {
      setIsAuthPromptOpen(false);
    }
  }, [isAuthPage, pathname]);

  const openAuthPrompt = () => setIsAuthPromptOpen(true);
  const closeAuthPrompt = () => setIsAuthPromptOpen(false);

  return (
    <AuthPromptContext.Provider value={{ openAuthPrompt, closeAuthPrompt }}>
      {children}
      <AuthRequiredModal
        open={isAuthPromptOpen}
        title={t("history.authRequiredTitle")}
        message={t("history.authRequiredMessage")}
        actionText={t("history.authRequiredAction")}
        onClose={closeAuthPrompt}
        onAction={() => {
          closeAuthPrompt();
          router.push("/login");
        }}
      />
    </AuthPromptContext.Provider>
  );
}

export function useAuthPrompt() {
  const context = useContext(AuthPromptContext);
  if (!context) {
    throw new Error("useAuthPrompt must be used within AuthPromptProvider");
  }

  return context;
}
