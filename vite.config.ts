import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path, { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/playwrightFrameworkGenerator/',
  build: {
    outDir: 'build',
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk for core React dependencies
          vendor: ['react', 'react-dom', 'react-router-dom'],
          
          // UI library chunk for Radix UI components
          ui: [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-label',
            '@radix-ui/react-radio-group',
            '@radix-ui/react-select',
            '@radix-ui/react-separator',
            '@radix-ui/react-slot',
            '@radix-ui/react-switch',
            '@radix-ui/react-tabs',
            '@radix-ui/react-tooltip',
            '@radix-ui/react-popover',
            '@radix-ui/react-progress',
            '@radix-ui/react-checkbox'
          ],
          
          // Redux chunk for state management
          redux: ['@reduxjs/toolkit', 'react-redux'],
          
          // Utilities chunk
          utils: ['clsx', 'jszip'],
          
          // Icons and charts chunk
          icons: ['lucide-react', 'recharts']
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: true
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@reduxjs/toolkit', 'react-redux']
  }
})