import { Dispatch, FC, SetStateAction, useRef } from "react";
import CompactShopRowItem from "./CompactShopRowItem";
import ShopCard from "@/components/ShopCard";
import { useTranslations } from "next-intl";
import { ShopWithRating, TrendingShop } from "@noq/shared";

interface DiscoverPageShopListProps {
    isListLayoutForShops: boolean;
    trendingShops: TrendingShop[]
    filteredShops: ShopWithRating[];
    activeDot: number;
    setActiveDot: Dispatch<SetStateAction<number>>;
}

const DiscoverPageShopList: FC<DiscoverPageShopListProps> = ({
    isListLayoutForShops,
    trendingShops,
    filteredShops,
    activeDot,
    setActiveDot
}) => {
    const t = useTranslations();

    const scrollRef = useRef<HTMLDivElement | null>(null);
    const indicatorCount = Math.max(1, trendingShops.length);

    const updatePopularActiveDot = () => {
        const el = scrollRef.current;

        if (!el) return;

        const maxScroll = el.scrollWidth - el.clientWidth;

        if (maxScroll <= 0) {
            setActiveDot(0);
            return;
        }

        const progress = el.scrollLeft / maxScroll;
        const index = Math.round(progress * (indicatorCount - 1));

        setActiveDot(
            Math.min(
                indicatorCount - 1,
                Math.max(0, index)
            )
        );
    };

    const scrollToDot = (index: number) => {
        const el = scrollRef.current;
        if (!el) return;

        const maxScroll = el.scrollWidth - el.clientWidth;
        const target = (maxScroll * index) / Math.max(1, indicatorCount - 1);
        el.scrollTo({ left: target, behavior: "smooth" });
    };

    if (
        isListLayoutForShops && filteredShops.length === 0 ||
        !isListLayoutForShops && trendingShops.length === 0
    ) {
        return (
            <div className="rounded-xl border border-slate-200 bg-white px-3 py-5 text-center text-sm text-slate-500 shadow-sm">
                {t("user.discover.noShopsFound")}
            </div>
        );
    }

    if (isListLayoutForShops) {
        return (
            <div className="rounded-2xl border border-slate-200 bg-white px-2">
                {filteredShops.map((shop, index) => (
                    <CompactShopRowItem
                        key={shop.id}
                        shop={shop}
                        isLast={index === filteredShops.length - 1}
                    />
                ))}
            </div>
        );
    }

    return (
        <>
            <div className="sm:hidden">
                <div
                    ref={scrollRef}
                    onScroll={updatePopularActiveDot}
                    className="flex gap-4 overflow-x-auto scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                >
                    {trendingShops.map((shop) => (
                        <div
                            key={shop.id}
                            className="w-[70vw] max-w-85 min-w-65 shrink-0"
                        >
                            <ShopCard shop={shop} />
                        </div>
                    ))}
                </div>

                {indicatorCount > 1 && (
                    <div className="mt-3 flex justify-center gap-2">
                        {Array.from({ length: indicatorCount }).map(
                            (_, i) => (
                                <button
                                    key={`dot-${i}`}
                                    type="button"
                                    onClick={() => scrollToDot(i)}
                                    className={`h-2 w-2 rounded-full transition-colors ${i === activeDot
                                        ? "bg-cyan-500"
                                        : "bg-slate-300"
                                        }`}
                                    aria-label={t("user.discover.goToCard", {
                                        index: i + 1,
                                    })}
                                />
                            ),
                        )}
                    </div>
                )}
            </div>

            <div className="hidden gap-4 sm:grid sm:grid-cols-2">
                {trendingShops.slice(0, 4).map((shop) => (
                    <ShopCard key={shop.id} shop={shop} />
                ))}
            </div>
        </>
    );
}

export default DiscoverPageShopList;