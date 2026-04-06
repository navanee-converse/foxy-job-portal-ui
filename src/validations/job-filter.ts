import { z } from "zod";

export const EmploymentType = {
  FULL_TIME: "full-time",
  PART_TIME: "part-time",
  CONTRACT: "contract",
  INTERNSHIP: "internship",
  FREELANCE: "freelance",
} as const;

export type EmploymentTypeValue =
  (typeof EmploymentType)[keyof typeof EmploymentType];

export const ExperienceLevel = {
  ENTRY: "Entry Level",
  JUNIOR: "Junior",
  MID: "Mid Level",
  SENIOR: "Senior",
  DIRECTOR: "Director",
  EXECUTIVE: "Executive",
} as const;

export type ExperienceLevelValue =
  (typeof ExperienceLevel)[keyof typeof ExperienceLevel];

export const Location = {
  REMOTE: "remote",
  ONSITE: "onsite",
  HYBRID: "hybrid",
} as const;

export type LocationValue = (typeof Location)[keyof typeof Location];

export const JobFilterSchema = z.object({
  title: z.string().optional(),

  employmentType: z.preprocess(
    (val) => (typeof val === "string" ? [val] : val),
    z.array(z.enum(EmploymentType)).optional(),
  ),

  experienceLevel: z.enum(ExperienceLevel).optional(),
  location: z.enum(Location).optional(),

  minSalary: z.coerce.number().min(0).optional(),
  maxSalary: z.coerce.number().min(0).optional(),

  tagIds: z.preprocess(
    (val) => (typeof val === "string" ? [val] : val),
    z.array(z.string().regex(/^[0-9a-fA-F]{24}$/)).optional(),
  ),
  city: z.string().optional(),

  categoryId: z.preprocess(
    (val) => {
      if (!val || val === "") return undefined;
      return typeof val === "string" ? [val] : val;
    },
    z.array(z.string().regex(/^[0-9a-fA-F]{24}$/)).optional(),
  ),
  sortBy: z
    .enum(["minSalary", "maxSalary", "publishedAt"])
    .default("publishedAt")
    .optional(),

  sortOrder: z.enum(["asc", "desc"]).default("desc").optional(),
  page: z.coerce.number().int().default(1).optional(),
  limit: z.coerce.number().int().max(100).default(10).optional(),
});

export type JobFilterValues = z.infer<typeof JobFilterSchema>;
