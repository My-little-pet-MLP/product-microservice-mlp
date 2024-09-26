import dotenv from "dotenv";
import { z } from "zod";

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

// Define o esquema de validação usando zod
const envSchema = z.object({
    DATABASE_URL: z.string().min(1,"DATABASE_URL is required!"),
    CLERK_SECRET_KEY: z.string().min(1,"CLERK_SECRET_KEY is required!"),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development") ,
    PORT: z.coerce.number().min(1,"PORT is required"),
    STRIPE_KEY: z.string().min(1,"STRIPE_KEY is required")
});

// Valida as variáveis de ambiente
const env = envSchema.safeParse(process.env);

if (!env.success) {
    console.error("Error validating environment variables!", env.error.format());
    process.exit(1); 
}

export const config = env.data;
