import z from "zod";

export const signInSchema = z.object({
    email: z.email().min(1, "User email is required"),
    password: z.string().min(1, "User password is required"),
});

export type SignInSchema = z.infer<typeof signInSchema>;