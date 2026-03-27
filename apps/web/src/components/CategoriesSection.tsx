"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Scissors,
  Sparkles,
  Heart,
  Coffee,
  Dumbbell,
  Palette,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";
import type { ShopCategory } from "@shared/types/types";

interface CategoriesSectionProps {
  categories?: ShopCategory[];
  isLoading?: boolean;
  onCategorySelect?: (categoryId: string | null) => void;
  selectedCategory?: string | null;
}

const ToothIcon: React.FC<{ className?: string }> = ({
  className = "w-6 h-6",
}) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor">
    <path d="M7 5.5c1.5-1 2.9-1.5 5-1.5s3.5.5 5 1.5c1.8 1.2 2.3 3.4 1.9 5.4-.4 2.2-1.4 4.2-2.5 6.2-.8 1.4-1.4 2.9-2.8 2.9-1.2 0-1.6-1.1-1.6-2.3V16c0-.6-.4-1-1-1s-1 .4-1 1v1.7c0 1.2-.4 2.3-1.6 2.3-1.4 0-2-1.5-2.8-2.9-1.1-2-2.1-4-2.5-6.2-.4-2 .1-4.2 1.9-5.4Z" />
  </svg>
);

const categoryIcons: Record<string, React.ReactNode> = {
  scissors: <Scissors className="w-6 h-6" />,
  sparkles: <Sparkles className="w-6 h-6" />,
  heart: <Heart className="w-6 h-6" />,
  coffee: <Coffee className="w-6 h-6" />,
  dumbbell: <Dumbbell className="w-6 h-6" />,
  palette: <Palette className="w-6 h-6" />,
  tooth: <ToothIcon className="w-6 h-6" />,
};

const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  categories = [],
  isLoading = false,
  onCategorySelect,
  selectedCategory = null,
}) => {
  const { t } = useLanguage();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [activeDot, setActiveDot] = useState(0);

  const resolveCategoryIcon = (iconName?: string) => {
    if (!iconName) return categoryIcons["sparkles"];

    const key = iconName.toLowerCase().trim();

    if (categoryIcons[key]) return categoryIcons[key];
    if (key.includes("hair")) return categoryIcons["scissors"];
    if (key.includes("beauty")) return categoryIcons["heart"];
    if (key.includes("nail")) return categoryIcons["palette"];
    if (key.includes("gym")) return categoryIcons["dumbbell"];
    if (key.includes("coffee")) return categoryIcons["coffee"];
    if (key.includes("dent")) return categoryIcons["tooth"];

    return categoryIcons["sparkles"];
  };

  const indicatorCount = useMemo(
    () => Math.max(1, categories.length),
    [categories.length]
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
  }, [indicatorCount]);

  const scrollToDot = (index: number) => {
    const el = scrollRef.current;
    if (!el) return;

    const maxScroll = el.scrollWidth - el.clientWidth;
    const target = (maxScroll * index) / Math.max(1, indicatorCount - 1);

    el.scrollTo({ left: target, behavior: "smooth" });
  };

  return (
    <section className="py-12 sm:py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-left mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
            {t("categories.title")}
          </h2>
          <div className="w-20 h-1 bg-linear-to-r from-blue-600 to-purple-600 rounded-full"></div>
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
                        ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:border-blue-400 hover:shadow-lg"
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <div
                        className={`w-10 h-10 sm:w-11 sm:h-11 rounded-lg flex items-center justify-center transition-all ${
                          isSelected
                            ? "bg-linear-to-br from-blue-600 to-purple-600 text-white"
                            : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400 group-hover:bg-linear-to-br group-hover:from-blue-600 group-hover:to-purple-600 group-hover:text-white"
                        }`}
                      >
                        {icon}
                      </div>
                      <span
                        className={`text-xs sm:text-sm font-semibold text-center leading-tight ${
                          isSelected
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-gray-700 dark:text-gray-300"
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
                    ? "bg-blue-600 dark:bg-blue-400"
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