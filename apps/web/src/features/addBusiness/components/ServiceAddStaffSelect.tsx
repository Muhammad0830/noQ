import { FC } from "react";
import FieldCard from "./FieldCard";
import { Check, User, Users } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { mockStaffMembers } from "../utils";
import { cn } from "cn";
import { useTranslations } from "next-intl";
import { FieldError } from "react-hook-form";

interface ServiceAddStaffSelectProps {
    error: FieldError | undefined;
    enabled: boolean;
    handleSelectAll: (checked: boolean) => void;
    selectedStaffs: string[];
    toggleStaff: (id: string) => void;
}

const ServiceAddStaffSelect: FC<ServiceAddStaffSelectProps> = ({
    error,
    enabled,
    selectedStaffs,
    handleSelectAll,
    toggleStaff,
}) => {
    const t = useTranslations()

    return (
        <FieldCard
            icon={<Users className="h-4 w-4 text-[#F49B33]" />}
            label={t("newShop.step3.staffAssignment")}
            error={error}
        >
            <div className="flex items-center justify-between gap-3">
                <p className="text-[14px] font-semibold text-[#111827]">
                    {t("newShop.step3.assignToAllStaff")}
                </p>

                <Switch checked={enabled} onChange={(event) =>
                    handleSelectAll(event.target.checked)
                } />
            </div>

            <div className="mt-4 space-y-1">
                <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#9aa3b1]">
                    {t("newShop.step3.specificMembers")}
                </p>

                {mockStaffMembers.map((member) => {
                    const active = selectedStaffs?.includes(member.id);

                    return (
                        <button
                            key={member.id}
                            type="button"
                            onClick={() => toggleStaff(member.id)}
                            className={cn(
                                "flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left transition-all duration-150",
                                active ? "border-[#F49B33] bg-[#F49B33] text-white shadow-[0_10px_24px_rgba(244,155,51,0.2)]" : "border-[#e2e6ec] bg-white text-[#6b7280]"
                            )}
                            aria-pressed={active}
                        >
                            <div className="flex items-center gap-3">
                                <span
                                    className={cn(
                                        "flex h-10 w-10 items-center justify-center rounded-full",
                                        active ? "bg-white/15 text-white" : "bg-[#f3f4f6] text-[#9aa3b1]"
                                    )}
                                >
                                    <User className="h-5 w-5" />
                                </span>

                                <span className="text-[15px] font-medium">{member.name}</span>
                            </div>

                            <span
                                className={cn(
                                    "flex h-6 w-6 items-center justify-center rounded-full border",
                                    active && enabled ? "border-white bg-white text-[#F49B33]" : "border-[#d8dde5] bg-white text-transparent"
                                )}
                            >
                                <Check className="h-4 w-4" />
                            </span>
                        </button>
                    )
                })}
            </div>
        </FieldCard>
    );
}

export default ServiceAddStaffSelect;