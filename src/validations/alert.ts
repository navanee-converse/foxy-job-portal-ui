import { z } from "zod";

export const alertSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  frequency: z.enum(["daily", "weekly"]),
  tagIds: z
    .array(z.object({ id: z.string(), name: z.string() }))
    .min(1, "Select at least one category"),
  location: z.string().min(1, "Location is required"),
  minSalary: z
    .number()
    .nonnegative("Salary must be a positive value")
    .min(1, "Salary must be greater than 1")
    .optional()
    .or(z.literal("").transform(() => undefined)),
  experienceLevel: z.string().optional(),
  employmentType: z.string().optional(),
  isEnabled: z.boolean().optional(),
});

export type AlertFormValues = z.infer<typeof alertSchema>;
