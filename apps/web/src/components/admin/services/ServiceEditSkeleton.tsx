import { Skeleton } from "@/components/ui/skeleton";

const ServiceEditSkeleton = () => {
    return (
        <div className="space-y-4 pb-4">
            <section className="rounded-[22px] bg-white p-4 shadow-[0_10px_30px_rgba(17,24,39,0.06)] ring-1 ring-black/5">
                <Skeleton className="mb-3 h-4 w-28 rounded-full bg-[#eceff3]" />
                <Skeleton className="h-40 w-full rounded-[22px] bg-[#eceff3]" />
            </section>

            <section className="rounded-[22px] bg-white p-4 shadow-[0_10px_30px_rgba(17,24,39,0.06)] ring-1 ring-black/5">
                <Skeleton className="mb-3 h-4 w-32 rounded-full bg-[#eceff3]" />
                <Skeleton className="h-12 w-full rounded-2xl bg-[#eceff3]" />
            </section>

            <section className="rounded-[22px] bg-white p-4 shadow-[0_10px_30px_rgba(17,24,39,0.06)] ring-1 ring-black/5">
                <Skeleton className="mb-3 h-4 w-36 rounded-full bg-[#eceff3]" />
                <div className="grid grid-cols-2 gap-3">
                    <Skeleton className="h-12 rounded-2xl bg-[#eceff3]" />
                    <Skeleton className="h-12 rounded-2xl bg-[#eceff3]" />
                </div>
                <Skeleton className="mt-4 h-20 rounded-2xl bg-[#eceff3]" />
            </section>

            <section className="rounded-[22px] bg-white p-4 shadow-[0_10px_30px_rgba(17,24,39,0.06)] ring-1 ring-black/5">
                <Skeleton className="mb-3 h-4 w-44 rounded-full bg-[#eceff3]" />
                <Skeleton className="h-12 w-full rounded-2xl bg-[#eceff3]" />
            </section>

            <section className="rounded-[22px] bg-white p-4 shadow-[0_10px_30px_rgba(17,24,39,0.06)] ring-1 ring-black/5">
                <Skeleton className="mb-3 h-4 w-36 rounded-full bg-[#eceff3]" />
                <Skeleton className="h-12 rounded-2xl bg-[#eceff3]" />
                <Skeleton className="mt-3 h-12 rounded-2xl bg-[#eceff3]" />
            </section>

            <div className="space-y-3 pt-2">
                <Skeleton className="h-14 w-full rounded-full bg-[#eceff3]" />
                <Skeleton className="h-14 w-full rounded-full bg-[#eceff3]" />
            </div>
        </div>
    );
}

export default ServiceEditSkeleton;