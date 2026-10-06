'use client';
import { ConditionalBottomNav } from "@/shared/components";
import React from "react"

export default function Layout({ children }: {
    children: React.ReactNode
}) {
    return <div>
        <div>{children}</div>

        <ConditionalBottomNav />
    </div>
}