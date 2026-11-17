import z from "zod";

export const getDashboardBookingListSchema = z.object({
    date: z.iso.datetime("Invalid date value"),
});

export type GetDashboardBookingListSchema = z.infer<typeof getDashboardBookingListSchema>;