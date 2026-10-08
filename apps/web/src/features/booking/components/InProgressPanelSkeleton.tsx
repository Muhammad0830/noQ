import { Skeleton } from "@/components/ui/skeleton";

const InProgressPanelSkeleton = () => {
    return (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white/85">
            {/* Image Skeleton */}
            <Skeleton className="h-36 w-full rounded-none sm:h-44" />

            <div className="p-4 sm:p-5">
                {/* Header Section */}
                <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1 space-y-2">
                        <Skeleton className="h-4 w-20 rounded-md" />
                        <Skeleton className="h-8 w-48 rounded-md" />
                        <Skeleton className="h-4 w-64 rounded-md" />
                    </div>
                    <Skeleton className="h-11 w-11 shrink-0 rounded-full" />
                </div>

                {/* Divider */}
                <div className="my-4 h-px w-full bg-slate-200" />

                {/* Countdown & Start Time Section */}
                <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
                    <div className="flex items-center gap-2.5">
                        <Skeleton className="h-14 w-14 rounded-2xl" />
                        <Skeleton className="h-14 w-14 rounded-2xl" />
                    </div>
                    <div className="space-y-1.5 text-right">
                        <Skeleton className="h-3 w-20 rounded-md" />
                        <Skeleton className="h-6 w-24 rounded-md" />
                    </div>
                </div>

                {/* Service Details Box */}
                <div className="mb-4 flex items-center justify-between rounded-2xl border border-slate-300/70 bg-white/75 px-3 py-2">
                    <Skeleton className="h-4 w-24 rounded-md" />
                    <Skeleton className="h-4 w-28 rounded-md" />
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-2">
                    <Skeleton className="h-12 flex-1 rounded-full" />
                    <Skeleton className="h-12 w-12 rounded-full" />
                </div>
            </div>
        </div>
    );
}

export default InProgressPanelSkeleton;