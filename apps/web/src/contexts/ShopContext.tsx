"use client";

import { Shop } from "@noq/shared";
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useSyncExternalStore
} from "react";
import { useAuth } from "./AuthContext";
import { useRouter } from "next/navigation";
import { Route } from "next";
import { useProviderMode } from "./ProviderModeContext";
import api, { API_ENDPOINTS } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import {
    getServerShopSnapshot,
    getShopSnapshot,
    saveShopToStorage,
    subscribeShop
} from "@/stores/shopStorage";

interface ShopContextType {
    shop: Shop | null;
    isShopLoading: boolean;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined)

export function ShopProvider({ children }: { children: ReactNode }) {
    const { user, isLoading } = useAuth();
    const { setProviderMode, providerMode } = useProviderMode();
    const router = useRouter();

    const { selectedShopId, shop, isReady } = useSyncExternalStore(
        subscribeShop,
        getShopSnapshot,
        getServerShopSnapshot
    );

    const isAdmin = !isLoading && user?.role === "ADMIN";

    const shopQuery = useQuery({
        queryKey: ["shopData", selectedShopId],
        queryFn: async () => {
            if (selectedShopId) {
                const response = await api.get(API_ENDPOINTS.shopById(selectedShopId))

                return response.data;
            }
        },
        enabled: providerMode &&
            !!selectedShopId &&
            !isLoading &&
            !shop &&
            isAdmin,
        staleTime: 5 * 60 * 1000,
    });

    useEffect(() => {
        if (
            !shopQuery.data ||
            selectedShopId !== shopQuery.data.id
        ) {
            return;
        }

        saveShopToStorage(shopQuery.data);
    }, [shopQuery.data, selectedShopId]);

    useEffect(() => {
        if (isLoading) {
            return;
        }

        if (!providerMode) {
            router.replace("/profile" as Route);
            return;
        }

        if (!user) {
            setProviderMode(false);
            router.replace("/login" as Route);
            return;
        }

        if (!isAdmin || !selectedShopId) {
            setProviderMode(false);
            router.replace("/profile" as Route);
            return;
        }
    }, [
        router,
        user,
        isAdmin,
        isLoading,
        providerMode,
        selectedShopId,
        setProviderMode
    ])

    return (
        <ShopContext.Provider value={{
            shop: shop,
            isShopLoading: shopQuery.isLoading ||
                isLoading ||
                !isReady,
        }} >
            {children}
        </ShopContext.Provider>
    )
}

export function useShop() {
    const ctx = useContext(ShopContext);

    if (!ctx) {
        throw new Error("useShop must be used inside ShopProvider")
    }

    return ctx;
}