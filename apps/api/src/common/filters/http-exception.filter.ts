import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { FastifyReply, FastifyRequest } from 'fastify';

interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail?: string | Record<string, unknown>;
  instance: string;
  requestId?: string;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<FastifyRequest>();
    const reply = ctx.getResponse<FastifyReply>();

    const { status, detail, title } = this.normalizeException(exception);

    const problem: ProblemDetails = {
      type: 'about:blank',
      title,
      status,
      detail,
      instance: request?.url ?? 'unknown',
      requestId: request?.id as string | undefined,
    };

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(detail ?? title, (exception as Error)?.stack);
    } else {
      this.logger.warn(`${title}: ${JSON.stringify(detail)}`);
    }

    reply.status(status);
    reply.header('content-type', 'application/problem+json');
    reply.send(problem);
  }

  private normalizeException(exception: unknown): {
    status: number;
    title: string;
    detail?: string | Record<string, unknown>;
  } {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      const message =
        typeof response === 'string'
          ? response
          : ((response as Record<string, unknown>).message ?? exception.message);

      return {
        status: exception.getStatus(),
        title: exception.name,
        detail: message as string,
      };
    }

    const error = exception as Error;
    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      title: error?.name ?? 'InternalServerError',
      detail: error?.message ?? 'Internal server error',
    };
  }
}
