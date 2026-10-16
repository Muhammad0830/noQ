"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { ReactNode } from "react";

export default function Layout({
    children
}: { children: ReactNode }) {
    const t = useTranslations();
    const router = useRouter();
    const pathname = usePathname();

    const isStepTwo = pathname === '/add-business/step-2';
    const isStepThree = pathname === '/add-business/step-3';

    const conditionalStepTrackerStyle = (step: number) => {
        const completedStyle = "bg-[#F49B33] text-white";

        if (step === 1) {
            return completedStyle;
        } else if (step === 2 && (isStepTwo || isStepThree)) {
            return completedStyle;
        } else if (step === 3 && isStepThree) {
            return completedStyle;
        }

        return "bg-slate-200 text-slate-500";
    };

    const headerText = isStepThree
        ? t("newShop.step3.pageTitle")
        : isStepTwo
            ? t("newShop.step2.pageTitle")
            : t("newShop.step1.pageTitle")

    return (
        <div className="min-h-screen bg-[#f4f5f8] px-4 py-5 text-slate-900">
            <header className="relative mb-6 flex items-center justify-center">
                <button
                    type="button"
                    onClick={() => router.back()}
                    aria-label={t("common.back")}
                    className="absolute left-0 inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50"
                >
                    <ChevronLeft className="h-5 w-5" />
                </button>
                <h1 className="text-lg font-semibold">
                    {headerText}
                </h1>
            </header>

            <div className="mb-5 flex items-center justify-center gap-2">
                {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center gap-2">
                        {step > 1 && <span className={cn(
                            "h-px w-12 bg-slate-300",
                            ((isStepTwo && step === 2) || isStepThree) && "bg-[#F49B33]")}
                        />}

                        <span
                            className={cn(
                                "inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold",
                                conditionalStepTrackerStyle(step)
                            )}
                        >
                            {step}
                        </span>
                    </div>
                ))}
            </div>

            {children}
        </div>
    );
}