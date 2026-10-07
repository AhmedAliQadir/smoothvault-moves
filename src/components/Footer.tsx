import { site } from '../config/site'
import { whatsappLink } from '../lib/whatsapp'
import { ClockIcon, MailIcon, PhoneIcon, WhatsAppIcon } from './icons'
import { Logo } from './Logo'

const year = new Date().getFullYear()
const nationsList = site.nations.join(', ').replace(/, ([^,]*)$/, ' and $1')

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div>
          <span className="footer__logo">
            <Logo />
          </span>
          <p className="footer__slogan">
            {site.slogan} {site.sloganTail}
          </p>
        </div>
        <div>
          <h2 className="footer__h">Contact</h2>
          <ul className="footer__list">
            <li>
              <a href={whatsappLink()} target="_blank" rel="noopener">
                <WhatsAppIcon width={18} height={18} /> WhatsApp
              </a>
            </li>
            <li>
              <a href={`tel:${site.phoneE164}`}>
                <PhoneIcon width={18} height={18} /> {site.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`}>
                <MailIcon width={18} height={18} /> {site.email}
              </a>
            </li>
            <li>
              <ClockIcon width={18} height={18} /> {site.hours}
            </li>
          </ul>
        </div>
        <div>
          <h2 className="footer__h">Teams in</h2>
          <p className="footer__cities">{site.cities.join(' · ')}</p>
          <p className="footer__small">Covering {nationsList}.</p>
        </div>
      </div>
      <div className="container footer__base">
        <p>
          © {year} {site.legalName}. Fully insured: goods in transit and public liability.
        </p>
      </div>
    </footer>
  )
}
