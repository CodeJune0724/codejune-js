import { defineConfig } from "vite";

export default defineConfig({
    mode: "production",
    resolve: {
        extensions: [".ts"]
    },
    build: {
        outDir: "./dist",
        target: "esnext",
        lib: {
            entry: "./src/zj0724-common.ts",
            name: "zj0724-common",
            fileName: (format: string) => `zj0724-common.${format}.js`
        },
        rollupOptions: {
            output: {
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name) {
                        if (/\.css$/i.test(assetInfo.name)) {
                            return "index.css";
                        }
                    }
                    return "[name].[ext]";
                }
            }
        }
    }
});