import { Skeleton } from "@/components/ui/skeleton";

export default function ShopsSkeleton() {
    return (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="relative h-52 overflow-hidden">
                <div className="h-full w-full bg-slate-200" />

                <Skeleton className="absolute top-3 right-3 h-7 w-14 rounded-full bg-slate-200" />
                <Skeleton className="absolute top-3 left-3 h-8 w-8 rounded-full bg-slate-200" />
                <Skeleton className="absolute bottom-3 left-3 h-6 w-20 rounded-full bg-slate-200" />
            </div>

            <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                        <Skeleton className="h-5 w-3/5 rounded-full bg-slate-200" />
                        <Skeleton className="mt-2 h-4 w-4/5 rounded-full bg-slate-200" />
                    </div>

                    <div className="shrink-0 text-right">
                        <Skeleton className="h-4 w-12 rounded-full bg-slate-200" />
                        <Skeleton className="mt-2 h-3 w-10 rounded-full bg-slate-200" />
                    </div>
                </div>

                <div className="my-4 h-px bg-slate-200/70" />

                <div className="flex items-center justify-between gap-3">
                    <div>
                        <Skeleton className="h-3 w-20 rounded-full bg-slate-200" />
                        <Skeleton className="mt-2 h-4 w-24 rounded-full bg-slate-200" />
                    </div>

                    <Skeleton className="h-9 w-20 rounded-full bg-slate-200" />
                </div>
            </div>
        </div>
    )
}