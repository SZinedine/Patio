import { defineConfig } from 'vite';
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
    plugins: [react()],
    build: {
        rollupOptions: {
            input: {
                newtab: resolve(__dirname, "newtab.html"),
                popup: resolve(__dirname, "src/popup/popup.html"),
                settings: resolve(__dirname, "src/settings/settings.html"),
            }
        },
        outDir: 'dist',
        emptyOutDir: true,
    },
    publicDir: 'src'
});
