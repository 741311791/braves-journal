import { z } from 'zod';

const environmentSchema = z.enum(['development', 'test', 'production']);
const logLevelSchema = z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']);

export const appConfigSchema = z.object({
  nodeEnv: environmentSchema.default('development'),
  name: z.string().default('Braves Journal API'),
  version: z.string().default('1.0.0'),
  port: z.number().int().positive().default(3001),
  logLevel: logLevelSchema.default('info'),
  docsBasicAuthUser: z.string().min(1),
  docsBasicAuthPassword: z.string().min(1),
});

export const authConfigSchema = z.object({
  supabaseUrl: z.string().url(),
  supabaseAnonKey: z.string().min(1),
  supabaseServiceRoleKey: z.string().min(1),
  jwtSecret: z.string().min(32, 'Supabase JWT secret must be at least 32 characters'),
});

export const databaseConfigSchema = z.object({
  url: z.string().url(),
  directUrl: z.string().url().optional(),
});

export const storageConfigSchema = z.object({
  endpoint: z.string().url(),
  bucket: z.string().min(1),
  accessKeyId: z.string().min(1),
  secretAccessKey: z.string().min(1),
  region: z.string().min(1),
});

export const aiConfigSchema = z.object({
  openaiApiKey: z.string().min(1),
});

export const otelConfigSchema = z.object({
  serviceName: z.string().min(1).default('braves-journal-api'),
  enabled: z.boolean().default(false),
  endpoint: z.string().url().optional(),
});

export const rateLimitConfigSchema = z.object({
  points: z.number().int().positive().default(100),
  duration: z.number().int().positive().default(60),
});

export const redisConfigSchema = z.object({
  url: z.string().url(),
});

export const configSchema = z.object({
  app: appConfigSchema,
  auth: authConfigSchema,
  db: databaseConfigSchema,
  storage: storageConfigSchema,
  ai: aiConfigSchema,
  otel: otelConfigSchema,
  rateLimit: rateLimitConfigSchema,
  redis: redisConfigSchema,
});

export type ValidatedConfig = z.infer<typeof configSchema>;

export function validateConfig(config: Record<string, unknown>): ValidatedConfig {
  return configSchema.parse(config);
}
