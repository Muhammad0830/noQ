"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import HeroSection from "@/components/HeroSection";
import CategoriesSection from "@/components/CategoriesSection";
import ServicesList from "@/components/ShopList";
import {
  API_ENDPOINTS,
} from "@/lib/api";
import useApiQuery from "@/hooks/useApiQuery";
import type { ShopCategory } from "@shared/types/general_types";
import { useLocale } from "next-intl";

export default function Home() {
  const router = useRouter();
  const locale = useLocale();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const categoriesUrl = `${API_ENDPOINTS.categories}?lang=${encodeURIComponent(locale)}`;
  const { data: categoriesData = [], isLoading: isCategoriesLoading } =
    useApiQuery<unknown[]>(categoriesUrl, {
      key: ["home-categories", locale],
    });

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

  const handleSearch = (query: string) => {
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
    router.push(query ? `/discover?${query}` : "/discover");
  };

  return (
    <div className="bg-white">
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
