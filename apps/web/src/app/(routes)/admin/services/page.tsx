"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ChevronLeft,
  Clock3,
  Loader2,
  MoreVertical,
  PenLine,
  Plus,
  Search,
  Scissors,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import useApiQuery from "@/hooks/useApiQuery";
import { API_ENDPOINTS, getStoredAuth } from "@/lib/api";

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

const toPriceLabel = (price: string) => {
  const parsed = Number(price);
  if (Number.isNaN(parsed)) {
    return `$${price}`;
  }
  if (Number.isInteger(parsed)) {
    return `$${parsed.toFixed(0)}`;
  }
  return `$${parsed.toFixed(2)}`;
};

export default function AdminServicesPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
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

  useEffect(() => {
    if (!services) return;
    setServicesState(services);
  }, [services]);

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
            : "Failed to toggle service";
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
      setToggleError(err instanceof Error ? err.message : "Toggle failed");
    } finally {
      setPendingIds((current) => ({ ...current, [id]: false }));
      void refetch();
    }
  };

  const getAdminHrefWithShopId = (path: string) => {
    if (!activeShopId) return path;
    return `${path}?shopId=${encodeURIComponent(activeShopId)}`;
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
      className={`relative h-7 w-12 rounded-full border transition-colors duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F49B33]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent ${
        enabled
          ? "border-[#F49B33]/60 bg-[#F49B33]/25 dark:border-[#F49B33]/70 dark:bg-[#F49B33]/35"
          : "border-slate-300 bg-slate-200 dark:border-white/25 dark:bg-white/10"
      }`}
      aria-label={`Toggle ${id}`}
      aria-pressed={enabled}
    >
      <span
        className={`absolute top-0.75 h-5 w-5 rounded-full ring-1 transition-all duration-200 ${
          enabled
            ? "left-6 bg-[#F49B33] ring-[#F49B33]/60 dark:bg-[#F49B33] dark:ring-[#F49B33]/70"
            : "left-1 bg-white ring-slate-300 dark:bg-slate-100 dark:ring-white/35"
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
              Manage Services
            </h1>

            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="absolute right-0 inline-flex h-9 w-9 items-center justify-center rounded-full text-[#b0b0b0] transition-colors duration-200 hover:bg-[#ececec]"
              aria-label="Open services menu"
            >
              <MoreVertical className="h-5 w-5" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-11 w-44 rounded-xl border border-[#e5e7eb] bg-white p-1 shadow-lg">
                <button
                  type="button"
                  onClick={() =>
                    router.push(getAdminHrefWithShopId("/admin/services/new"))
                  }
                  className="w-full rounded-lg px-3 py-2 text-left text-xs font-medium text-[#4d5560] transition-colors hover:bg-[#f7f7f7]"
                >
                  Add Service
                </button>
                <button
                  type="button"
                  className="w-full rounded-lg px-3 py-2 text-left text-xs font-medium text-[#4d5560] transition-colors hover:bg-[#f7f7f7]"
                >
                  Export Catalog
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="px-4 pt-4">
          <div className="hidden sm:flex sm:flex-col sm:gap-3">
            <Link
              href={getAdminHrefWithShopId("/admin/services/new")}
              className="inline-flex h-14 w-full shrink-0 items-center justify-center gap-2 rounded-[18px] bg-[#F49B33] px-5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(244,155,51,0.24)] transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0"
            >
              <Plus className="h-4 w-4" />
              <span>Add Service</span>
            </Link>

            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9aa0aa]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search service by name or duration"
                className="w-full rounded-[18px] border border-[#d7d7d7] bg-white py-4 pl-11 pr-4 text-[15px] text-[#2c3138] placeholder:text-[#9aa0aa] shadow-[0_10px_28px_rgba(17,24,39,0.04)] transition-all duration-200 focus:border-[#F49B33] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 sm:hidden">
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9aa0aa]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search service by name or duration"
                className="w-full rounded-full border border-[#d7d7d7] bg-white py-4 pl-11 pr-4 text-[15px] text-[#2c3138] placeholder:text-[#9aa0aa] shadow-[0_10px_28px_rgba(17,24,39,0.04)] transition-all duration-200 focus:border-[#F49B33] focus:outline-none"
              />
            </div>

            <Link
              href={getAdminHrefWithShopId("/admin/services/new")}
              aria-label="Add service"
              className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F49B33] text-white shadow-[0_10px_24px_rgba(244,155,51,0.24)] transition-transform duration-200 active:scale-95"
            >
              <Plus className="h-5 w-5" />
            </Link>
          </div>

          {!activeShopId && (
            <div className="mt-4 rounded-[18px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Shop tanlanmagan. Avval admin dashboarddan shop tanlang.
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
                "Failed to load services"}
            </div>
          )}

          {toggleError && (
            <div className="mt-4 rounded-[18px] border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
              {toggleError}
            </div>
          )}

          <section className="mt-5 flex items-center justify-between">
            <div>
              <h2 className="mt-1 text-[17px] font-medium text-[#8b95a1]">
                Active Services
              </h2>
            </div>
            <span className="rounded-full bg-[#fff2e1] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#F49B33] shadow-[0_6px_14px_rgba(244,155,51,0.12)]">
              {totalActive} Total
            </span>
          </section>

          <section className="mt-4 space-y-4">
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
                    className={`relative overflow-hidden rounded-[24px] bg-white p-4 shadow-[0_10px_25px_rgba(17,24,39,0.04)] ring-1 ring-black/5 transition-transform duration-200 hover:-translate-y-0.5 ${
                      isCardPending ? "opacity-80" : ""
                    }`}
                  >
                    {isCardPending && (
                      <div className="absolute inset-0 z-20 flex items-center justify-center gap-2 bg-white/65 backdrop-blur-[1px]">
                        <Loader2 className="h-4 w-4 animate-spin text-[#F49B33]" />
                        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7f8894]">
                          Updating
                        </span>
                      </div>
                    )}

                    <div className="flex items-start gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="text-[18px] font-bold tracking-tight text-[#111827]">
                              {service.name}
                            </h3>
                            <div className="mt-1 flex items-center gap-2 text-[12px] text-[#8b95a1]">
                              <Clock3 className="h-3.5 w-3.5" />
                              <span>{service.durationMin} min</span>
                              <span className="text-[#d8dbe1]">•</span>
                              <span>{toPriceLabel(service.price)}</span>
                            </div>
                          </div>
                          <div className="inline-flex min-h-14 min-w-14 items-center justify-center rounded-[18px] bg-[#fff2e4] px-3 py-2">
                            <p className="text-[32px] font-bold leading-none tracking-tight text-[#F49B33]">
                              {toPriceLabel(service.price)}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#fff2e4] text-[#F49B33]">
                              <Scissors className="h-4 w-4" />
                            </span>
                            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7f8894]">
                              {service.bufferTime
                                ? `Buffer ${service.bufferTime} min`
                                : "No buffer"}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                router.push(getServiceEditHref(service.id))
                              }
                              aria-label={`Edit ${service.name}`}
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
                No active services matched your search.
              </div>
            )}
          </section>

          <section className="mt-6">
            <h3 className="mt-1 text-[17px] font-medium text-[#8b95a1]">
              Inactive Services
            </h3>

            <div className="mt-4 space-y-3 rounded-[24px] bg-white p-4 shadow-[0_10px_25px_rgba(17,24,39,0.04)] ring-1 ring-black/5">
              {isLoading && (
                <>
                  <div className="h-14 animate-pulse rounded-2xl bg-[#f3f4f6]" />
                  <div className="h-14 animate-pulse rounded-2xl bg-[#f3f4f6]" />
                </>
              )}

              {inactiveServices.length === 0 && !isLoading && (
                <div className="rounded-xl border border-dashed border-[#d5d9df] px-4 py-6 text-center text-sm text-[#8b95a1]">
                  No inactive services found.
                </div>
              )}

              {inactiveServices.map((service) => {
                const enabled = service.isActive;
                const isCardPending = Boolean(pendingIds[service.id]);

                return (
                  <div
                    key={service.id}
                    className={`relative flex items-center gap-3 rounded-2xl py-1 ${
                      isCardPending ? "opacity-80" : ""
                    }`}
                  >
                    {isCardPending && (
                      <div className="absolute inset-0 z-20 flex items-center justify-center gap-2 rounded-2xl bg-white/65 backdrop-blur-[1px]">
                        <Loader2 className="h-4 w-4 animate-spin text-[#F49B33]" />
                        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7f8894]">
                          Updating
                        </span>
                      </div>
                    )}

                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f3f4f6] text-[#a4abb6]">
                      <Scissors className="h-5 w-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[16px] font-semibold text-[#374151]">
                        {service.name}
                      </p>
                      <div className="mt-0.5 flex items-center gap-2 text-[11px] text-[#98a0ab]">
                        <span>{service.durationMin} min</span>
                        <span className="text-[#d8dbe1]">•</span>
                        <span>{toPriceLabel(service.price)}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          router.push(getServiceEditHref(service.id))
                        }
                        className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9aa1ab] transition-colors hover:text-[#F49B33]"
                      >
                        <PenLine className="h-3.5 w-3.5" />
                        Edit
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
