# @braves-journal/config

Shared configuration for linting, formatting, testing, and TypeScript across the monorepo.

## Configurations

### ESLint

ESLint 9 flat config with TypeScript support.

```js
import baseConfig from '@braves-journal/config/eslint';

export default [...baseConfig];
```

### Prettier

Prettier 3 configuration with sensible defaults.

```js
module.exports = {
  ...require('@braves-journal/config/prettier'),
};
```

### TypeScript

Multiple tsconfig presets for different environments:

- `base.json` - Base configuration
- `nextjs.json` - Next.js applications
- `node.json` - Node.js applications
- `react.json` - React libraries

```json
{
  "extends": "@braves-journal/config/tsconfig/nextjs.json"
}
```

### Vitest

Vitest configuration for unit testing.

```ts
import { mergeConfig } from 'vitest/config';
import baseConfig from '@braves-journal/config/vitest';

export default mergeConfig(baseConfig, {
  // your config
});
```

### Tailwind CSS

Tailwind preset with custom theme configuration.

```js
module.exports = {
  presets: [require('@braves-journal/config/tailwind')],
};
```

### Commitlint

Conventional commits configuration.

```js
module.exports = {
  extends: ['@braves-journal/config/commitlint'],
};
```

### Playwright

Playwright configuration for E2E testing.

```ts
import { defineConfig } from '@playwright/test';
import baseConfig from '@braves-journal/config/playwright';

export default defineConfig({
  ...baseConfig,
});
```
