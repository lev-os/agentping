import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
        port: 7891,
        proxy: {
            '/api': {
                target: 'http://localhost:7890',
                changeOrigin: true,
            },
            '/ws': {
                target: 'ws://localhost:7890',
                ws: true,
            },
        },
    },
    build: {
        outDir: 'dist',
        sourcemap: true,
    },
});
