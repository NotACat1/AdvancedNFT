/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PINATA_API_KEY: string;
  readonly VITE_PINATA_SECRET_API_KEY: string;
  readonly VITE_CONTRACT_ADRESS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
