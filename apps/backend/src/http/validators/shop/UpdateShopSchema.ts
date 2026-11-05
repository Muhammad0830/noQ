import z from "zod";

export const updateShopSchema = z.object({
    id: z.string().min(1, "Shop ID is required"),
    name: z.string().min(1, "Shop name is required"),
    address: z.string().min(1, "Shop address is required"),
    phoneNumber: z.string().min(1, "Shop phoneNumber is required"),
    description: z.string().optional(),
    logoURL: z.string().optional(),
    file: z.file().optional(),
});

export type UpdateShopSchema = z.infer<typeof updateShopSchema>;