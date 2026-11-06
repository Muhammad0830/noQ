import z from "zod";

export const signUpSchema = z.object({
    name: z.string().min(1, "User name is required"),
    email: z.email().min(1, "User email is required"),
    password: z.string().min(1, "User password is required"),
    phoneNumber: z.string().optional(),
});

export type SignUpSchema = z.infer<typeof signUpSchema>;