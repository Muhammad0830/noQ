"use client";

import React, { useRef } from "react";
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

  return (
    <section className="bg-white pt-8 pb-5 sm:pt-10 sm:pb-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-left mb-8 sm:mb-10">
          <h2 className="mb-3 text-2xl font-bold text-slate-900 sm:text-3xl">
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
                      className="min-w-28 sm:min-w-30 p-3 sm:p-4 rounded-xl border border-gray-200 bg-gray-50 shrink-0"
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
                            ? "border-[#F49B33] bg-[#fff3e6]"
                            : "border-[#f1c894] bg-white hover:border-[#F49B33] hover:shadow-[0_10px_18px_rgba(244,155,51,0.18)]"
                        }`}
                      >
                        <div className="flex flex-col items-center space-y-2">
                          <div
                            className={`w-10 h-10 sm:w-11 sm:h-11 rounded-lg flex items-center justify-center transition-all ${
                              isSelected
                                ? "bg-[#F49B33] text-white"
                                : "bg-[#fff8f1] text-[#F49B33] group-hover:bg-[#F49B33] group-hover:text-white"
                            }`}
                          >
                            {icon}
                          </div>
                          <span
                            className={`text-xs sm:text-sm font-semibold text-center leading-tight ${
                              isSelected
                                ? "text-[#F49B33]"
                                : "text-slate-700"
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

      </div>
    </section>
  );
};

export default CategoriesSection;
