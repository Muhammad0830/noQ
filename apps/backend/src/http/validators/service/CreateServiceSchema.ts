import z from "zod";

export const createServiceSchema = z.object({
    shopId: z.string().min(1, "Shop ID is required"),
    name: z.string().min(1, "Service name is required"),
    description: z.string().optional(),
    price: z.number().min(1, "Service price is required"),
    durationMin: z.number().min(1, "Service duration is required"),
    bufferTime: z.number().optional(),
});

export type CreateServiceSchema = z.infer<typeof createServiceSchema>;