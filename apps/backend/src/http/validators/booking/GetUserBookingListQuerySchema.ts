import z from "zod";

export const getUserBookingListQuerySchema = z.object({
    view: z.enum(["ongoing", "completed", "cancelled"])
        .default("ongoing"),

    limit: z.coerce.number()
        .int()
        .min(1)
        .max(100)
        .default(20),

    cursor: z.string()
        .min(1)
        .optional(),
})