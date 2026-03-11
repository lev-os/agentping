import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [react(), tailwindcss()],
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
