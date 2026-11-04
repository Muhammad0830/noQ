import z from "zod";

export const getPeakHourListSchema = z.object({
    startTime: z.iso.datetime("Invalid startTime value"),
    endTime: z.iso.datetime("Invalid endTime value"),
});

export type GetPeakHourListSchema = z.infer<typeof getPeakHourListSchema>;