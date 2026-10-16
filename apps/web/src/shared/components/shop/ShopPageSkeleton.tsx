import { Skeleton } from "@/components/ui/skeleton";

const ShopPageSkeleton = () => {
    return (
        <div className="bg-white transition-colors">
            <div className="max-w-3xl mx-auto px-4 pt-3 pb-2 flex items-center gap-3">
                <Skeleton className="w-9 h-9 rounded-full" />
                <Skeleton className="h-6 w-40 rounded-md" />
                <div className="ml-auto flex items-center gap-2">
                    <Skeleton className="w-9 h-9 rounded-full" />
                    <Skeleton className="w-9 h-9 rounded-full" />
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 mt-1">
                <Skeleton className="h-64 sm:h-80 w-full rounded-3xl" />
            </div>

            <div className="max-w-3xl mx-auto px-4 pt-6">
                <div className="grid grid-cols-4 gap-3 sm:gap-4 mb-6">
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-20 sm:h-24 w-full rounded-lg" />
                    ))}
                </div>

                <div className="flex gap-4 sm:gap-8 mb-6">
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-5 w-20 rounded" />
                    ))}
                </div>

                <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="p-4 sm:p-5 bg-gray-50 rounded-xl">
                            <Skeleton className="h-5 w-44 mb-3" />
                            <Skeleton className="h-4 w-60 mb-3" />
                            <div className="flex items-center justify-between">
                                <Skeleton className="h-6 w-20" />
                                <Skeleton className="h-9 w-24 rounded-full" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ShopPageSkeleton;