import z from "zod";

export const updateServiceSchema = z.object({
    id: z.string().min(1, "Service ID is required"),
    name: z.string().min(1, "Service name is required"),
    price: z.number().min(1, "Service ID is required"),
    durationMin: z.number().min(1, "Service ID is required"),
    description: z.string().optional(),
    bufferTime: z.number().optional(),
})

export type UpdateServiceSchema = z.infer<typeof updateServiceSchema>;