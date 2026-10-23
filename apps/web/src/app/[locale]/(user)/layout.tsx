import { ConditionalBottomNav } from "@/shared/components";
import React from "react";

export default function Layout({ children }: {
    children: React.ReactNode
}) {
    return <div className="pb-16 flex-1 flex flex-col">
        <div className="flex-1 flex flex-col">{children}</div>

        <ConditionalBottomNav />
    </div>
}