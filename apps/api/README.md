# Braves Journal API

NestJS 10 API application with Fastify adapter, featuring comprehensive infrastructure for authentication, logging, observability, and health monitoring.

## Features

- **Framework**: NestJS 10 + Fastify
- **Authentication**: Supabase JWT with RBAC (roles: adventurer, mogul, admin)
- **Logging**: Pino JSON logging with request ID correlation
- **Observability**: OpenTelemetry with OTLP export (HTTP, Prisma, BullMQ instrumentation)
- **Security**: Rate limiting, global exception handling, problem+json responses
- **Documentation**: Swagger/OpenAPI with Basic Auth protection
- **Health Checks**: Liveness and readiness endpoints with DB/Storage indicators

## Quick Start

```bash
# Install dependencies (from monorepo root)
pnpm install

# Copy environment file
cd apps/api
cp .env.example .env

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run tests
pnpm test
```

## Environment Configuration

See `.env.example` for all available configuration options.

Required variables:

- `SUPABASE_JWT_SECRET`: Your Supabase JWT secret (min 32 chars)
- `DATABASE_URL`: PostgreSQL connection string
- `S3_ENDPOINT`: S3/MinIO storage endpoint
- `OPENAI_API_KEY`: OpenAI API key

## API Endpoints

### Health

- `GET /health/live` - Liveness probe (always returns 200)
- `GET /health/ready` - Readiness probe (checks DB and storage)

### Documentation

- `GET /docs` - Swagger UI (requires basic auth)
- `GET /docs/json` - OpenAPI JSON spec

### Domain Modules

- `/projects` - Projects management
- `/prd` - PRD management
- `/tasks` - Task management
- `/prompts` - Prompt management
- `/doc-packages` - Document packages
- `/analytics` - Analytics data
- `/shared` - Shared utilities

## Authentication

API uses Supabase JWT tokens via Bearer authentication:

```
Authorization: Bearer <your-jwt-token>
```

### Roles

- `adventurer`: Base user role
- `mogul`: Advanced user role
- `admin`: Administrator role

### Decorators

Use `@Roles()` decorator to protect routes:

```typescript
import { Roles } from './auth/roles.decorator';
import { Role } from './auth/role.enum';

@Roles(Role.Admin)
@Get('admin-only')
adminOnlyRoute() {
  // Only accessible by admin users
}
```

Use `@Public()` decorator for unauthenticated routes:

```typescript
import { Public } from './auth/public.decorator';

@Public()
@Get('public')
publicRoute() {
  // Accessible without authentication
}
```

## Architecture

```
src/
├── @types/          # TypeScript type declarations
├── auth/            # Authentication (Supabase JWT strategy)
├── common/          # Shared guards, filters, logger
├── config/          # Configuration with Zod validation
├── health/          # Health check endpoints
├── modules/         # Domain modules
│   ├── projects/
│   ├── prd/
│   ├── tasks/
│   ├── prompts/
│   ├── doc-packages/
│   ├── analytics/
│   └── shared/
├── observability/   # OpenTelemetry tracing setup
├── shared/          # Shared DTOs, pipes, utilities
├── app.module.ts    # Root application module
└── main.ts          # Application entry point
```

## Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:cov
```

## Development

The API uses NestJS CLI for code generation:

```bash
# Generate a new module
nest g module modules/example

# Generate a controller
nest g controller modules/example

# Generate a service
nest g service modules/example
```

## Observability

OpenTelemetry tracing can be enabled via environment variables:

```bash
OTEL_ENABLED=true
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318/v1/traces
```

Traces are automatically collected for:

- HTTP requests
- Prisma database queries
- BullMQ queue operations

## Contributing

1. Create a feature branch from `main`
2. Implement your changes with tests
3. Ensure all tests pass: `pnpm test`
4. Submit a pull request

## License

MIT
