"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AppSearchInput from "@/components/AppSearchInput";
import { API_ENDPOINTS } from "@/lib/api";
import type { Service, Shop, ShopCategory } from "@shared/types/general_types";
import useApiQuery from "@/hooks/useApiQuery";
import { useTranslations } from "next-intl";
import FilterDialog from "@/components/user/discover/FilterDialog";
import { FilterType, ShopsResponse } from "@/features/discovery/types";
import { getShopsUrl } from "@/features/discovery/utils/get-shops-url";
import ShopList from "@/components/user/discover/ShopList";
import ServiceList from "@/components/user/discover/ServiceList";

const SKELETON_COUNT = 10;
const COMPACT_SHOP_ROW_SKELETON_COUNT = 5;

const defaultFilter = (categoryId?: string | null): FilterType => ({
  categories: categoryId ? [categoryId] : [],
  priceEnabled: false,
  minPrice: 0,
  maxPrice: 1000000,
});

export default function Page() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const router = useRouter()

  const initialCategoryId = searchParams.get("categoryId");
  const isSearchFocusedQuery = searchParams.get("focus") === "search";

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filter, setFilter] = useState<FilterType>(defaultFilter(initialCategoryId));
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [activeDot, setActiveDot] = useState(0);

  useEffect(() => {
    if (isSearchFocusedQuery) {
      searchInputRef.current?.focus();
      searchInputRef.current?.select();
    }
  }, [isSearchFocusedQuery]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
      setActiveDot(0);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [search]);

  const hasCategoryFilter = filter.categories.length > 0;
  const isPriceOnlyFilter = filter.priceEnabled && !hasCategoryFilter;
  const hasAppliedFilters = hasCategoryFilter || filter.priceEnabled;

  const searchTerm = debouncedSearch.toLowerCase().trim();
  const isSearching = searchTerm.length > 0;
  const filterItemsVisible = isSearching || hasAppliedFilters;

  const isListLayoutForShops = hasCategoryFilter || isSearching;
  const contentVisible =
    (!isSearchFocused ||
      search.trim().length > 0 ||
      hasAppliedFilters) &&
    search.trim() === searchTerm;
    
  const shopsUrl = getShopsUrl({ isSearching, searchTerm, filter });

  const { data: filterCategories = [] } =
    useApiQuery<ShopCategory[]>(API_ENDPOINTS.categories, { key: ["discover-filter-categories"] });

  const { data: shopsData = { shops: [], services: [] }, isLoading: isShopsLoading } =
    useApiQuery<ShopsResponse>(shopsUrl, { key: [shopsUrl] });

  const { data: trendingShops = { shops: [] }, isLoading: isTrendingShopsLoading } =
    useApiQuery<{ shops: Shop[] }>(API_ENDPOINTS.shops_trending, { key: ['trending_shops'] });

  const { data: trendingServices = [], isLoading: isTrendingServicesLoading } =
    useApiQuery<Service[]>(API_ENDPOINTS.services_trending, { key: ['trending_services'] });

  const applyFilters = (draftFilter: FilterType) => {
    setFilter(draftFilter);
    setIsFilterOpen(false);
    setActiveDot(0);
  };

  const clearFilters = () => {
    setIsFilterOpen(false);
    setFilter(defaultFilter());
  };

  const onBlur = () => {
    setIsSearchFocused(false);
    if (isSearchFocusedQuery) {
      router.replace('/discover');
    }
  }

  const onClear = () => {
    setSearch("");
    setDebouncedSearch("");
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto w-full max-w-md px-4 pb-4 pt-3">
        <AppSearchInput
          value={search}
          inputRef={searchInputRef}
          onValueChange={setSearch}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={onBlur}
          onClear={onClear}
          placeholder={t("user.hero.search_placeholder")}
          onFilterClick={() => setIsFilterOpen(true)}
        />

        {contentVisible && !isPriceOnlyFilter && (
          <div className="mt-5">
            <p className="mb-3 text-sm font-semibold text-slate-700">
              {t("user.discover.shops")}
            </p>

            <ShopList
              shops={filterItemsVisible ? shopsData.shops : trendingShops.shops}
              isLoading={filterItemsVisible ? isShopsLoading : isTrendingShopsLoading}
              isListLayoutForShops={isListLayoutForShops}
              skeleton_count={SKELETON_COUNT}
              activeDot={activeDot}
              setActiveDot={setActiveDot}
              compact_skeleton_count={COMPACT_SHOP_ROW_SKELETON_COUNT} />
          </div>
        )}

        {contentVisible && (
          <ServiceList
            isLoading={filterItemsVisible ? isShopsLoading : isTrendingServicesLoading}
            skeletonCount={SKELETON_COUNT}
            services={isSearching || hasAppliedFilters ? shopsData.services : trendingServices}
          />
        )}
      </div>

      <FilterDialog
        key={isFilterOpen ? "open" : "closed"}
        categories={filterCategories}
        isOpen={isFilterOpen}
        filter={filter}
        applyFilters={applyFilters}
        clearFilters={clearFilters}
        setIsFilterOpen={setIsFilterOpen}
      />
    </div>
  );
}
