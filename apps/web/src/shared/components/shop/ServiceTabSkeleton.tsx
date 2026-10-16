import { Skeleton } from "@/components/ui/skeleton";

const ServiceSkeleton = () => {
    return (
        [...Array(4)].map((_, i) => (
            <div key={i} className="p-4 sm:p-5 bg-gray-50 rounded-xl">
                <Skeleton className="h-5 w-44 mb-3" />
                <Skeleton className="h-4 w-60 mb-3" />
                <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-9 w-24 rounded-full" />
                </div>
            </div>
        ))
    );
}

export default ServiceSkeleton;