import yaml from '@modyfi/vite-plugin-yaml';
import react from '@vitejs/plugin-react';
import path from 'path';
import ruby from 'vite-plugin-ruby';
import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
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
      exclude: [...(configDefaults.coverage.exclude || []), '**/tests/setup.ts'],
    },
    threads: false,
  },
});
