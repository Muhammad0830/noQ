"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";
import type { ShopCategory } from "@shared/types/general_types";
import { resolveCategoryIcon } from "@/lib/getCategoryIcon";

interface CategoriesSectionProps {
  categories?: ShopCategory[];
  isLoading?: boolean;
  onCategorySelect?: (categoryId: string | null) => void;
  selectedCategory?: string | null;
}

const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  categories = [],
  isLoading = false,
  onCategorySelect,
  selectedCategory = null,
}) => {
  const { t } = useLanguage();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [activeDot, setActiveDot] = useState(0);

  const indicatorCount = useMemo(
    () => Math.max(1, categories.length),
    [categories.length],
  );

  const updateActiveDot = () => {
    const el = scrollRef.current;
    if (!el) return;

    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) return;

    const progress = el.scrollLeft / maxScroll;
    setActiveDot(Math.round(progress * (indicatorCount - 1)));
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener("scroll", updateActiveDot, { passive: true });
    window.addEventListener("resize", updateActiveDot);

    return () => {
      el.removeEventListener("scroll", updateActiveDot);
      window.removeEventListener("resize", updateActiveDot);
    };
  }, [indicatorCount]); // eslint-disable-line

  const scrollToDot = (index: number) => {
    const el = scrollRef.current;
    if (!el) return;

    const maxScroll = el.scrollWidth - el.clientWidth;
    const target = (maxScroll * index) / Math.max(1, indicatorCount - 1);

    el.scrollTo({ left: target, behavior: "smooth" });
  };

  return (
    <section className="bg-white pt-8 pb-5 sm:pt-10 sm:pb-6 dark:bg-[#211201]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-left mb-8 sm:mb-10">
          <h2 className="mb-3 text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
            {t("categories.title")}
          </h2>
          <div className="h-1 w-20 rounded-full bg-[#F49B33]" />
        </div>

        {/* Categories */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            <div className="flex flex-nowrap gap-3 w-max min-w-full">
              {isLoading
                ? Array.from({ length: 8 }).map((_, index) => (
                    <div
                      key={`category-skeleton-${index}`}
                      className="min-w-28 sm:min-w-30 p-3 sm:p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 shrink-0"
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <Skeleton className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg" />
                        <Skeleton className="h-3 w-16 rounded" />
                      </div>
                    </div>
                  ))
                : categories.map((category) => {
                    const isSelected = selectedCategory === category.id;
                    const icon = resolveCategoryIcon(category.icon);

                    return (
                      <button
                        key={category.id}
                        onClick={() => onCategorySelect?.(category.id)}
                        className={`group min-w-28 sm:min-w-30 p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 shrink-0 ${
                          isSelected
                            ? "border-[#F49B33] bg-[#fff3e6] dark:bg-[#3a2415]"
                            : "border-[#f1c894] dark:border-[#4a2e1b] bg-white dark:bg-[#2b170b] hover:border-[#F49B33] hover:shadow-[0_10px_18px_rgba(244,155,51,0.18)]"
                        }`}
                      >
                        <div className="flex flex-col items-center space-y-2">
                          <div
                            className={`w-10 h-10 sm:w-11 sm:h-11 rounded-lg flex items-center justify-center transition-all ${
                              isSelected
                                ? "bg-[#F49B33] text-white"
                                : "bg-[#fff8f1] dark:bg-[#3a2415] text-[#F49B33] group-hover:bg-[#F49B33] group-hover:text-white"
                            }`}
                          >
                            {icon}
                          </div>
                          <span
                            className={`text-xs sm:text-sm font-semibold text-center leading-tight ${
                              isSelected
                                ? "text-[#F49B33] dark:text-[#ffd4a6]"
                                : "text-slate-700 dark:text-slate-200"
                            }`}
                          >
                            {category.name}
                          </span>
                        </div>
                      </button>
                    );
                  })}
            </div>
          </div>
        </div>

        {/* Dots */}
        {indicatorCount > 1 && (
          <div className="mt-3 flex items-center justify-center gap-2 sm:hidden">
            {Array.from({ length: indicatorCount }).map((_, i) => (
              <button
                key={i}
                onClick={() => scrollToDot(i)}
                className={`w-2 h-2 rounded-full ${
                  i === activeDot
                    ? "bg-[#F49B33] dark:bg-[#F49B33]"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoriesSection;
