"use client";

import { FC, ReactNode } from "react";
import { FieldError } from "react-hook-form";

interface FieldCardProps {
    children: ReactNode;
    icon: ReactNode;
    label: string;
    error?: FieldError;
}

const FieldCard: FC<FieldCardProps> = ({
    children,
    label,
    icon,
    error,
}) => {
    return (
        <section className="rounded-[22px] bg-white p-4 shadow-[0_10px_30px_rgba(17,24,39,0.06)] ring-1 ring-black/5">
            <div className="mb-3 flex items-center gap-2 text-[#9aa3b1]">
                {icon}

                <span className="text-[12px] font-semibold uppercase tracking-[0.18em]">
                    {label}
                </span>
            </div>

            {children}

            {error && (
                <p className="text-red-600 mt-1" role="alert">{error.message}</p>
            )}
        </section>

    );
}

export default FieldCard;