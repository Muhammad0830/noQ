import { Dispatch, FC, SetStateAction, useState } from "react";
import ShopDetailsSection from "./ShopDetailsScreen";
import ServiceTabSkeleton from "./ServiceTabSkeleton";
import ServiceTab from "./ServiceTab";
import GalleryTab from "./GalleryTab";
import ReviewsTabSkeleton from "./ReviewsTabSkeleton";
import ReviewsTab from "./ReviewsTab";
import { useTranslations } from "next-intl";
import { ShopWithServices } from "@/shared/types/shop";
import { Review } from "@/features/reviews/types";
import { Service } from "@noq/shared";

interface ShopTabsProps {
    imageLoadError: boolean;
    isShopLoading: boolean;
    isServicesLoading: boolean;
    isReviewsLoading: boolean;
    shop: ShopWithServices;
    serviceList: Service[];
    reviewList: Review[];
    backgroundImage: string | null;
    setImageLoadError: Dispatch<SetStateAction<boolean>>;
}

const ShopTabs: FC<ShopTabsProps> = ({
    imageLoadError,
    isShopLoading,
    isServicesLoading,
    serviceList,
    shop,
    reviewList,
    isReviewsLoading,
    backgroundImage,
    setImageLoadError,
}) => {
    const t = useTranslations();

    const [activeTab, setActiveTab] = useState("services");

    return (
        <div className="max-w-3xl mx-auto px-4 pt-6">
            <ShopDetailsSection phone={shop.phone} />

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
                <div className="flex gap-4 sm:gap-8 overflow-x-auto no-scrollbar">
                    {["services", "gallery", "reviews", "about"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-3 font-medium text-xs sm:text-sm capitalize transition-colors whitespace-nowrap ${activeTab === tab
                                ? "text-teal-600 border-b-2 border-teal-600"
                                : "text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            {t(`user.shop.${tab}`)}
                        </button>
                    ))}
                </div>
            </div>

            {activeTab === "services" && !isShopLoading && (
                <div className="space-y-4">
                    {isServicesLoading
                        ? <ServiceTabSkeleton />
                        : <ServiceTab serviceList={serviceList} shopId={shop.id} />}
                </div>
            )}

            {activeTab === "gallery" && (
                <GalleryTab
                    backgroundImage={backgroundImage}
                    imageLoadError={imageLoadError}
                    shopName={shop.name}
                    setImageLoadError={setImageLoadError} />
            )}

            {/* Reviews Tab */}
            {activeTab === "reviews" && (
                <div className="space-y-4">
                    {isReviewsLoading
                        ? <ReviewsTabSkeleton />
                        : <ReviewsTab reviewList={reviewList} />}
                </div>
            )}

            {/* About Tab */}
            {activeTab === "about" && (
                <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">
                        {t("user.shop.about")}
                    </h3>
                    <p className="text-gray-700 text-sm">
                        {shop.description || "No description yet"}
                    </p>
                </div>
            )}
        </div>
    );
}

export default ShopTabs;