import z from "zod";

export const checkEmailExistsSchema = z.object({
    email: z.email("Invalid email value").min(1, "Email is required"),
});

export type CheckEmailExistsSchema = z.infer<typeof checkEmailExistsSchema>;