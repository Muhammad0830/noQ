"use client";

import { useEffect, useState } from "react";
import HeroSection from "@/components/HeroSection";
import CategoriesSection from "@/components/CategoriesSection";
import ServicesList from "@/components/ServicesList";
import { getImageUrl } from "@/lib/supabaseClient";
import API_ENDPOINTS from "@/lib/api";
import type { ShopCategory } from "@shared/types/types";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<ShopCategory[]>([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);

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
    // Scroll to services section
    const servicesSection = document.getElementById("services");
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    let mounted = true;

    const fetchCategories = async () => {
      try {
        if (mounted) setIsCategoriesLoading(true);
        const token = localStorage.getItem("token");
        const headers: HeadersInit = token
          ? { Authorization: `Bearer ${token}` }
          : {};

        const response = await fetch(API_ENDPOINTS.categories, {
          headers,
          cache: "no-store",
        });

        if (!response.ok) {
          if (mounted) {
            setCategories([]);
            setIsCategoriesLoading(false);
          }
          return;
        }

        const payload: unknown = await response.json();
        if (!mounted || !Array.isArray(payload)) return;

        const normalized: ShopCategory[] = payload.map((item: any) => ({
          id: String(item.id),
          name: String(item.name),
          icon: item.icon ? String(item.icon) : undefined,
        }));

        setCategories(normalized);
        setIsCategoriesLoading(false);
      } catch {
        if (mounted) {
          setCategories([]);
          setIsCategoriesLoading(false);
        }
      }
    };

    fetchCategories();

    return () => {
      mounted = false;
    };
  }, []);

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
