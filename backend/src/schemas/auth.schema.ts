import { z } from "zod";

export const registerSchema = z.object({
    name: z.string().min(10),
    email: z.email(),
    password: z.string().min(6),
    role: z.enum(["HEADMASTER", "BURSAR", "PATRON", "DOS"]),
    schoolId: z.string().min(1),
});

export const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(6),
});
