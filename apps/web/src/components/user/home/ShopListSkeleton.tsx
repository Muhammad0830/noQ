import { Skeleton } from "../../ui/skeleton";

interface Props {
    desktop_count: number;
    mobile_count: number;
}

export default function ShopListSkeleton({
    desktop_count,
    mobile_count
}: Props) {
    return (
        <>
            <div className="sm:hidden">
                <div className="overflow-x-auto flex gap-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                    {Array.from({ length: mobile_count }).map((_, i) => (
                        <div
                            key={`mobile-skeleton-${i}`}
                            className="max-w-85 min-w-65 w-[70vw] shrink-0"
                        >
                            <div className="rounded-3xl border border-[#f1c894] bg-white p-4 shadow-sm">
                                <Skeleton className="h-52 w-full rounded-2xl" />
                                <Skeleton className="mt-4 h-5 w-3/4" />
                                <Skeleton className="mt-2 h-4 w-1/2" />
                                <Skeleton className="mt-4 h-10 w-full rounded-xl" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: desktop_count }).map((_, i) => (
                    <div
                        key={`desktop-skeleton-${i}`}
                        className="rounded-3xl border border-[#f1c894] bg-white p-4 shadow-sm"
                    >
                        <Skeleton className="h-52 w-full rounded-2xl" />
                        <Skeleton className="mt-4 h-5 w-3/4" />
                        <Skeleton className="mt-2 h-4 w-1/2" />
                        <Skeleton className="mt-4 h-10 w-full rounded-xl" />
                    </div>
                ))}
            </div>
        </>
    )
}