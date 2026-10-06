"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProviderModeProvider } from "@/contexts/ProviderModeContext";
import QueryProvider from "@/contexts/ReactQueryProvider";
import { LogInDialogProvider } from "@/contexts/LogInDialogContext";

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <AuthProvider>
          <ProviderModeProvider>
            <LogInDialogProvider>
              {children}
            </LogInDialogProvider>
          </ProviderModeProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}
