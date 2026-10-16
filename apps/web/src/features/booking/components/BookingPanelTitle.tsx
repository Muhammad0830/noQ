import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { FC, ReactNode } from "react";

interface BookingPanelTitleProps {
    title: string;
    icon: ReactNode;
    labelText: string;
    labelClassName: string;
}

const BookingPanelTitle: FC<BookingPanelTitleProps> = ({
    title,
    icon,
    labelText,
    labelClassName,
}) => {
    const t = useTranslations();

    return (
        <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[23px] font-semibold tracking-tight text-foreground sm:text-[30px]">
                {t(title)}
            </h2>
            <span
                className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-2 py-1 text-[10px] uppercase tracking-widest font-bold",
                    labelClassName
                )}
            >
                {icon}
                {t(labelText)}
            </span>
        </div>
    );
}

export default BookingPanelTitle;