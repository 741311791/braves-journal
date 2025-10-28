import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jose from 'jose';

import type { Configuration } from '../config/configuration';

export type UserRole = 'adventurer' | 'mogul' | 'admin';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  metadata?: Record<string, unknown>;
}

export interface AuthenticatedRequest {
  user?: AuthUser;
}

@Injectable()
export class SupabaseStrategy {
  constructor(private readonly configService: ConfigService<Configuration, true>) {}

  async validate(token: string): Promise<AuthUser> {
    const jwtSecret = this.configService.get('supabase.jwtSecret', { infer: true });
    const supabaseUrl = this.configService.get('supabase.url', { infer: true });

    if (!jwtSecret) {
      throw new UnauthorizedException('JWT secret not configured');
    }

    if (!supabaseUrl) {
      throw new UnauthorizedException('Supabase URL not configured');
    }

    try {
      const secret = new TextEncoder().encode(jwtSecret);
      const issuer = new URL('/auth/v1', supabaseUrl).toString();
      const { payload } = await jose.jwtVerify(token, secret, {
        issuer,
      });

      if (!payload.sub || !payload.email) {
        throw new UnauthorizedException('Invalid token payload');
      }

      const role = this.extractRole(payload);

      return {
        id: payload.sub,
        email: payload.email as string,
        role,
        metadata: payload.user_metadata as Record<string, unknown> | undefined,
      };
    } catch (error) {
      if (error instanceof jose.errors.JWTExpired) {
        throw new UnauthorizedException('Token expired');
      }
      if (error instanceof jose.errors.JWTInvalid) {
        throw new UnauthorizedException('Invalid token');
      }
      throw new UnauthorizedException('Token validation failed');
    }
  }

  private extractRole(payload: jose.JWTPayload): UserRole {
    const metadata = payload.user_metadata as Record<string, unknown> | undefined;
    const role = metadata?.role;

    if (role === 'admin' || role === 'mogul' || role === 'adventurer') {
      return role;
    }

    return 'adventurer';
  }
}
