# Braves Journal

A comprehensive journaling application built with a modern monorepo architecture.

## 🏗️ Monorepo Structure

This project uses pnpm workspaces and Turborepo for efficient monorepo management.

```
braves-journal/
├── apps/
│   ├── web/          # Next.js web application
│   └── api/          # Hono API server
├── packages/
│   ├── config/       # Shared configurations (ESLint, Prettier, etc.)
│   ├── shared/       # Shared utilities and types
│   └── ui/           # Shared UI components
├── infra/            # Infrastructure configurations
└── docs/             # Documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 20.0.0
- pnpm >= 8.0.0
- Docker (for local development)

### Installation

```bash
# Install dependencies
pnpm install

# Start local infrastructure (Postgres, Redis, MinIO)
docker compose -f infra/compose.dev.yaml up -d

# Copy environment variables
cp .env.example .env
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env

# Start development servers
pnpm dev
```

The web app will be available at http://localhost:3000 and the API at http://localhost:3001.

## 📦 Workspaces

### Applications

- **apps/web** - Next.js 14 web application with App Router
- **apps/api** - Hono-based API server

### Packages

- **packages/config** - Shared tooling configurations (ESLint, Prettier, TypeScript, Vitest, Playwright, Tailwind)
- **packages/shared** - Shared utilities, types, and business logic
- **packages/ui** - Shared React UI components

## 🛠️ Development

### Available Scripts

```bash
# Development
pnpm dev              # Start all apps in development mode
pnpm dev --filter web # Start only the web app

# Building
pnpm build            # Build all apps and packages
pnpm build --filter api # Build only the API

# Linting & Formatting
pnpm lint             # Lint all workspaces
pnpm format           # Format all files
pnpm format:check     # Check formatting

# Testing
pnpm test             # Run all tests
pnpm test:unit        # Run unit tests
pnpm test:e2e         # Run E2E tests with Playwright

# Type Checking
pnpm typecheck        # Type check all workspaces

# Cleanup
pnpm clean            # Remove all build artifacts and dependencies
```

### Code Quality

This project enforces code quality through:

- **ESLint 9** with TypeScript support
- **Prettier 3** for consistent formatting
- **Husky** for Git hooks
- **lint-staged** for pre-commit linting
- **Commitlint** for conventional commit messages

## 🐳 Docker

Multi-stage Dockerfiles are provided for both apps:

```bash
# Build web app
docker build -f apps/web/Dockerfile -t braves-journal-web .

# Build API
docker build -f apps/api/Dockerfile -t braves-journal-api .
```

## 🧪 Testing

- Unit tests with Vitest
- E2E tests with Playwright (placeholder configured)

## 📚 Documentation

See [docs/architecture/monorepo-overview.md](docs/architecture/monorepo-overview.md) for detailed architecture documentation.

## 🔧 Infrastructure

Local development infrastructure is managed with Docker Compose:

- **PostgreSQL** (port 5432) - Primary database
- **Redis** (port 6379) - Caching and rate limiting
- **MinIO** (ports 9000, 9001) - S3-compatible object storage

```bash
# Start infrastructure
docker compose -f infra/compose.dev.yaml up -d

# Stop infrastructure
docker compose -f infra/compose.dev.yaml down

# View logs
docker compose -f infra/compose.dev.yaml logs -f
```

## 📝 License

MIT License - see [LICENSE](LICENSE) for details.

## 🤝 Contributing

This is a scaffolded monorepo ready for feature development. Follow the conventional commits specification for all commit messages.
