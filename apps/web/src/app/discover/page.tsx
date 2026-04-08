'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ChevronRight, Clock3, Search, SlidersHorizontal, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import ShopCard from '@/components/ShopCard';
import { Skeleton } from '@/components/ui/skeleton';
import { API_ENDPOINTS } from '@/lib/api';
import { getImageUrl } from '@/lib/supabaseClient';
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
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const initialCategoryId = searchParams.get('categoryId');
  const initialSearch = searchParams.get('q') ?? '';
  const shouldFocusSearch = searchParams.get('focus') === 'search';
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
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
    appliedPriceEnabled;

  const hasCategoryFilter = appliedCategories.length > 0;
  const hasPriceFilter = appliedPriceEnabled;
  const isPriceOnlyFilter = hasPriceFilter && !hasCategoryFilter;
  const isTypingSearch = search.trim() !== debouncedSearch;

  const searchOnlyMode = search.trim().length > 0 && !hasAppliedFilters;
  const shouldShowContent = !(
    isSearchFocused && search.trim().length === 0 && !hasAppliedFilters
  );
  const shouldShowShops =
    shouldShowContent &&
    !isTypingSearch &&
    !isPriceOnlyFilter &&
    (searchOnlyMode || hasCategoryFilter || !hasAppliedFilters);
  const shouldShowServices =
    shouldShowContent && !isTypingSearch && (isPriceOnlyFilter || hasCategoryFilter || searchOnlyMode || !hasAppliedFilters);

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
      setSearch('');
      setDebouncedSearch('');
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
    ? `${API_ENDPOINTS.shops}?limit=1000${isSearching ? `&search=${encodeURIComponent(debouncedSearch)}` : ''}`
    : `${API_ENDPOINTS.shops_trending}?search=${encodeURIComponent(debouncedSearch)}`;

  const servicesUrl = shouldUseFullCatalog
    ? `${API_ENDPOINTS.services}?limit=1000${isSearching ? `&search=${encodeURIComponent(debouncedSearch)}` : ''}${hasPriceFilter ? `&minPrice=${appliedMinPrice}&maxPrice=${appliedMaxPrice}` : ''}`
    : `${API_ENDPOINTS.services_trending}?search=${encodeURIComponent(debouncedSearch)}`;

  const { data: popularShopsData, isLoading: isPopularShopsLoading } =
    useApiQuery<ShopsListResponse>(shopsUrl, {
      key: [
        'discover-popular-purchases',
        shouldUseFullCatalog ? 'all-shops' : 'trending-shops',
        debouncedSearch,
        appliedCategories.join(','),
        appliedPriceEnabled ? 'price-on' : 'price-off',
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
    useApiQuery<TrendingService[]>(
      servicesUrl,
      {
        key: [
          'discover-popular-services',
          shouldUseFullCatalog ? 'all-services' : 'trending-services',
          debouncedSearch,
          appliedCategories.join(','),
          appliedPriceEnabled ? 'price-on' : 'price-off',
          appliedMinPrice,
          appliedMaxPrice,
        ],
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

      if (appliedCategories.length > 0) {
        const categoryId = item.shop?.category?.id ?? item.shop?.categoryId ?? '';
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
    appliedCategories,
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
        filterCategories.length > 0 && appliedCategories.length < filterCategories.length
      ) {
        const categoryId = shop.category?.id ?? shop.categoryId ?? '';
        if (!appliedCategories.includes(categoryId)) {
          return false;
        }
      }

      return true;
    });
  }, [popularShops, searchTerm, appliedCategories, filterCategories.length]);

  const shouldHideServicesSectionForEmptyCategory =
    hasCategoryFilter && !isPopularServicesLoading && filteredServices.length === 0;

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
    <div className={`flex items-center gap-3 px-2 py-3 ${isLast ? '' : 'border-b border-slate-200/70 dark:border-slate-800/80'}`}>
      <Skeleton className="h-14 w-14 shrink-0 rounded-2xl bg-slate-200 dark:bg-slate-700" />
      <div className="min-w-0 flex-1">
        <Skeleton className="h-5 w-36 rounded-full bg-slate-200 dark:bg-slate-700" />
        <Skeleton className="mt-2 h-4 w-24 rounded-full bg-slate-200 dark:bg-slate-700" />
      </div>
      <Skeleton className="h-5 w-5 rounded-full bg-slate-200 dark:bg-slate-700" />
    </div>
  );

  const CompactShopRow = ({ shop, isLast = false }: { shop: Shop; isLast?: boolean }) => {
    const imageUrl = shop.backgroundImageUrl
      ? getImageUrl(shop.backgroundImageUrl, 'shop_images')
      : null;

    return (
      <Link
        href={`/shop/${shop.id}`}
        className={`group flex items-center gap-3 px-2 py-3 ${isLast ? '' : 'border-b border-slate-200/70 dark:border-slate-800/80'}`}
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
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">1.5 km away</p>
        </div>

        <ChevronRight className="h-5 w-5 text-slate-400 transition-colors group-hover:text-slate-300" />
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#070d18] dark:text-white">
      <div className="mx-auto w-full max-w-md px-4 pb-8 pt-3">
        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm dark:border-slate-700 dark:bg-white">
          <Search className="h-5 w-5 text-slate-400 dark:text-slate-400" />
          <input
            ref={searchInputRef}
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
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="text-[11px] font-bold tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    {t('filter.priceRange').toUpperCase()}
                  </p>
                  <div className="flex min-w-0 items-center justify-end gap-2">
                    <span className="whitespace-nowrap text-base font-bold text-[#00c9a7] dark:text-[#00f5c4] sm:text-lg">
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
                          ? 'bg-[#00c9a7]'
                          : 'bg-slate-300 dark:bg-slate-600'
                      }`}
                      aria-label="Toggle price filter"
                      aria-pressed={draftPriceEnabled}
                    >
                      <span
                        className={`block h-5 w-5 rounded-full bg-white shadow transition-transform ${
                          draftPriceEnabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <div className={`rangePrice mt-0.5 ${draftPriceEnabled ? '' : 'opacity-45'}`}>
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
                      className={`thumb ${draftMinPrice > DEFAULT_MAX_PRICE - 20 ? 'thumb--zindex-5' : 'thumb--zindex-3'}`}
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
                      className="thumb thumb--zindex-4"
                    />

                    <div className="slider__track" />
                    <div className="slider__range" style={priceTrackStyle} />
                    <div className="slider__left-value">${DEFAULT_MIN_PRICE}</div>
                    <div className="slider__right-value">${DEFAULT_MAX_PRICE}</div>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-3">
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
              {t('discover.popularShops')}
            </p>

            {isPopularShopsLoading ? (
              useListLayoutForShops ? (
                <div className="rounded-2xl border border-slate-200 bg-white px-2 dark:border-slate-800 dark:bg-[#0e1726]">
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
                <div className="rounded-2xl border border-slate-200 bg-white px-2 dark:border-slate-800 dark:bg-[#0e1726]">
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
                      <div key={shop.id} className="w-[70vw] max-w-85 min-w-65 shrink-0">
                        <ShopCard shop={shop} />
                      </div>
                    ))}
                  </div>

                  {popularIndicatorCount > 1 && (
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

                <div className="hidden gap-4 sm:grid sm:grid-cols-2">
                  {filteredPopularShops.slice(0, 4).map((shop) => (
                    <ShopCard key={shop.id} shop={shop} />
                  ))}
                </div>
              </>
              )
            ) : (
              <div className="rounded-xl border border-slate-200 bg-white px-3 py-5 text-center text-sm text-slate-500 shadow-sm dark:border-slate-800 dark:bg-[#0e1726] dark:text-slate-400 dark:shadow-none">
                {t('discover.noShopsFound')}
              </div>
            )}
          </div>
        )}

        {shouldShowServices && !shouldHideServicesSectionForEmptyCategory && (
          <div className="mt-6">
            <p className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
              {t('services.title')}
            </p>
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-1 shadow-sm dark:border-slate-800 dark:bg-[#0e1726] dark:shadow-none">
              {isPopularServicesLoading
                ? Array.from({ length: 3 }).map((_, i) => (
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
                      <Link
                        key={item.id}
                        href={
                          targetShopId
                            ? `/book/${targetShopId}?service=${item.id}`
                            : '/discover'
                        }
                        className="block border-b border-slate-200/70 py-4 last:border-b-0 dark:border-slate-800/80"
                      >
                        <div className="flex items-center justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-lg font-semibold text-slate-900 dark:text-slate-100 sm:text-base">{item.name}</p>
                          <p className="mt-1 flex items-center gap-1.5 text-xs tracking-wide text-slate-500 dark:text-slate-400">
                            <Clock3 className="h-4 w-4" />
                            <span className="truncate">
                              {Number.isFinite(durationValue) ? durationValue : 0} MIN • {item.shop?.name ?? t('services.unknownShop')}
                            </span>
                          </p>
                        </div>

                        <div className="shrink-0 text-right">
                          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 sm:text-xl">
                            {Number.isFinite(priceValue) ? `$${priceValue.toFixed(2)}` : '--'}
                          </p>
                          <span className="mt-1 inline-block text-xs font-semibold text-emerald-500">
                            {t('shops.book').toUpperCase()}
                          </span>
                        </div>
                        </div>
                      </Link>
                    );
                  })}

              {!isPopularServicesLoading && filteredServices.length === 0 && (
                <div className="py-5 text-center text-sm text-slate-500 dark:text-slate-400">
                  {t('services.noResults')}
                </div>
              )}
            </div>
          </div>
        )}

        <style jsx>{`
          .rangePrice {
            height: 46px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .slider {
            position: relative;
            width: 100%;
          }

          .slider__track,
          .slider__range,
          .slider__left-value,
          .slider__right-value {
            position: absolute;
          }

          .slider__track,
          .slider__range {
            border-radius: 3px;
            height: 5px;
            top: 10px;
          }

          .slider__track {
            background: linear-gradient(90deg, #e2e8f0 0%, #cbd5e1 100%);
            width: 100%;
            z-index: 1;
            box-shadow: inset 0 1px 1px rgba(15, 23, 42, 0.08);
          }

          .slider__range {
            background: #00c9a7;
            z-index: 2;
            box-shadow: 0 0 0 1px rgba(0, 201, 167, 0.22), 0 0 12px rgba(0, 201, 167, 0.35);
          }

          .slider__left-value,
          .slider__right-value {
            color: #64748b;
            font-size: 12px;
            font-weight: 700;
            margin-top: 20px;
          }

          .slider__left-value {
            left: 0;
          }

          .slider__right-value {
            right: 0;
          }

          .thumb,
          .thumb::-webkit-slider-thumb {
            -webkit-appearance: none;
            -webkit-tap-highlight-color: transparent;
          }

          .thumb {
            pointer-events: none;
            position: absolute;
            height: 0;
            width: 100%;
            outline: none;
            top: 10px;
            background: none;
          }

          .thumb--zindex-3 {
            z-index: 3;
          }

          .thumb--zindex-4 {
            z-index: 4;
          }

          .thumb--zindex-5 {
            z-index: 5;
          }

          .thumb::-webkit-slider-thumb {
            background: radial-gradient(circle at 30% 30%, #ffffff 0%, #ecfeff 45%, #ccfbf1 100%);
            border: 2px solid #00c9a7;
            border-radius: 50%;
            box-shadow: 0 2px 10px rgba(15, 23, 42, 0.2), 0 0 0 3px rgba(0, 201, 167, 0.28);
            cursor: pointer;
            height: 18px;
            width: 18px;
            margin-top: 4px;
            pointer-events: all;
            position: relative;
            transition: transform 0.15s ease, box-shadow 0.2s ease;
          }

          .thumb::-webkit-slider-thumb:hover {
            transform: scale(1.06);
          }

          .thumb::-moz-range-thumb {
            background: radial-gradient(circle at 30% 30%, #ffffff 0%, #ecfeff 45%, #ccfbf1 100%);
            border: 2px solid #00c9a7;
            border-radius: 50%;
            box-shadow: 0 2px 10px rgba(15, 23, 42, 0.2), 0 0 0 3px rgba(0, 201, 167, 0.28);
            cursor: pointer;
            height: 18px;
            width: 18px;
            margin-top: 4px;
            pointer-events: all;
            position: relative;
            transition: transform 0.15s ease, box-shadow 0.2s ease;
          }

          .thumb::-moz-range-thumb:hover {
            transform: scale(1.06);
          }
        `}</style>
      </div>
    </div>
  );
}
