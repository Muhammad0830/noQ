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
  const [providerMode, setProviderMode] = useState<boolean>(typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("selected_shop_id") ?? 'false') : false);

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
