import react from '@vitejs/plugin-react';
import fonts from 'vite-plugin-fonts';
import ruby from 'vite-plugin-ruby';
import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    ruby(),
    react(),
    fonts({
      google: {
        families: [
          {
            name: 'Archivo',
            styles: 'wght,wdth@400,100;500,100;600,100;700,100;700,125',
          },
        ],
      },
    }),
  ],
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
