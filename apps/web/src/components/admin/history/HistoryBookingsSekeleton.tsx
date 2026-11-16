import { FC } from "react";

interface HistoryBookingsSkeletonProps {
    count?: number
}

const HistoryBookingsSkeleton: FC<HistoryBookingsSkeletonProps> = ({
    count = 5
}) => {
    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <article key={index} className="border-b border-[#dfe3e8] py-3">
                    <div className="animate-pulse">
                        <div className="flex items-start gap-3">
                            <div className="mt-0.5 h-7 w-7 rounded-md bg-[#eef1f5]" />

                            <div className="min-w-0 flex-1">
                                <div className="h-6 w-36 rounded-full bg-[#eef1f5]" />
                                <div className="mt-2 h-4 w-44 rounded-full bg-[#eef1f5]" />
                                <div className="mt-2 h-3 w-40 rounded-full bg-[#eef1f5]" />
                            </div>

                            <div className="text-right">
                                <div className="h-7 w-16 rounded-full bg-[#fff2e4]" />
                                <div className="mt-2 h-4 w-14 rounded-full bg-[#eef1f5]" />
                            </div>
                        </div>
                    </div>
                </article>
            ))}
        </>
    );
}

export default HistoryBookingsSkeleton;