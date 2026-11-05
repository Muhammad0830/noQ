import z from "zod";

export const getShopHistoryBookingListSchema = z.object({
    startTime: z.iso.datetime("Invalid startTime value"),
    endTime: z.iso.datetime("Invalid endTime value"),
    searchQuery: z.string().optional(),
});

export type GetShopHistoryBookingListSchema = z.infer<typeof getShopHistoryBookingListSchema>;