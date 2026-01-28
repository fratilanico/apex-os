import path from 'path';
import { defineConfig, type PluginOption, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

/**
 * Local API middleware plugin.
 * Intercepts /api/* requests and executes the corresponding
 * serverless handler (api/*.ts) via Vite's SSR module loader.
 * Mirrors Vercel's file-based routing for local development.
 */
function localApiMiddleware(): PluginOption {
  return {
    name: 'local-api-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) {
          return next();
        }

        // Load env variables for the current mode and ensure they are in process.env
        const env = loadEnv(server.config.mode, process.cwd(), '');
        Object.assign(process.env, env);
        
        if (req.url?.includes('terminal') || req.url?.includes('chat')) {
          console.log(`[API] ${req.url} | GEMINI_API_KEY: ${process.env.GEMINI_API_KEY ? 'FOUND' : 'MISSING'}`);
        }

        const endpoint = req.url.replace('/api/', '').split('?')[0];
        if (!endpoint) return next();

        try {
          // Parse request body for POST/PUT/PATCH
          let body: Record<string, unknown> = {};
          if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
            const rawBody = await new Promise<string>((resolve, reject) => {
              let data = '';
              req.on('data', (chunk: Buffer) => (data += chunk.toString()));
              req.on('end', () => resolve(data));
              req.on('error', reject);
            });
            if (rawBody) body = JSON.parse(rawBody);
          }

          // Mock Vercel request shape
          const mockReq = {
            method: req.method,
            body,
            headers: req.headers,
            query: Object.fromEntries(
              new URL(req.url!, `http://${req.headers.host}`).searchParams
            ),
            url: req.url,
          };

          // Mock Vercel response shape
          let statusCode = 200;
          const mockRes = {
            status(code: number) {
              statusCode = code;
              return mockRes;
            },
            json(data: unknown) {
              res.writeHead(statusCode, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify(data));
            },
            send(data: unknown) {
              res.writeHead(statusCode);
              res.end(typeof data === 'string' ? data : JSON.stringify(data));
            },
          };

          // Use Vite's SSR loader — handles TypeScript, env vars, imports
          const module = await server.ssrLoadModule(`./api/${endpoint}.ts`);
          await module.default(mockReq, mockRes);
        } catch (err: any) {
          console.error(`[API] /api/${endpoint}:`, err.message);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: err.message || 'Internal server error' }));
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => ({
  server: {
    port: 5173,
    host: '0.0.0.0',
  },
  
  plugins: [
    localApiMiddleware(),
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
