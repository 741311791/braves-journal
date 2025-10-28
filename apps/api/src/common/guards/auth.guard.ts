import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { FastifyRequest } from 'fastify';
import { SupabaseStrategy } from '../../auth/supabase.strategy';
import { IS_PUBLIC_KEY } from '../../auth/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly supabaseStrategy: SupabaseStrategy,
    private readonly reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const authHeader = request.headers.authorization;
    const token = this.supabaseStrategy.extractTokenFromHeader(authHeader);

    if (!token) {
      throw new UnauthorizedException('Missing authentication token');
    }

    const user = await this.supabaseStrategy.validate(token);
    (request as FastifyRequest & { user: unknown }).user = user;

    return true;
  }
}
