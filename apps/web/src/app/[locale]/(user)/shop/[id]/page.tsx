"use client";

import { useState, use } from "react";
import useApiQuery from "@/hooks/useApiQuery";
import { API_ENDPOINTS } from "@/lib/api";
import { getImageUrl } from "@/lib/supabaseClient";
import SecondaryHeader from "@/components/layouts/SecondaryHeader";
import ShopPageSkeleton from "@/shared/components/shop/ShopPageSkeleton";
import ImageSection from "@/shared/components/shop/ImageSection";
import ShopTabs from "@/shared/components/shop/ShopTabs";
import { ShopWithServices } from "@/shared/types/shop";
import { Service } from "@/shared/types/service";
import { Review } from "@/features/reviews/types";

export default function ShopProfile({ params }: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);

  const {
    data: shop,
    isLoading: shopLoading,
    error: shopError,
  } = useApiQuery<ShopWithServices>(API_ENDPOINTS.shopById(id), {
    key: ["shop", id],
  });

  const { data: servicesData = [], isLoading: servicesLoading } = useApiQuery<
    Service[]
  >(API_ENDPOINTS.shopServices(id), {
    key: ["services", id],
  });

  const { data: reviewsData = { data: [] }, isLoading: reviewsLoading } = useApiQuery<
    { data: Review[] }
  >(API_ENDPOINTS.shopReviews(id), {
    key: ["reviews", id],
  });

  if (shopLoading) {
    return <ShopPageSkeleton />
  }

  if (!shop) {
    // TODO: shop not found component implementation
    return null;
  }

  const backgroundImage = shop.backgroundImageUrl
    ? shop.backgroundImageUrl.startsWith("http")
      ? shop.backgroundImageUrl
      : getImageUrl("shop_images", shop.backgroundImageUrl)
    : null;

  return (
    <div className="bg-white transition-colors">
      <SecondaryHeader isFavorite={isFavorite} shop={shop} onFavorite={() => setIsFavorite(!isFavorite)} />

      {shopError && (
        <div className="bg-red-50 border border-red-200 p-4 m-4 rounded-lg">
          <p className="text-red-800 font-semibold">
            Error loading shop details
          </p>
          <p className="text-red-600 text-sm">
            {shopError.response?.data?.message || shopError.message}
          </p>
        </div>
      )}

      <ImageSection
        shop={shop}
        backgroundImage={backgroundImage}
        imageLoadError={imageLoadError}
        isLoading={shopLoading}
        setImageLoadError={setImageLoadError} />

      <ShopTabs
        imageLoadError={imageLoadError}
        isShopLoading={shopLoading}
        isServicesLoading={servicesLoading}
        isReviewsLoading={reviewsLoading}
        shop={shop}
        serviceList={servicesData}
        reviewList={reviewsData.data}
        backgroundImage={backgroundImage}
        setImageLoadError={setImageLoadError} />
    </div>
  );
}
