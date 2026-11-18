import { useShop } from "@/contexts/ShopContext";
import useApiQuery from "@/hooks/useApiQuery";
import { API_ENDPOINTS } from "@/lib/api";
import { getInitials } from "@/lib/utils";
import { Staff } from "@noq/shared";
import { cn } from "cn";
import { useTranslations } from "next-intl";
import { Dispatch, FC, SetStateAction } from "react";

interface SelectStaffProps {
    selectedStaff: Staff | null;
    setSelectedStaff: Dispatch<SetStateAction<Staff | null>>;
}

const SelectStaff: FC<SelectStaffProps> = ({
    selectedStaff,
    setSelectedStaff,
}) => {
    const t = useTranslations();
    const { shop } = useShop();

    const { data: staffs = [], isLoading } =
        useApiQuery<Staff[]>(
            API_ENDPOINTS.admin.staffs,
            {
                key: ["admin-new-booking-staff", `${shop?.id}`],
                enabled: !!shop?.id,
                staleTime: 30_000,
                headers: { "x-shop-id": shop?.id ?? '' },
            },
        );

    return (
        <section className="space-y-4">
            <h3 className=" text-sm font-bold text-slate-900">
                3. {t("user.booking.selectStaff")}
            </h3>

            {isLoading ? (
                <p className="text-xs text-slate-500">
                    {t("common.loading")}
                </p>
            ) : staffs.length === 0 ? (
                <div className="px-3 py-2 rounded-2xl border border-slate-200 bg-slate-50 text-center text-sm">
                    {t("admin.newBooking.staff_not_found")}
                </div>
            ) : (
                <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
                    {staffs.map((member) =>
                        <button
                            key={member.id}
                            onClick={() => setSelectedStaff(member)}
                            className="w-full text-center flex flex-col items-center"
                        >
                            <div
                                className={cn(
                                    "h-16 w-16 rounded-full border-2 p-0.5 bg-primary/70 transition-all duration-150 border-slate-300",
                                    selectedStaff?.id === member.id && "bg-primary border-[#F49B33] shadow-[0_0_0_2px_rgba(244,155,51,0.22)]",
                                )}
                            >
                                <div className="h-full w-full rounded-full bg-linear-to-br flex items-center justify-center">
                                    <span className="text-white text-md font-bold tracking-wide">
                                        {getInitials(member.user.name)}
                                    </span>
                                </div>
                            </div>

                            <p className={cn(
                                "mt-2 w-full px-1 text-[11px] leading-[1.2] whitespace-normal wrap-break-word",
                                selectedStaff?.id === member.id ? "text-[#F49B33]" : "text-slate-500"
                            )}>
                                {member.user.name}
                            </p>
                        </button>
                    )}
                </div>
            )}
        </section>
    );
}

export default SelectStaff;