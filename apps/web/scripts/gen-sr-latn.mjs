// Generates src/i18n/locales/sr-Latn.json from sr-Cyrl.json.
// Runs automatically before dev/build/test; never edit sr-Latn.json by hand.
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { toLatinMessages } from './sr-transliterate.mjs'

const dir = fileURLToPath(new URL('../src/i18n/locales/', import.meta.url))
const cyrl = JSON.parse(readFileSync(`${dir}sr-Cyrl.json`, 'utf8'))
const next = JSON.stringify(toLatinMessages(cyrl), null, 2) + '\n'

let current = ''
try {
  current = readFileSync(`${dir}sr-Latn.json`, 'utf8')
} catch {
  // first run
}

if (process.argv.includes('--check')) {
  if (current !== next) {
    console.error('sr-Latn.json is out of date. Run: npm run i18n:gen -w @trust-lab/web')
    process.exit(1)
  }
} else if (current !== next) {
  writeFileSync(`${dir}sr-Latn.json`, next)
  console.log('sr-Latn.json regenerated')
}
