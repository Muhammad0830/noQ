"use client";

import React, { useRef, useState } from "react";
import { Filter } from "lucide-react";
import ShopCard from "../../ShopCard";
import type { ApiError, Shop } from "@shared/types/general_types";
import { useTranslations } from "next-intl";
import ShopListSkeleton from "./ShopListSkeleton";

const SKELETON_MOBILE_COUNT = 3;
const SKELETON_DESKTOP_COUNT = 8;

interface Props {
  shops: Shop[];
  isLoading: boolean;
  isError: boolean;
  error: ApiError | null;
}

const ShopList = ({
  shops,
  isLoading,
  isError,
  error
}: Props) => {
  const t = useTranslations();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [activeDot, setActiveDot] = useState(0);

  const indicatorCount = Math.max(1, shops.length);

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

  const onFavorite = (_id: string) => { };

  if (error) {
    return (
      <div className="w-full text-center">
        <span className="text-red-600">{error?.message ?? ""}</span>
      </div>
    );
  }

  return (
    <section className="bg-white pt-6 pb-12 sm:pt-8 sm:pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="text-left mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            {t("user.services.homePopularPurchases")}
          </h2>
          <div className="w-20 h-1 rounded-full bg-[#F49B33]"></div>
        </div>

        {/* LOADING */}
        {isLoading ? (
          <ShopListSkeleton desktop_count={SKELETON_DESKTOP_COUNT} mobile_count={SKELETON_MOBILE_COUNT} />
        ) : shops.length > 0 ? (
          <>
            {/* MOBILE */}
            <div className="sm:hidden">
              <div
                ref={scrollRef}
                onScroll={updateActiveDot}
                className="overflow-x-auto flex gap-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
              >
                {shops.map((shop) => (
                  <div
                    key={shop.id}
                    className="max-w-85 min-w-65 w-[70vw] shrink-0"
                  >
                    <ShopCard shop={shop} />
                  </div>
                ))}
              </div>
            </div>

            {/* DESKTOP */}
            <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {shops.map((shop) => (
                <ShopCard
                  key={shop.id}
                  shop={shop}
                />
              ))}
            </div>

            {indicatorCount > 1 && (
              <div className="sm:hidden flex justify-center gap-2 mt-3">
                {Array.from({ length: indicatorCount }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => scrollToDot(i)}
                    className={`w-2 h-2 rounded-full ${i === activeDot ? "bg-[#F49B33]" : "bg-gray-300"
                      }`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <Filter className="mx-auto mb-4 text-muted-foreground" />
            <p>{isError ? t("common.error") : t("user.services.noResults")}</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ShopList;
