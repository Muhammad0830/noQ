"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import HeroSection from "@/components/HeroSection";
import CategoriesSection from "@/components/CategoriesSection";
import ServicesList from "@/components/ShopList";
import {
  API_ENDPOINTS,
  getStorageBySource,
  getStoredAuth,
  REFRESH_TOKEN_STORAGE_KEY,
} from "@/lib/api";
import useApiQuery from "@/hooks/useApiQuery";
import type { ShopCategory } from "@shared/types/general_types";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Home() {
  const router = useRouter();
  const { language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const categoriesUrl = `${API_ENDPOINTS.categories}?lang=${encodeURIComponent(language)}`;
  const { data: categoriesData = [], isLoading: isCategoriesLoading } =
    useApiQuery<unknown[]>(categoriesUrl, {
      key: ["home-categories", language],
    });

  const refresh = REFRESH_TOKEN_STORAGE_KEY;
  const getAuth = getStoredAuth();
  console.log("refresh", REFRESH_TOKEN_STORAGE_KEY);
  console.log("storage", getAuth);

  const categories = useMemo<ShopCategory[]>(
    () =>
      // eslint-disable-next-line
      categoriesData.map((item: any) => ({
        id: String(item.id),
        name: String(item.name),
        icon: item.icon ? String(item.icon) : undefined,
      })),
    [categoriesData],
  );

  const handleSearch = (query: string, location: string) => {
    setSearchQuery(query);
    // Scroll to services section
    const servicesSection = document.getElementById("services");
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategory(categoryId);

    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      params.set("q", searchQuery.trim());
    }
    if (categoryId) {
      params.set("categoryId", categoryId);
    }

    const query = params.toString();
    router.push(query ? `/user/discover?${query}` : "/user/discover");
  };

  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <HeroSection onSearch={handleSearch} />

      {/* Categories Section */}
      <CategoriesSection
        categories={categories}
        isLoading={isCategoriesLoading}
        onCategorySelect={handleCategorySelect}
        selectedCategory={selectedCategory}
      />

      {/* Services Section */}
      <div id="services">
        <ServicesList
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}
          // locationQuery={locationQuery}
        />
      </div>
    </div>
  );
}
