import { useState, useSyncExternalStore } from 'react'

function createMediaQueryStore(query: string) {
  return {
    subscribe(onChange: () => void) {
      const mql = window.matchMedia(query)
      mql.addEventListener('change', onChange)
      return () => mql.removeEventListener('change', onChange)
    },
    get: () => window.matchMedia(query).matches,
  }
}

export function useMediaQuery(query: string, serverFallback = false) {
  const [store] = useState(() => createMediaQueryStore(query))
  return useSyncExternalStore(store.subscribe, store.get, () => serverFallback)
}

export const usePrefersReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)')
