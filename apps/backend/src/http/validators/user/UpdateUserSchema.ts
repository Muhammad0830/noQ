import z from "zod";

export const updateUserSchema = z.object({
    id: z.string().min(1, "User ID is required"),
    name: z.string().min(1, "User name is required"),
    phoneNumber: z.string().optional().nullable(),
});

export type UpdateUserSchema = z.infer<typeof updateUserSchema>;