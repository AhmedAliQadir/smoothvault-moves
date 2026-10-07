import { site } from '../config/site'
import { whatsappLink } from '../lib/whatsapp'
import { PhoneIcon, WhatsAppIcon } from './icons'

export function FinalCta() {
  return (
    <section className="final container" aria-labelledby="final-title">
      <div className="final__card" data-reveal>
        <h2 className="final__title" id="final-title">
          Ready when you are.
        </h2>
        <p>Tell us where, when and what — we’ll come back with a clear, all-in price.</p>
        <div className="final__ctas">
          <a className="btn btn--cta" href={whatsappLink('Hi Smooth Vault Moves, I would like a quote.')} target="_blank" rel="noopener">
            <WhatsAppIcon width={20} height={20} /> Message us on WhatsApp
          </a>
          <a className="btn btn--on-navy" href={`tel:${site.phoneE164}`}>
            <PhoneIcon width={20} height={20} /> Call {site.phoneDisplay}
          </a>
        </div>
      </div>
    </section>
  )
}
