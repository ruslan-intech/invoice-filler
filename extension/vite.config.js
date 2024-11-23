import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import webExtension from 'vite-plugin-web-extension';
import { resolve } from 'path';

export default defineConfig({
    plugins: [
        react(),
        webExtension({
            manifest: {
                manifest_version: 3,
                name: 'Invoice Filler',
                version: '1.0.0',
                description: 'Clockify data extraction and invoice filling',
                permissions: [
                    'storage',
                    'activeTab'
                ],
                host_permissions: [
                    "http://localhost:3000/*",
                    "https://api.clockify.me/api/*"
                ],
                action: {
                    default_popup: 'src/popup.html',
                    default_icon: {
                        "16": "icons/icon16.png",
                        "32": "icons/icon32.png",
                        "48": "icons/icon48.png",
                        "128": "icons/icon128.png"
                    }
                },
                icons: {
                    "16": "icons/icon16.png",
                    "32": "icons/icon32.png",
                    "48": "icons/icon48.png",
                    "128": "icons/icon128.png"
                }
            }
        })
    ],
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: {
                popup: resolve(__dirname, 'src/popup.html'),
                background: resolve(__dirname, 'src/background.js')
            }
        }
    },
    publicDir: 'public'
});