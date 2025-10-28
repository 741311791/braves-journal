# Monorepo Architecture Overview

## Introduction

This document provides an overview of the Braves Journal monorepo architecture, tooling choices, and development practices.

## Technology Stack

### Core Technologies

- **Package Manager**: pnpm 8+ with workspaces
- **Build Tool**: Turborepo for task orchestration and caching
- **Language**: TypeScript 5.3+
- **Frontend**: Next.js 14 (App Router)
- **Backend**: Hono (lightweight web framework)
- **Database**: PostgreSQL (via Supabase)
- **Storage**: S3-compatible (MinIO for local dev)
- **Caching**: Redis

### Development Tools

- **Linting**: ESLint 9 with flat config
- **Formatting**: Prettier 3
- **Git Hooks**: Husky 9
- **Commit Validation**: Commitlint
- **Testing**: Vitest (unit), Playwright (E2E)
- **Containerization**: Docker with multi-stage builds

## Workspace Structure

### Apps Directory

Contains deployable applications:

- **web**: Next.js web application
  - App Router architecture
  - Server and Client Components
  - Tailwind CSS for styling
  - TypeScript strict mode

- **api**: Hono API server
  - RESTful API endpoints
  - Shared business logic with web app
  - TypeScript with Node.js runtime

### Packages Directory

Contains shared code and configurations:

- **config**: Centralized tooling configurations
  - ESLint configurations
  - Prettier settings
  - TypeScript configs for different environments
  - Vitest and Playwright setups
  - Tailwind preset
  - Commitlint rules

- **shared**: Shared utilities and types
  - Common TypeScript types
  - Utility functions
  - Business logic shared between apps
  - Zod schemas for validation

- **ui**: Shared React components
  - Reusable UI components
  - Consistent styling with Tailwind
  - TypeScript props with proper typing

### Infrastructure Directory

Contains infrastructure-as-code and deployment configurations:

- **compose.dev.yaml**: Docker Compose for local development
- Future: Terraform, Kubernetes configs, CI/CD templates

## Build System

### Turborepo Pipeline

Turborepo manages the build pipeline with dependency-aware task execution:

- **build**: Compiles TypeScript and builds applications
- **dev**: Runs development servers with hot reload
- **lint**: Runs ESLint across all workspaces
- **test**: Executes unit and E2E tests
- **typecheck**: Validates TypeScript types

Tasks are cached and only re-run when dependencies change, significantly improving build times.

### Task Dependencies

```
build (web) → build (shared, ui)
build (api) → build (shared)
lint → build
test → build
```

## Code Quality

### Linting Strategy

- ESLint 9 with flat configuration
- TypeScript-specific rules
- Consistent import ordering
- Unused variable detection
- Strict type checking enforced

### Formatting

- Prettier for consistent code style
- Single quotes, semicolons, 2-space indent
- 100-character line width
- Trailing commas (ES5)
- LF line endings

### Git Workflow

1. **Pre-commit Hook**: Runs lint-staged
   - Lints and formats staged files
   - Catches issues before commit

2. **Commit-msg Hook**: Validates commit messages
   - Enforces conventional commits format
   - Types: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert

### Conventional Commits

Format: `<type>(<scope>): <subject>`

Examples:

- `feat(web): add user authentication`
- `fix(api): resolve database connection timeout`
- `docs: update README with setup instructions`

## Development Workflow

### Local Development

1. Start infrastructure: `docker compose -f infra/compose.dev.yaml up -d`
2. Install dependencies: `pnpm install`
3. Start dev servers: `pnpm dev`

### Adding Dependencies

```bash
# Root-level (tooling)
pnpm add -D <package> -w

# Specific workspace
pnpm add <package> --filter @braves-journal/web

# Workspace dependencies
pnpm add @braves-journal/shared --filter @braves-journal/web
```

### Creating New Workspaces

1. Create directory under `apps/` or `packages/`
2. Add `package.json` with appropriate name: `@braves-journal/<name>`
3. Add to appropriate scripts in root `package.json` if needed
4. Run `pnpm install` to link workspace

## Testing Strategy

### Unit Tests (Vitest)

- Located alongside source files or in `__tests__` directories
- Fast, isolated tests for utilities and business logic
- Coverage reporting enabled

### E2E Tests (Playwright)

- Located in workspace-specific `tests/` directories
- Browser automation for critical user flows
- Configured for Chrome, Firefox, Safari
- Currently placeholder - to be implemented

## CI/CD Pipeline

### GitHub Actions Workflow

Jobs run in parallel when possible:

1. **lint**: ESLint and Prettier checks
2. **typecheck**: TypeScript compilation
3. **test**: Unit tests with coverage
4. **build**: Production builds
5. **playwright**: E2E tests (placeholder)

### Caching Strategy

- pnpm store cached across runs
- Turborepo cache for incremental builds
- Playwright browsers cached
- Docker layer caching in future

## Environment Variables

### Local Development

- `.env.example` files at root and app levels
- Copy to `.env` or `.env.local` and fill in values
- Never commit actual `.env` files

### Required Variables

- Database connection strings (PostgreSQL)
- Supabase credentials
- OpenAI API keys
- S3/MinIO configuration
- Redis URL
- CORS origins

## Docker Strategy

### Multi-Stage Builds

1. **deps**: Install dependencies
2. **builder**: Build application
3. **runner**: Minimal production image

Benefits:

- Smaller final images
- Cached dependency layers
- Secure (no source code in production image)

### Local Infrastructure

Docker Compose provides:

- PostgreSQL database
- Redis cache
- MinIO S3-compatible storage

All services include health checks and persistent volumes.

## Future Enhancements

- [ ] Database migrations tooling
- [ ] Automated E2E tests
- [ ] Performance monitoring integration
- [ ] Semantic release automation
- [ ] Storybook for component documentation
- [ ] Bundle size analysis
- [ ] Deployment pipelines
- [ ] Preview environments for PRs

## Best Practices

1. **Keep workspaces focused**: Each should have a single responsibility
2. **Use workspace protocol**: Reference workspace packages with `workspace:*`
3. **Shared configs**: Extend from `@braves-journal/config` when possible
4. **Type safety**: Enable strict TypeScript checks everywhere
5. **Test coverage**: Aim for >80% coverage on business logic
6. **Commit conventions**: Always use conventional commit format
7. **Documentation**: Update docs when making architectural changes

## Resources

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [pnpm Workspaces](https://pnpm.io/workspaces)
- [Next.js Documentation](https://nextjs.org/docs)
- [Hono Documentation](https://hono.dev)
- [Conventional Commits](https://www.conventionalcommits.org)
