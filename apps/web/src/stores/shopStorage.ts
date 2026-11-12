import { Shop } from "@noq/shared";

const STORAGE_EVENT = "shop-storage-change";

interface ShopSnapshot {
    selectedShopId: string | null;
    shop: Shop | null;
    isReady: boolean;
}

let cachedRawValue: string | null = null;
let cachedSelectedId: string | null = null;
let cachedSnapshot: ShopSnapshot = {
    selectedShopId: null,
    shop: null,
    isReady: false,
};

const serverSnapshot: ShopSnapshot = {
    selectedShopId: null,
    shop: null,
    isReady: false,
};

export function getShopSnapshot(): ShopSnapshot {
    const rawShop = localStorage.getItem("shop");
    const selectedShopId = localStorage.getItem("selected_shop_id");

    if (
        rawShop === cachedRawValue &&
        selectedShopId === cachedSelectedId
    ) {
        return cachedSnapshot;
    }

    cachedRawValue = rawShop;
    cachedSelectedId = selectedShopId;

    let shop: Shop | null = null;

    try {
        shop = rawShop ? JSON.parse(rawShop) : null;
    } catch {
        shop = null;
    }

    cachedSnapshot = {
        selectedShopId,
        shop: shop?.id === selectedShopId ? shop : null,
        isReady: true,
    };

    return cachedSnapshot;
}

export function getServerShopSnapshot(): ShopSnapshot {
    return serverSnapshot;
}

export function subscribeShop(callback: () => void) {
    window.addEventListener("storage", callback);
    window.addEventListener(STORAGE_EVENT, callback);

    return () => {
        window.removeEventListener("storage", callback);
        window.removeEventListener(STORAGE_EVENT, callback);
    };
}

export function notifyShopStorageChanged() {
    window.dispatchEvent(new Event(STORAGE_EVENT));
}

export function saveShopToStorage(shop: Shop | null) {
    if (shop) {
        localStorage.setItem("shop", JSON.stringify(shop));
    } else {
        localStorage.removeItem("shop");
    }

    notifyShopStorageChanged();
}