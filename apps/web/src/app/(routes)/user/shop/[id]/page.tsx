"use client";

import { useState, useMemo, use } from "react";
import Link from "next/link";
import {
  Star,
  MapPin,
  Clock,
  Phone,
  Heart,
  Share2,
  ChevronLeft,
  Map,
} from "lucide-react";
import useApiQuery from "@/hooks/useApiQuery";
import { API_ENDPOINTS } from "@/lib/api";
import type { Shop, Service, Review } from "@shared/types/general_types";
import { getImageUrl } from "@/lib/supabaseClient";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";

// Helper function to truncate address
const truncateAddress = (address: string, words: number = 4): string => {
  if (!address) return "";
  const addressWords = address.split(" ");
  if (addressWords.length > words) {
    return addressWords.slice(0, words).join(" ") + "...";
  }
  return address;
};

interface ShopDetailResponse extends Omit<Shop, "services"> {
  services: Service[];
}

export default function ShopProfile({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { t, locale } = useLanguage();
  const [activeTab, setActiveTab] = useState("services");
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);

  // 🔥 FETCH SHOP DETAILS
  const {
    data: shop,
    isLoading: shopLoading,
    error: shopError,
  } = useApiQuery<ShopDetailResponse>(API_ENDPOINTS.shopById(id), {
    key: ["shop", id],
  });

  // 🔥 FETCH SERVICES
  const { data: servicesData = [], isLoading: servicesLoading } = useApiQuery<
    Service[]
  >(API_ENDPOINTS.shopServices(id), {
    key: ["services", id],
  });

  // 🔥 FETCH REVIEWS
  const { data: reviewsData = [], isLoading: reviewsLoading } = useApiQuery<
    Review[]
  >(API_ENDPOINTS.shopReviews(id), {
    key: ["reviews", id],
  });

  const services = useMemo(() => {
    return (servicesData?.length > 0 ? servicesData : shop?.services) || [];
  }, [servicesData, shop?.services]);

  const reviews = useMemo(() => {
    return reviewsData || [];
  }, [reviewsData]);

  if (shopLoading && !shop) {
    return (
      <div className="bg-white transition-colors">
        <div className="max-w-3xl mx-auto px-4 pt-3 pb-2 flex items-center gap-3">
          <Skeleton className="w-9 h-9 rounded-full" />
          <Skeleton className="h-6 w-40 rounded-md" />
          <div className="ml-auto flex items-center gap-2">
            <Skeleton className="w-9 h-9 rounded-full" />
            <Skeleton className="w-9 h-9 rounded-full" />
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 mt-1">
          <Skeleton className="h-64 sm:h-80 w-full rounded-3xl" />
        </div>

        <div className="max-w-3xl mx-auto px-4 pt-6">
          <div className="grid grid-cols-4 gap-3 sm:gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-20 sm:h-24 w-full rounded-lg" />
            ))}
          </div>

          <div className="flex gap-4 sm:gap-8 mb-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-5 w-20 rounded" />
            ))}
          </div>

          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="p-4 sm:p-5 bg-gray-50 rounded-xl"
              >
                <Skeleton className="h-5 w-44 mb-3" />
                <Skeleton className="h-4 w-60 mb-3" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-9 w-24 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const shopData = shop || {
    id: id,
    name: "Loading...",
    description: "",
    address: "",
    phone: "",
    isOpen: true,
    averageRating: 0,
    reviewCount: 0,
    categoryId: "",
    ownerId: "",
    category: undefined,
    backgroundImageUrl: undefined,
    createdAt: new Date().toISOString(),
  };

  const shopInitial = (shopData.name?.trim()?.charAt(0) || "S").toUpperCase();

  const backgroundImage = shopData.backgroundImageUrl
    ? shopData.backgroundImageUrl.startsWith("http")
      ? shopData.backgroundImageUrl
      : getImageUrl(shopData.backgroundImageUrl, "shop_images")
    : null;
  const distance = "1.2 miles";
  const hours = "9AM - 8PM";
  const hasPhone = Boolean(shopData.phone && shopData.phone.trim().length > 0);

  return (
    <div className="bg-white transition-colors">
      {/* Error Message */}
      {shopError && (
        <div className="bg-red-50 border border-red-200 p-4 m-4 rounded-lg">
          <p className="text-red-800 font-semibold">
            Error loading shop details
          </p>
          <p className="text-red-600 text-sm">
            {shopError.data?.message || shopError.message}
          </p>
        </div>
      )}

      {/* Top Bar */}
      <div className="max-w-3xl mx-auto px-4 pt-3 pb-2 flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="shrink-0 p-1.5 sm:p-2 bg-white rounded-full border border-gray-200 hover:bg-gray-50 transition"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
        </button>

        <div className="flex-1 text-center min-w-0">
          <h1 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">
            {shopData.name}
          </h1>
          <div className="flex items-center justify-center gap-1 mt-0.5">
            <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold text-xs sm:text-sm text-gray-900">
              {shopData.averageRating?.toFixed(1) || "0.0"}
            </span>
            <span className="text-xs sm:text-sm text-gray-600">
              ({shopData.reviewCount || 0} {t("common.reviews")})
            </span>
          </div>
        </div>

        <button
          type="button"
          className="shrink-0 p-1.5 sm:p-2 bg-white rounded-full border border-gray-200 hover:bg-gray-50 transition"
        >
          <Share2 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
        </button>
        <button
          type="button"
          onClick={() => setIsFavorite(!isFavorite)}
          className="shrink-0 p-1.5 sm:p-2 bg-white rounded-full border border-gray-200 hover:bg-gray-50 transition"
        >
          <Heart
            className={`w-4 h-4 sm:w-5 sm:h-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-700"}`}
          />
        </button>
      </div>

      {/* Hero Image Section */}
      <div className="max-w-3xl mx-auto px-4 mt-1">
        <div className="relative h-64 sm:h-80 bg-gray-300 overflow-hidden rounded-3xl">
          {shopLoading ? (
            <Skeleton className="h-full w-full rounded-3xl" />
          ) : (
            <>
              {backgroundImage && !imageLoadError ? (
                <img
                  src={backgroundImage}
                  alt={shopData.name}
                  onError={() => setImageLoadError(true)}
                  className="w-full h-full object-cover"
                  onError={() => setHeroImageHasError(true)}
                />
              ) : (
                <div className="w-full h-full bg-linear-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                  <span className="text-6xl font-bold text-gray-300">
                    {shopInitial}
                  </span>
                </div>
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/20 to-transparent" />

              {/* Status + Address */}
              <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 pr-4">
                <span
                  className={`px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold text-white ${shopData.isOpen ? "bg-teal-500" : "bg-red-500"}`}
                >
                  {shopData.isOpen ? t("shop.openNow") : t("shop.closed")}
                </span>
                <p className="mt-1.5 sm:mt-2 text-white text-base sm:text-2xl font-medium leading-tight drop-shadow-md line-clamp-2">
                  {truncateAddress(shopData.address, 4) ||
                    "Address not available"}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 pt-6">
        {/* Header Info */}
        {!shopLoading && (
          <div className="mb-6">
            {/* Quick Info Grid */}
            <div
              className={`grid ${hasPhone ? "grid-cols-4" : "grid-cols-3"} gap-3 sm:gap-4`}
            >
              <div className="flex flex-col items-center gap-2 sm:gap-3 rounded-2xl border border-[#f1c894] bg-white p-3 text-center">
                <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-[#F49B33]" />
                <span className="text-xs font-semibold text-[#8a5620] sm:text-sm">
                  {distance}
                </span>
              </div>
              <div className="flex flex-col items-center gap-2 sm:gap-3 rounded-2xl border border-[#f1c894] bg-white p-3 text-center">
                <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-[#F49B33]" />
                <span className="text-xs font-semibold text-[#8a5620] sm:text-sm">
                  {hours}
                </span>
              </div>
              <div className="flex flex-col items-center gap-2 sm:gap-3 rounded-2xl border border-[#f1c894] bg-white p-3 text-center">
                <Map className="h-5 w-5 sm:h-6 sm:w-6 text-[#F49B33]" />
                <span className="text-xs font-semibold text-[#8a5620] sm:text-sm">
                  {t("shop.viewDetails")}
                </span>
              </div>
              {hasPhone && (
                <a
                  href={`tel:${shopData.phone}`}
                  className="flex flex-col items-center gap-2 rounded-2xl border border-[#f1c894] bg-white p-3 text-center transition hover:bg-white sm:p-4 sm:gap-3"
                >
                  <Phone className="h-5 w-5 sm:h-6 sm:w-6 text-[#F49B33]" />
                  <span className="text-xs font-semibold text-[#8a5620] sm:text-sm">
                    {t("shop.phone")}
                  </span>
                </a>
              )}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <div className="flex gap-4 sm:gap-8 overflow-x-auto no-scrollbar">
            {["services", "gallery", "reviews", "about"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 font-medium text-xs sm:text-sm capitalize transition-colors whitespace-nowrap ${
                  activeTab === tab
                    ? "text-teal-600 border-b-2 border-teal-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {t(`shop.${tab}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Services Tab */}
        {activeTab === "services" && !shopLoading && (
          <div className="space-y-4">
            {servicesLoading ? (
              [...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="p-4 sm:p-5 bg-gray-50 rounded-xl"
                >
                  <Skeleton className="h-5 w-44 mb-3" />
                  <Skeleton className="h-4 w-60 mb-3" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-9 w-24 rounded-full" />
                  </div>
                </div>
              ))
            ) : services.length > 0 ? (
              services.map((service) => (
                <Link
                  key={service.id}
                  href={`/user/book/${id}?service=${service.id}`}
                  className="flex items-center justify-between p-4 sm:p-5 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm sm:text-base text-gray-900">
                      {service.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-600 dark:text-gray-400">
                      {service.durationMin && (
                        <span className="flex items-center gap-1 whitespace-nowrap">
                          <Clock className="w-4 h-4 shrink-0" />
                          <span>
                            {service.durationMin} {t("services.duration")}
                          </span>
                        </span>
                      )}
                      {service.description && (
                        <span className="truncate">{service.description}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 ml-4 shrink-0">
                    <div className="text-right">
                      <p className="text-base sm:text-lg font-bold text-teal-600 dark:text-teal-400 break-words">
                        {new Intl.NumberFormat(locale || "uz", {
                          style: "currency",
                          currency: "UZS",
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }).format(service.price || 0)}
                      </p>
                    </div>
                    <button
                      className="px-4 sm:px-6 py-2 bg-teal-500 dark:bg-teal-600 text-white text-xs sm:text-sm font-medium rounded-full hover:bg-teal-600 dark:hover:bg-teal-700 transition whitespace-nowrap text-center"
                    >
                      {t("shops.book")}
                    </button>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">
                {t("shop.noServices")}
              </p>
            )}
          </div>
        )}

        {/* Gallery Tab */}
        {activeTab === "gallery" && (
          <div className="grid grid-cols-3 gap-4">
            {backgroundImage && !imageLoadError ? (
              <div className="col-span-3">
                <img
                  src={backgroundImage}
                  alt={shopData.name}
                  onError={() => setImageLoadError(true)}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            ) : (
              <>
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square bg-gray-200 rounded-lg"
                  ></div>
                ))}
              </>
            )}
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === "reviews" && (
          <div className="space-y-4">
            {reviewsLoading ? (
              [...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <Skeleton className="h-4 w-28 mb-2" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
              ))
            ) : reviews.length > 0 ? (
              reviews.map((review) => (
                <div
                  key={review.id}
                  className="p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {review.user?.name || "Anonymous"}
                      </h4>
                      <div className="flex items-center gap-1 text-yellow-400 mt-1">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm">
                    {review.comment || "No comment"}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">
                {t("shop.noReviews")}
              </p>
            )}
          </div>
        )}

        {/* About Tab */}
        {activeTab === "about" && (
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">
              {t("shop.about")}
            </h3>
            <p className="text-gray-700 text-sm">
              {shopData.description || "No description yet"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
