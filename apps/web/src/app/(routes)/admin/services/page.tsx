"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ChevronLeft,
  Clock3,
  Loader2,
  PenLine,
  Plus,
  Search,
  Scissors,
  Menu,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import useApiQuery from "@/hooks/useApiQuery";
import { API_ENDPOINTS, getStoredAuth } from "@/lib/api";
import AdminSidebar from "@/components/AdminSidebar";
import { useAdminSidebar } from "@/hooks/useAdminSidebar";

type AdminService = {
  id: string;
  name: string;
  description: string | null;
  price: string;
  durationMin: number;
  isActive: boolean;
  shopId: string;
  bufferTime: number | null;
  shop?: {
    name?: string;
  };
};

const headersByShop = (shopId: string) => ({
  "x-shopid": shopId,
  "x-shop-id": shopId,
});

const toPriceLabel = (price: string, priceUnit: string) => {
  const parsed = Number(price);
  if (Number.isNaN(parsed)) {
    return `${price} ${priceUnit}`;
  }
  if (Number.isInteger(parsed)) {
    return `${parsed.toFixed(0)} ${priceUnit}`;
  }
  return `${parsed.toFixed(2)} ${priceUnit}`;
};

export default function AdminServicesPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [persistedShopId, setPersistedShopId] = useState<string | null>(null);
  const [hasLoadedPersistedShop, setHasLoadedPersistedShop] =
    useState<boolean>(false);
  const [pendingIds, setPendingIds] = useState<Record<string, boolean>>({});
  const [toggleError, setToggleError] = useState<string | null>(null);
  const [servicesState, setServicesState] = useState<AdminService[]>([]);

  const shopIdFromQuery = searchParams.get("shopId");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem("selected_shop_id");
    if (saved) {
      setPersistedShopId(saved);
    }
    setHasLoadedPersistedShop(true);
  }, []);

  const activeShopId = useMemo(() => {
    if (!hasLoadedPersistedShop) return null;

    const userShops = user?.shops || [];
    if (
      shopIdFromQuery &&
      userShops.some((shop) => shop.id === shopIdFromQuery)
    ) {
      return shopIdFromQuery;
    }
    if (
      persistedShopId &&
      userShops.some((shop) => shop.id === persistedShopId)
    ) {
      return persistedShopId;
    }

    return userShops[0]?.id || null;
  }, [hasLoadedPersistedShop, persistedShopId, shopIdFromQuery, user?.shops]);

  const {
    isSidebarVisible,
    isSidebarClosing,
    openSidebar,
    closeSidebar,
    adminNavItems,
    getAdminHrefWithShopId,
  } = useAdminSidebar(activeShopId);

  useEffect(() => {
    if (
      !hasLoadedPersistedShop ||
      !activeShopId ||
      typeof window === "undefined"
    ) {
      return;
    }
    window.localStorage.setItem("selected_shop_id", activeShopId);
  }, [activeShopId, hasLoadedPersistedShop]);

  const {
    data: services,
    isLoading,
    isError,
    error,
    refetch,
  } = useApiQuery<AdminService[]>(
    activeShopId
      ? `${API_ENDPOINTS.admin.services}?shopId=${activeShopId}`
      : null,
    {
      key: ["admin-services", activeShopId || "none"],
      enabled: Boolean(activeShopId && user),
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      headers: activeShopId ? headersByShop(activeShopId) : undefined,
    },
  );

  const { data: pendingFromCache = [] } = useQuery<string[]>({
    queryKey: ["admin-services-pending", activeShopId || "none"],
    queryFn: () =>
      (queryClient.getQueryData<string[]>([
        "admin-services-pending",
        activeShopId || "none",
      ]) ?? []) as string[],
    enabled: Boolean(activeShopId),
  });

  useEffect(() => {
    if (!services) return;

    // update pendingIds state from reactive query
    if (pendingFromCache && pendingFromCache.length > 0) {
      const pendingMap: Record<string, boolean> = {};
      for (const id of pendingFromCache) pendingMap[id] = true;
      setPendingIds((current) => ({ ...current, ...pendingMap }));

      // Merge server services into previous state to preserve order for pending items
      setServicesState((prev) => {
        if (!prev) return services;

        const serverMap = new Map(services.map((s) => [s.id, s]));

        const merged = prev.map((item) => serverMap.get(item.id) ?? item);

        // append any new items from server that weren't in prev
        const missing = services.filter(
          (s) => !prev.some((p) => p.id === s.id),
        );

        return [...merged, ...missing];
      });
    } else {
      setPendingIds({});
      setServicesState(services);
    }
  }, [services, activeShopId, pendingFromCache]);

  const displayedServices = servicesState;

  const filteredServices = useMemo<AdminService[]>(() => {
    const q = search.toLowerCase().trim();

    return displayedServices.filter((service) => {
      const matchesSearch =
        !q ||
        service.name.toLowerCase().includes(q) ||
        service.durationMin.toString().includes(q) ||
        service.price.toString().includes(q);

      return matchesSearch;
    });
  }, [displayedServices, search]);

  const activeServices = filteredServices.filter((service) => service.isActive);
  const inactiveServices = filteredServices.filter(
    (service) => !service.isActive,
  );
  const totalActive = displayedServices.filter(
    (service) => service.isActive,
  ).length;

  const toggleService = async (id: string) => {
    if (!activeShopId || pendingIds[id]) return;

    const current = displayedServices.find((service) => service.id === id);
    if (!current) return;

    const previousIsActive = current.isActive;

    try {
      setToggleError(null);
      setPendingIds((current) => ({ ...current, [id]: true }));
      setServicesState((currentState) =>
        currentState.map((service) =>
          service.id === id
            ? {
                ...service,
                isActive: !service.isActive,
              }
            : service,
        ),
      );

      const token = getStoredAuth()?.token;
      const res = await fetch(API_ENDPOINTS.admin.toggleServiceActive, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...headersByShop(activeShopId),
        },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        const message =
          body && typeof body.message === "string"
            ? body.message
            : t("admin.services.error.toggleFailed");
        throw new Error(message);
      }
    } catch (err) {
      setServicesState((currentState) =>
        currentState.map((service) =>
          service.id === id
            ? {
                ...service,
                isActive: previousIsActive,
              }
            : service,
        ),
      );
      setToggleError(
        err instanceof Error
          ? err.message
          : t("admin.services.error.toggleFailed"),
      );
    } finally {
      setPendingIds((current) => ({ ...current, [id]: false }));
      void refetch();
    }
  };

  const getServiceEditHref = (serviceId: string) => {
    const params = new URLSearchParams();
    params.set("serviceId", serviceId);

    if (activeShopId) {
      params.set("shopId", activeShopId);
    }

    return `/admin/services/edit?${params.toString()}`;
  };

  const renderProfileStyleToggle = (enabled: boolean, id: string) => (
    <button
      type="button"
      onClick={() => void toggleService(id)}
      disabled={pendingIds[id]}
      className={`relative h-7 w-12 rounded-full transition-colors duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22c55e]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent ${
        enabled ? "bg-[#22c55e]" : "bg-[#d7dbe3]"
      }`}
      aria-label={t("admin.services.aria.toggleService")}
      aria-pressed={enabled}
    >
      <span
        className={`absolute top-0.75 h-5 w-5 rounded-full transition-all duration-200 ${
          enabled ? "left-6 bg-white" : "left-1 bg-white"
        }`}
      />
    </button>
  );

  const renderServiceCardSkeleton = (key: string) => (
    <article
      key={key}
      className="overflow-hidden rounded-[24px] bg-white p-4 shadow-[0_10px_25px_rgba(17,24,39,0.04)] ring-1 ring-black/5"
    >
      <div className="animate-pulse">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="h-6 w-36 rounded-full bg-[#eceff3]" />
            <div className="mt-2 h-4 w-28 rounded-full bg-[#eceff3]" />
          </div>
          <div className="h-14 w-14 rounded-full bg-[#fff2e4]" />
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-[#fff2e4]" />
            <div className="h-3 w-24 rounded-full bg-[#eceff3]" />
          </div>
          <div className="h-7 w-12 rounded-full bg-[#eceff3]" />
        </div>
      </div>
    </article>
  );

  return (
    <div className="min-h-dvh bg-[#f4f4f4]">
      <AdminSidebar
        isVisible={isSidebarVisible}
        isClosing={isSidebarClosing}
        currentShopName={
          activeShopId
            ? (user?.shops || []).find((s) => s.id === activeShopId)?.name ||
              t("admin.services.title")
            : t("admin.services.title")
        }
        adminNavItems={adminNavItems}
        onClose={closeSidebar}
        getAdminHrefWithShopId={getAdminHrefWithShopId}
      />

      <div className="mx-auto w-full bg-[#f4f4f4] pb-4">
        <header className="sticky top-0 z-20 border-b border-[#dcdcdc] bg-[#f9f9f9]/95 px-4 py-3 backdrop-blur-sm">
          <div className="relative flex items-center justify-center">
            <button
              type="button"
              onClick={() => router.back()}
              className="absolute left-0 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#d7d7d7] text-[#9d9d9d] transition-transform duration-200 hover:scale-105 active:scale-95"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <h1 className="text-[18px] font-bold tracking-tight text-[#111111]">
              {t("admin.services.manageTitle")}
            </h1>

            <button
              type="button"
              onClick={openSidebar}
              className="absolute right-0 inline-flex h-9 w-9 items-center justify-center rounded-full text-[#b0b0b0] transition-colors duration-200 hover:bg-[#ececec]"
              aria-label={t("admin.services.aria.openSidebar")}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </header>

        <main className="px-4 md:px-5 lg:px-6 pt-4 md:pt-5 lg:pt-6">
          <div className="hidden md:flex md:flex-col md:gap-3 lg:gap-4">
            <Link
              href={getAdminHrefWithShopId("/admin/services/new")}
              className="inline-flex h-12 md:h-12 lg:h-14 w-full shrink-0 items-center justify-center gap-2 rounded-[18px] bg-[#F49B33] px-5 text-xs md:text-sm lg:text-sm font-semibold text-white shadow-[0_10px_24px_rgba(244,155,51,0.24)] transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0"
            >
              <Plus className="h-3.5 w-3.5 md:h-4 md:w-4 lg:h-4 lg:w-4" />
              <span>{t("admin.services.addService")}</span>
            </Link>

            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9aa0aa]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("admin.services.searchPlaceholder")}
                className="w-full rounded-[18px] border border-[#d7d7d7] bg-white py-3 md:py-4 lg:py-4 pl-11 pr-4 text-[13px] md:text-[15px] lg:text-[15px] text-[#2c3138] placeholder:text-[#9aa0aa] shadow-[0_10px_28px_rgba(17,24,39,0.04)] transition-all duration-200 focus:border-[#F49B33] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex md:hidden items-center gap-3">
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9aa0aa]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("admin.services.searchPlaceholder")}
                className="w-full rounded-full border border-[#d7d7d7] bg-white py-4 pl-11 pr-4 text-[15px] text-[#2c3138] placeholder:text-[#9aa0aa] shadow-[0_10px_28px_rgba(17,24,39,0.04)] transition-all duration-200 focus:border-[#F49B33] focus:outline-none"
              />
            </div>

            <Link
              href={getAdminHrefWithShopId("/admin/services/new")}
              aria-label={t("admin.services.aria.addService")}
              className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F49B33] text-white shadow-[0_10px_24px_rgba(244,155,51,0.24)] transition-transform duration-200 active:scale-95"
            >
              <Plus className="h-5 w-5" />
            </Link>
          </div>

          {!activeShopId && (
            <div className="mt-4 rounded-[18px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              {t("admin.services.noShopSelected")}
            </div>
          )}

          {isError && (
            <div className="mt-4 rounded-[18px] border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
              {(error?.data &&
                typeof error.data === "object" &&
                "message" in error.data &&
                typeof (error.data as { message?: unknown }).message ===
                  "string" &&
                (error.data as { message: string }).message) ||
                error?.message ||
                t("admin.services.error.loadFailed")}
            </div>
          )}

          {toggleError && (
            <div className="mt-4 rounded-[18px] border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
              {toggleError}
            </div>
          )}

          <section className="mt-4 md:mt-5 lg:mt-6 flex items-center justify-between">
            <div>
              <h2 className="mt-1 text-[15px] md:text-[16px] lg:text-[17px] font-medium text-[#8b95a1]">
                {t("admin.services.active")}
              </h2>
            </div>
            <span className="rounded-full bg-[#fff2e1] px-3 py-1 text-[10px] md:text-[10px] lg:text-[11px] font-semibold uppercase tracking-[0.18em] text-[#F49B33] shadow-[0_6px_14px_rgba(244,155,51,0.12)]">
              {t("admin.services.total", { count: totalActive })}
            </span>
          </section>

          <section className="mt-4 md:mt-4 lg:mt-5 space-y-3 md:space-y-4 lg:space-y-4">
            {isLoading ? (
              <>
                {renderServiceCardSkeleton("active-skeleton-1")}
                {renderServiceCardSkeleton("active-skeleton-2")}
                {renderServiceCardSkeleton("active-skeleton-3")}
              </>
            ) : activeServices.length > 0 ? (
              activeServices.map((service) => {
                const enabled = service.isActive;
                const isCardPending = Boolean(pendingIds[service.id]);

                return (
                  <article
                    key={service.id}
                    className={`relative overflow-hidden rounded-4xl bg-white p-3 md:p-4 lg:p-5 shadow-[0_10px_25px_rgba(17,24,39,0.04)] ring-1 ring-black/5 transition-transform duration-200 hover:-translate-y-0.5 ${
                      isCardPending ? "opacity-80" : ""
                    }`}
                  >
                    {isCardPending && (
                      <div className="absolute inset-0 z-20 flex items-center justify-center gap-2 bg-white/65 backdrop-blur-[1px]">
                        <Loader2 className="h-4 w-4 animate-spin text-[#F49B33]" />
                        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7f8894]">
                          {t("admin.services.updating")}
                        </span>
                      </div>
                    )}

                    <div className="flex items-start gap-2 md:gap-3 lg:gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2 md:gap-3 lg:gap-3">
                          <div>
                            <h3 className="text-[16px] md:text-[17px] lg:text-[18px] font-bold tracking-tight text-[#111827]">
                              {service.name}
                            </h3>
                            <div className="mt-1 flex items-center gap-2 text-[11px] md:text-[12px] lg:text-[12px] text-[#8b95a1]">
                              <Clock3 className="h-3 w-3 md:h-3.5 md:w-3.5 lg:h-3.5 lg:w-3.5" />
                              <span>
                                {service.durationMin} {t("services.duration")}
                              </span>
                              <span className="text-[#d8dbe1]">•</span>
                              <span>
                                {toPriceLabel(
                                  service.price,
                                  t("services.price"),
                                )}
                              </span>
                            </div>
                          </div>
                          <div className="inline-flex min-h-12 md:min-h-13 lg:min-h-14 min-w-12 md:min-w-13 lg:min-w-14 items-center justify-center rounded-3xl md:rounded-3xl lg:rounded-3xl bg-[#fff2e4] px-2 md:px-3 lg:px-3 py-1.5 md:py-2 lg:py-2">
                            <p className="text-2xl md:text-3xl lg:text-4xl font-bold leading-none tracking-tight text-[#F49B33]">
                              {toPriceLabel(service.price, t("services.price"))}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 md:mt-4 lg:mt-4 flex items-center justify-between gap-2 md:gap-3 lg:gap-3">
                          <div className="flex items-center gap-2">
                            <span className="flex h-7 md:h-8 lg:h-8 w-7 md:w-8 lg:w-8 items-center justify-center rounded-full bg-[#fff2e4] text-[#F49B33]">
                              <Scissors className="h-3.5 w-3.5 md:h-4 md:w-4 lg:h-4 lg:w-4" />
                            </span>
                            <span className="text-[9px] md:text-[10px] lg:text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7f8894]">
                              {service.bufferTime
                                ? t("admin.services.buffer", {
                                    minutes: service.bufferTime,
                                  })
                                : t("admin.services.noBuffer")}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 md:gap-2 lg:gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                router.push(getServiceEditHref(service.id))
                              }
                              aria-label={t("admin.services.aria.editService")}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#8f98a4] transition-colors hover:bg-[#f3f4f6]"
                            >
                              <PenLine className="h-4 w-4" />
                            </button>
                            {renderProfileStyleToggle(enabled, service.id)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })
            ) : (
              <div className="rounded-[24px] border border-dashed border-[#d5d9df] bg-white px-4 py-8 text-center text-sm text-[#8b95a1]">
                {t("admin.services.noActiveMatches")}
              </div>
            )}
          </section>

          <section className="mt-6 md:mt-7 lg:mt-8">
            <h3 className="mt-1 text-[15px] md:text-[16px] lg:text-[17px] font-medium text-[#8b95a1]">
              {t("admin.services.inactive")}
            </h3>

            <div className="mt-4 md:mt-4 lg:mt-5 space-y-2 md:space-y-3 lg:space-y-3 rounded-4xl bg-white p-3 md:p-4 lg:p-5 shadow-[0_10px_25px_rgba(17,24,39,0.04)] ring-1 ring-black/5">
              {isLoading && (
                <>
                  <div className="h-14 animate-pulse rounded-2xl bg-[#f3f4f6]" />
                  <div className="h-14 animate-pulse rounded-2xl bg-[#f3f4f6]" />
                </>
              )}

              {inactiveServices.length === 0 && !isLoading && (
                <div className="rounded-xl border border-dashed border-[#d5d9df] px-4 py-6 text-center text-sm text-[#8b95a1]">
                  {t("admin.services.noInactive")}
                </div>
              )}

              {inactiveServices.map((service) => {
                const enabled = service.isActive;
                const isCardPending = Boolean(pendingIds[service.id]);

                return (
                  <div
                    key={service.id}
                    className={`relative flex items-center gap-2 md:gap-3 lg:gap-3 rounded-2xl md:rounded-2xl lg:rounded-2xl py-0.5 md:py-1 lg:py-1 ${
                      isCardPending ? "opacity-80" : ""
                    }`}
                  >
                    {isCardPending && (
                      <div className="absolute inset-0 z-20 flex items-center justify-center gap-2 rounded-2xl bg-white/65 backdrop-blur-[1px]">
                        <Loader2 className="h-4 w-4 animate-spin text-[#F49B33]" />
                        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7f8894]">
                          {t("admin.services.updating")}
                        </span>
                      </div>
                    )}

                    <div className="flex h-9 md:h-10 lg:h-10 w-9 md:w-10 lg:w-10 items-center justify-center rounded-2xl md:rounded-2xl lg:rounded-2xl bg-[#f3f4f6] text-[#a4abb6]">
                      <Scissors className="h-4 w-4 md:h-5 md:w-5 lg:h-5 lg:w-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[15px] md:text-[16px] lg:text-[16px] font-semibold text-[#374151]">
                        {service.name}
                      </p>
                      <div className="mt-0.5 flex items-center gap-2 text-[10px] md:text-[11px] lg:text-[11px] text-[#98a0ab]">
                        <span>
                          {service.durationMin} {t("services.duration")}
                        </span>
                        <span className="text-[#d8dbe1]">•</span>
                        <span>
                          {toPriceLabel(service.price, t("services.price"))}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          router.push(getServiceEditHref(service.id))
                        }
                        className="mt-1 inline-flex items-center gap-1 text-[9px] md:text-[10px] lg:text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9aa1ab] transition-colors hover:text-[#F49B33]"
                      >
                        <PenLine className="h-3 w-3 md:h-3.5 md:w-3.5 lg:h-3.5 lg:w-3.5" />
                        {t("admin.services.edit")}
                      </button>
                    </div>

                    {renderProfileStyleToggle(enabled, service.id)}
                  </div>
                );
              })}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
