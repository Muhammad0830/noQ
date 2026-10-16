import { BookingStatus } from "@noq/shared"
import type { Booking } from "@noq/shared"

export { BookingStatus, Booking };

export enum BookingTabs {
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
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

export interface Staff {
    id: string;
    name: string;
    avatarUrl?: string | null;
}

export interface TimeSlot {
    id: string;
    time: string;
    type: 'available' | 'break' | 'booked';
}

export interface ScheduleSlot extends TimeSlot {
    startMin: number;
}

export interface TimelineRange {
    start: string;
    end: string;
}

export interface DayTimelineResponse {
    open: string | null;
    close: string | null;
    disabled: TimelineRange[];
    busy: TimelineRange[];
}

export interface SelectedDateType {
    date: string;
    time: string | null;
}