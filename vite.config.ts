import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig, loadEnv } from "vite";
import type { UserConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

import config, { handleEnv } from "./config.ts";

export default defineConfig(({ mode }) => {
  const viteEnvs = loadEnv(mode, config.CONST.ROOT_PATH);
  const handledEnvs = handleEnv(viteEnvs);

  const codeEnvs = ["VITE_DEBUG"] as const satisfies ReadonlyArray<
    keyof typeof handledEnvs
  >;

  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: "autoUpdate",
        manifest: {
          name: config.ENVS.VITE_NAME,
          short_name: config.ENVS.VITE_NAME,
          description: config.ENVS.VITE_DESCRIPTION,
          theme_color: "#ffffff",
          background_color: "#ffffff",
          display: "standalone",
          icons: [
            {
              src: "pwa-64x64.png",
              sizes: "64x64",
              type: "image/png"
            },
            {
              src: "pwa-192x192.png",
              sizes: "192x192",
              type: "image/png"
            },
            {
              src: "pwa-512x512.png",
              sizes: "512x512",
              type: "image/png"
            },
            {
              src: "maskable-icon-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable"
            }
          ]
        }
      })
    ],
    assetsInclude: ["**/*.svg"],
    server: {
      host: true,
      port: config.ENVS.VITE_DEV_PORT,
      strictPort: true
    },
    preview: {
      host: true,
      port: config.ENVS.VITE_PREVIEW_PORT,
      strictPort: true,
      https: {
        cert: config.ENVS.VITE_SSL_CERT_PATH,
        key: config.ENVS.VITE_SSL_KEY_PATH
      }
    },
    resolve: {
      alias: {
        "@": path.join(config.CONST.ROOT_PATH, "src"),
        "@theme": path.join(config.CONST.ROOT_PATH, "src", "theme")
      }
    },
    build: {
      outDir: path.join(config.CONST.ROOT_PATH, "dist"),
      assetsInlineLimit: (filePath): boolean => !filePath.includes("sprite.svg"),
      sourcemap: true,
      target: "esnext",
      rollupOptions: {
        output: {
          manualChunks: (id): string | null => {
            if (!id.includes("node_modules")) return null;
            if (id.includes("react")) return "react";
            if (id.includes("moment")) return "moment";
            if (id.includes("core-js")) return "core-js";
            if (id.includes("tailwindcss")) return "tailwindcss";

            return null;
          }
        }
      }
    },
    optimizeDeps: {
      esbuildOptions: {
        target: "esnext"
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern-compiler"
        }
      }
    },
    define: {
      CONFIG: Object.fromEntries(codeEnvs.map((key) => [key, handledEnvs[key]]))
    }
  } satisfies UserConfig;
});
