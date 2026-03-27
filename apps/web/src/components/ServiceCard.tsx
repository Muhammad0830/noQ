"use client";

import React from "react";
import { Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Service } from "@shared/types/types";
import Link from "next/link";

interface ServiceCardProps {
  service: Service;
  onFavorite?: (serviceId: string) => void;
  isFavorite?: boolean;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onFavorite: _onFavorite,
  isFavorite: _isFavorite = false,
}) => {
  const { t } = useLanguage();
  const rating = service.shop?.rating?.toFixed(1) ?? "4.9";
  const distance = "0.8 km";
  const driveTime = `12 ${t("serviceCard.minDrive")}`;
  const nextSlot = `2:00 PM ${t("serviceCard.today")}`;
  const title = service.name;
  console.log(service);
  

  return (
    <Link href={`/shop/${service.shopId}`}>
      <div className="group overflow-hidden rounded-3xl bg-linear-to-br from-blue-50 via-white to-purple-50 dark:from-blue-900/20 dark:via-gray-900 dark:to-purple-900/20 border border-blue-100 dark:border-blue-800/40 shadow-sm hover:shadow-lg transition-all duration-300">
        {/* Image Section */}
        <div className="relative h-52 overflow-hidden">
          {service.shop?.logoUrl ? (
            <img
              src={service.shop.logoUrl}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-amber-200 via-orange-200 to-amber-300 dark:from-amber-900/40 dark:via-orange-900/40 dark:to-amber-800/40">
              <span className="text-6xl font-bold text-white/80">
                {service.name.charAt(0)}
              </span>
            </div>
          )}

          <div className="absolute top-3 right-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-gray-800 flex items-center gap-1">
            <Star className="w-4 h-4 fill-cyan-400 text-cyan-400" />
            {rating}
          </div>

          <div className="absolute bottom-3 left-3 rounded-full bg-emerald-500 px-2.5 py-1 text-[10px] sm:text-xs font-semibold text-white">
            {t("serviceCard.availableNow")}
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
                {service.services && service.services.length >0 && service.services?.map((s) => s.name).join(", ")}

              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm sm:text-base font-bold text-cyan-500">{distance}</p>
              <p className="text-[11px] sm:text-xs text-gray-400">{driveTime}</p>
            </div>
          </div>

          <div className="my-4 h-px bg-linear-to-r from-blue-100 via-purple-100 to-pink-100 dark:from-blue-800/40 dark:via-purple-800/40 dark:to-pink-800/40" />

          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold tracking-wide text-gray-400 uppercase">{t("serviceCard.nextSlot")}</p>
              <p className="mt-1 text-sm sm:text-base font-bold text-gray-800 dark:text-gray-200">{nextSlot}</p>
            </div>

            <button className="px-5 py-2 rounded-full bg-linear-to-r from-blue-500/15 to-purple-500/15 text-blue-600 dark:text-blue-300 text-xs sm:text-sm font-semibold hover:from-blue-500/25 hover:to-purple-500/25 transition-colors">
              {t("services.book")}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ServiceCard;
