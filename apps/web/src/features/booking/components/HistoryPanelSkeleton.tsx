'use client';

import { Skeleton } from "@/components/ui/skeleton";

const HistoryPanelSkeleton = () => {
    return (
        <div className="space-y-3">
            {[1, 2, 3].map((item) => (
                <div
                    key={item}
                    className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white/80"
                >
                    {/* Header Section Skeleton */}
                    <div className="p-3.5 pb-3">
                        <div className="flex items-start gap-3">
                            <Skeleton className="h-14 w-14 shrink-0 rounded-xl" />
                            <div className="min-w-0 flex-1 space-y-2">
                                <Skeleton className="h-5 w-32 rounded-md" />
                                <Skeleton className="h-4 w-40 rounded-md" />
                                <Skeleton className="h-3 w-48 rounded-md" />
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="mx-3.5 h-px bg-slate-200" />

                    {/* Status Section Skeleton */}
                    <div className="flex items-center justify-between px-3.5 py-3">
                        <Skeleton className="h-4 w-24 rounded-md" />
                        <Skeleton className="h-5 w-20 rounded-md" />
                    </div>

                    {/* Details Section Skeleton */}
                    <div className="border-t border-slate-200 px-3.5 py-3">
                        <Skeleton className="h-4 w-32 rounded-md" />
                    </div>

                    {/* Actions/Reason Section Skeleton */}
                    <div className="border-t border-slate-200 px-3.5 py-3">
                        <div className="flex gap-2">
                            <Skeleton className="h-9 flex-1 rounded-full" />
                            <Skeleton className="h-9 flex-1 rounded-full" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default HistoryPanelSkeleton;