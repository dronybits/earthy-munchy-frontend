import { defineConfig } from 'vite'
import react from '@vitejs/react'

export default defineConfig({
  plugins: [react()],
  // Ensures assets are linked relatively, which is safer for Vercel deployments
  base: './',
})