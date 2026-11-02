import { resolve } from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import { bike, logoMark, logoSprite, partArt, roadSign, sceneArt, type SceneId } from './src/art'
import type { PartId } from './src/logo'

/** The landscapes, signs and the motorcycle are drawn into the HTML at build time,
 *  so every scene is visible before (and without) any script. */
function art(): Plugin {
  return {
    name: 'ride-art',
    transformIndexHtml(html) {
      return html
        .replace(/<!--sprite-->/g, () => logoSprite())
        .replace(/<!--art:(\w+)-->/g, (_, id: SceneId) => sceneArt(id))
        .replace(/<!--sign:([^|]+)\|([^>]+?)-->/g, (_, km: string, place: string) => roadSign(km, place))
        .replace(/<!--bike:([\w -]+)-->/g, (_, cls: string) => bike(cls))
        .replace(/<!--part:(\w+)-->/g, (_, id: PartId) => partArt(id))
        .replace(/<!--logo:([\w -]+)-->/g, (_, cls: string) => logoMark(cls))
    },
  }
}

// Served from the custom domain https://ninoredoble.is-a.dev/ at the root
export default defineConfig({
  base: '/',
  plugins: [art()],
  build: {
    target: 'es2022',
    assetsInlineLimit: 0,
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        summary: resolve(import.meta.dirname, 'summary/index.html'),
      },
    },
  },
})
