import { ChevronLeft, MoreHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { FC } from "react";

interface HeaderProps {
    shopName: string | null | undefined;
}

const Header: FC<HeaderProps> = ({
    shopName
}) => {
    const t = useTranslations();
    const router = useRouter();

    return (
        <div className="flex items-center justify-between mb-4">
            <button
                type="button"
                onClick={() => router.back()}
                className="h-9 w-9 rounded-full bg-white border border-slate-200 flex items-center justify-center"
            >
                <ChevronLeft className="w-5 h-5 text-slate-700" />
            </button>

            <div className="text-center">
                <p className="text-sm font-semibold tracking-wide">
                    {t("user.booking.title")}
                </p>
                <p className="text-[10px] text-[#F49B33] uppercase font-bold tracking-[0.2em]">
                    {shopName || t("user.booking.defaultShop")}
                </p>
            </div>

            <button className="h-9 w-9 rounded-full bg-white border border-slate-200 flex items-center justify-center">
                <MoreHorizontal className="w-5 h-5 text-slate-700" />
            </button>
        </div>
    );
}

export default Header;