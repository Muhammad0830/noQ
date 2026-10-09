import { Link } from "@/i18n/navigation";
import { getImageUrl } from "@/lib/supabaseClient";
import { Shop } from "@shared/types/general_types";
import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

interface Props {
    shop: Shop;
    isLast?: boolean;
}

export default function CompactShopRowItem({ shop, isLast = false }: Props) {
    const t = useTranslations();

    const imageUrl = shop.backgroundImageUrl
        ? getImageUrl("shop_images", shop.backgroundImageUrl)
        : null;

    return (
        <Link
            href={`/shop/${shop.id}`}
            className={`group flex items-center gap-3 px-2 py-3 ${isLast ? "" : "border-b border-slate-200/70"}`}
        >
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-slate-200">
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={shop.name}
                        fill
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-slate-500 to-slate-700 text-lg font-bold text-white">
                        {shop.name.charAt(0)}
                    </div>
                )}
            </div>

            <div className="min-w-0 flex-1">
                <p className="truncate text-lg font-semibold leading-tight text-slate-900 sm:text-xl">
                    {shop.name}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                    {t("user.discover.distanceAway", { distance: "1.5", })}
                </p>
            </div>

            <ChevronRight className="h-5 w-5 text-slate-400 transition-colors group-hover:text-slate-300" />
        </Link>
    );
}