export enum BookingTabs {
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
}

export enum BookingStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    COMPLETED = 'COMPLETED',
    IN_PROGRESS = 'IN_PROGRESS',
    CANCELLED = 'CANCELLED',
    NO_SHOW = 'NO_SHOW',
}

export type ActiveBookingStatus = Extract<BookingStatus, "PENDING" | "CONFIRMED" | "IN_PROGRESS">;
export type HistoryBookingStatus = Extract<BookingStatus, "COMPLETED" | "CANCELLED" | "NO_SHOW">;

export interface BookingItem {
    id: string;
    status: BookingStatus;
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
    pending: BookingItem[];
    confirmed: BookingItem[];
    inProgress: BookingItem[];
}

export interface HistoryBookingsResponse {
    cancelled: BookingItem[];
    completed: BookingItem[];
    noShow: BookingItem[];
}

export interface InProgressBookingCardData {
    id: string;
    shopName: string;
    serviceName: string;
    duration: string;
    price: number;
    status: BookingStatus;
    address: string;
    city: string;
    remainingDays: number | null;
    remainingHours: number;
    remainingMinutes: number;
    startLabel: string;
    image: string | null;
}

export interface HistoryCardData {
    id: string;
    shopName: string;
    serviceName: string;
    date: string;
    time: string;
    duration: string;
    price: number;
    status: BookingStatus;
    address: string;
    image: string | null;
}

export interface BookingTabsComponentProps {
    tabsKey: BookingTabs;
    onChange: (next: BookingTabs) => void;
}