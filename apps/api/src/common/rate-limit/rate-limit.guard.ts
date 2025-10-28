import {
  CanActivate,
  ExecutionContext,
  Injectable,
  TooManyRequestsException,
} from '@nestjs/common';
import type { FastifyRequest } from 'fastify';

type RateLimitRequest = FastifyRequest & {
  rateLimit?: () => Promise<void>;
};

@Injectable()
export class RateLimitGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RateLimitRequest>();

    if (typeof request.rateLimit !== 'function') {
      return true;
    }

    try {
      await request.rateLimit();
    } catch (error) {
      throw new TooManyRequestsException(
        error instanceof Error ? error.message : 'Too many requests',
      );
    }

    return true;
  }
}
