import { defineConfig } from '@playwright/test';
export default defineConfig({ testDir:'./tests',fullyParallel:false,workers:1, use:{baseURL:'http://127.0.0.1:4173/Unclutter-Showcase/',browserName:'chromium'},webServer:{command:'npm run preview',url:'http://127.0.0.1:4173/Unclutter-Showcase/',reuseExistingServer:false},reporter:'list' });
