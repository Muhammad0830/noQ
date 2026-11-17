"use client";

import { Route } from "next";
import Link from "next/link";
import { FC, ReactNode } from "react";

interface PanelChangeListItemProps {
    href: Route,
    icon: ReactNode,
    title: string,
    subtitle?: string,
    onClick?: () => void;
}

const PanelChangeListItem: FC<PanelChangeListItemProps> = ({
    href,
    icon,
    title,
    subtitle,
    onClick,
}) => {
    return (
        <Link
            type="button"
            href={href}
            onClick={onClick}
            aria-label={title}
            className="no-underline! w-full relative flex items-center gap-2 py-3 rounded-lg text-left text-base"
        >
            <div className="absolute left-0 right-0 top-0 bg-black/10 h-px" />

            <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fff3e6] text-[#F49B33]">
                {icon}
            </div>

            <div className="flex flex-col gap-0.5">
                <span className="font-semibold text-sm text-slate-800">
                    {title}
                </span>

                {subtitle && (
                    <span className="text-xs text-slate-800">
                        {subtitle}
                    </span>
                )}
            </div>
        </Link>
    );
}

export default PanelChangeListItem;