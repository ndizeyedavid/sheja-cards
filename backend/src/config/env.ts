import dotenv from "dotenv";
import { envSchema } from "../schemas/env.schema";

dotenv.config();

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
    console.error("❌ Invalid environment variables:", _env.error.format());
    process.exit(1);
}

export const env = {
    PORT: Number(_env.data.PORT),
    MONGO_URI: _env.data.MONGO_URI,
    JWT_SECRET: _env.data.JWT_SECRET,
    NODE_ENV: _env.data.NODE_ENV,
    SUPER_EMAIL: _env.data.SUPER_EMAIL,
    SUPER_PASSWORD: _env.data.SUPER_PASSWORD,
};
