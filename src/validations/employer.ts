import z from "zod";

export const updateEmployerProfileSchema = z.object({
  jobtitle: z.string().min(2, { message: "Job title is required" }),
  department: z.string().optional(),
});

export type UpdateEmployerProfileDto = z.infer<
  typeof updateEmployerProfileSchema
>;
