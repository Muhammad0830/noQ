import z from "zod";

export const createShopBlockSchema = z.array(z.object({
    startTime: z.iso.datetime("Invalid start time value"),
    endTime: z.iso.datetime("Invalid end time value"),
    reason: z.string().optional(),
}));

export type CreateShopBlockSchema = z.infer<typeof createShopBlockSchema>;