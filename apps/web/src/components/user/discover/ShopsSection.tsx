import { Dispatch, FC, SetStateAction } from "react";
import CompactShopRowSkeleton from "./CompactShopRowSkeleton";
import ShopsSkeleton from "./ShopsSkeleton";
import { useTranslations } from "next-intl";
import { ShopWithRating, TrendingShop } from "@noq/shared";
import DiscoverPageShopList from "./DiscoverPageShopList";

interface ShopsSectionProps {
    isLoading: boolean,
    isListLayoutForShops: boolean,
    skeleton_count: number,
    compact_shop_row_skeleton_count: number,
    trendingShops: TrendingShop[],
    filteredShops: ShopWithRating[],
    activeDot: number,
    setActiveDot: Dispatch<SetStateAction<number>>,
}

const ShopsSection: FC<ShopsSectionProps> = ({
    isLoading,
    isListLayoutForShops,
    skeleton_count,
    compact_shop_row_skeleton_count,
    trendingShops,
    filteredShops,
    activeDot,
    setActiveDot,
}) => {
    const t = useTranslations();

    if (isListLayoutForShops && isLoading) {
        return (
            <div className="mt-5">
                <p className="mb-3 text-sm font-semibold text-slate-700">
                    {t("user.discover.shops")}
                </p>
                <div className="rounded-2xl border border-slate-200 bg-white px-2">
                    {Array.from({ length: compact_shop_row_skeleton_count }).map((_, i) => (
                        <CompactShopRowSkeleton
                            key={`discover-popular-list-skeleton-${i}`}
                            isLast={i === compact_shop_row_skeleton_count - 1}
                        />
                    ))}
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="mt-5">
                <p className="mb-3 text-sm font-semibold text-slate-700">
                    {t("user.discover.shops")}
                </p>

                <div className="flex gap-4 overflow-x-auto scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                    {Array.from({ length: skeleton_count }).map((_, i) => (
                        <div
                            key={`discover-popular-skeleton-${i}`}
                            className="w-[70vw] max-w-85 min-w-65 shrink-0"
                        >
                            <ShopsSkeleton />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="mt-5">
            <p className="mb-3 text-sm font-semibold text-slate-700">
                {t("user.discover.shops")}
            </p>

            <DiscoverPageShopList
                trendingShops={trendingShops}
                filteredShops={filteredShops}
                isListLayoutForShops={isListLayoutForShops}
                activeDot={activeDot}
                setActiveDot={setActiveDot} />
        </div>
    );
}

export default ShopsSection;