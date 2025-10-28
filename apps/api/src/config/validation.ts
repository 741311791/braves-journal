import { z } from 'zod';

export const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3001),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z.string().url({ message: 'DATABASE_URL must be a valid URL' }),
  DIRECT_URL: z.string().url({ message: 'DIRECT_URL must be a valid URL' }),
  SUPABASE_URL: z.string().url({ message: 'SUPABASE_URL must be a valid URL' }),
  SUPABASE_ANON_KEY: z.string().min(1, { message: 'SUPABASE_ANON_KEY is required' }),
  SUPABASE_SERVICE_ROLE_KEY: z
    .string()
    .min(1, { message: 'SUPABASE_SERVICE_ROLE_KEY is required' }),
  SUPABASE_JWT_SECRET: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  S3_ENDPOINT: z.string().url({ message: 'S3_ENDPOINT must be a valid URL' }),
  S3_BUCKET: z.string().min(1, { message: 'S3_BUCKET is required' }),
  S3_ACCESS_KEY_ID: z.string().min(1, { message: 'S3_ACCESS_KEY_ID is required' }),
  S3_SECRET_ACCESS_KEY: z
    .string()
    .min(1, { message: 'S3_SECRET_ACCESS_KEY is required' }),
  S3_REGION: z.string().min(1, { message: 'S3_REGION is required' }),
  REDIS_URL: z.string().url({ message: 'REDIS_URL must be a valid URL' }),
  CORS_ORIGIN: z.string().min(1, { message: 'CORS_ORIGIN is required' }),
  OTEL_ENABLED: z.enum(['true', 'false']).default('false'),
  OTEL_EXPORTER_OTLP_ENDPOINT: z
    .string()
    .url({ message: 'OTEL_EXPORTER_OTLP_ENDPOINT must be a valid URL' }),
  OTEL_SERVICE_NAME: z.string().min(1, { message: 'OTEL_SERVICE_NAME is required' }),
  SWAGGER_USER: z.string().min(1, { message: 'SWAGGER_USER is required' }),
  SWAGGER_PASSWORD: z.string().min(1, { message: 'SWAGGER_PASSWORD is required' }),
  RATE_LIMIT_MAX: z.coerce
    .number()
    .int({ message: 'RATE_LIMIT_MAX must be an integer' })
    .positive({ message: 'RATE_LIMIT_MAX must be positive' })
    .default(100),
  RATE_LIMIT_WINDOW: z
    .string()
    .min(1, { message: 'RATE_LIMIT_WINDOW is required' })
    .default('1 minute'),
});

export type EnvSchema = z.infer<typeof envSchema>;

export const validateEnv = (config: Record<string, unknown>): EnvSchema => {
  const parsed = envSchema.safeParse(config);

  if (!parsed.success) {
    const formattedErrors = parsed.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join(', ');

    throw new Error(`Invalid environment configuration: ${formattedErrors}`);
  }

  return parsed.data;
};
