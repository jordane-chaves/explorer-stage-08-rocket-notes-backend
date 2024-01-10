import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'production', 'test']).default('production'),
  JWT_SECRET: z.string(),
  DATABASE_URL: z.string(),
  DATABASE_CLIENT: z.enum(['sqlite3', 'pg']),
  PORT: z.coerce.number().optional().default(3333),
});

const envParsed = envSchema.safeParse(process.env);

if (envParsed.success === false) {
  console.log("⚠️ Invalid environment variables.", envParsed.error.format());
  throw new Error("⚠️ Invalid environment variables.");
}

export const env = envParsed.data;
