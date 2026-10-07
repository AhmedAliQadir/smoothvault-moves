import { useState } from 'react'
import { runtimeConfig } from './config/runtime'
import { Coverage } from './components/Coverage'
import { Faq } from './components/Faq'
import { FinalCta } from './components/FinalCta'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { MobileBar } from './components/MobileBar'
import { QuoteSection } from './components/QuoteSection'
import { Reviews } from './components/Reviews'
import { Services } from './components/Services'
import { Storage } from './components/Storage'
import { TrustStrip } from './components/TrustStrip'
import { usePrefersReducedMotion } from './hooks/useMediaQuery'
import { useRevealOnScroll } from './hooks/useRevealOnScroll'
import { supportsWebGL } from './lib/webgl'

/**
 * The 3D journey needs WebGL and motion, and on screens under 900px it can be switched off with
 * `mobile3D: false` in public/config.js. The build-time snapshot (scripts/prerender.mjs) always uses
 * the 3D layout; the browser renders the real choice when the page loads.
 */
function show3D(webgl: boolean, reducedMotion: boolean) {
  if (typeof window === 'undefined') return true
  return webgl && !reducedMotion && (runtimeConfig().mobile3D !== false || window.matchMedia('(min-width: 900px)').matches)
}

export default function App() {
  const reducedMotion = usePrefersReducedMotion()
  const [webgl] = useState(supportsWebGL)
  useRevealOnScroll()

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <span id="top" />
        <Hero enable3D={show3D(webgl, reducedMotion)} />
        <TrustStrip />
        <Services />
        <Storage />
        <Coverage />
        <QuoteSection />
        <Reviews />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <MobileBar />
    </>
  )
}
