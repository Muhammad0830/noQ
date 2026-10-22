import type z from "zod";
import type { getUserBookingListQuerySchema } from "../validators/booking/GetUserBookingListQuerySchema.js";

export type GetUserBookingListQuery = z.infer<typeof getUserBookingListQuerySchema>;

export interface GetUserBookingsQuery {
    userId: string;
    view: "ongoing" | "completed" | "cancelled";
    limit: number;
    cursor?: string;
};

export interface CancelBookingRequestBody {
    id: string;
    userId: string;
    reason?: string;
}