import 'fastify';
import type { CurrentUser } from '../auth/current-user.decorator';

declare module 'fastify' {
  interface FastifyRequest {
    user?: CurrentUser;
  }
}
