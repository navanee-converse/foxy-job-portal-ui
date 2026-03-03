import z from "zod";

export const updateEmployerProfileSchema = z.object({
  jobtitle: z.string().optional(),
  department: z.string().optional(),
});

export type UpdateEmployerProfileDto = z.infer<
  typeof updateEmployerProfileSchema
>;
