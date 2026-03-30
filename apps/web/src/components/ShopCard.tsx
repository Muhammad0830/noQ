"use client";

import React from "react";
import {
  Star,
  Scissors,
  Sparkles,
  Heart,
  Coffee,
  Dumbbell,
  Palette,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Shop } from "@shared/types/types";
import Link from "next/link";
import { getImageUrl } from "@/lib/supabaseClient";

interface ShopCardProps {
  shop: Shop;
  onFavorite?: (shopId: string) => void;
  isFavorite?: boolean;
}

const ToothIcon: React.FC<{ className?: string }> = ({
  className = "w-5 h-5",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M7 5.5c1.5-1 2.9-1.5 5-1.5s3.5.5 5 1.5c1.8 1.2 2.3 3.4 1.9 5.4-.4 2.2-1.4 4.2-2.5 6.2-.8 1.4-1.4 2.9-2.8 2.9-1.2 0-1.6-1.1-1.6-2.3V16c0-.6-.4-1-1-1s-1 .4-1 1v1.7c0 1.2-.4 2.3-1.6 2.3-1.4 0-2-1.5-2.8-2.9-1.1-2-2.1-4-2.5-6.2-.4-2 .1-4.2 1.9-5.4Z" />
  </svg>
);

const getCategoryIcon = (iconOrName?: string) => {
  const key = iconOrName?.toLowerCase().trim() ?? "";

  if (!key) return <Sparkles className="w-5 h-5" />;
  if (
    key.includes("barber") ||
    key.includes("hair") ||
    key.includes("scissor")
  ) {
    return <Scissors className="w-5 h-5" />;
  }
  if (
    key.includes("beauty") ||
    key.includes("spa") ||
    key.includes("massage")
  ) {
    return <Heart className="w-5 h-5" />;
  }
  if (
    key.includes("nail") ||
    key.includes("makeup") ||
    key.includes("palette")
  ) {
    return <Palette className="w-5 h-5" />;
  }
  if (key.includes("gym") || key.includes("fit")) {
    return <Dumbbell className="w-5 h-5" />;
  }
  if (key.includes("coffee") || key.includes("cafe")) {
    return <Coffee className="w-5 h-5" />;
  }
  if (
    key.includes("dentist") ||
    key.includes("dental") ||
    key.includes("tooth") ||
    key.includes("teeth")
  ) {
    return <ToothIcon className="w-5 h-5" />;
  }

  if (key === "scissors") return <Scissors className="w-5 h-5" />;
  if (key === "heart") return <Heart className="w-5 h-5" />;
  if (key === "palette") return <Palette className="w-5 h-5" />;
  if (key === "dumbbell") return <Dumbbell className="w-5 h-5" />;
  if (key === "coffee") return <Coffee className="w-5 h-5" />;

  return <Sparkles className="w-5 h-5" />;
};

const shopCard: React.FC<ShopCardProps> = ({
  shop,
  onFavorite: _onFavorite,
  isFavorite: _isFavorite = false,
}) => {
  const { t } = useLanguage();
  const rootShop = shop as Partial<Shop> & {
    id?: string;  
    logoUrl?: string;
    backgroundImageUrl?: string;
    isOpen?: boolean;
  };

  const backendRating = shop.averageRating ?? shop?.averageRating;
  const rating =
    typeof backendRating === "number" ? backendRating.toFixed(1) : "0.0";
  const distance = "0.8 km";
  const driveTime = `12 ${t("shopCard.minDrive")}`;
  const nextSlot = `2:00 PM ${t("shopCard.today")}`;
  console.log(shop);
  const title = shop.name;
  const shopId = shop.id || rootShop.id || "";
  const categoryIcon = getCategoryIcon(
    shop.category?.icon || shop.category?.name,
  );
  const serviceNamesSource =
    (Array.isArray(shop.services) && shop.services) ||
    (Array.isArray((rootShop as any).services) && (rootShop as any).services) ||
    [];
    console.log("shop", shop);
    
  const serviceNames = Array.isArray(serviceNamesSource)
    ? serviceNamesSource
        .map((item) => (typeof item === "string" ? item : String(item)))
        .join(" — ")
    : "";
  const isCurrentlyOpen = shop?.isOpen ?? rootShop.isOpen ?? true;
  const rawImage = rootShop.backgroundImageUrl;
  const imageUrl = rawImage ? getImageUrl(rawImage) : null;


  return (
    <Link href={`/shop/${shopId}`} className="block">
      <div className="group overflow-hidden rounded-3xl bg-linear-to-br from-blue-50 via-white to-purple-50 dark:from-blue-900/20 dark:via-gray-900 dark:to-purple-900/20 border border-blue-100 dark:border-blue-800/40 shadow-sm hover:shadow-lg transition-all duration-300">
        {/* Image Section */}
        <div className="relative h-52 overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-amber-200 via-orange-200 to-amber-300 dark:from-amber-900/40 dark:via-orange-900/40 dark:to-amber-800/40">
              <span className="text-6xl font-bold text-white/80">
                {shop.name.charAt(0)}
              </span>
            </div>
          )}

          <div className="absolute top-3 right-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-gray-800 flex items-center gap-1">
            <Star className="w-4 h-4 fill-cyan-400 text-cyan-400" />
            {rating}
          </div>

          <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/95 text-blue-600 dark:text-blue-300 flex items-center justify-center shadow-sm">
            {categoryIcon}
          </div>

          <div
            className={`absolute bottom-3 left-3 rounded-full px-2.5 py-1 text-[10px] sm:text-xs font-semibold text-white ${
              isCurrentlyOpen ? "bg-emerald-500" : "bg-red-500"
            }`}
          >
            {isCurrentlyOpen
              ? t("shopCard.availableNow")
              : t("shopCard.closedNow")}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white line-clamp-1">
                {title}
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                {serviceNames}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm sm:text-base font-bold text-cyan-500">
                {distance}
              </p>
              <p className="text-[11px] sm:text-xs text-gray-400">
                {driveTime}
              </p>
            </div>
          </div>

          <div className="my-4 h-px bg-linear-to-r from-blue-100 via-purple-100 to-pink-100 dark:from-blue-800/40 dark:via-purple-800/40 dark:to-pink-800/40" />

          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold tracking-wide text-gray-400 uppercase">
                {t("shopCard.nextSlot")}
              </p>
              <p className="mt-1 text-sm sm:text-base font-bold text-gray-800 dark:text-gray-200">
                {nextSlot}
              </p>
            </div>

            <button className="px-5 py-2 rounded-full bg-linear-to-r from-blue-500/15 to-purple-500/15 text-blue-600 dark:text-blue-300 text-xs sm:text-sm font-semibold hover:from-blue-500/25 hover:to-purple-500/25 transition-colors">
              {t("shops.book")}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default shopCard;
