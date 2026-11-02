import z from "zod";

export const updateShopScheduleSchema = z.array(z.object({
    dayOfWeek: z.number().int().min(0).max(6),
    startTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format"),
    endTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format"),
    type: z.enum(["OPEN", "BLOCK"]),
})).length(7, "Schedule must have 7 days");

export type UpdateShopScheduleSchema = z.infer<typeof updateShopScheduleSchema>;