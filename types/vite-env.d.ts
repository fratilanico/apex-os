/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PREVIEW_USER: string;
  readonly VITE_PREVIEW_PASS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
