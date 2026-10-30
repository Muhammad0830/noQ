import z from "zod";

export const addServiceToFavouriteSchema = z.object({
    serviceId: z.string().min(1, "Service ID is required"),
    userId: z.string().min(1, "User ID is required"),
})

export type AddServiceToFavouriteSchema = z.infer<typeof addServiceToFavouriteSchema>;