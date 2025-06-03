/*import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})*/

import { defineConfig } from 'vite';

export default defineConfig({
  optimizeDeps: {
    include: ['jwt-decode']
  },
  // If necessary, add commonjs options
  build: {
    commonjsOptions: {
      include: [/jwt-decode/, /node_modules/],
    }
  }
});
