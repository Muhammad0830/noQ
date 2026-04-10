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
import type { Shop } from "@shared/types/general_types";
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
  const title = shop.name;
  const shopId = shop.id || rootShop.id || "";
  const categoryIcon = getCategoryIcon(
    shop.category?.icon || shop.category?.name,
  );
  const serviceNamesSource =
    (Array.isArray(shop.services) && shop.services) ||
    (Array.isArray((rootShop as any).services) && (rootShop as any).services) ||
    [];

  const serviceNames = Array.isArray(serviceNamesSource)
    ? serviceNamesSource
        .map((item) => (typeof item === "string" ? item : String(item)))
        .join(" — ")
    : "";
  const isCurrentlyOpen = shop?.isOpen ?? rootShop.isOpen ?? true;
  const rawImage = rootShop.backgroundImageUrl;
  const imageUrl = rawImage ? getImageUrl(rawImage, "shop_images") : null;

  return (
    <Link href={`/user/shop/${shopId}`} className="block">
      <div className="group overflow-hidden rounded-3xl border border-[#f1c894] bg-linear-to-br from-[#fff8f0] via-white to-[#f6e4cd] shadow-sm transition-all duration-300 hover:shadow-[0_18px_36px_rgba(244,155,51,0.18)] dark:border-[#F49B33]/20 dark:from-[#2b170b] dark:via-[#211201] dark:to-[#1a0e06] dark:shadow-none">
        {/* Image Section */}
        <div className="relative h-52 overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-[#ffd8a6] via-[#f49b33] to-[#f08a17] dark:from-[#4a2e1b] dark:via-[#2b170b] dark:to-[#1a0e06]">
              <span className="text-6xl font-bold text-white/90">
                {shop.name.charAt(0)}
              </span>
            </div>
          )}

          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-[#8a5620] shadow-sm dark:bg-[#fff3e6] dark:text-[#8a5620]">
            <Star className="h-4 w-4 fill-[#F49B33] text-[#F49B33]" />
            {rating}
          </div>

          <div className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-[#F49B33] shadow-sm dark:bg-[#fff3e6] dark:text-[#F49B33]">
            {categoryIcon}
          </div>

          <div
            className={`absolute bottom-3 left-3 rounded-full px-2.5 py-1 text-[10px] sm:text-xs font-semibold text-white ${
              isCurrentlyOpen ? "bg-[#F49B33]" : "bg-red-500"
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
              <h3 className="line-clamp-1 text-base font-bold text-slate-900 dark:text-white sm:text-lg">
                {title}
              </h3>
              <p className="line-clamp-1 text-xs text-slate-500 dark:text-slate-300 sm:text-sm">
                {serviceNames}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm font-bold text-[#F49B33] sm:text-base">
                {distance}
              </p>
              <p className="text-[11px] text-slate-400 sm:text-xs dark:text-slate-400">
                {driveTime}
              </p>
            </div>
          </div>

          <div className="my-4 h-px bg-linear-to-r from-[#f1c894] via-[#f49b33] to-[#f1c894] dark:from-[#4a2e1b] dark:via-[#f49b33] dark:to-[#4a2e1b]" />

          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-400">
                {t("shopCard.nextSlot")}
              </p>
              <p className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-100 sm:text-base">
                {nextSlot}
              </p>
            </div>

            <button className="rounded-full bg-[#F49B33] px-5 py-2 text-xs font-semibold text-white shadow-[0_10px_18px_rgba(244,155,51,0.24)] transition hover:bg-[#e28a20] sm:text-sm">
              {t("shops.book")}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default shopCard;
