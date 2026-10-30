"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { ShopDetails } from "@noq/shared";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Dispatch, FC, SetStateAction } from "react";

interface ImageSectionProps {
    shop: ShopDetails;
    isLoading: boolean;
    backgroundImage: string | null;
    imageLoadError: boolean;
    setImageLoadError: Dispatch<SetStateAction<boolean>>;
}

const ImageSection: FC<ImageSectionProps> = ({
    isLoading,
    backgroundImage,
    imageLoadError,
    shop,
    setImageLoadError
}) => {
    const t = useTranslations();

    const shopInitial = (shop.name?.trim()?.charAt(0) || "S").toUpperCase();
    console.log(shop)

    return (
        <div className="max-w-3xl mx-4 mt-1 relative h-64 sm:h-80 bg-gray-300 overflow-hidden rounded-3xl">
            {isLoading ? (
                <Skeleton className="h-full w-full relative rounded-3xl" />
            ) : (
                <>
                    {backgroundImage && !imageLoadError ? (
                        <Image
                            src={backgroundImage}
                            alt={shop.name}
                            onError={() => {
                                setImageLoadError(true);
                            }}
                            fill
                            loading="eager"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-linear-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                            <span className="text-6xl font-bold text-gray-300">
                                {shopInitial}
                            </span>
                        </div>
                    )}

                    <div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/20 to-transparent" />

                    <div className="absolute bottom-3 sm:bottom-4 left-3 right-0 sm:left-4 pr-4">
                        <span
                            className={`px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold text-white ${shop.isOpen ? "bg-green-600" : "bg-red-500"}`}
                        >
                            {shop.isOpen ? t("user.shop.openNow") : t("user.shop.closed")}
                        </span>
                        <p className="mt-1.5 sm:mt-2 w-full truncate text-white text-base sm:text-2xl font-medium leading-tight drop-shadow-md line-clamp-2">
                            {shop.address || "Address not available"}
                        </p>
                    </div>
                </>
            )}
        </div>

    );
}

export default ImageSection;