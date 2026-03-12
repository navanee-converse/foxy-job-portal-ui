import * as z from "zod";

export const urlRegex =
  /^https:\/\/([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

export const companySchema = z.object({
  name: z.string().min(2, "Name is required"),
  website: z
    .string()
    .regex(urlRegex, "Please enter a valid web address")
    .or(z.literal("")),
  location: z.object({
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    country: z.string().min(1, "Country is required"),
    address: z.string().optional(),
    zipCode: z.string().optional(),
  }),
  industry: z.string().optional(),
  size: z.string().optional(),
  aboutCompany: z.string().optional(),
  socials: z
    .object({
      linkedin: z
        .string()
        .regex(urlRegex, "Invalid LinkedIn URL")
        .optional()
        .or(z.literal("").transform(() => undefined)),
      twitter: z
        .string()
        .regex(urlRegex, "Invalid Twitter URL")
        .optional()
        .or(z.literal("").transform(() => undefined)),
      facebook: z
        .string()
        .regex(urlRegex, "Invalid Facebook URL")
        .optional()
        .or(z.literal("").transform(() => undefined)),
    })
    .optional(),
});

export type CompanyDto = z.infer<typeof companySchema>;
