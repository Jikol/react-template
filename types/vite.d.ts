/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly RETINA_WEBAPP_DEBUG: boolean;
  readonly RETINA_WEBAPP_VIEW: "retina" | "showcase";
  readonly RETINA_WEBAPP_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare const CONFIG: ImportMetaEnv;
