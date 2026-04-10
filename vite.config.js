import { defineConfig } from 'vite'
import react from '@vitejs/react'

export default defineConfig({
  plugins: [react()],
  base: './', // This tells Vite to use relative paths
})