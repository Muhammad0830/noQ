import { Skeleton } from "@/components/ui/skeleton";

const ReviewsTabSkeleton = () => {
    return (
        [...Array(3)].map((_, i) => (
            <div key={i} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                    <div>
                        <Skeleton className="h-4 w-28 mb-2" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-4/5" />
            </div>
        ))
    );
}

export default ReviewsTabSkeleton;