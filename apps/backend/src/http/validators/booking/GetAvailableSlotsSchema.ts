import z from "zod";

export const getAvailableSlotsSchema = z.object({
    shopId: z.string().min(1, "Shop ID is required"),
    serviceId: z.string().min(1, "Service Id is required"),
    date: z.iso.date({
        message: "Invalid Date value",
    }),
    staffId: z.string().optional(),
})

export type GetAvailableSlostsRequestQuery = z.infer<typeof getAvailableSlotsSchema>;