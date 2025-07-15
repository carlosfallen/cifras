import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // <-- aqui!
    port: 5173, // opcional, defina se quiser uma porta fixa
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
