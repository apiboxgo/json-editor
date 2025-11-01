import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@editor': path.resolve(__dirname, './src/editor'),
            '@i18n': path.resolve(__dirname, './src/i18n'),
            '@config': path.resolve(__dirname, './src/config'),
        },
    },
});
