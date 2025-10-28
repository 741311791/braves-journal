import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration, { type ApiConfig } from '../src/config/configuration';
import { validateConfig } from '../src/config/validation';

describe('Configuration', () => {
  let moduleRef: TestingModule;
  let configService: ConfigService;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    process.env.PORT = '4000';
    process.env.SUPABASE_URL = 'http://test.supabase.co';
    process.env.SUPABASE_ANON_KEY = 'test-anon-key';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key';
    process.env.SUPABASE_JWT_SECRET = 'test-secret-with-at-least-32-characters-long';
    process.env.DATABASE_URL = 'https://database.example.com';
    process.env.S3_ENDPOINT = 'https://storage.example.com';
    process.env.S3_BUCKET = 'test-bucket';
    process.env.S3_ACCESS_KEY_ID = 'test-key';
    process.env.S3_SECRET_ACCESS_KEY = 'test-secret';
    process.env.S3_REGION = 'us-east-1';
    process.env.OPENAI_API_KEY = 'sk-test-key';
    process.env.REDIS_URL = 'redis://localhost:6379';
    process.env.DOCS_BASIC_AUTH_USER = 'docs';
    process.env.DOCS_BASIC_AUTH_PASSWORD = 'password';

    moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          cache: true,
          load: [configuration],
          validate: validateConfig,
        }),
      ],
    }).compile();

    configService = moduleRef.get<ConfigService>(ConfigService);
  });

  afterAll(async () => {
    delete process.env.NODE_ENV;
    delete process.env.PORT;
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_ANON_KEY;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    delete process.env.SUPABASE_JWT_SECRET;
    delete process.env.DATABASE_URL;
    delete process.env.S3_ENDPOINT;
    delete process.env.S3_BUCKET;
    delete process.env.S3_ACCESS_KEY_ID;
    delete process.env.S3_SECRET_ACCESS_KEY;
    delete process.env.S3_REGION;
    delete process.env.OPENAI_API_KEY;
    delete process.env.REDIS_URL;
    delete process.env.DOCS_BASIC_AUTH_USER;
    delete process.env.DOCS_BASIC_AUTH_PASSWORD;

    await moduleRef.close();
  });

  it('should validate and expose application configuration', () => {
    const appConfig = configService.get<ApiConfig['app']>('app');

    expect(appConfig).toBeDefined();
    expect(appConfig?.nodeEnv).toBe('test');
    expect(appConfig?.port).toBe(4000);
    expect(appConfig?.docsBasicAuthUser).toBe('docs');
    expect(appConfig?.docsBasicAuthPassword).toBe('password');
  });

  it('should validate auth configuration', () => {
    const authConfig = configService.get<ApiConfig['auth']>('auth');

    expect(authConfig).toBeDefined();
    expect(authConfig?.supabaseUrl).toBe('http://test.supabase.co');
    expect(authConfig?.jwtSecret).toBe('test-secret-with-at-least-32-characters-long');
  });

  it('should validate database and storage configuration', () => {
    const dbConfig = configService.get<ApiConfig['db']>('db');
    const storageConfig = configService.get<ApiConfig['storage']>('storage');

    expect(dbConfig?.url).toBe('https://database.example.com');
    expect(storageConfig?.endpoint).toBe('https://storage.example.com');
  });

  it('should apply defaults for optional configs', () => {
    const rateLimitConfig = configService.get<ApiConfig['rateLimit']>('rateLimit');
    const otelConfig = configService.get<ApiConfig['otel']>('otel');

    expect(rateLimitConfig).toEqual({ points: 100, duration: 60 });
    expect(otelConfig?.enabled).toBe(false);
  });
});
