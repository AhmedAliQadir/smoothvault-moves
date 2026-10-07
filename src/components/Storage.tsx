import { whatsappLink } from '../lib/whatsapp'
import { CheckIcon, WhatsAppIcon } from './icons'

const BOLT_COUNT = 12

/** CSS-3D vault whose door swings open as it scrolls into view. */
function VaultArt() {
  const bolts = Array.from({ length: BOLT_COUNT }, (_, i) => i)
  return (
    <div className="vault3d" aria-hidden>
      <div className="vault3d__frame">
        <div className="vault3d__inside" />
        <div className="vault3d__door">
          <svg viewBox="0 0 200 200">
            <defs>
              <radialGradient id="vd-face" cx="40%" cy="35%" r="75%">
                <stop offset="0" stopColor="#EEF3F8" />
                <stop offset="0.6" stopColor="#CFD8E2" />
                <stop offset="1" stopColor="#9EAEC0" />
              </radialGradient>
            </defs>
            <circle cx="100" cy="100" r="96" fill="url(#vd-face)" stroke="#8A9BAE" strokeWidth="2" />
            <circle cx="100" cy="100" r="78" fill="none" stroke="#A9B8C8" strokeWidth="2" />
            {bolts.map((i) => {
              const angle = (i / BOLT_COUNT) * Math.PI * 2
              return <circle key={i} cx={100 + Math.cos(angle) * 87} cy={100 + Math.sin(angle) * 87} r="3.6" fill="#7F91A6" />
            })}
            <g className="vault3d__wheel">
              <circle cx="100" cy="100" r="34" fill="none" stroke="#0A1C2E" strokeWidth="7" />
              <path d="M100 58v84M58 100h84M70 70l60 60M130 70l-60 60" stroke="#0A1C2E" strokeWidth="5" strokeLinecap="round" />
              <circle cx="100" cy="100" r="11" fill="#1F6FB2" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  )
}

const storagePoints = [
  'Secure on-site storage, run by us',
  'Short gaps between completions or longer stays',
  'Collected and redelivered by the same crew',
]

export function Storage() {
  return (
    <section className="storage" id="storage" aria-labelledby="storage-title">
      <div className="container storage__grid">
        <div data-reveal>
          <p className="kicker kicker--on-navy">Secure storage</p>
          <h2 className="section-title storage__title" id="storage-title">
            Moved. Vaulted. Sorted.
          </h2>
          <p className="storage__lede">
            Completion dates don’t always line up. When there’s a gap, your things wait safely with us until the new place is ready.
          </p>
          <ul className="checklist">
            {storagePoints.map((point) => (
              <li key={point}>
                <CheckIcon width={20} height={20} /> {point}
              </li>
            ))}
          </ul>
          <a className="btn btn--cta" href={whatsappLink('Hi, I would like to ask about storage.')} target="_blank" rel="noopener">
            <WhatsAppIcon width={20} height={20} /> Ask about storage
          </a>
        </div>
        <div className="storage__art" data-reveal>
          <VaultArt />
        </div>
      </div>
    </section>
  )
}
