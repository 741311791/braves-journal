import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Role } from './role.enum';

export interface JwtPayload {
  sub: string;
  email?: string;
  role?: Role;
  aud?: string;
  iss?: string;
  exp?: number;
  iat?: number;
}

export interface CurrentUser extends JwtPayload {
  userId: string;
}

export const User = createParamDecorator(
  (data: keyof CurrentUser | undefined, ctx: ExecutionContext): CurrentUser | unknown => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as CurrentUser;

    return data ? user?.[data] : user;
  }
);
