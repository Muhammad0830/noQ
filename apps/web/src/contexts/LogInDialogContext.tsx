"use client";

import React, { createContext, useContext, useState } from "react";
import { usePathname } from "next/navigation";
import AuthRequiredDialog from "@/components/AuthRequiredDialog";
import { useAuth } from "./AuthContext";

type LogInDialogContextType = {
  open: () => void;
  close: () => void;
};

const LogInDialogContext = createContext<LogInDialogContextType | undefined>(
  undefined,
);

export function LogInDialogProvider({ children }: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/forgot-password");

  const shouldShowLoginDialog = isOpen && !isAuthPage && !isAuthenticated;

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return (
    <LogInDialogContext.Provider value={{ open, close }}>
      {children}
      {shouldShowLoginDialog && <AuthRequiredDialog
        open={isOpen}
        onClose={close}
      />}
    </LogInDialogContext.Provider>
  );
}

export function useLoginDialog() {
  const context = useContext(LogInDialogContext);
  if (!context) {
    throw new Error("useLoginDialog must be used within LoginDialogProvider");
  }

  return context;
}
