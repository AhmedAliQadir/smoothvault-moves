import { useState } from 'react'
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
        <Hero enable3D={webgl && !reducedMotion} />
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
