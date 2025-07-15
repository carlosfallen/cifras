import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
<<<<<<< HEAD
  server: {
    host: '0.0.0.0', // <-- aqui!
    port: 5173, // opcional, defina se quiser uma porta fixa
  },
=======
>>>>>>> 6dce138b82ee42ab581451b7550730ca0522ac21
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
