// Writes a snapshot of the home page into dist/index.html, so search engines and link previews
// see the content without running JavaScript. React replaces it when the page loads.
import { readFile, writeFile } from 'node:fs/promises'
import { createServer } from 'vite'

const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' })
try {
  const { render } = await vite.ssrLoadModule('/src/entry-server.tsx')
  const file = new URL('../dist/index.html', import.meta.url)
  const html = await readFile(file, 'utf8')
  const placeholder = '<div id="root"></div>'
  if (!html.includes(placeholder)) throw new Error('dist/index.html has no empty #root to fill')
  await writeFile(file, html.replace(placeholder, `<div id="root">${render()}</div>`))
  console.log('Pre-rendered dist/index.html')
} finally {
  await vite.close()
}
