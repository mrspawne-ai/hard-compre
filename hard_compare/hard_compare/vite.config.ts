import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        configure(proxy) {
          proxy.on('error', (_err, _req, res) => {
            const r = res as import('http').ServerResponse;
            if (!r.headersSent) r.writeHead(503, { 'Content-Type': 'application/json' });
            r.end(JSON.stringify({ error: 'Cannot connect to server. Make sure the backend is running.' }));
          });
        },
      },
    },
  },
})
