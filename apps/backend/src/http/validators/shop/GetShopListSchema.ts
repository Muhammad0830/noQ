import z from "zod";

export const getShopListSchema = z.object({
    categories: z
        .string()
        .transform(val => val.split(","))
        .pipe(z
            .array(z
                .string()
                .min(1, "Category ID cannot be empty")
            ),
        ).optional(),
    search: z.string().optional(),
    minPrice: z.coerce.number().optional(),
    maxPrice: z.coerce.number().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
})

export type GetShopListSchema = z.infer<typeof getShopListSchema>;