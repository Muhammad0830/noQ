import z from "zod";

export const addShopToFavouriteSchema = z.object({
    shopId: z.string().min(1, "Shop ID is required"),
    userId: z.string().min(1, "User ID is required"),
})

export type AddShopToFavouriteSchema = z.infer<typeof addShopToFavouriteSchema>;