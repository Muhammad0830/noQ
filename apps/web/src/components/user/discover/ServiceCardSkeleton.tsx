import { Skeleton } from "@/components/ui/skeleton";

export default function ServiceCardSkeleton() {
    return (
        <div className="flex items-center justify-between gap-4 border-b border-slate-200/70 py-4 last:border-b-0">
            <div className="min-w-0 flex-1">
                <Skeleton className="h-5 w-36 rounded-full bg-slate-200" />
                <Skeleton className="mt-2 h-3.5 w-44 rounded-full bg-slate-200" />
            </div>

            <div className="shrink-0 text-right">
                <Skeleton className="ml-auto h-6 w-18 rounded-full bg-slate-200" />
                <Skeleton className="mt-2 ml-auto h-4 w-12 rounded-full bg-slate-200" />
            </div>
        </div>
    )
}