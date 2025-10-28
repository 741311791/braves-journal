import { ConfigService } from '@nestjs/config';

export type AppEnvironment = 'development' | 'test' | 'production';

export interface AppConfig {
  nodeEnv: AppEnvironment;
  name: string;
  version: string;
  port: number;
  logLevel: 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace';
  docsBasicAuthUser: string;
  docsBasicAuthPassword: string;
}

export interface AuthConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  supabaseServiceRoleKey: string;
  jwtSecret: string;
}

export interface DatabaseConfig {
  url: string;
  directUrl?: string;
}

export interface StorageConfig {
  endpoint: string;
  bucket: string;
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
}

export interface AiConfig {
  openaiApiKey: string;
}

export interface OtelConfig {
  serviceName: string;
  enabled: boolean;
  endpoint?: string;
}

export interface RateLimitConfig {
  points: number;
  duration: number;
}

export interface RedisConfig {
  url: string;
}

export interface ApiConfig {
  app: AppConfig;
  auth: AuthConfig;
  db: DatabaseConfig;
  storage: StorageConfig;
  ai: AiConfig;
  otel: OtelConfig;
  rateLimit: RateLimitConfig;
  redis: RedisConfig;
}

export default (): ApiConfig => {
  const {
    NODE_ENV,
    PORT,
    LOG_LEVEL,
    DOCS_BASIC_AUTH_USER,
    DOCS_BASIC_AUTH_PASSWORD,
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY,
    SUPABASE_JWT_SECRET,
    DATABASE_URL,
    DIRECT_URL,
    S3_ENDPOINT,
    S3_BUCKET,
    S3_ACCESS_KEY_ID,
    S3_SECRET_ACCESS_KEY,
    S3_REGION,
    OPENAI_API_KEY,
    OTEL_SERVICE_NAME,
    OTEL_ENABLED,
    OTEL_EXPORTER_OTLP_ENDPOINT,
    REDIS_URL,
    RATE_LIMIT_POINTS,
    RATE_LIMIT_DURATION,
  } = process.env;

  return {
    app: {
      nodeEnv: (NODE_ENV as AppEnvironment) ?? 'development',
      name: 'Braves Journal API',
      version: '1.0.0',
      port: PORT ? Number(PORT) : 3001,
      logLevel: (LOG_LEVEL as AppConfig['logLevel']) ?? 'info',
      docsBasicAuthUser: DOCS_BASIC_AUTH_USER ?? 'admin',
      docsBasicAuthPassword: DOCS_BASIC_AUTH_PASSWORD ?? 'change-me',
    },
    auth: {
      supabaseUrl: SUPABASE_URL ?? '',
      supabaseAnonKey: SUPABASE_ANON_KEY ?? '',
      supabaseServiceRoleKey: SUPABASE_SERVICE_ROLE_KEY ?? '',
      jwtSecret: SUPABASE_JWT_SECRET ?? '',
    },
    db: {
      url: DATABASE_URL ?? '',
      directUrl: DIRECT_URL,
    },
    storage: {
      endpoint: S3_ENDPOINT ?? '',
      bucket: S3_BUCKET ?? '',
      accessKeyId: S3_ACCESS_KEY_ID ?? '',
      secretAccessKey: S3_SECRET_ACCESS_KEY ?? '',
      region: S3_REGION ?? 'us-east-1',
    },
    ai: {
      openaiApiKey: OPENAI_API_KEY ?? '',
    },
    otel: {
      serviceName: OTEL_SERVICE_NAME ?? 'braves-journal-api',
      enabled: OTEL_ENABLED === 'true',
      endpoint: OTEL_EXPORTER_OTLP_ENDPOINT,
    },
    rateLimit: {
      points: RATE_LIMIT_POINTS ? Number(RATE_LIMIT_POINTS) : 100,
      duration: RATE_LIMIT_DURATION ? Number(RATE_LIMIT_DURATION) : 60,
    },
    redis: {
      url: REDIS_URL ?? 'redis://localhost:6379',
    },
  };
};

export const createConfigService = (configService: ConfigService): ApiConfig => ({
  app: configService.getOrThrow<AppConfig>('app'),
  auth: configService.getOrThrow<AuthConfig>('auth'),
  db: configService.getOrThrow<DatabaseConfig>('db'),
  storage: configService.getOrThrow<StorageConfig>('storage'),
  ai: configService.getOrThrow<AiConfig>('ai'),
  otel: configService.getOrThrow<OtelConfig>('otel'),
  rateLimit: configService.getOrThrow<RateLimitConfig>('rateLimit'),
  redis: configService.getOrThrow<RedisConfig>('redis'),
});
