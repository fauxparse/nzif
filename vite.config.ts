import * as path from 'node:path';
import yaml from '@modyfi/vite-plugin-yaml';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react-swc';
import ruby from 'vite-plugin-ruby';
import { configDefaults, defineConfig } from 'vitest/config';

const plugins = [
  ruby(),
  TanStackRouterVite({
    routesDirectory: path.resolve(__dirname, './app/frontend/routes'),
    generatedRouteTree: path.resolve(__dirname, './app/frontend/routeTree.gen.ts'),
    quoteStyle: 'single',
    experimental: {
      enableCodeSplitting: true,
    },
  }),
  react(),
  yaml(),
];

export default defineConfig({
  resolve: {
    alias: {
      '@config': path.resolve(__dirname, './config'),
      '@ladle': path.resolve(__dirname, './.ladle'),
      '@': path.resolve(__dirname, './app/frontend'),
    },
  },
  plugins: plugins,
  test: {
    globals: true,
    css: true,
    environment: 'jsdom',
    setupFiles: 'tests/setup.ts',
    coverage: {
      provider: 'istanbul',
      exclude: [...(configDefaults.coverage.exclude || []), '**/tests/setup.ts'],
    },
  },
  define: {
    STRIPE_PUBLIC_KEY: '"process.env.STRIPE_PUBLISHABLE_KEY"',
    MAPBOX_KEY: '"process.env.MAPBOX_KEY"',
  },
});
