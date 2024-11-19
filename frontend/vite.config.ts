import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     proxy: {
//       '/api': {
//         target: 'http://localhost:8080', // Your backend URL
//         changeOrigin: true,             // Ensures the host header is updated to match the target
//         rewrite: (path) => path.replace(/^\/api/, ''), // Remove `/api` prefix if backend doesn't expect it
//         secure: false,
//       },
//     },
//   },
// });

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
