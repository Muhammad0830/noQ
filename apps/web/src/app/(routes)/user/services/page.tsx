"use client";

import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import ServicesList from "@/components/ShopList";
import { useAuth } from "@/contexts/AuthContext";

export default function ServicesPage() {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">
            {t("services.all")}
          </h1>
          <p className="text-gray-600 text-sm mt-1">{t("nav.services")}</p>
        </div>
      </div>

      {/* Services List */}
      <ServicesList
        selectedCategory={selectedCategory}
        searchQuery={searchQuery}
      />
    </div>
  );
}
