"use client";

import { Review } from "@/features/reviews/types";
import { Star } from "lucide-react";
import { useTranslations } from "next-intl";
import { FC } from "react";

interface ReviewsTabProps {
    reviewList: Review[]
}

const ReviewsTab: FC<ReviewsTabProps> = ({
    reviewList
}) => {
    const t = useTranslations();

    if (reviewList.length <= 0) {
        return (
            <p className="text-gray-500 text-center py-8">
                {t("user.shop.noReviews")}
            </p>
        )
    }

    return reviewList.map(review => {
        return (
            <div key={review.id} className="p-4 bg-gray-50 rounded-lg">
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
        )
    });
}

export default ReviewsTab;