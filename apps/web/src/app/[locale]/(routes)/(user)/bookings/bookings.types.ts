export type BookingFilter = "ongoing" | "completed" | "cancelled";

export type ActiveBookingStatus = "PENDING" | "CONFIRMED" | "IN_PROGRESS";
export type HistoryBookingStatus = "COMPLETED" | "CANCELLED" | "NO_SHOW";

export interface ActiveBookingItem {
    id: string;
    status: ActiveBookingStatus;
    startTime: string;
    endTime: string;
    shop: {
        id: string;
        name: string;
        address: string;
        backgroundImageUrl: string | null;
    };
    service: {
        id: string;
        name: string;
        price: string;
        durationMin: number;
    };
}

export interface ActiveBookingsResponse {
    pending: ActiveBookingItem[];
    confirmed: ActiveBookingItem[];
    inProgress: ActiveBookingItem[];
}

export interface HistoryBookingItem {
    id: string;
    status: HistoryBookingStatus;
    startTime: string;
    endTime: string;
    cancelReason?: string | null;
    reason?: string | null;
    shop: {
        id: string;
        name: string;
        address: string;
        backgroundImageUrl: string | null;
    };
    service: {
        id: string;
        name: string;
        price: string;
        durationMin: number;
    };
}

export interface HistoryBookingsResponse {
    cancelled: HistoryBookingItem[];
    completed: HistoryBookingItem[];
    noShow?: HistoryBookingItem[];
    nowShow?: HistoryBookingItem[];
}

export interface OngoingBookingCardData {
    id: string;
    shopName: string;
    service: string;
    duration: string;
    price: number;
    status: "ongoing";
    address: string;
    city: string;
    subtitle: ActiveBookingStatus;
    remainingDays: number | null;
    remainingHours: number;
    remainingMinutes: number;
    startLabel: string;
    image: string | null;
}

export interface HistoryCardData {
    id: string;
    shopName: string;
    service: string;
    date: string;
    time: string;
    duration: string;
    price: number;
    status: "completed" | "cancelled";
    address: string;
    cancelReason?: string;
    image: string | null;
}
