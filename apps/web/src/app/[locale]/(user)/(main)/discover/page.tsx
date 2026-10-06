"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Clock3 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import ShopCard from "@/components/ShopCard";
import AppSearchInput from "@/components/AppSearchInput";
import { API_ENDPOINTS } from "@/lib/api";
import type { Shop, ShopCategory } from "@shared/types/general_types";
import useApiQuery from "@/hooks/useApiQuery";
import { useLocale, useTranslations } from "next-intl";
import PopularShopsSkeleton from "@/components/user/discover/PopularShopsSkeleton";
import ServiceCardSkeleton from "@/components/user/discover/ServiceCardSkeleton";
import CompactShopRowSkeleton from "@/components/user/discover/CompactShopRowSkeleton";
import CompacyShopRowItem from "@/components/user/discover/CompactShopRowItem";
import { Route } from "next";
import { TrendingService } from "@/shared/types/Service";
import FilterDialog from "@/components/user/discover/FilterDialog";

const SKELETON_COUNT = 10;
const COMPACT_SHOP_ROW_SKELETON_COUNT = 5;

type ShopsListResponse =
  | Shop[]
  | {
      shops?: Shop[];
    };

interface FilterType {
  categories: string[];
  priceEnabled: boolean;
  minPrice: number;
  maxPrice: number;
}

const defaultFilter: FilterType = {
  categories: [],
  priceEnabled: false,
  minPrice: 0,
  maxPrice: 1000000,
};

export default function Page() {
  const t = useTranslations();
  const locale = useLocale();
  const searchParams = useSearchParams();
  const initialCategoryId = searchParams.get("categoryId");
  const shouldFocusSearch = searchParams.get("focus") === "search";

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filter, setFilter] = useState<FilterType>(defaultFilter);
  const popularScrollRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [activePopularDot, setActivePopularDot] = useState(0);

  const { data: filterCategories = [] } = useApiQuery<ShopCategory[]>(
    API_ENDPOINTS.categories,
    {
      key: ["discover-filter-categories", locale],
    },
  );

  const hasAppliedFilters = filter.categories.length > 0 || filter.priceEnabled;

  const hasCategoryFilter = filter.categories.length > 0;
  const isPriceOnlyFilter = filter.priceEnabled && !hasCategoryFilter;
  const isTypingSearch = search.trim() !== debouncedSearch;

  const searchOnlyMode = search.trim().length > 0 && !hasAppliedFilters;
  const shouldShowContent = !(
    isSearchFocused &&
    search.trim().length === 0 &&
    !hasAppliedFilters
  );
  const shouldShowShops = shouldShowContent;
  const shouldShowServices =
    shouldShowContent &&
    !isTypingSearch &&
    (isPriceOnlyFilter ||
      hasCategoryFilter ||
      searchOnlyMode ||
      !hasAppliedFilters);

  const searchTerm = debouncedSearch.toLowerCase().trim();
  const useListLayoutForShops = hasCategoryFilter || searchTerm.length > 0;

  useEffect(() => {
    if (!shouldFocusSearch) return;

    const timer = window.setTimeout(() => {
      searchInputRef.current?.focus();
      searchInputRef.current?.select();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [shouldFocusSearch]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [search]);

  const isSearching = debouncedSearch.trim().length > 0;
  const shouldUseFullCatalog = isSearching || hasAppliedFilters;

  const shopsUrl = shouldUseFullCatalog
    ? `${API_ENDPOINTS.shops}?limit=1000${isSearching ? `&search=${encodeURIComponent(debouncedSearch)}` : ""}`
    : `${API_ENDPOINTS.shops_trending}?search=${encodeURIComponent(debouncedSearch)}`;

  const servicesUrl = shouldUseFullCatalog
    ? `${API_ENDPOINTS.services}?limit=1000${isSearching ? `&search=${encodeURIComponent(debouncedSearch)}` : ""}${filter.priceEnabled ? `&minPrice=${filter.minPrice}&maxPrice=${filter.maxPrice}` : ""}`
    : `${API_ENDPOINTS.services_trending}?search=${encodeURIComponent(debouncedSearch)}`;

  const { data: popularShopsData, isLoading: isPopularShopsLoading } =
    useApiQuery<ShopsListResponse>(shopsUrl, {
      key: [
        "discover-popular-purchases",
        shouldUseFullCatalog ? "all-shops" : "trending-shops",
        debouncedSearch,
        filter.categories.join(","),
        filter.priceEnabled ? "price-on" : "price-off",
        filter.minPrice,
        filter.maxPrice,
      ],
    });

  const popularShops = useMemo<Shop[]>(() => {
    if (Array.isArray(popularShopsData)) {
      return popularShopsData;
    }

    if (popularShopsData && Array.isArray(popularShopsData.shops)) {
      return popularShopsData.shops;
    }

    return [];
  }, [popularShopsData]);

  const { data: popularServices = [], isLoading: isPopularServicesLoading } =
    useApiQuery<TrendingService[]>(servicesUrl, {
      key: [
        "discover-popular-services",
        shouldUseFullCatalog ? "all-services" : "trending-services",
        debouncedSearch,
        filter.categories.join(","),
        filter.priceEnabled ? "price-on" : "price-off",
        filter.minPrice,
        filter.maxPrice,
      ],
    });

  const filteredServices = useMemo(() => {
    return popularServices.filter((item) => {
      if (
        searchTerm &&
        !item.name.toLowerCase().includes(searchTerm) &&
        !(item.shop?.name ?? "").toLowerCase().includes(searchTerm)
      ) {
        return false;
      }

      if (filter.categories.length > 0) {
        const categoryId =
          item.shop?.category?.id ?? item.shop?.categoryId ?? "";
        if (!filter.categories.includes(categoryId)) {
          return false;
        }
      }

      if (filter.priceEnabled) {
        const priceValue = Number(item.price);
        if (!Number.isFinite(priceValue)) return false;
        if (priceValue < filter.minPrice || priceValue > filter.maxPrice) {
          return false;
        }
      }

      return true;
    });
  }, [popularServices, searchTerm, filter]);

  const filteredPopularShops = useMemo(() => {
    return popularShops.filter((shop) => {
      if (searchTerm && !shop.name.toLowerCase().includes(searchTerm)) {
        return false;
      }

      // Agar barcha kategoriyalar tanlangan bo'lsa, filterni qo'llama
      // filterCategories.length > 0 check - data loading bo'lganida to'g'ri ishlay
      if (
        filter.categories.length > 0 &&
        filterCategories.length > 0 &&
        filter.categories.length < filterCategories.length
      ) {
        const categoryId = shop.category?.id ?? shop.categoryId ?? "";
        if (!filter.categories.includes(categoryId)) {
          return false;
        }
      }

      return true;
    });
  }, [popularShops, searchTerm, filter.categories, filterCategories.length]);

  const shouldHideServicesSectionForEmptyCategory =
    hasCategoryFilter &&
    !isPopularServicesLoading &&
    filteredServices.length === 0;

  useEffect(() => {
    setActivePopularDot(0); // eslint-disable-line
    if (popularScrollRef.current) {
      popularScrollRef.current.scrollTo({ left: 0, behavior: "auto" });
    }
  }, [searchTerm, filter.categories]);

  const popularIndicatorCount = Math.max(1, filteredPopularShops.length);

  const updatePopularActiveDot = () => {
    const el = popularScrollRef.current;
    if (!el) return;

    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) {
      setActivePopularDot(0);
      return;
    }

    const progress = el.scrollLeft / maxScroll;
    setActivePopularDot(Math.round(progress * (popularIndicatorCount - 1)));
  };

  const scrollToPopularDot = (index: number) => {
    const el = popularScrollRef.current;
    if (!el) return;

    const maxScroll = el.scrollWidth - el.clientWidth;
    const target = (maxScroll * index) / Math.max(1, popularIndicatorCount - 1);
    el.scrollTo({ left: target, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto w-full max-w-md px-4 pb-4 pt-3">
        <AppSearchInput
          value={search}
          inputRef={searchInputRef}
          onValueChange={setSearch}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
          placeholder={t("user.hero.search_placeholder")}
          onClear={() => {
            setSearch("");
            setDebouncedSearch("");
          }}
          onFilterClick={() => setIsFilterOpen(true)}
        />

        {shouldShowShops && (
          <div className="mt-5">
            <p className="mb-3 text-sm font-semibold text-slate-700">
              {t("user.discover.popularShops")}
            </p>

            {isPopularShopsLoading ? (
              useListLayoutForShops ? (
                <div className="rounded-2xl border border-slate-200 bg-white px-2">
                  {Array.from({ length: COMPACT_SHOP_ROW_SKELETON_COUNT }).map(
                    (_, i) => (
                      <CompactShopRowSkeleton
                        key={`discover-popular-list-skeleton-${i}`}
                        isLast={i === SKELETON_COUNT - 1}
                      />
                    ),
                  )}
                </div>
              ) : (
                <div className="flex gap-4 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                  {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                    <div
                      key={`discover-popular-skeleton-${i}`}
                      className="w-[70vw] max-w-85 min-w-65 shrink-0"
                    >
                      <PopularShopsSkeleton />
                    </div>
                  ))}
                </div>
              )
            ) : filteredPopularShops.length > 0 ? (
              useListLayoutForShops ? (
                <div className="rounded-2xl border border-slate-200 bg-white px-2">
                  {filteredPopularShops.map((shop, index) => (
                    <CompacyShopRowItem
                      key={shop.id}
                      shop={shop}
                      isLast={index === filteredPopularShops.length - 1}
                    />
                  ))}
                </div>
              ) : (
                <>
                  <div className="sm:hidden">
                    <div
                      ref={popularScrollRef}
                      onScroll={updatePopularActiveDot}
                      className="flex gap-4 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                    >
                      {filteredPopularShops.map((shop) => (
                        <div
                          key={shop.id}
                          className="w-[70vw] max-w-85 min-w-65 shrink-0"
                        >
                          <ShopCard shop={shop} />
                        </div>
                      ))}
                    </div>

                    {popularIndicatorCount > 1 && (
                      <div className="mt-3 flex justify-center gap-2">
                        {Array.from({ length: popularIndicatorCount }).map(
                          (_, i) => (
                            <button
                              key={`popular-dot-${i}`}
                              type="button"
                              onClick={() => scrollToPopularDot(i)}
                              className={`h-2 w-2 rounded-full transition-colors ${
                                i === activePopularDot
                                  ? "bg-cyan-500"
                                  : "bg-slate-300"
                              }`}
                              aria-label={t("user.discover.goToCard", {
                                index: i + 1,
                              })}
                            />
                          ),
                        )}
                      </div>
                    )}
                  </div>

                  <div className="hidden gap-4 sm:grid sm:grid-cols-2">
                    {filteredPopularShops.slice(0, 4).map((shop) => (
                      <ShopCard key={shop.id} shop={shop} />
                    ))}
                  </div>
                </>
              )
            ) : (
              <div className="rounded-xl border border-slate-200 bg-white px-3 py-5 text-center text-sm text-slate-500 shadow-sm">
                {t("user.discover.noShopsFound")}
              </div>
            )}
          </div>
        )}

        {shouldShowServices && !shouldHideServicesSectionForEmptyCategory && (
          <div className="mt-6">
            <p className="mb-3 text-sm font-semibold text-slate-700">
              {t("user.services.title")}
            </p>
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-1 shadow-sm">
              {isPopularServicesLoading
                ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                    <ServiceCardSkeleton
                      key={`popular-service-skeleton-${i}`}
                    />
                  ))
                : filteredServices.map((item) => {
                    const priceValue =
                      item.price === null || item.price === undefined
                        ? Number.NaN
                        : Number(item.price);
                    const durationValue =
                      item.durationMin === null ||
                      item.durationMin === undefined
                        ? 0
                        : Number(item.durationMin);
                    const targetShopId = item.shopId || item.shop?.id;

                    return (
                      <Link
                        key={item.id}
                        href={
                          (targetShopId
                            ? `/book/${targetShopId}?service=${item.id}`
                            : "/discover") as Route
                        }
                        className="block border-b border-slate-200/70 py-4 last:border-b-0"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[15px] font-semibold text-slate-900 sm:text-base">
                              {item.name}
                            </p>
                            <p className="mt-1 flex items-center gap-1.5 text-[10px] tracking-wide text-slate-500">
                              <Clock3 className="h-4 w-4" />
                              <span className="truncate">
                                {Number.isFinite(durationValue)
                                  ? durationValue
                                  : 0}{" "}
                                {t("user.services.duration")} •{" "}
                                {item.shop?.name ??
                                  t("user.services.unknownShop")}
                              </span>
                            </p>
                          </div>

                          <div className="shrink-0 text-right">
                            <p className="text-[18px] font-bold text-slate-800 sm:text-xl">
                              {Number.isFinite(priceValue)
                                ? `${formatPrice(priceValue, locale)} ${t("common.currency")}`
                                : "--"}
                            </p>
                            <span className="mt-1 inline-block text-[10px] font-semibold text-emerald-500">
                              {t("user.services.book").toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}

              {!isPopularServicesLoading && filteredServices.length === 0 && (
                <div className="py-5 text-center text-sm text-slate-500">
                  {t("user.services.noResults")}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <FilterDialog
        key={isFilterOpen ? "open" : "closed"}
        initialCategoryId={initialCategoryId}
        categories={filterCategories}
        isOpen={isFilterOpen}
        filter={filter}
        defaultFilter={defaultFilter}
        setFilter={setFilter}
        setIsFilterOpen={setIsFilterOpen}
      />
    </div>
  );
}
