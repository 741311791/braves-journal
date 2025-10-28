import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '../src/common/guards/auth.guard';
import { SupabaseStrategy } from '../src/auth/supabase.strategy';
import { IS_PUBLIC_KEY } from '../src/auth/public.decorator';
import type { CurrentUser } from '../src/auth/current-user.decorator';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let supabaseStrategy: SupabaseStrategy;
  let reflector: Reflector;

  const mockSupabaseStrategy = {
    extractTokenFromHeader: jest.fn(),
    validate: jest.fn(),
  };

  const mockReflector = {
    getAllAndOverride: jest.fn(),
  };

  const mockConfigService = {
    getOrThrow: jest.fn((key: string) => {
      if (key === 'auth') {
        return {
          jwtSecret: 'test-secret-with-at-least-32-characters-long',
        };
      }
      return {};
    }),
  };

  const createMockExecutionContext = (request: Record<string, unknown>) => {
    return {
      switchToHttp: jest.fn(() => ({
        getRequest: jest.fn(() => request),
      })),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as unknown as ExecutionContext;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        { provide: SupabaseStrategy, useValue: mockSupabaseStrategy },
        { provide: Reflector, useValue: mockReflector },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    guard = module.get<AuthGuard>(AuthGuard);
    supabaseStrategy = module.get<SupabaseStrategy>(SupabaseStrategy);
    reflector = module.get<Reflector>(Reflector);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should allow access to public routes', async () => {
    mockReflector.getAllAndOverride.mockReturnValue(true);

    const context = createMockExecutionContext({ headers: {} });
    const result = await guard.canActivate(context);

    expect(result).toBe(true);
    expect(reflector.getAllAndOverride).toHaveBeenCalledWith(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    expect(mockSupabaseStrategy.extractTokenFromHeader).not.toHaveBeenCalled();
  });

  it('should throw UnauthorizedException if no token is provided', async () => {
    mockReflector.getAllAndOverride.mockReturnValue(false);
    mockSupabaseStrategy.extractTokenFromHeader.mockReturnValue(null);

    const context = createMockExecutionContext({ headers: {} });

    await expect(guard.canActivate(context)).rejects.toThrow(
      new UnauthorizedException('Missing authentication token')
    );
  });

  it('should allow access with valid token', async () => {
    const mockUser: CurrentUser = {
      sub: '123',
      userId: '123',
      email: 'test@example.com',
    };

    mockReflector.getAllAndOverride.mockReturnValue(false);
    mockSupabaseStrategy.extractTokenFromHeader.mockReturnValue('valid-token');
    mockSupabaseStrategy.validate.mockResolvedValue(mockUser);

    const request = { headers: { authorization: 'Bearer valid-token' } };
    const context = createMockExecutionContext(request);

    const result = await guard.canActivate(context);

    expect(result).toBe(true);
    expect(mockSupabaseStrategy.validate).toHaveBeenCalledWith('valid-token');
    expect((request as any).user).toEqual(mockUser);
  });

  it('should throw UnauthorizedException with invalid token', async () => {
    mockReflector.getAllAndOverride.mockReturnValue(false);
    mockSupabaseStrategy.extractTokenFromHeader.mockReturnValue('invalid-token');
    mockSupabaseStrategy.validate.mockRejectedValue(new UnauthorizedException('Invalid token'));

    const context = createMockExecutionContext({
      headers: { authorization: 'Bearer invalid-token' },
    });

    await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
  });
});
