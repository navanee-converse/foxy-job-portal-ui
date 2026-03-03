import { z } from "zod";

const educationSchema = z.object({
  level: z
    .enum(["sslc", "hsc", "diploma", "bachelor", "master", "phd"])
    .describe("Invalid education level"),
  degree: z.string().optional(),
  fieldOfStudy: z.string().nullable().optional(),
  institution: z.string().optional(),
  startYear: z.coerce.number().int().min(1900).max(2100).optional(),
  endYear: z.coerce.number().int().min(1900).max(2100).optional(),
  percentage: z.coerce.number().min(0).max(100).optional(),
});

const experienceSchema = z.object({
  company: z.string().optional(),
  title: z.string().optional(),
  startYear: z.coerce.number().int().min(1900).max(2100).optional(),
  endYear: z.coerce.number().int().min(1900).max(2100).optional(),
});

export const updateJobSeekerProfileSchema = z.object({
  education: z.array(educationSchema).optional(),
  experience: z.array(experienceSchema).optional(),
  tagIds: z.array(z.object({ _id: z.string(), name: z.string() })).optional(),
});

export type UpdateJobSeekerProfileDto = z.infer<
  typeof updateJobSeekerProfileSchema
>;
