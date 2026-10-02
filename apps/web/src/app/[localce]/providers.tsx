"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProviderModeProvider } from "@/contexts/ProviderModeContext";
import QueryProvider from "@/contexts/ReactQueryProvider";

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
      <QueryProvider>
        <ThemeProvider>
          <AuthProvider>
            <ProviderModeProvider>{children}</ProviderModeProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryProvider>
  );
}
