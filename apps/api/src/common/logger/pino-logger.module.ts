import { randomUUID } from 'node:crypto';

import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        transport:
          process.env.NODE_ENV !== 'production'
            ? {
                target: 'pino-pretty',
                options: {
                  colorize: true,
                  singleLine: true,
                  ignore: 'pid,hostname',
                },
              }
            : undefined,
        customProps: () => ({
          context: 'HTTP',
        }),
        serializers: {
          req(req) {
            return {
              id: req.id,
              method: req.method,
              url: req.url,
              query: req.query,
              params: req.params,
            };
          },
          res(res) {
            return {
              statusCode: res.statusCode,
            };
          },
        },
        genReqId: (req) => req.headers['x-request-id'] || randomUUID(),
        customLogLevel: (req, res, err) => {
          if (res.statusCode >= 400 && res.statusCode < 500) {
            return 'warn';
          } else if (res.statusCode >= 500 || err) {
            return 'error';
          }
          return 'info';
        },
        formatters: {
          level: (label) => {
            return { level: label };
          },
        },
        redact: {
          paths: ['req.headers.authorization', 'req.headers.cookie'],
          censor: '***',
        },
      },
    }),
  ],
  exports: [LoggerModule],
})
export class PinoLoggerModule {}
