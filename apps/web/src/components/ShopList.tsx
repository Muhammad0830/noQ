"use client";

import React, { useMemo, useRef, useState } from "react";
import { Filter } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import ShopCard from "./ShopCard";
import { Skeleton } from "@/components/ui/skeleton";
import { API_ENDPOINTS } from "@/lib/api";
import type { Shop, ShopCategory } from "@shared/types/general_types";
import useApiQuery from "@/hooks/useApiQuery";

interface ServicesListProps {
  initialShops?: Shop[];
  categories?: ShopCategory[];
  selectedCategory?: string | null;
  searchQuery?: string;
}

const ServicesList: React.FC<ServicesListProps> = ({
  selectedCategory = null,
  searchQuery = "",
}) => {
  const { t } = useLanguage();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [activeDot, setActiveDot] = useState(0);

  const trendingUrl = useMemo(() => {
    const params = new URLSearchParams();

    if (searchQuery.trim()) {
      params.set("search", searchQuery.trim());
    }

    if (selectedCategory) {
      params.set("categoryId", selectedCategory);
    }

    const query = params.toString();
    return query
      ? `${API_ENDPOINTS.shops_trending}?${query}`
      : API_ENDPOINTS.shops_trending;
  }, [searchQuery, selectedCategory]);

  // 🔥 API CALL
  const {
    data: shops = [],
    isLoading,
    isError,
    error,
  } = useApiQuery<Shop[]>(trendingUrl, {
    key: ["shops", searchQuery, selectedCategory ?? "all"],
  });

  // 🔥 FILTER
  const filteredServices = shops.filter((shop) => {
    if (
      searchQuery &&
      !shop.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    if (selectedCategory && shop.categoryId !== selectedCategory) {
      return false;
    }

    return true;
  });

  const indicatorCount = Math.max(1, filteredServices.length);

  const updateActiveDot = () => {
    const el = scrollRef.current;
    if (!el) return;

    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) return;

    const progress = el.scrollLeft / maxScroll;
    setActiveDot(Math.round(progress * (indicatorCount - 1)));
  };

  const scrollToDot = (index: number) => {
    const el = scrollRef.current;
    if (!el) return;

    const maxScroll = el.scrollWidth - el.clientWidth;
    const target = (maxScroll * index) / Math.max(1, indicatorCount - 1);

    el.scrollTo({ left: target, behavior: "smooth" });
  };

  const handleFavorite = (_id: string) => {};

  const skeletonCountMobile = 3;
  const skeletonCountDesktop = 8;

  return (
    <section className="bg-white pt-6 pb-12 sm:pt-8 sm:pb-16 dark:bg-[#211201]">
      {error?.message ?? ""}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="text-left mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
            {t("services.homePopularPurchases")}
          </h2>
          <div className="w-20 h-1 rounded-full bg-[#F49B33]"></div>
        </div>

        {/* LOADING */}
        {isLoading ? (
          <>
            <div className="sm:hidden">
              <div className="overflow-x-auto flex gap-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {Array.from({ length: skeletonCountMobile }).map((_, i) => (
                  <div
                    key={`mobile-skeleton-${i}`}
                    className="max-w-85 min-w-65 w-[70vw] shrink-0"
                  >
                    <div className="rounded-3xl border border-border bg-card p-4">
                      <Skeleton className="h-52 w-full rounded-2xl" />
                      <Skeleton className="mt-4 h-5 w-3/4" />
                      <Skeleton className="mt-2 h-4 w-1/2" />
                      <Skeleton className="mt-4 h-10 w-full rounded-xl" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: skeletonCountDesktop }).map((_, i) => (
                <div
                  key={`desktop-skeleton-${i}`}
                  className="rounded-3xl border border-border bg-card p-4"
                >
                  <Skeleton className="h-52 w-full rounded-2xl" />
                  <Skeleton className="mt-4 h-5 w-3/4" />
                  <Skeleton className="mt-2 h-4 w-1/2" />
                  <Skeleton className="mt-4 h-10 w-full rounded-xl" />
                </div>
              ))}
            </div>
          </>
        ) : filteredServices.length > 0 ? (
          <>
            {/* MOBILE */}
            <div className="sm:hidden">
              <div
                ref={scrollRef}
                onScroll={updateActiveDot}
                className="overflow-x-auto flex gap-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
              >
                {filteredServices.map((shop) => (
                  <div
                    key={shop.id}
                    className="max-w-85 min-w-65 w-[70vw] shrink-0"
                  >
                    <ShopCard shop={shop} onFavorite={handleFavorite} />
                  </div>
                ))}
              </div>

              {indicatorCount > 1 && (
                <div className="flex justify-center gap-2 mt-3">
                  {Array.from({ length: indicatorCount }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => scrollToDot(i)}
                      className={`w-2 h-2 rounded-full ${
                        i === activeDot ? "bg-[#F49B33]" : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* DESKTOP */}
            <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredServices.map((shop) => (
                <ShopCard
                  key={shop.id}
                  shop={shop}
                  onFavorite={handleFavorite}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <Filter className="mx-auto mb-4 text-muted-foreground" />
            <p>{isError ? t("common.error") : t("services.noResults")}</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ServicesList;
