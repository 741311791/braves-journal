import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import type { ApiConfig } from '../../config/configuration';

@Module({
  imports: [
    LoggerModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const config = configService.get<ApiConfig['app']>('app');
        return {
          pinoHttp: {
            level: config?.logLevel ?? 'info',
            genReqId: (req) => {
              const existingId = req.id ?? req.headers['x-request-id'];
              if (existingId) return existingId;
              return randomUUID();
            },
            redact: {
              paths: [
                'req.headers.authorization',
                'req.headers.cookie',
                'res.headers["set-cookie"]',
                'req.body.password',
                'req.body.token',
              ],
              remove: true,
            },
            customSuccessMessage: (req, res, responseTime) => {
              return `${req.method} ${req.url} completed with ${res.statusCode} in ${responseTime}ms`;
            },
            customErrorMessage: (req, res, error) => {
              return `${req.method} ${req.url} failed with ${res.statusCode}: ${error.message}`;
            },
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  exports: [LoggerModule],
})
export class PinoLoggerModule {}
