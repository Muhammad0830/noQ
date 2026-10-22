import type { DateTime } from "@/domain/shared/value-objects/DateTime.js";
import type { ShopSchedule } from "@/domain/shop-schedule/entities/ShopSchedule.js";
import type { TimeSlot } from "@/domain/shared/value-objects/TimeSlot.js";
import type { SlotStatus } from "@noq/shared";

export interface GetAvailableSlotsUseCaseInput {
    shopId: string;
    serviceId: string;
    date: string;
    staffId?: string;
}

export interface VisibleSlots {
    id: string;
    time: string;
    duration: number;
    bufferTime: number;
    status: SlotStatus;
}

export interface GetSlotStatusInput {
    regularBlockSlots: TimeSlot[];
    emergencyBlockSlots: TimeSlot[];
    bookedSlots: TimeSlot[];
    startTime: string;
    endTime: string;
    selectedDate: DateTime;
}

export interface GetAvailableSlotsUseCaseInterface {
    execute(input: GetAvailableSlotsUseCaseInput): Promise<VisibleSlots[]>
}