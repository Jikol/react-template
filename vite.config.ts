import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig, loadEnv } from "vite";
import type { UserConfig } from "vite";

import config, { handleEnv } from "./config.ts";

export default defineConfig(({ mode }) => {
  const viteEnvs = loadEnv(mode, config.CONST.ROOT_PATH, config.CONST.ENV_PREFIX);
  // remove nodes only environment variables, keep code only environment variables
  /* eslint-disable */
  const {
    _WEBAPP_HTTP_PORT,
    _WEBAPP_HTTPS_PORT,
    _WEBAPP_SSL_CERT_PATH,
    _WEBAPP_SSL_KEY_PATH,
    ...handledViteEnvs
  } = handleEnv(viteEnvs);
  /* eslint-enable */

  return {
    plugins: [react(), tailwindcss()],
    assetsInclude: ["**/*.svg"],
    server: {
      host: true,
      port: config.ENVS._WEBAPP_HTTP_PORT,
      strictPort: true
    },
    preview: {
      host: true,
      port: config.ENVS._WEBAPP_HTTPS_PORT,
      strictPort: true,
      https: {
        cert: config.ENVS._WEBAPP_SSL_CERT_PATH,
        key: config.ENVS._WEBAPP_SSL_KEY_PATH
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
            if (id.includes("lodash")) return "lodash";
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
    envPrefix: config.CONST.ENV_PREFIX,
    define: {
      CONFIG: handledViteEnvs
    }
  } satisfies UserConfig;
});
