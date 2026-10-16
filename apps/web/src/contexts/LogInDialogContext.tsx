"use client";

import React, { createContext, useContext, useState } from "react";
import AuthRequiredDialog from "@/components/AuthRequiredDialog";

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
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return (
    <LogInDialogContext.Provider value={{ open, close }}>
      {children}
      <AuthRequiredDialog
        open={isOpen}
        onClose={close}
      />
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
