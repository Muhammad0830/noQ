import { Dispatch, FC, SetStateAction, useState } from "react";
import ShopDetailsSection from "./ShopDetailsScreen";
import ServiceTabSkeleton from "./ServiceTabSkeleton";
import ServiceTab from "./ServiceTab";
import GalleryTab from "./GalleryTab";
import ReviewsTabSkeleton from "./ReviewsTabSkeleton";
import ReviewsTab from "./ReviewsTab";
import { useTranslations } from "next-intl";
import { ShopDetails } from "@noq/shared";

interface ShopTabsProps {
    isLoading: boolean;
    shop: ShopDetails;
    imageLoadError: boolean;
    backgroundImage: string | null;
    setImageLoadError: Dispatch<SetStateAction<boolean>>;
}

const ShopTabs: FC<ShopTabsProps> = ({
    shop,
    isLoading,
    imageLoadError,
    backgroundImage,
    setImageLoadError,
}) => {
    const t = useTranslations();
    const [activeTab, setActiveTab] = useState("services");

    return (
        <div className="max-w-3xl mx-auto px-4 pt-6">
            <ShopDetailsSection shop={shop} />

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

            {activeTab === "services" && (
                <div className="space-y-4">
                    {isLoading
                        ? <ServiceTabSkeleton />
                        : <ServiceTab serviceList={shop.services} shopId={shop.id} />}
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
                    {isLoading
                        ? <ReviewsTabSkeleton />
                        : <ReviewsTab reviewList={shop.reviews} />}
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