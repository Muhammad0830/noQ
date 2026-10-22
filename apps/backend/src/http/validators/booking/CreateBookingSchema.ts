import { z } from "zod";

export const createBookingSchema = z.object({
    serviceId: z.string().min(1, "Service ID is required"),
    staffId: z.string().min(1, "Staff ID is required"),
    shopId: z.string().min(1, "Shop ID is required"),
    date: z.iso.date({
        error: "Date must be a valid ISO date",
    }),
    startTime: z.string().regex(
        /^([01]\d|2[0-3]):[0-5]\d$/,
        "Start time must be in HH:mm format",
    ),
});

export type CreateBookingRequestBody = z.infer<typeof createBookingSchema>;