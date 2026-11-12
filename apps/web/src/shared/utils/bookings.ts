export const bookingStatusStyles = {
    CONFIRMED: {
        badge: "bg-orange-300 text-white",
        card: "border border-gray-300 bg-white",
        dot: "border-gray-300",
        time: "text-gray-500",
    },
    IN_PROGRESS: {
        badge: "bg-[#f59e0b] text-white",
        card: "border border-[#fbbf24] bg-transparent",
        dot: "border-[#f59e0b]",
        time: "text-[#f59e0b]",
    },
    PENDING: {
        badge: "border border-orange-300 bg-orange-50 text-[#f49b33]",
        card: "border border-gray-300 bg-white",
        dot: "border-gray-300",
        time: "text-gray-500",
    },
    CANCELLED: {
        badge: "bg-red-500 text-white",
        card: "border border-red-300 bg-red-50/30",
        dot: "border-red-300",
        time: "text-red-500",
    },
    COMPLETED: {
        badge: "bg-[#059669] text-white",
        card: "border border-[#34d399] bg-transparent",
        dot: "border-[#10b981]",
        time: "text-[#059669]",
    },
    NO_SHOW: {
        badge: "bg-gray-400 text-white",
        card: "border border-gray-300 bg-gray-50",
        dot: "border-gray-300",
        time: "text-gray-500",
    },
};