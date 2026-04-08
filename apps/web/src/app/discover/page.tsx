"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ChevronRight,
  Clock3,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import ShopCard from "@/components/ShopCard";
import { Skeleton } from "@/components/ui/skeleton";
import { API_ENDPOINTS } from "@/lib/api";
import { getImageUrl } from "@/lib/supabaseClient";
import type { Shop, ShopCategory } from "@shared/types/general_types";
import useApiQuery from "@/hooks/useApiQuery";

type TrendingService = {
  id: string;
  name: string;
  shopId?: string;
  price?: number | string | null;
  durationMin?: number | string | null;
  shop?: {
    id?: string;
    name?: string;
    categoryId?: string;
    category?: {
      id?: string;
    };
  };
};

type ShopsListResponse =
  | Shop[]
  | {
      shops?: Shop[];
    };

export default function DiscoverServices() {
  const { t, language } = useLanguage();
  const searchParams = useSearchParams();
  const initialCategoryId = searchParams.get("categoryId");
  const initialSearch = searchParams.get("q") ?? "";
  const shouldFocusSearch = searchParams.get("focus") === "search";
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [appliedCategories, setAppliedCategories] = useState<string[]>([]);
  const [draftCategories, setDraftCategories] = useState<string[]>([]);
  const [appliedPriceEnabled, setAppliedPriceEnabled] = useState(false);
  const [draftPriceEnabled, setDraftPriceEnabled] = useState(false);
  const [appliedMinPrice, setAppliedMinPrice] = useState(0);
  const [appliedMaxPrice, setAppliedMaxPrice] = useState(200);
  const [draftMinPrice, setDraftMinPrice] = useState(0);
  const [draftMaxPrice, setDraftMaxPrice] = useState(200);
  const popularScrollRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [activePopularDot, setActivePopularDot] = useState(0);

  const DEFAULT_MIN_PRICE = 0;
  const DEFAULT_MAX_PRICE = 200;
  const categoriesUrl = `${API_ENDPOINTS.categories}?lang=${encodeURIComponent(language)}`;

  const { data: filterCategoriesData = [] } = useApiQuery<ShopCategory[]>(
    categoriesUrl,
    {
      key: ["discover-filter-categories", language],
    },
  );

  const filterCategories = useMemo(
    () => filterCategoriesData,
    [filterCategoriesData],
  );

  const hasAppliedFilters = appliedCategories.length > 0 || appliedPriceEnabled;

  const hasCategoryFilter = appliedCategories.length > 0;
  const hasPriceFilter = appliedPriceEnabled;
  const isPriceOnlyFilter = hasPriceFilter && !hasCategoryFilter;
  const isTypingSearch = search.trim() !== debouncedSearch;

  const searchOnlyMode = search.trim().length > 0 && !hasAppliedFilters;
  const shouldShowContent = !(
    isSearchFocused &&
    search.trim().length === 0 &&
    !hasAppliedFilters
  );
  const shouldShowShops =
    shouldShowContent &&
    !isTypingSearch &&
    !isPriceOnlyFilter &&
    (searchOnlyMode || hasCategoryFilter || !hasAppliedFilters);
  const shouldShowServices =
    shouldShowContent &&
    !isTypingSearch &&
    (isPriceOnlyFilter ||
      hasCategoryFilter ||
      searchOnlyMode ||
      !hasAppliedFilters);

  const searchTerm = debouncedSearch.toLowerCase().trim();
  const useListLayoutForShops = hasCategoryFilter || searchTerm.length > 0;

  const priceTrackStyle = useMemo(() => {
    const min = DEFAULT_MIN_PRICE;
    const max = 200;
    const left = ((draftMinPrice - min) / (max - min)) * 100;
    const right = ((draftMaxPrice - min) / (max - min)) * 100;

    return {
      left: `${Math.max(0, Math.min(left, 100))}%`,
      width: `${Math.max(0, Math.min(right, 100) - Math.max(0, Math.min(left, 100)))}%`,
    };
  }, [draftMinPrice, draftMaxPrice, DEFAULT_MIN_PRICE]);

  const openFilterModal = () => {
    setDraftCategories(appliedCategories);
    setDraftPriceEnabled(appliedPriceEnabled);
    setDraftMinPrice(appliedMinPrice);
    setDraftMaxPrice(appliedMaxPrice);
    setIsFilterOpen(true);
  };

  const applyFilters = () => {
    setAppliedCategories(draftCategories);
    setAppliedPriceEnabled(draftPriceEnabled);
    setAppliedMinPrice(draftMinPrice);
    setAppliedMaxPrice(draftMaxPrice);
    setIsFilterOpen(false);
  };

  const resetDraftFilters = () => {
    setDraftCategories([]);
    setDraftPriceEnabled(false);
    setDraftMinPrice(DEFAULT_MIN_PRICE);
    setDraftMaxPrice(DEFAULT_MAX_PRICE);
  };

  useEffect(() => {
    if (initialCategoryId) {
      setAppliedCategories([initialCategoryId]);
      setDraftCategories([initialCategoryId]);
    } else {
      setAppliedCategories([]);
      setDraftCategories([]);
    }

    if (initialSearch) {
      setSearch(initialSearch);
      setDebouncedSearch(initialSearch);
    } else {
      setSearch("");
      setDebouncedSearch("");
    }
  }, [initialCategoryId, initialSearch]);

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
    ? `${API_ENDPOINTS.services}?limit=1000${isSearching ? `&search=${encodeURIComponent(debouncedSearch)}` : ""}${hasPriceFilter ? `&minPrice=${appliedMinPrice}&maxPrice=${appliedMaxPrice}` : ""}`
    : `${API_ENDPOINTS.services_trending}?search=${encodeURIComponent(debouncedSearch)}`;

  const { data: popularShopsData, isLoading: isPopularShopsLoading } =
    useApiQuery<ShopsListResponse>(shopsUrl, {
      key: [
        "discover-popular-purchases",
        shouldUseFullCatalog ? "all-shops" : "trending-shops",
        debouncedSearch,
        appliedCategories.join(","),
        appliedPriceEnabled ? "price-on" : "price-off",
        appliedMinPrice,
        appliedMaxPrice,
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
        appliedCategories.join(","),
        appliedPriceEnabled ? "price-on" : "price-off",
        appliedMinPrice,
        appliedMaxPrice,
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

      if (appliedCategories.length > 0) {
        const categoryId =
          item.shop?.category?.id ?? item.shop?.categoryId ?? "";
        if (!appliedCategories.includes(categoryId)) {
          return false;
        }
      }

      if (hasPriceFilter) {
        const priceValue = Number(item.price);
        if (!Number.isFinite(priceValue)) return false;
        if (priceValue < appliedMinPrice || priceValue > appliedMaxPrice) {
          return false;
        }
      }

      return true;
    });
  }, [
    popularServices,
    searchTerm,
    appliedMinPrice,
    appliedMaxPrice,
    DEFAULT_MIN_PRICE,
    DEFAULT_MAX_PRICE,
    hasPriceFilter,
  ]);

  const filteredPopularShops = useMemo(() => {
    return popularShops.filter((shop) => {
      if (searchTerm && !shop.name.toLowerCase().includes(searchTerm)) {
        return false;
      }

      // Agar barcha kategoriyalar tanlangan bo'lsa, filterni qo'llama
      // filterCategories.length > 0 check - data loading bo'lganida to'g'ri ishlay
      if (
        appliedCategories.length > 0 &&
        filterCategories.length > 0 &&
        appliedCategories.length < filterCategories.length
      ) {
        const categoryId = shop.category?.id ?? shop.categoryId ?? "";
        if (!appliedCategories.includes(categoryId)) {
          return false;
        }
      }

      return true;
    });
  }, [popularShops, searchTerm, appliedCategories, filterCategories.length]);

  const shouldHideServicesSectionForEmptyCategory =
    hasCategoryFilter &&
    !isPopularServicesLoading &&
    filteredServices.length === 0;

  useEffect(() => {
    setActivePopularDot(0);
    if (popularScrollRef.current) {
      popularScrollRef.current.scrollTo({ left: 0, behavior: "auto" });
    }
  }, [searchTerm, appliedCategories]);

  const popularIndicatorCount = Math.max(1, filteredPopularShops.length);

  const sliderTrackStyle = {
    background: "linear-gradient(90deg, #e2e8f0 0%, #cbd5e1 100%)",
    width: "100%",
    zIndex: 1,
    boxShadow: "inset 0 1px 1px rgba(15, 23, 42, 0.08)",
  } as const;

  const sliderRangeStyle = {
    background: "#f49b33",
    zIndex: 2,
    boxShadow:
      "0 0 0 1px rgba(244, 155, 51, 0.26), 0 0 12px rgba(244, 155, 51, 0.38)",
  } as const;

  const sliderLeftValueStyle = { left: 0 } as const;
  const sliderRightValueStyle = { right: 0 } as const;

  const thumbStyle = {
    WebkitAppearance: "none",
    WebkitTapHighlightColor: "transparent",
    pointerEvents: "none",
    position: "absolute",
    height: 0,
    width: "100%",
    outline: "none",
    top: 10,
    background: "none",
  } as const;

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

  const toggleCategory = (category: string) => {
    setDraftCategories((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category],
    );
  };

  const PopularShopCardSkeleton = () => (
    <div className="overflow-hidden rounded-3xl border border-[#f1c894] bg-linear-to-br from-[#fff8f0] via-white to-[#f6e4cd] shadow-sm dark:border-[#F49B33]/20 dark:from-[#2b170b] dark:via-[#211201] dark:to-[#1a0e06] dark:shadow-none">
      <div className="relative h-52 overflow-hidden">
        <div className="h-full w-full bg-linear-to-br from-[#f4eadf] via-[#fff7ef] to-[#f1c894] dark:from-[#3a2415] dark:via-[#2b170b] dark:to-[#1a0e06]" />

        <Skeleton className="absolute right-3 top-3 h-7 w-14 rounded-full bg-white/95 dark:bg-white/10" />
        <Skeleton className="absolute left-3 top-3 h-8 w-8 rounded-full bg-white/95 dark:bg-white/10" />
        <Skeleton className="absolute bottom-3 left-3 h-6 w-20 rounded-full bg-white/95 dark:bg-white/10" />
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <Skeleton className="h-5 w-3/5 rounded-full bg-slate-200 dark:bg-slate-700" />
            <Skeleton className="mt-2 h-4 w-4/5 rounded-full bg-slate-200 dark:bg-slate-700" />
          </div>

          <div className="shrink-0 text-right">
            <Skeleton className="h-4 w-12 rounded-full bg-slate-200 dark:bg-slate-700" />
            <Skeleton className="mt-2 h-3 w-10 rounded-full bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>

        <div className="my-4 h-px bg-linear-to-r from-[#f1c894] via-[#f49b33] to-[#f1c894] dark:from-[#4a2e1b] dark:via-[#f49b33] dark:to-[#4a2e1b]" />

        <div className="flex items-center justify-between gap-3">
          <div>
            <Skeleton className="h-3 w-20 rounded-full bg-slate-200 dark:bg-slate-700" />
            <Skeleton className="mt-2 h-4 w-24 rounded-full bg-slate-200 dark:bg-slate-700" />
          </div>

          <Skeleton className="h-9 w-20 rounded-full bg-slate-200 dark:bg-slate-700" />
        </div>
      </div>
    </div>
  );

  const ServiceCardSkeleton = () => (
    <div className="flex items-center justify-between gap-4 border-b border-slate-200/70 py-4 last:border-b-0 dark:border-slate-800/80">
      <div className="min-w-0 flex-1">
        <Skeleton className="h-5 w-36 rounded-full bg-slate-200 dark:bg-slate-700" />
        <Skeleton className="mt-2 h-3.5 w-44 rounded-full bg-slate-200 dark:bg-slate-700" />
      </div>

      <div className="shrink-0 text-right">
        <Skeleton className="ml-auto h-6 w-18 rounded-full bg-slate-200 dark:bg-slate-700" />
        <Skeleton className="mt-2 ml-auto h-4 w-12 rounded-full bg-slate-200 dark:bg-slate-700" />
      </div>
    </div>
  );

  const CompactShopRowSkeleton = ({ isLast = false }: { isLast?: boolean }) => (
    <div
      className={`flex items-center gap-3 px-2 py-3 ${isLast ? "" : "border-b border-slate-200/70 dark:border-slate-800/80"}`}
    >
      <Skeleton className="h-14 w-14 shrink-0 rounded-2xl bg-slate-200 dark:bg-slate-700" />
      <div className="min-w-0 flex-1">
        <Skeleton className="h-5 w-36 rounded-full bg-slate-200 dark:bg-slate-700" />
        <Skeleton className="mt-2 h-4 w-24 rounded-full bg-slate-200 dark:bg-slate-700" />
      </div>
      <Skeleton className="h-5 w-5 rounded-full bg-slate-200 dark:bg-slate-700" />
    </div>
  );

  const CompactShopRow = ({
    shop,
    isLast = false,
  }: {
    shop: Shop;
    isLast?: boolean;
  }) => {
    const imageUrl = shop.backgroundImageUrl
      ? getImageUrl(shop.backgroundImageUrl, "shop_images")
      : null;

    return (
      <Link
        href={`/shop/${shop.id}`}
        className={`group flex items-center gap-3 px-2 py-3 ${isLast ? "" : "border-b border-slate-200/70 dark:border-slate-800/80"}`}
      >
        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-slate-200 dark:bg-slate-800">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={shop.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-slate-500 to-slate-700 text-lg font-bold text-white">
              {shop.name.charAt(0)}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-lg font-semibold leading-tight text-slate-900 dark:text-slate-100 sm:text-xl">
            {shop.name}
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {t("discover.distanceAway", { distance: "1.5" })}
          </p>
        </div>

        <ChevronRight className="h-5 w-5 text-slate-400 transition-colors group-hover:text-slate-300" />
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#211201] dark:text-white">
      <div className="mx-auto w-full max-w-md px-4 pb-8 pt-3">
        <div className="flex items-center gap-2 rounded-2xl border border-[#f1c894] bg-white px-3 py-2.5 shadow-sm dark:border-[#4a2e1b] dark:bg-white">
          <Search className="h-5 w-5 text-[#F49B33] dark:text-[#F49B33]" />
          <input
            ref={searchInputRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            placeholder={t("hero.search.placeholder")}
            className="h-6 w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-[#d0954d]"
          />
          {search.length > 0 && (
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                setSearch("");
                setDebouncedSearch("");
              }}
              className="rounded-lg bg-[#fff3e6] p-2 text-[#F49B33] transition hover:bg-[#fce2c4]"
              aria-label={t("common.clearSearch")}
            >
              <X className="h-4 w-4" />
            </button>
          )}
          {search.length === 0 && (
            <button
              type="button"
              onClick={openFilterModal}
              className="rounded-lg bg-[#fff3e6] p-2 text-[#F49B33] transition hover:bg-[#fce2c4]"
              aria-label={t("filter.title")}
            >
              <SlidersHorizontal className="h-4 w-4" />
            </button>
          )}
        </div>

        {isFilterOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-3"
            onClick={() => setIsFilterOpen(false)}
          >
            <div
              className="w-full max-w-md rounded-3xl border border-[#f1c894] bg-white p-4 text-slate-900 shadow-2xl dark:border-[#4a2e1b] dark:bg-[#2b170b] dark:text-slate-100"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-[#F49B33]">
                  {t("filter.title")}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsFilterOpen(false)}
                  className="rounded-full bg-[#fff3e6] p-2 text-[#F49B33] hover:bg-[#fce2c4] dark:bg-[#3a2415] dark:text-[#F49B33] dark:hover:bg-[#4a2e1b]"
                  aria-label={t("common.close")}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mb-5">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-[11px] font-bold tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    {t("filter.category").toUpperCase()}
                  </p>
                  <span className="text-[10px] font-bold tracking-[0.14em] text-[#F49B33] dark:text-[#F49B33]">
                    {t("filter.multiSelect").toUpperCase()}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {filterCategories.map((category) => {
                    const active = draftCategories.includes(category.id);

                    return (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => toggleCategory(category.id)}
                        className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                          active
                            ? "bg-[#F49B33] text-slate-950 dark:text-slate-900"
                            : "bg-[#fff3e6] text-[#8a5620] dark:bg-[#3a2415] dark:text-[#ffd4a6]"
                        }`}
                      >
                        {category.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="text-[11px] font-bold tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    {t("filter.priceRange").toUpperCase()}
                  </p>
                  <div className="flex min-w-0 items-center justify-end gap-2">
                    <span className="whitespace-nowrap text-base font-bold text-[#F49B33] dark:text-[#F49B33] sm:text-lg">
                      ${draftMinPrice} - ${draftMaxPrice}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setDraftPriceEnabled((prev) => {
                          const next = !prev;
                          if (next) {
                            setDraftMinPrice(DEFAULT_MIN_PRICE);
                            setDraftMaxPrice(DEFAULT_MAX_PRICE);
                          }
                          return next;
                        });
                      }}
                      className={`relative inline-flex h-6 w-11 shrink-0 items-center overflow-hidden rounded-full p-0.5 transition ${
                        draftPriceEnabled
                          ? "bg-[#F49B33]"
                          : "bg-slate-300 dark:bg-slate-600"
                      }`}
                      aria-label={t("filter.togglePrice")}
                      aria-pressed={draftPriceEnabled}
                    >
                      <span
                        className={`block h-5 w-5 rounded-full bg-white shadow transition-transform ${
                          draftPriceEnabled ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <div
                  className={`rangePrice mt-0.5 ${draftPriceEnabled ? "" : "opacity-45"}`}
                >
                  <div className="slider">
                    <input
                      type="range"
                      min={DEFAULT_MIN_PRICE}
                      max={DEFAULT_MAX_PRICE}
                      step={1}
                      value={draftMinPrice}
                      disabled={!draftPriceEnabled}
                      onChange={(e) => {
                        const nextMin = Number(e.target.value);
                        setDraftMinPrice(Math.min(nextMin, draftMaxPrice));
                      }}
                      className={`range-thumb ${draftMinPrice > DEFAULT_MAX_PRICE - 20 ? "range-thumb--zindex-5" : "range-thumb--zindex-3"}`}
                      style={thumbStyle}
                    />

                    <input
                      type="range"
                      min={DEFAULT_MIN_PRICE}
                      max={DEFAULT_MAX_PRICE}
                      step={1}
                      value={draftMaxPrice}
                      disabled={!draftPriceEnabled}
                      onChange={(e) => {
                        const nextMax = Number(e.target.value);
                        setDraftMaxPrice(Math.max(nextMax, draftMinPrice));
                      }}
                      className="range-thumb range-thumb--zindex-4"
                      style={thumbStyle}
                    />

                    <div className="slider-track" style={sliderTrackStyle} />
                    <div
                      className="slider-range"
                      style={{ ...sliderRangeStyle, ...priceTrackStyle }}
                    />
                    <div
                      className="slider-left-value"
                      style={sliderLeftValueStyle}
                    >
                      ${DEFAULT_MIN_PRICE}
                    </div>
                    <div
                      className="slider-right-value"
                      style={sliderRightValueStyle}
                    >
                      ${DEFAULT_MAX_PRICE}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={resetDraftFilters}
                    className="flex-1 rounded-2xl border border-[#f1c894] bg-[#fff8f1] px-4 py-3 text-sm font-semibold text-[#8a5620] transition hover:bg-[#fce8d0] dark:border-[#4a2e1b] dark:bg-[#2b170b] dark:text-[#ffd4a6] dark:hover:bg-[#3a2415]"
                  >
                    {t("filter.reset")}
                  </button>
                  <button
                    type="button"
                    onClick={applyFilters}
                    className="flex-1 rounded-2xl bg-[#F49B33] px-4 py-3 text-sm font-bold text-white transition hover:opacity-90"
                  >
                    {t("common.save")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {shouldShowShops && (
          <div className="mt-5">
            <p className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
              {t("discover.popularShops")}
            </p>

            {isPopularShopsLoading ? (
              useListLayoutForShops ? (
                <div className="rounded-2xl border border-slate-200 bg-white px-2 dark:border-slate-800 dark:bg-[#211201]">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <CompactShopRowSkeleton
                      key={`discover-popular-list-skeleton-${i}`}
                      isLast={i === 2}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex gap-4 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div
                      key={`discover-popular-skeleton-${i}`}
                      className="w-[70vw] max-w-85 min-w-65 shrink-0"
                    >
                      <PopularShopCardSkeleton />
                    </div>
                  ))}
                </div>
              )
            ) : filteredPopularShops.length > 0 ? (
              useListLayoutForShops ? (
                <div className="rounded-2xl border border-slate-200 bg-white px-2 dark:border-slate-800 dark:bg-[#211201]">
                  {filteredPopularShops.map((shop, index) => (
                    <CompactShopRow
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
                                  ? "bg-[#F49B33] dark:bg-[#F49B33]"
                                  : "bg-slate-300 dark:bg-slate-600"
                              }`}
                              aria-label={t("discover.goToCard", {
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
              <div className="rounded-xl border border-slate-200 bg-white px-3 py-5 text-center text-sm text-slate-500 shadow-sm dark:border-slate-800 dark:bg-[#211201] dark:text-slate-400 dark:shadow-none">
                {t("discover.noShopsFound")}
              </div>
            )}
          </div>
        )}

        {shouldShowServices && !shouldHideServicesSectionForEmptyCategory && (
          <div className="mt-6">
            <p className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
              {t("services.title")}
            </p>
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-1 shadow-sm dark:border-slate-800 dark:bg-[#211201] dark:shadow-none">
              {isPopularServicesLoading
                ? Array.from({ length: 3 }).map((_, i) => (
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
                          targetShopId
                            ? `/book/${targetShopId}?service=${item.id}`
                            : "/discover"
                        }
                        className="block border-b border-slate-200/70 py-4 last:border-b-0 dark:border-slate-800/80"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-lg font-semibold text-slate-900 dark:text-slate-100 sm:text-base">
                              {item.name}
                            </p>
                            <p className="mt-1 flex items-center gap-1.5 text-xs tracking-wide text-slate-500 dark:text-slate-400">
                              <Clock3 className="h-4 w-4" />
                              <span className="truncate">
                                {Number.isFinite(durationValue)
                                  ? durationValue
                                  : 0}{" "}
                                {t("services.duration")} •{" "}
                                {item.shop?.name ?? t("services.unknownShop")}
                              </span>
                            </p>
                          </div>

                          <div className="shrink-0 text-right">
                            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 sm:text-xl">
                              {Number.isFinite(priceValue)
                                ? `$${priceValue.toFixed(2)}`
                                : "--"}
                            </p>
                            <span className="mt-1 inline-block text-xs font-semibold text-[#F49B33]">
                              {t("shops.book").toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}

              {!isPopularServicesLoading && filteredServices.length === 0 && (
                <div className="py-5 text-center text-sm text-slate-500 dark:text-slate-400">
                  {t("services.noResults")}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
