import z from "zod";

export const getRevenueBaseInfoSchema = z.object({
    startTime: z.iso.datetime("Invalid startTime value"),
    endTime: z.iso.datetime("Invalid endTime value"),
});

export type GetRevenueBaseInfoSchema = z.infer<typeof getRevenueBaseInfoSchema>;