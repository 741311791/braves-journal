import { randomUUID } from 'crypto';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, UnauthorizedException } from '@nestjs/common';
import fastifyBasicAuth from '@fastify/basic-auth';
import fastifyRateLimit from '@fastify/rate-limit';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ZodValidationPipe } from './shared/zod.pipe';
import { initTracing } from './observability/tracing';
import { createConfigService } from './config/configuration';

async function bootstrap() {
  const adapter = new FastifyAdapter({
    logger: false,
    genReqId: () => randomUUID(),
  });

  const app = await NestFactory.create<NestFastifyApplication>(AppModule, adapter, {
    bufferLogs: true,
  });

  const configService = app.get(ConfigService);
  const config = createConfigService(configService);

  await initTracing(config.otel);

  app.useLogger(app.get(Logger));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ZodValidationPipe());
  app.enableCors();

  const fastifyInstance = app.getHttpAdapter().getInstance();

  await fastifyInstance.register(fastifyRateLimit, {
    global: false,
    max: config.rateLimit.points,
    timeWindow: config.rateLimit.duration * 1000,
    errorResponseBuilder: (_, context) => ({
      type: 'about:blank',
      title: 'TooManyRequests',
      status: 429,
      detail: 'Rate limit exceeded',
      instance: context?.req?.url ?? '/',
    }),
  });

  await fastifyInstance.register(fastifyBasicAuth, {
    validate: async (username: string, password: string) => {
      if (
        username !== config.app.docsBasicAuthUser ||
        password !== config.app.docsBasicAuthPassword
      ) {
        throw new UnauthorizedException('Invalid documentation credentials');
      }
    },
    authenticate: true,
  });

  fastifyInstance.addHook('onRequest', async (request, reply) => {
    reply.header('x-request-id', request.id);

    if (request.url.startsWith('/docs')) {
      await request.authenticate();
    }
  });

  const docsConfig = new DocumentBuilder()
    .setTitle(config.app.name)
    .setDescription('Braves Journal API documentation')
    .setVersion(config.app.version)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, docsConfig);
  SwaggerModule.setup('docs', app, document, {
    jsonDocumentUrl: 'docs/json',
  });

  const port = config.app.port;
  await app.listen(port, '0.0.0.0');

  const logger = app.get(Logger);
  logger.log(`🚀 Braves Journal API running at http://0.0.0.0:${port}`);
  logger.log(`📚 API documentation available at http://0.0.0.0:${port}/docs`);
  logger.log(`❤️ Health endpoint at http://0.0.0.0:${port}/health/live`);
}

bootstrap().catch((error) => {
  console.error('Error during bootstrap', error);
  process.exit(1);
});
