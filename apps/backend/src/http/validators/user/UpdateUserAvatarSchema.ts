import z from "zod";

export const updateUserAvatarSchema = z.object({
    id: z.string().min(1, "User ID is required"),
});

export type UpdateUserAvatarSchema = z.infer<typeof updateUserAvatarSchema>;