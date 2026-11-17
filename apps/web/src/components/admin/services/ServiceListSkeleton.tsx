"use client";

const ServiceListSkeleton = ({
    count
}: { count?: number }) => {
    return (
        <>
            {Array.from({ length: count ?? 5 }).map((_, index) => (
                <article
                    key={index}
                    className="overflow-hidden rounded-[24px] bg-white p-4 shadow-[0_10px_25px_rgba(17,24,39,0.04)] ring-1 ring-black/5"
                >
                    <div className="animate-pulse">
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                                <div className="h-6 w-36 rounded-full bg-[#eceff3]" />
                                <div className="mt-2 h-4 w-28 rounded-full bg-[#eceff3]" />
                            </div>
                            <div className="h-14 w-14 rounded-full bg-[#fff2e4]" />
                        </div>

                        <div className="mt-5 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-[#fff2e4]" />
                                <div className="h-3 w-24 rounded-full bg-[#eceff3]" />
                            </div>
                            <div className="h-7 w-12 rounded-full bg-[#eceff3]" />
                        </div>
                    </div>
                </article>
            ))}
        </>
    );
}

export default ServiceListSkeleton;