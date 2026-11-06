/// <reference types="vitest/config" />
import { execFileSync } from 'node:child_process'
import { basename } from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig, type Plugin } from 'vite'

/**
 * Dev only:
 * - regenerate sr-Latn.json whenever sr-Cyrl.json is saved, so Serbian edits
 *   show up live in both scripts (builds regenerate it via `prebuild`);
 * - keep the dev server alive on Windows file-lock errors (EBUSY/EPERM), which
 *   otherwise crash the watcher when tools create and delete files quickly.
 */
function devWatcher(): Plugin {
  const script = fileURLToPath(new URL('./scripts/gen-sr-latn.mjs', import.meta.url))
  return {
    name: 'trust-lab:dev-watcher',
    apply: 'serve',
    configureServer(server) {
      server.watcher.on('error', (err) => {
        server.config.logger.warn(`[watcher] ${(err as Error).message}`)
      })
      server.watcher.on('change', (file) => {
        if (basename(file) !== 'sr-Cyrl.json') return
        try {
          execFileSync(process.execPath, [script], { stdio: 'inherit' })
        } catch {
          // Invalid JSON while typing; the next save will retry.
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    // Precompiles locale JSON at build time: smaller bundle, no runtime
    // message compiler, and no `eval`, so it works under a strict CSP.
    VueI18nPlugin({
      include: fileURLToPath(new URL('./src/i18n/locales/**', import.meta.url)),
    }),
    devWatcher(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    // Open the browser on `npm run dev`; HMR pushes every save to it instantly.
    open: true,
  },
  test: {
    include: ['src/**/*.test.ts'],
  },
})
