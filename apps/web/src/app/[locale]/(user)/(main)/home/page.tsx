"use client";

import { useRouter } from "next/navigation";
import HeroSection from "@/components/user/home/HeroSection";
import CategoriesSection from "@/components/CategoriesSection";
import ShopList from "@/components/user/home/ShopList";
import { API_ENDPOINTS } from "@/lib/api";
import useApiQuery from "@/hooks/useApiQuery";
import type { Shop, ShopCategory } from "@shared/types/general_types";
import { useLocale } from "next-intl";
import { Route } from "next";

export default function Home() {
  const router = useRouter();
  const locale = useLocale();
  const { data: categories = [], isLoading: isCategoriesLoading } = useApiQuery<
    ShopCategory[]
  >(API_ENDPOINTS.categories, {
    key: ["home-categories", locale],
  });

  const {
    data: shopsData,
    isLoading,
    isError,
    error,
  } = useApiQuery<{ shops: Shop[] }>(API_ENDPOINTS.shops_trending, {
    key: ["shops"],
  });

  const handleCategorySelect = (categoryId: string | null) => {
    const params = new URLSearchParams();
    if (String(categoryId).trim()) {
      params.set("q", String(categoryId).trim());
    }
    if (categoryId) {
      params.set("categoryId", categoryId);
    }

    const query = params.toString();
    router.push((query ? `/discover?${query}` : "/discover") as Route);
  };

  return (
    <div className="bg-white min-h-dvh">
      {/* Hero Section */}
      <HeroSection />

      {/* Categories Section */}
      <CategoriesSection
        categories={categories}
        isLoading={isCategoriesLoading}
        onCategorySelect={handleCategorySelect}
      />

      {/* Shops Section */}
      <div id="shops">
        <ShopList
          shops={shopsData?.shops ?? []}
          isLoading={isLoading}
          isError={isError}
          error={error}
        // locationQuery={locationQuery}
        />
      </div>
    </div>
  );
}
