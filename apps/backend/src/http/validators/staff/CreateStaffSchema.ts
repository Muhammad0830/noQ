import z from "zod";

export const createStaffSchema = z.object({
    userId: z.string().min(1, "User ID is required"),
    shopId: z.string().min(1, "Shop ID is required"),
    position: z.enum(["STAFF", "MANAGER"]),
});

export type CreateStaffSchema = z.infer<typeof createStaffSchema>;