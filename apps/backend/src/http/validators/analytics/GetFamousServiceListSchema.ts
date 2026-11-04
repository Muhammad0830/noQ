import z from "zod";

export const getFamousServiceListSchema = z.object({
    startTime: z.iso.datetime("Invalid startTime value"),
    endTime: z.iso.datetime("Invalid endTime value"),
})

export type GetFamousServiceListSchema = z.infer<typeof getFamousServiceListSchema>;