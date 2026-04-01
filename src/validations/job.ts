import * as z from "zod";

export const jobSchema = z
  .object({
    title: z.string().min(5, "Job title must be at least 5 characters"),
    employmentType: z.enum([
      "full-time",
      "part-time",
      "contract",
      "freelance",
      "internship",
    ]),
    experienceLevel: z.enum([
      "Entry Level",
      "Junior",
      "Mid Level",
      "Senior",
      "Executive",
      "Director",
    ]),
    location: z.enum(["remote", "onsite", "hybrid"]),
    tagIds: z
      .array(
        z.object({
          _id: z.string(),
          name: z.string(),
        }),
      )
      .min(1, "Please select at least one tag"),

    status: z.enum(["draft", "published", "closed"]),
    categoryId: z.string().min(1, "Please select a job category"),
    description: z.string().min(20, "Please provide a detailed description"),

    numberOfPositions: z.preprocess(
      (val) => {
        if (val === "" || val == null) return undefined;

        const num = Number(val);
        return isNaN(num) ? NaN : num;
      },
      z
        .number({ error: "Please provide numeric values" })
        .int("Must be a whole number")
        .gt(0, "Number of positions must be greater than 0")
        .default(1),
    ),

    responsibilities: z
      .array(z.string().trim().min(1, "Responsibility cannot be empty"))
      .min(1, "At least one responsibility is required"),

    skillsAndQualifications: z
      .array(z.string().trim().min(1, "Skill cannot be empty"))
      .min(1, "At least one skill is required"),
    minSalary: z.coerce
      .number()
      .min(0, { message: "Minimum salary must be zero or a positive number" })
      .optional(),
    maxSalary: z.coerce
      .number()
      .min(0, { message: "Minimum salary must be zero or a positive number" })
      .optional(),
    lastDate: z.coerce
      .date()
      .min(new Date(), { message: "Last date must be in the future" })
      .optional(),
  })
  .refine(
    (data) => {
      if (data.minSalary && data.maxSalary) {
        return data.maxSalary >= data.minSalary;
      }
      return true;
    },
    {
      message: "Max salary cannot be less than min salary",
      path: ["maxSalary"],
    },
  );

export type JobFormValues = z.infer<typeof jobSchema>;
