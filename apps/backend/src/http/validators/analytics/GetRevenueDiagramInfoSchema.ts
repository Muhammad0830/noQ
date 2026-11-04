import z from "zod";

export const getRevenueDiagramInfoSchema = z.object({
    startTime: z.iso.datetime("Invalid startTime value"),
    endTime: z.iso.datetime("Invalid endTime value"),
    interval: z.enum(["day", "month", "year"]),
})

export type GetRevenueDiagramInfoSchema = z.infer<typeof getRevenueDiagramInfoSchema>;