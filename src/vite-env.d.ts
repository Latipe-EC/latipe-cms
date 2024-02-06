/// <reference types="vite/client" />
interface ImportMetaEnv {
	readonly VITE_SEARCH: boolean
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}
