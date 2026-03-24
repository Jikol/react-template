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
      target: "es2022",
      rollupOptions: {
        input: {
          app: path.join(config.CONST.ROOT_PATH, "index.html")
        },
        output: {
          manualChunks: (id): string | null | undefined => {
            if (!id.includes("node_modules")) return null;

            // React
            if (id.includes("node_modules/react/")) return "react";
            if (id.includes("node_modules/react-dom/")) return "react";

            // Tanstack
            if (id.includes("tanstack")) return "tanstack";

            // Visuals
            if (id.includes("clsx")) return "visuals";
            if (id.includes("tailwind-merge")) return "visuals";
            if (id.includes("class-variance-authority")) return "visuals";
            if (id.includes("tinycolor")) return "visuals";
            if (id.includes("ldrs")) return "visuals";
            if (id.includes("lucide-react")) return "visuals";

            // Hooks
            if (id.includes("@uidotdev/usehooks")) return "hooks";
            if (id.includes("usehooks-ts")) return "hooks";
            if (id.includes("use-immer")) return "hooks";

            // Motions
            if (id.includes("embla-carousel")) return "motion";
            if (id.includes("wheel-gestures")) return "motion";

            // Utils
            if (id.includes("axios")) return "utils";
            if (id.includes("pino")) return "utils";
            if (id.includes("jotai")) return "utils";
            if (id.includes("immer")) return "utils";
            if (id.includes("jotai-immer")) return "utils";
            if (id.includes("zustand")) return "utils";
            if (id.includes("dayjs")) return "utils";
            if (id.includes("fast-deep-equal")) return "utils";
            if (id.includes("js-cookie")) return "utils";
            if (id.includes("uuid")) return "utils";

            // Big packages
            if (id.includes("zod")) return "zod";
          }
        }
      }
    },
    optimizeDeps: {
      esbuildOptions: {
        target: "es2022"
      }
    },
    define: {
      CONFIG: Object.fromEntries(codeEnvs.map((key) => [key, handledEnvs[key]]))
    }
  } satisfies UserConfig;
});
