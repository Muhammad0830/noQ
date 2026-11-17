import { cn } from "cn";
import { FC, ReactNode } from "react";

interface MetricCardProps {
    icon: ReactNode;
    label: string;
    value: string;
    change: string;
    changeClassName: string;
    isLoading?: boolean;
}

const MetricCard: FC<MetricCardProps> = ({
    icon,
    label,
    value,
    change,
    changeClassName,
    isLoading = false,
}) => {
    return (
        <div className="rounded-[22px] bg-white p-4 shadow-[0_10px_30px_rgba(15,17,21,0.06)]">
            <div className="mb-4 flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#fff2df] text-[#f3a137]">
                    {icon}
                </div>

                {isLoading ? (
                    <span className="h-4 w-12 animate-pulse rounded-full bg-gray-200" />
                ) : (
                    <span className={cn(
                        "rounded-full px-2 md:px-2.5 lg:px-2.5 py-0.5 md:py-1 lg:py-1 text-[9px] md:text-[10px] lg:text-[10px] font-semibold",
                        changeClassName
                    )}
                    >
                        {change}
                    </span>
                )}
            </div>

            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.28em] text-[#c2c2c2]">
                {label}
            </p>

            {
                isLoading ? (
                    <div className="h-8 w-16 animate-pulse rounded-xl bg-gray-200" />
                ) : (
                    <p className="text-[30px] font-bold tracking-tight text-[#111111]">
                        {value}
                    </p>
                )
            }
        </div >
    );
}

export default MetricCard;