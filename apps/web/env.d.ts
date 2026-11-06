/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Optional backend URL. When empty, the app runs fully client-side. */
  readonly VITE_API_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
