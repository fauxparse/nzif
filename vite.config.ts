import yaml from '@modyfi/vite-plugin-yaml';
import react from '@vitejs/plugin-react';
import * as path from 'path';
import ruby from 'vite-plugin-ruby';
import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@config': path.resolve(__dirname, './config'),
      '@': path.resolve(__dirname, './app/frontend'),
    },
  },
  plugins: [...(process.env.STORYBOOK ? [] : [ruby()]), react(), yaml()],
  test: {
    globals: true,
    css: true,
    environment: 'jsdom',
    setupFiles: 'tests/setup.ts',
    coverage: {
      provider: 'c8',
      exclude: [...(configDefaults.coverage.exclude || []), '**/tests/setup.ts'],
    },
    threads: false,
  },
  define: {
    STRIPE_PUBLIC_KEY: '"process.env.STRIPE_PUBLISHABLE_KEY"',
  },
});
