import type { UserConfig } from 'vitest/config';

const config: UserConfig = {
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/**',
        'dist/**',
        '**/*.config.*',
        '**/*.d.ts',
        'coverage/**',
        'test/**',
        'tests/**',
      ],
    },
  },
};

export default config;
