import { cn, getInitials } from "@/lib/utils";
import { ShopDetails } from "@noq/shared";
import { useTranslations } from "next-intl";
import { FC } from "react";

interface SelectStaffSectionProps {
    shop: ShopDetails | undefined;
}

const SelectStaffSection: FC<SelectStaffSectionProps> = ({
    shop,
}) => {
    const t = useTranslations();

    if (!shop || shop.staffs.length === 0) {
        return null;
    }

    return (
        <section className="mb-2">
            <h3 className="text-sm font-semibold mb-3 text-slate-800">
                {t("user.booking.selectStaff")}
            </h3>

            <div className="flex items-start gap-3 overflow-x-auto px-1 snap-x snap-mandatory">
                {shop.staffs.map((member, index) => {

                    return (
                        <button
                            key={`${member.id ?? "staff"}-${index}`}
                            className="shrink-0 w-23 text-center snap-start flex flex-col items-center"
                        >
                            <div className={cn(
                                "h-16 w-16 rounded-full border-2 p-0.5",
                                index === 0 ? "border-[#F49B33]" : "border-transparent"
                            )}>
                                <div className={cn(
                                    "h-full w-full rounded-full flex items-center justify-center",
                                    index === 0 ? "bg-[#ff951d]" : "bg-[#ff961dc0]"
                                )}>
                                    <span className="text-white text-sm font-bold tracking-wide">
                                        {getInitials(member.name)}
                                    </span>
                                </div>
                            </div>

                            <p className={`mt-2 w-full px-1 text-[11px] leading-[1.2] min-h-[2.4rem] whitespace-normal wrap-break-word ${index === 0 ? "text-black" : "text-slate-500"}`}>
                                {member.name}
                            </p>
                        </button>
                    );
                })}
            </div>
        </section>
    );
}

export default SelectStaffSection;