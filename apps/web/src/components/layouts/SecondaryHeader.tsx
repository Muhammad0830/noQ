import { ShopWithServices } from "@shared/types/general_types";
import { ChevronLeft, Heart, Share2, Star } from "lucide-react";
import { useTranslations } from "next-intl";

interface Props {
    shop: ShopWithServices;
    isFavorite: boolean;
    onFavorite: (value: boolean) => void;
}

export default function SecondaryHeader({
    shop,
    isFavorite,
    onFavorite
}: Props) {
    const t = useTranslations();

    return (
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
                    {shop.name}
                </h1>
                <div className="flex items-center justify-center gap-1 mt-0.5">
                    <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-xs sm:text-sm text-gray-900">
                        {shop.averageRating?.toFixed(1) || "0.0"}
                    </span>
                    <span className="text-xs sm:text-sm text-gray-600">
                        ({shop.reviewCount || 0} {t("common.reviews")})
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
                onClick={() => onFavorite(!isFavorite)}
                className="shrink-0 p-1.5 sm:p-2 bg-white rounded-full border border-gray-200 hover:bg-gray-50 transition"
            >
                <Heart
                    className={`w-4 h-4 sm:w-5 sm:h-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-700"}`}
                />
            </button>
        </div>
    )
}