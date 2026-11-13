import { Skeleton } from "../../ui/skeleton";

const DashboardTimeLineSkeleton = () => {
    return (
        <div className="mb-4 space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
                <div
                    key={`timeline-skeleton-${index}`}
                    className="grid grid-cols-[40px_12px_minmax(0,1fr)] items-start gap-1 md:grid-cols-[52px_13px_minmax(0,1fr)] md:gap-1.5 lg:grid-cols-[64px_14px_minmax(0,1fr)] lg:gap-2"
                >
                    <div className="flex justify-start pt-1 md:pt-1 lg:pt-2">
                        <Skeleton className="h-2.5 w-7 rounded-full md:h-3 md:w-7 lg:h-3 lg:w-8" />
                    </div>

                    <div className="relative min-h-full min-w-0">
                        <div className="absolute bottom-0 left-1/2 top-0 w-px -translate-x-1/2 bg-gray-200" />
                        <Skeleton className="absolute left-1/2 top-3 h-3 w-3 -translate-x-1/2 rounded-full" />
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white px-3 py-3 shadow-sm md:px-4 md:py-3.5 lg:rounded-3xl lg:px-5 lg:py-4">
                        <div className="mb-1 flex min-w-0 items-start justify-between gap-2 sm:gap-3">
                            <Skeleton className="h-5 w-28 rounded-full" />
                            <Skeleton className="h-5 w-20 shrink-0 rounded-full" />
                        </div>

                        <div className="mt-1 flex min-w-0 items-center gap-2">
                            <Skeleton className="h-3 w-36 rounded-full" />
                            <Skeleton className="h-5 w-14 shrink-0 rounded-full" />
                        </div>

                        <div className="my-3 h-px bg-gray-200" />

                        <div className="flex min-w-0 items-center gap-2">
                            <Skeleton className="h-6 w-6 rounded-full" />
                            <Skeleton className="h-3 w-40 rounded-full" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default DashboardTimeLineSkeleton;