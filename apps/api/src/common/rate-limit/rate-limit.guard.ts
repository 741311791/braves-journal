import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
  HttpException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { RateLimitConfig } from '../../config/configuration';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

@Injectable()
export class RateLimitGuard implements CanActivate {
  private readonly store = new Map<string, RateLimitEntry>();
  private readonly config: RateLimitConfig;

  constructor(private readonly configService: ConfigService) {
    this.config = this.configService.getOrThrow<RateLimitConfig>('rateLimit');
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const identifier = this.getIdentifier(request);

    const now = Date.now();
    const entry = this.store.get(identifier);

    if (!entry || now > entry.resetTime) {
      this.store.set(identifier, {
        count: 1,
        resetTime: now + this.config.duration * 1000,
      });
      return true;
    }

    if (entry.count >= this.config.points) {
      throw new HttpException('Rate limit exceeded', HttpStatus.TOO_MANY_REQUESTS);
    }

    entry.count += 1;
    return true;
  }

  private getIdentifier(request: { ip?: string; headers?: Record<string, string> }): string {
    return request.ip ?? request.headers?.['x-forwarded-for'] ?? 'unknown';
  }
}
