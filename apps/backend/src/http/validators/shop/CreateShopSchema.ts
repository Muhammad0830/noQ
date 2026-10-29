import z, { minLength } from "zod";

export const createShopSchema = z.object({
    shop: z.object({
        userId: z.string().min(1, "User ID is required"),
        categoryId: z.string().min(1, "Category ID is required"),
        name: z.string().min(1, "Shop name is required"),
        address: z.string().min(1, "Shop address is required"),
        phoneNumber: z.string().min(1, "Shop phone number is required"),
        description: z.string().optional(),
        logoUrl: z.string().optional(),
        file: z.file().optional(),
    }),
    schedule: z.array(z.object({
        dayOfWeek: z.int().min(0, "Invalid dayOfWeek value").max(6, "Invalid dayOfWeek value"),
        slots: z.array(z.object({
            block: z.boolean(),
            startTime: z.string().regex(
                /^([01]\d|2[0-3]):[0-5]\d$/,
                "Start time must be in HH:mm format",
            ),
            endTime: z.string().regex(
                /^([01]\d|2[0-3]):[0-5]\d$/,
                "End time must be in HH:mm format",
            ),
        }))
    })).length(7, "You must provide exactly 7 days"),
    services: z.array(z.object({
        name: z.string().min(1, "Service name is required"),
        price: z.number().min(1, "Service price is required"),
        durationMin: z.number().min(1, "Service duration is required"),
        bufferTime: z.number().min(0, "BufferTime cannot be negatice").optional(),
        selectedStaffs: z.array(z.string()).min(1),
        description: z.string().optional(),
    }))
});

export type CreateShopSchema = z.infer<typeof createShopSchema>;