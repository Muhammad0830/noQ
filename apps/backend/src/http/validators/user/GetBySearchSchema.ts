import z from "zod";

export const getBySearchSchema = z.object({
    search: z.string().min(1, "Search query is required"),
})

export type GetBySearchSchema = z.infer<typeof getBySearchSchema>;