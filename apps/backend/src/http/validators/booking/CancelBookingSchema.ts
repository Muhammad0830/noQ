import z from "zod";

export const cancelBookingSchema = z.object({
    reason: z.string().min(1, "Cancellation reason is required"),
});

export type CancelBookingSchema = z.infer<typeof cancelBookingSchema>;