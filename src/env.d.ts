/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL backend Python FastAPI (contoh: http://localhost:3000) */
  readonly VITE_BACKEND_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
