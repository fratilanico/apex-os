import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ mode }) => ({
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  
  plugins: [
    react(),
    visualizer({
      filename: './dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  
  // Environment variable prefix
  envPrefix: 'VITE_',
  
  // Optimize dependency pre-bundling
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'lucide-react',
      'react-markdown',
      'remark-gfm',
    ],
  },
  
  build: {
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 600,
    
    // Disable sourcemaps in production
    sourcemap: mode !== 'production',
    
    // Use terser for better minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
      },
      format: {
        comments: false,
      },
    },
    
    // Rollup options for advanced code splitting
    rollupOptions: {
      output: {
        // Manual chunk splitting strategy
        manualChunks: (id): string | undefined => {
          // Vendor chunks - Be specific to avoid circular dependencies
          if (id.includes('node_modules')) {
            // Animation library - check first because it contains 'react' in name
            if (id.includes('framer-motion')) {
              return 'vendor-motion';
            }
            // Icon library - check before react because it contains 'react' in name
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            // Markdown - check before react because it contains 'react' in name
            if (id.includes('react-markdown')) {
              return 'vendor-markdown';
            }
            // Core React - must be together to avoid circular deps
            if (id.includes('/react/') || id.includes('/react-dom/') || id.includes('scheduler')) {
              return 'vendor-react';
            }
            // React Router
            if (id.includes('react-router') || id.includes('@remix-run')) {
              return 'vendor-router';
            }
            // Markdown plugins
            if (id.includes('remark-gfm') || id.includes('remark') || id.includes('unified') || 
                id.includes('micromark') || id.includes('mdast')) {
              return 'vendor-markdown';
            }
            // State management
            if (id.includes('zustand')) {
              return 'vendor-state';
            }
            // Web vitals and other utilities - don't create separate vendor chunk
            // Let them be in default chunks to avoid circular dependencies
          }
          
          // Data chunks
          if (id.includes('data/curriculumData')) {
            return 'data-curriculum';
          }
          
          // Artifact components - split by feature
          if (id.includes('artifacts/DeploymentDemo')) {
            return 'artifact-deployment';
          }
          if (id.includes('artifacts/ToolArsenal')) {
            return 'artifact-tools';
          }
          if (id.includes('artifacts/CurriculumLog')) {
            return 'artifact-curriculum';
          }
          if (id.includes('artifacts/AuthenticatedTerminal')) {
            return 'artifact-terminal';
          }
          
          return undefined;
        },
        
        // Asset file naming
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name || 'asset';
          const info = name.split('.');
          const extType = info[info.length - 1] || '';
          
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/woff2?|ttf|otf|eot/i.test(extType)) {
            return `assets/fonts/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        
        // Chunk file naming
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },
    
    // Target modern browsers for better optimization
    target: 'esnext',
    
    // CSS code splitting
    cssCodeSplit: true,
  },
}));
