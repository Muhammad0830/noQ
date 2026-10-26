"use client";

import { useState, use } from "react";
import useApiQuery from "@/hooks/useApiQuery";
import { API_ENDPOINTS } from "@/lib/api";
import { getImageUrl } from "@/lib/supabaseClient";
import SecondaryHeader from "@/components/layouts/SecondaryHeader";
import ShopPageSkeleton from "@/shared/components/shop/ShopPageSkeleton";
import ImageSection from "@/shared/components/shop/ImageSection";
import ShopTabs from "@/shared/components/shop/ShopTabs";
import { ShopWithStaffs } from "@/shared/types/shop";

export default function ShopProfile({ params }: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);

  const {
    data: shop,
    isLoading,
    error: shopError,
  } = useApiQuery<ShopWithStaffs>(API_ENDPOINTS.shopById(id), {
    key: ["shop", id],
  });

  if (isLoading) {
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
        isLoading={isLoading}
        setImageLoadError={setImageLoadError} />

      <ShopTabs
        imageLoadError={imageLoadError}
        shop={shop}
        isLoading={isLoading}
        backgroundImage={backgroundImage}
        setImageLoadError={setImageLoadError} />
    </div>
  );
}
