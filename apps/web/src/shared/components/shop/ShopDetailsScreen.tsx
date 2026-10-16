import { Clock, Map, MapPin, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { FC } from "react";

interface ShopDetailsScreenProps {
    phone: string | undefined;
}

const ShopDetailsScreen: FC<ShopDetailsScreenProps> = ({
    phone,
}) => {
    const t = useTranslations();

    const distance = "1.2 miles";
    const hours = "9AM - 8PM";

    return (
        <div className="mb-6">
            <div
                className={`grid ${phone ? "grid-cols-4" : "grid-cols-3"} gap-3 sm:gap-4`}
            >
                <div className="flex flex-col items-center gap-2 sm:gap-3 rounded-2xl border border-[#f1c894] bg-white p-3 text-center">
                    <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-[#F49B33]" />

                    <span className="flex-1 flex items-center text-xs font-semibold text-[#8a5620] sm:text-sm">
                        {distance}
                    </span>
                </div>

                <div className="flex flex-col items-center gap-2 sm:gap-3 rounded-2xl border border-[#f1c894] bg-white p-3 text-center">
                    <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-[#F49B33]" />

                    <span className="flex-1 flex items-center text-xs font-semibold text-[#8a5620] sm:text-sm">
                        {hours}
                    </span>
                </div>

                <div className="flex flex-col items-center gap-2 sm:gap-3 rounded-2xl border border-[#f1c894] bg-white p-3 text-center">
                    <Map className="h-5 w-5 sm:h-6 sm:w-6 text-[#F49B33]" />

                    <span className="flex-1 flex items-center text-xs font-semibold text-[#8a5620] sm:text-sm">
                        {t("user.shop.viewDetails")}
                    </span>
                </div>

                {phone &&
                    <a
                        target="_blank"
                        href={`tel:${phone}`}
                        className="flex flex-col items-center gap-2 rounded-2xl border border-[#f1c894] bg-white p-3 text-center transition hover:bg-white sm:p-4 sm:gap-3"
                    >
                        <Phone className="h-5 w-5 sm:h-6 sm:w-6 text-[#F49B33]" />

                        <span className="flex-1 flex items-center text-xs font-semibold text-[#8a5620] sm:text-sm">
                            {t("user.shop.phone")}
                        </span>
                    </a>
                }
            </div>
        </div>
    );
}

export default ShopDetailsScreen;