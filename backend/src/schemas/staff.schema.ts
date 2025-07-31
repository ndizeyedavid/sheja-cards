import { z } from "zod";

export const staffSchema = z.object({
  schoolId: z.string(),
  name: z.string(),
  email: z.email(),
  phone: z.string().max(10, "Enter valid phone number"),
  idNumber: z.number().max(16),
  role: z.enum(["HEADMASTER", "BURSAR", "PATRON", "DOS"]),
});
