import {
  Injectable,
  type CanActivate,
  type ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import type { Reflector } from '@nestjs/core';
import type { FastifyRequest } from 'fastify';

import { IS_PUBLIC_KEY } from '../metadata/public.metadata';
import type { AuthenticatedRequest, AuthUser } from '../../auth/supabase.strategy';
import type { SupabaseStrategy } from '../../auth/supabase.strategy';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly supabaseStrategy: SupabaseStrategy
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<FastifyRequest & AuthenticatedRequest>();
    const authorization = request.headers['authorization'];

    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid Authorization header');
    }

    const token = authorization.replace('Bearer ', '').trim();

    if (!token) {
      throw new UnauthorizedException('Empty bearer token');
    }

    const user = await this.validateToken(token);
    request.user = user;

    return true;
  }

  private async validateToken(token: string): Promise<AuthUser> {
    try {
      return await this.supabaseStrategy.validate(token);
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
