import { z } from "zod";

export const updateServiceSchema = (staffs: { id: string }[]) => z.object({
    id: z.string().min(1, "Service ID is required"),
    shopId: z.string().min(1, "Service ID is required"),
    name: z
        .string("Invalid value")
        .trim()
        .min(2, "Service name must contain at least 2 characters")
        .max(100, "Service name cannot exceed 100 characters"),

    durationMin: z
        .string("Invalid value")
        .regex(
            /^\d{2,}:[0-5]\d$/,
            "Duration must use HH:mm format, e.g. 01:30",
        )
        .refine((value) => {
            const [hours, minutes] = value.split(":").map(Number);

            return hours > 0 || minutes > 0;
        }, "Duration must be greater than 00:00"), // 00:00 is not possible to fill

    bufferTime: z
        .number("Invalid value")
        .int("Invalid value")
        .min(0, "Buffer time cannot be negative")
        .optional(),

    price: z
        .number("Invalid value")
        .int("Invalid value")
        .min(1, "Price is required"),

    assignedToAllStaffs: z.boolean("Invalid value"),

    selectedStaffs: z
        .array(z.string())
        .refine(
            (ids) => ids.every(id => staffs.some(staff => staff.id === id)),
            { message: "Please select a valid staff member" },
        ),
});

export const updateServiceFormSchema = (staffs: { id: string }[]) =>
    updateServiceSchema(staffs).omit({ id: true, shopId: true });

export type UpdateServiceInput = z.input<
    ReturnType<typeof updateServiceSchema>
>;

export type UpdateServiceData = z.output<
    ReturnType<typeof updateServiceSchema>
>;

export type UpdateServiceFormInput = z.input<
    ReturnType<typeof updateServiceFormSchema>
>;

export type UpdateServiceFormData = z.output<
    ReturnType<typeof updateServiceFormSchema>
>;