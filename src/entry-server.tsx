import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App'

/** HTML snapshot of the home page, written into dist/index.html by scripts/prerender.mjs. */
export function render() {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
