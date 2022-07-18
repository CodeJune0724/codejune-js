import { defineConfig } from "vite";

export default defineConfig({
    mode: "production",
    resolve: {
        extensions: [".ts"]
    },
    build: {
        outDir: "./dist",
        target: "ESNext",
        lib: {
            entry: "./src/codejune.ts",
            name: "codejune",
            fileName: (format: string) => `codejune.${format}.js`
        },
        rollupOptions: {
            output: {
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name) {
                        if (/\.css$/i.test(assetInfo.name)) {
                            return "css/index.css";
                        }
                    }
                    return "[name].[ext]";
                }
            }
        }
    }
});