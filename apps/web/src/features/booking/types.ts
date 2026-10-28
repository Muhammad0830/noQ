import { BookingStatus } from "@noq/shared"
import type { Booking, BookingItem, SlotStatus } from "@noq/shared"

export { BookingStatus, Booking, BookingItem };

export enum BookingTabs {
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
}

export type ActiveBookingStatus = Extract<BookingStatus, "PENDING" | "CONFIRMED" | "IN_PROGRESS">;
export type HistoryBookingStatus = Extract<BookingStatus, "COMPLETED" | "CANCELLED" | "NO_SHOW">;

export interface InProgressBookingCardData {
    id: string;
    shopName: string;
    serviceName: string;
    durationMin: string;
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
    durationMin: string;
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

export interface TimelineRange {
    start: string;
    end: string;
}

export interface SelectedDateType {
    date: string;
    time: string | null;
}