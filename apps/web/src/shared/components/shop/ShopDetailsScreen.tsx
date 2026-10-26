import { ShopWithStaffs } from "@/shared/types/shop";
import { Clock, MapPin, Phone, SquareArrowOutUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { FC } from "react";

interface ShopDetailsScreenProps {
    shop: ShopWithStaffs;
}

const ShopDetailsScreen: FC<ShopDetailsScreenProps> = ({
    shop,
}) => {
    const t = useTranslations();

    const distance = "1.2 miles";

    return (
        <div className="mb-6">
            <div
                className={`grid ${shop.phoneNumber ? "grid-cols-3" : "grid-cols-2"} gap-3 sm:gap-4`}
            >
                <div className="flex flex-col items-center gap-2 sm:gap-3 rounded-2xl border border-[#f1c894] bg-white p-3 text-center">
                    <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-[#F49B33]" />

                    <div className="flex-1 flex flex-col gap-1 items-center text-[12px] font-semibold text-[#8a5620] sm:text-sm">
                        <span>{shop.openTime ? `${shop.openTime} - ${shop.closeTime}` : 'user.shop.closedToday'}</span>

                        <div className="flex items-center gap-2">
                            <span>{t("user.shop.viewDetails")}</span>
                            <SquareArrowOutUpRight className="w-3.5 h-3.5" />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-2 sm:gap-3 rounded-2xl border border-[#f1c894] bg-white p-3 text-center">
                    <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-[#F49B33]" />

                    <div className="flex-1 flex flex-col gap-1 items-center text-[12px] font-semibold text-[#8a5620] sm:text-sm">
                        <span>{distance}</span>

                        <div className="flex items-center gap-2">
                            <span>{t("user.shop.viewDetails")}</span>
                            <SquareArrowOutUpRight className="w-3.5 h-3.5" />
                        </div>
                    </div>
                </div>

                <a
                    target="_blank"
                    href={`tel:${shop.phoneNumber}`}
                    className="flex flex-col items-center gap-2 rounded-2xl border border-[#f1c894] bg-white p-3 text-center transition hover:bg-white sm:p-4 sm:gap-3"
                >
                    <Phone className="h-5 w-5 sm:h-6 sm:w-6 text-[#F49B33]" />

                    <div className="flex-1 flex flex-col gap-1 items-center text-[12px] font-semibold text-[#8a5620] sm:text-sm">
                        <span>{t("user.shop.phoneNumber")}</span>

                        <div className="flex items-center gap-2">
                            <span>{t("user.shop.call")}</span>
                            <SquareArrowOutUpRight className="w-3.5 h-3.5" />
                        </div>
                    </div>
                </a>
            </div>
        </div>
    );
}

export default ShopDetailsScreen;