import { site } from '../config/site'
import { whatsappLink } from '../lib/whatsapp'
import { ArrowRightIcon, ShieldCheckIcon, WhatsAppIcon } from './icons'

/** Eyebrow, headline, lede and calls to action, shared by the 3D journey and the static hero. */
export function HeroCopy({ asHeading = true }: { asHeading?: boolean }) {
  const Title = asHeading ? 'h1' : 'p'
  return (
    <>
      <p className="eyebrow">
        <span className="eyebrow__dot" aria-hidden /> Removals &amp; secure storage · England, Scotland &amp; Wales
      </p>
      <Title className="hero__title">
        {site.slogan} <span className="hero__title-accent">{site.sloganTail}</span>
      </Title>
      <p className="hero__lede">
        Family-run, fully insured and often available same‑day. We pack, move, store and deliver — one crew, one route.
      </p>
      <div className="hero__ctas">
        <a
          className="btn btn--cta"
          href={whatsappLink('Hi Smoothvault Moves, I would like a quote for a move.')}
          target="_blank"
          rel="noopener"
        >
          <WhatsAppIcon width={20} height={20} /> Message us on WhatsApp
        </a>
        <a className="btn btn--ghost" href="#quote">
          Get a free quote <ArrowRightIcon width={18} height={18} />
        </a>
      </div>
      <p className="hero__trust">
        <ShieldCheckIcon width={18} height={18} /> Goods in transit &amp; public liability cover on every job
      </p>
    </>
  )
}
