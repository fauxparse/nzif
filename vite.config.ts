import { defineConfig } from 'vite';
import ruby from 'vite-plugin-ruby';
import react from '@vitejs/plugin-react';
import fonts from 'vite-plugin-fonts';

export default defineConfig({
  plugins: [
    ruby(),
    react(),
    fonts({
      google: {
        families: [
          {
            name: 'Archivo',
            styles: 'wght@400;500;600;700',
          },
        ],
      },
    }),
  ],
});
