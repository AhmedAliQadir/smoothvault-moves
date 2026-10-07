import { site } from '../config/site'
import { whatsappLink } from '../lib/whatsapp'
import { PhoneIcon, WhatsAppIcon } from './icons'

/** Sticky WhatsApp / call bar on phones (hidden from 900px). */
export function MobileBar() {
  return (
    <div className="mobile-bar" role="region" aria-label="Quick contact">
      <a className="btn btn--cta" href={whatsappLink('Hi Smooth Vault Moves, I would like a quote.')} target="_blank" rel="noopener">
        <WhatsAppIcon width={20} height={20} /> WhatsApp
      </a>
      <a className="btn btn--ghost" href={`tel:${site.phoneE164}`}>
        <PhoneIcon width={20} height={20} /> Call
      </a>
    </div>
  )
}
