import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import type { AuthConfig } from '../config/configuration';
import type { JwtPayload, CurrentUser } from './current-user.decorator';
import { Role, ALL_ROLES } from './role.enum';

@Injectable()
export class SupabaseStrategy {
  private readonly logger = new Logger(SupabaseStrategy.name);
  private readonly config: AuthConfig;

  constructor(private readonly configService: ConfigService) {
    this.config = this.configService.getOrThrow<AuthConfig>('auth');
  }

  async validate(token: string): Promise<CurrentUser> {
    if (!this.config.jwtSecret) {
      throw new UnauthorizedException('JWT secret not configured');
    }

    try {
      const decoded = jwt.verify(token, this.config.jwtSecret) as JwtPayload;

      if (!decoded.sub) {
        throw new UnauthorizedException('Invalid token: missing subject');
      }

      const role = this.normalizeRole(decoded.role);

      return {
        ...decoded,
        userId: decoded.sub,
        role,
      };
    } catch (error) {
      this.logger.warn(`Token validation failed: ${(error as Error).message}`);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  extractTokenFromHeader(authHeader?: string): string | null {
    if (!authHeader) {
      return null;
    }

    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) {
      return null;
    }

    return token;
  }

  private normalizeRole(role?: string): Role {
    if (role && (ALL_ROLES as string[]).includes(role)) {
      return role as Role;
    }

    return Role.Adventurer;
  }
}
