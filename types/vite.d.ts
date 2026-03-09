/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly _WEBAPP_DEBUG: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare const CONFIG: ImportMetaEnv;
