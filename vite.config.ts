import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: [
        '@midnight-ntwrk/dapp-connector-api',
        '@midnight-ntwrk/midnight-js-network-provider'
      ]
    }
  },
  server: {
    port: 3000,
    host: true
  }
});
