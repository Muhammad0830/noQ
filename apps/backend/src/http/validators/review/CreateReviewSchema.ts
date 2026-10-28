import z from "zod";

export const createReviewSchema = z.object({
    shopId: z.string().optional(),
    serviceId: z.string().optional(),
    rating: z.number()
        .min(0, "Invalid rating value, rating cannot be negative")
        .max(5, "Invalid rating value, rating cannot be higher than 5"),
    comment: z.string().optional(),
});

export type CreateReviewSchema = z.infer<typeof createReviewSchema>;