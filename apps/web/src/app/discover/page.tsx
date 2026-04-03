'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import ShopCard from '@/components/ShopCard';
import { Skeleton } from '@/components/ui/skeleton';
import { API_ENDPOINTS } from '@/lib/api';
import type { Shop, ShopCategory } from '@shared/types/types';
import useApiQuery from '@/hooks/useApiQuery';

type TrendingService = {
  id: string;
  name: string;
  shopId?: string;
  price?: number | string | null;
  durationMin?: number | string | null;
  shop?: {
    id?: string;
    name?: string;
  };
};

export default function DiscoverServices() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const initialCategoryId = searchParams.get('categoryId');
  const initialSearch = searchParams.get('q') ?? '';
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [appliedCategories, setAppliedCategories] = useState<string[]>([]);
  const [draftCategories, setDraftCategories] = useState<string[]>([]);
  const [appliedMinPrice, setAppliedMinPrice] = useState(10);
  const [appliedMaxPrice, setAppliedMaxPrice] = useState(200);
  const [draftMinPrice, setDraftMinPrice] = useState(10);
  const [draftMaxPrice, setDraftMaxPrice] = useState(200);
  const popularScrollRef = useRef<HTMLDivElement | null>(null);
  const [activePopularDot, setActivePopularDot] = useState(0);

  const DEFAULT_MIN_PRICE = 10;
  const DEFAULT_MAX_PRICE = 200;

  const { data: filterCategoriesData = [] } = useApiQuery<ShopCategory[]>(
    API_ENDPOINTS.categories,
    {
      key: ['discover-filter-categories'],
    }
  );

  const filterCategories = useMemo(
    () => filterCategoriesData,
    [filterCategoriesData]
  );

  const hasAppliedFilters =
    appliedCategories.length > 0 ||
    appliedMinPrice !== DEFAULT_MIN_PRICE ||
    appliedMaxPrice !== DEFAULT_MAX_PRICE;

  const hasCategoryFilter = appliedCategories.length > 0;
  const hasPriceFilter =
    appliedMinPrice !== DEFAULT_MIN_PRICE ||
    appliedMaxPrice !== DEFAULT_MAX_PRICE;

  const searchOnlyMode = search.trim().length > 0 && !hasAppliedFilters;
  const shouldShowContent = !(
    isSearchFocused && search.trim().length === 0 && !hasAppliedFilters
  );
  const shouldShowShops =
    shouldShowContent && !hasPriceFilter && (searchOnlyMode || hasCategoryFilter || !hasAppliedFilters);
  const shouldShowServices =
    shouldShowContent &&
    !searchOnlyMode &&
    (!hasCategoryFilter || hasPriceFilter);

  const searchTerm = debouncedSearch.toLowerCase().trim();

  const openFilterModal = () => {
    setDraftCategories(appliedCategories);
    setDraftMinPrice(appliedMinPrice);
    setDraftMaxPrice(appliedMaxPrice);
    setIsFilterOpen(true);
  };

  const applyFilters = () => {
    setAppliedCategories(draftCategories);
    setAppliedMinPrice(draftMinPrice);
    setAppliedMaxPrice(draftMaxPrice);
    setIsFilterOpen(false);
  };

  const resetDraftFilters = () => {
    setDraftCategories([]);
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
      setSearch('');
      setDebouncedSearch('');
    }
  }, [initialCategoryId, initialSearch]);

  const priceTrackStyle = useMemo(() => {
    const min = 0;
    const max = 200;
    const left = ((draftMinPrice - min) / (max - min)) * 100;
    const right = ((draftMaxPrice - min) / (max - min)) * 100;
    return {
      left: `${left}%`,
      width: `${Math.max(right - left, 0)}%`,
    };
  }, [draftMinPrice, draftMaxPrice]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [search]);

  const { data: popularShops = [], isLoading: isPopularShopsLoading } =
    useApiQuery<Shop[]>(
      `${API_ENDPOINTS.shops_trending}?search=${encodeURIComponent(debouncedSearch)}`,
      {
        key: ['discover-popular-purchases', debouncedSearch],
      }
    );

  const { data: popularServices = [], isLoading: isPopularServicesLoading } =
    useApiQuery<TrendingService[]>(
      `${API_ENDPOINTS.services_trending}?search=${encodeURIComponent(debouncedSearch)}`,
      {
        key: ['discover-popular-services', debouncedSearch],
      }
    );

  const filteredServices = useMemo(() => {
    return popularServices.filter((item) => {
      if (
        searchTerm &&
        !item.name.toLowerCase().includes(searchTerm) &&
        !(item.shop?.name ?? '').toLowerCase().includes(searchTerm)
      ) {
        return false;
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

      if (appliedCategories.length > 0) {
        const categoryId = shop.category?.id ?? '';
        if (!appliedCategories.includes(categoryId)) {
          return false;
        }
      }

      return true;
    });
  }, [popularShops, searchTerm, appliedCategories]);

  useEffect(() => {
    setActivePopularDot(0);
    if (popularScrollRef.current) {
      popularScrollRef.current.scrollTo({ left: 0, behavior: 'auto' });
    }
  }, [searchTerm, appliedCategories]);

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
    el.scrollTo({ left: target, behavior: 'smooth' });
  };

  const toggleCategory = (category: string) => {
    setDraftCategories((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category]
    );
  };

  const PopularShopCardSkeleton = () => (
    <div className="overflow-hidden rounded-3xl border border-blue-100 bg-linear-to-br from-blue-50 via-white to-purple-50 shadow-sm dark:border-blue-800/40 dark:from-blue-900/20 dark:via-gray-900 dark:to-purple-900/20 dark:shadow-none">
      <div className="relative h-52 overflow-hidden">
        <div className="h-full w-full bg-linear-to-br from-slate-200 via-slate-100 to-slate-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800" />

        <Skeleton className="absolute top-3 right-3 h-7 w-14 rounded-full bg-white/95 dark:bg-white/10" />
        <Skeleton className="absolute top-3 left-3 h-8 w-8 rounded-full bg-white/95 dark:bg-white/10" />
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

        <div className="my-4 h-px bg-linear-to-r from-blue-100 via-purple-100 to-pink-100 dark:from-blue-800/40 dark:via-purple-800/40 dark:to-pink-800/40" />

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
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm dark:border-slate-800 dark:bg-[#0e1726] dark:shadow-none">
      <Skeleton className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700" />

      <div className="min-w-0 flex-1">
        <Skeleton className="h-4 w-3/5 rounded-full bg-slate-200 dark:bg-slate-700" />
        <Skeleton className="mt-2 h-3 w-4/5 rounded-full bg-slate-200 dark:bg-slate-700" />
        <Skeleton className="mt-2 h-4 w-24 rounded-full bg-slate-200 dark:bg-slate-700" />
      </div>

      <Skeleton className="h-8 w-16 rounded-full bg-slate-200 dark:bg-slate-700" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#070d18] dark:text-white">
      <div className="mx-auto w-full max-w-md px-4 pb-8 pt-3">
        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm dark:border-slate-700 dark:bg-white">
          <Search className="h-5 w-5 text-slate-400 dark:text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            placeholder={t('hero.search.placeholder')}
            className="h-6 w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
          />
          {search.length > 0 && (
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                setSearch('');
                setDebouncedSearch('');
              }}
              className="rounded-lg bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          {search.length === 0 && (
            <button
              type="button"
              onClick={openFilterModal}
              className="rounded-lg bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200"
              aria-label={t('filter.title')}
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
              className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-4 text-slate-900 shadow-2xl dark:border-slate-700 dark:bg-[#1b2230] dark:text-slate-100"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-2xl font-bold">{t('filter.title')}</h3>
                <button
                  type="button"
                  onClick={() => setIsFilterOpen(false)}
                  className="rounded-full bg-slate-100 p-2 text-slate-700 hover:bg-slate-200 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/20"
                  aria-label="Close filter"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mb-5">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-[11px] font-bold tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    {t('filter.category').toUpperCase()}
                  </p>
                  <span className="text-[10px] font-bold tracking-[0.14em] text-[#00c9a7] dark:text-[#00f5c4]">
                    {t('filter.multiSelect').toUpperCase()}
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
                            ? 'bg-[#00f5c4] text-slate-950 dark:text-slate-900'
                            : 'bg-slate-100 text-slate-700 dark:bg-[#111827] dark:text-slate-300'
                        }`}
                      >
                        {category.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-[11px] font-bold tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    {t('filter.priceRange').toUpperCase()}
                  </p>
                  <span className="text-lg font-bold text-[#00c9a7] dark:text-[#00f5c4]">
                    ${draftMinPrice} - ${draftMaxPrice}
                  </span>
                </div>

                <div className="relative mt-4 h-8">
                  <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-slate-200 dark:bg-slate-800" />
                  <div
                    className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-[#00f5c4]"
                    style={priceTrackStyle}
                  />
                  <input
                    type="range"
                    min={0}
                    max={200}
                    value={draftMinPrice}
                    onChange={(e) =>
                      setDraftMinPrice(Math.min(Number(e.target.value), draftMaxPrice - 5))
                    }
                    className="absolute left-0 top-1/2 z-10 h-1 w-full -translate-y-1/2 appearance-none bg-transparent outline-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-[#0b0f17] [&::-webkit-slider-thumb]:bg-[#00f5c4] [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-[#0b0f17] [&::-moz-range-thumb]:bg-[#00f5c4]"
                  />
                  <input
                    type="range"
                    min={0}
                    max={200}
                    value={draftMaxPrice}
                    onChange={(e) =>
                      setDraftMaxPrice(Math.max(Number(e.target.value), draftMinPrice + 5))
                    }
                    className="absolute left-0 top-1/2 z-10 h-1 w-full -translate-y-1/2 appearance-none bg-transparent outline-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-[#0b0f17] [&::-webkit-slider-thumb]:bg-[#00f5c4] [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-[#0b0f17] [&::-moz-range-thumb]:bg-[#00f5c4]"
                  />
                </div>

                <div className="mt-5 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={resetDraftFilters}
                    className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-[#111827] dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    {t('filter.reset')}
                  </button>
                  <button
                    type="button"
                    onClick={applyFilters}
                    className="flex-1 rounded-2xl bg-[#00f5c4] px-4 py-3 text-sm font-bold text-slate-950 transition hover:opacity-90"
                  >
                    {t('common.save')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {shouldShowShops && (
          <div className="mt-5">
            <p className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
              {t('services.homePopularPurchases')}
            </p>

            {isPopularShopsLoading ? (
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
            ) : filteredPopularShops.length > 0 ? (
              <>
                <div className="sm:hidden">
                  <div
                    ref={popularScrollRef}
                    onScroll={updatePopularActiveDot}
                    className={hasCategoryFilter ? 'flex flex-col gap-4' : 'flex gap-4 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden'}
                  >
                    {filteredPopularShops.map((shop) => (
                      <div key={shop.id} className={hasCategoryFilter ? 'w-full shrink-0' : 'w-[70vw] max-w-85 min-w-65 shrink-0'}>
                        <ShopCard shop={shop} />
                      </div>
                    ))}
                  </div>

                  {!hasCategoryFilter && popularIndicatorCount > 1 && (
                    <div className="mt-3 flex justify-center gap-2">
                      {Array.from({ length: popularIndicatorCount }).map((_, i) => (
                        <button
                          key={`popular-dot-${i}`}
                          type="button"
                          onClick={() => scrollToPopularDot(i)}
                          className={`h-2 w-2 rounded-full transition-colors ${
                            i === activePopularDot
                              ? 'bg-cyan-500 dark:bg-cyan-400'
                              : 'bg-slate-300 dark:bg-slate-600'
                          }`}
                          aria-label={`Go to card ${i + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className={`hidden sm:grid gap-4 ${hasCategoryFilter ? 'grid-cols-1' : 'grid-cols-2'}`}>
                  {filteredPopularShops.slice(0, 4).map((shop) => (
                    <ShopCard key={shop.id} shop={shop} />
                  ))}
                </div>
              </>
            ) : (
              <div className="rounded-xl border border-slate-200 bg-white px-3 py-5 text-center text-sm text-slate-500 shadow-sm dark:border-slate-800 dark:bg-[#0e1726] dark:text-slate-400 dark:shadow-none">
                {t('services.noResults')}
              </div>
            )}
          </div>
        )}

        {shouldShowServices && (
          <div className="mt-6">
            <p className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
              {t('services.title')}
            </p>
            <div className="space-y-2.5">
              {isPopularServicesLoading
                ? Array.from({ length: 2 }).map((_, i) => (
                    <ServiceCardSkeleton key={`popular-service-skeleton-${i}`} />
                  ))
                : filteredServices.map((item) => {
                    const priceValue =
                      item.price === null || item.price === undefined
                        ? Number.NaN
                        : Number(item.price);
                    const durationValue =
                      item.durationMin === null || item.durationMin === undefined
                        ? 0
                        : Number(item.durationMin);
                    const targetShopId = item.shopId || item.shop?.id;

                    return (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm dark:border-slate-800 dark:bg-[#0e1726] dark:shadow-none"
                      >
                        <div className="h-10 w-10 rounded-full bg-linear-to-br from-slate-300 to-slate-500" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{item.name}</p>
                          <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">
                            {Number.isFinite(durationValue) ? durationValue : 0} {t('services.duration')} • {item.shop?.name ?? t('services.unknownShop')}
                          </p>
                          <p className="text-sm font-bold text-cyan-400">
                            {Number.isFinite(priceValue) ? `$${priceValue.toFixed(2)}` : t('services.priceUnavailable')}
                          </p>
                        </div>
                        <Link
                          href={
                            targetShopId
                              ? `/book/${targetShopId}?service=${item.id}`
                              : '/discover'
                          }
                          className="rounded-full bg-emerald-400 px-3 py-1.5 text-xs font-bold text-emerald-950"
                        >
                          {t('shops.book')}
                        </Link>
                      </div>
                    );
                  })}

              {!isPopularServicesLoading && filteredServices.length === 0 && (
                <div className="rounded-xl border border-slate-200 bg-white px-3 py-5 text-center text-sm text-slate-500 shadow-sm dark:border-slate-800 dark:bg-[#0e1726] dark:text-slate-400 dark:shadow-none">
                  {t('services.noResults')}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
