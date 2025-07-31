import { z } from "zod";

export const envSchema = z.object({
    PORT: z.string().default("3000"),
    MONGO_URI: z.string().min(10, "MongoDB URI is required"),
    JWT_SECRET: z.string().min(32, "JWT secret must be at least 32 characters"),
    NODE_ENV: z.enum(["development", "production", "test"]),
    SMTP_HOST: z.string().min(1, "SMTP host is required"),
    SMTP_PORT: z.string().transform(Number),
    SMTP_USER: z.string().email("SMTP user must be a valid email"),
    SMTP_PASS: z.string().min(1, "SMTP password is required"),
    SUPER_EMAIL: z.string().email("SUPER_EMAIL must be a valid email"),
    SUPER_PASSWORD: z.string().min(1, "SUPER_PASSWORD is required"),
});

export type EnvSchema = z.infer<typeof envSchema>;
