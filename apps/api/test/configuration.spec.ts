import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import configuration from '../src/config/configuration';
import { validateEnv } from '../src/config/validation';

describe('Configuration', () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    originalEnv = { ...process.env };
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it('loads configuration from environment variables', () => {
    process.env = {
      ...originalEnv,
      PORT: '3002',
      NODE_ENV: 'test',
      CORS_ORIGIN: 'http://localhost:4000',
    };

    const config = configuration();

    expect(config.port).toBe(3002);
    expect(config.nodeEnv).toBe('test');
    expect(config.cors.origin).toBe('http://localhost:4000');
  });

  it('uses default values when environment variables are not set', () => {
    delete process.env.PORT;
    delete process.env.NODE_ENV;
    delete process.env.CORS_ORIGIN;

    const config = configuration();

    expect(config.port).toBe(3001);
    expect(config.nodeEnv).toBe('development');
    expect(config.cors.origin).toBe('http://localhost:3000');
  });

  it('validates required environment variables', () => {
    const invalidConfig = {
      PORT: '3001',
      NODE_ENV: 'development',
      DATABASE_URL: 'invalid-url',
    };

    expect(() => validateEnv(invalidConfig)).toThrow();
  });

  it('validates required environment variables - valid config', () => {
    const validConfig = {
      PORT: '3001',
      NODE_ENV: 'development',
      DATABASE_URL: 'postgresql://localhost:5432/db',
      DIRECT_URL: 'postgresql://localhost:5432/db',
      SUPABASE_URL: 'http://localhost:54321',
      SUPABASE_ANON_KEY: 'key',
      SUPABASE_SERVICE_ROLE_KEY: 'key',
      S3_ENDPOINT: 'http://localhost:9000',
      S3_BUCKET: 'bucket',
      S3_ACCESS_KEY_ID: 'key',
      S3_SECRET_ACCESS_KEY: 'secret',
      S3_REGION: 'us-east-1',
      REDIS_URL: 'redis://localhost:6379',
      CORS_ORIGIN: 'http://localhost:3000',
      OTEL_ENABLED: 'false',
      OTEL_EXPORTER_OTLP_ENDPOINT: 'http://localhost:4318',
      OTEL_SERVICE_NAME: 'braves-journal-api',
      SWAGGER_USER: 'admin',
      SWAGGER_PASSWORD: 'changeme',
      RATE_LIMIT_MAX: '100',
      RATE_LIMIT_WINDOW: '1 minute',
    };

    expect(() => validateEnv(validConfig)).not.toThrow();
  });
});
