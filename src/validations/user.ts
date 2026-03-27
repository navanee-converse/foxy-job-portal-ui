import { z } from "zod";

export const updateUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format")
    .min(10, "Phone number must be at least 10 digits"),
});

export type UserDto = z.infer<typeof updateUserSchema>;
