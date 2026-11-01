// One-off: renders public/favicon.svg to public/apple-touch-icon.png (180x180).
// Run with `npm run icons` after changing the favicon. Not part of the app bundle.
import { readFile, writeFile } from 'node:fs/promises'
import { Resvg } from '@resvg/resvg-js'

const SIZE = 180
const svg = await readFile(new URL('../public/favicon.svg', import.meta.url))

// iOS shows transparent corners as black anyway; make it explicit.
const png = new Resvg(svg, {
  fitTo: { mode: 'width', value: SIZE },
  background: '#000000',
}).render().asPng()

await writeFile(new URL('../public/apple-touch-icon.png', import.meta.url), png)
console.log(`Wrote public/apple-touch-icon.png (${SIZE}x${SIZE})`)
