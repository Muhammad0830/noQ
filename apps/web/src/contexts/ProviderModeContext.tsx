"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type ProviderModeContextType = {
  providerMode: boolean;
  setProviderMode: React.Dispatch<React.SetStateAction<boolean>>;
};

const ProviderModeContext = createContext<ProviderModeContextType | undefined>(
  undefined,
);

export function ProviderModeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [providerMode, setProviderMode] = useState<boolean>(() => {
    const raw = localStorage.getItem("providerMode");
    const parsed = raw ? JSON.parse(raw) : false;
    return Boolean(parsed);
  });

  useEffect(() => {
    localStorage.setItem("providerMode", providerMode ? "true" : "false");
  }, [providerMode]);

  return (
    <ProviderModeContext.Provider value={{ providerMode, setProviderMode }}>
      {children}
    </ProviderModeContext.Provider>
  );
}

export function useProviderMode() {
  const ctx = useContext(ProviderModeContext);
  if (!ctx) {
    throw new Error("useProviderMode must be used within ProviderModeProvider");
  }
  return ctx;
}

export default ProviderModeContext;
