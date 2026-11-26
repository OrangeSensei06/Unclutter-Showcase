import { defineConfig } from 'vite';
export default defineConfig({ base: '/Unclutter-Showcase/', build: { sourcemap: false, modulePreload: { polyfill: false }, rollupOptions: { input: ['index.html','try/index.html','architecture/index.html'] } } });
