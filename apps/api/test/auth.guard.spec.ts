import { describe, expect, it, beforeEach, vi } from 'vitest';
import { UnauthorizedException } from '@nestjs/common';
import type { ExecutionContext } from '@nestjs/common';

import { AuthGuard } from '../src/common/guards/auth.guard';
import type { AuthUser } from '../src/auth/supabase.strategy';

const createExecutionContext = (request: Record<string, unknown>): ExecutionContext => {
  return {
    switchToHttp: () => ({
      getRequest: () => request,
    }),
    getHandler: () => ({}),
    getClass: () => ({}),
  } as unknown as ExecutionContext;
};

describe('AuthGuard', () => {
  const reflector = {
    getAllAndOverride: vi.fn(),
  };
  const supabaseStrategy = {
    validate: vi.fn<[], Promise<AuthUser>>(),
  };

  let guard: AuthGuard;

  beforeEach(() => {
    reflector.getAllAndOverride.mockReset();
    supabaseStrategy.validate.mockReset();
    guard = new AuthGuard(reflector as never, supabaseStrategy as never);
  });

  it('allows public routes without validation', async () => {
    reflector.getAllAndOverride.mockReturnValue(true);

    const context = createExecutionContext({ headers: {} });

    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(supabaseStrategy.validate).not.toHaveBeenCalled();
  });

  it('throws when authorization header is missing', async () => {
    reflector.getAllAndOverride.mockReturnValue(false);

    const context = createExecutionContext({ headers: {} });

    await expect(guard.canActivate(context)).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('validates token and attaches user to request', async () => {
    const user: AuthUser = {
      id: 'user-1',
      email: 'user@example.com',
      role: 'adventurer',
    };

    reflector.getAllAndOverride.mockReturnValue(false);
    supabaseStrategy.validate.mockResolvedValue(user);

    const request = {
      headers: {
        authorization: 'Bearer valid.token',
      },
      user: undefined,
    };

    const context = createExecutionContext(request);

    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(request.user).toEqual(user);
    expect(supabaseStrategy.validate).toHaveBeenCalledWith('valid.token');
  });
});
