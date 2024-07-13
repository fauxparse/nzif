import * as path from 'node:path';
import yaml from '@modyfi/vite-plugin-yaml';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@config': path.resolve(__dirname, './config'),
      '@': path.resolve(__dirname, './app/frontend'),
      '~/fonts': path.resolve(__dirname, './app/frontend/fonts'),
    },
  },
  plugins: [react(), yaml()],
});
