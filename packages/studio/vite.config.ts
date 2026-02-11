import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [
        react(),
        {
            name: 'spa-fallback',
            configureServer(server) {
                server.middlewares.use((req, res, next) => {
                    // Route retired navigator path to SPA dashboards route
                    if (req.url === '/navigator' || req.url?.startsWith('/navigator?')) {
                        req.url = '/';
                    }
                    next();
                });
            },
        },
    ],
    root: 'src/renderer',
    base: './',
    server: {
        port: 5180,
    },
    build: {
        outDir: '../../dist/renderer',
        emptyOutDir: true,
        sourcemap: true,
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, 'src/renderer/index.html'),
            },
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
});
