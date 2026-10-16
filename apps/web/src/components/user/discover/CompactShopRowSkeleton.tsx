import { Skeleton } from "@/components/ui/skeleton";

export default function CompactShopRowSkeleton({ isLast }: { isLast: boolean }) {
    return (
        <div
            className={`flex items-center gap-3 px-2 py-3 ${isLast ? "" : "border-b border-slate-200/70"}`}
        >
            <Skeleton className="h-14 w-14 shrink-0 rounded-2xl bg-slate-200" />
            <div className="min-w-0 flex-1">
                <Skeleton className="h-5 w-36 rounded-full bg-slate-200" />
                <Skeleton className="mt-2 h-4 w-24 rounded-full bg-slate-200" />
            </div>
            <Skeleton className="h-5 w-5 rounded-full bg-slate-200" />
        </div>
    )
}