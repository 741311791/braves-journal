import 'reflect-metadata';

import basicAuth from '@fastify/basic-auth';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';

import { AppModule } from './app.module';
import type { Configuration } from './config/configuration';
import { setupTracing, shutdownTracing } from './common/telemetry/tracing';

async function bootstrap(): Promise<void> {
  const adapter = new FastifyAdapter({
    trustProxy: true,
    logger: false,
  });

  const app = await NestFactory.create<NestFastifyApplication>(AppModule, adapter, {
    bufferLogs: true,
  });

  const logger = app.get(Logger);
  app.useLogger(logger);

  const configService = app.get(ConfigService<Configuration, true>);
  const port = configService.get('port', { infer: true });
  const corsConfig = configService.get('cors', { infer: true });
  const swaggerConfig = configService.get('swagger', { infer: true });
  const rateLimitConfig = configService.get('rateLimit', { infer: true });
  const otelConfig = configService.get('otel', { infer: true });

  const fastifyInstance = app.getHttpAdapter().getInstance();

  await fastifyInstance.register(cors, {
    origin: corsConfig.origin,
    credentials: true,
  });

  await fastifyInstance.register(rateLimit, {
    global: true,
    max: rateLimitConfig.max,
    timeWindow: rateLimitConfig.timeWindow,
  });

  await fastifyInstance.register(basicAuth, {
    validate: async (username, password) => {
      if (username !== swaggerConfig.user || password !== swaggerConfig.password) {
        throw new Error('Invalid documentation credentials');
      }
    },
    authenticate: { realm: 'Braves Journal Docs' },
  });

  fastifyInstance.addHook('onRequest', async (request, reply) => {
    if (request.url?.startsWith('/docs')) {
      await (fastifyInstance as any).basicAuth(request, reply);
    }
  });

  const docBuilder = new DocumentBuilder()
    .setTitle('Braves Journal API')
    .setDescription('API documentation for Braves Journal')
    .setVersion('1.0')
    .addBearerAuth();

  const document = SwaggerModule.createDocument(app, docBuilder.build());

  SwaggerModule.setup('/docs', app, document, {
    jsonDocumentUrl: '/docs/json',
  });

  setupTracing({
    enabled: otelConfig.enabled,
    endpoint: otelConfig.endpoint,
    serviceName: otelConfig.serviceName,
  });

  app.enableShutdownHooks();

  fastifyInstance.addHook('onClose', async () => {
    await shutdownTracing();
  });

  await app.listen(port, '0.0.0.0');
  logger.log(`Application is running on: http://0.0.0.0:${port}`);
}

void bootstrap();
