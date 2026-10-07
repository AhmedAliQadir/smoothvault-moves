import type { CSSProperties } from 'react'
import { trustPoints } from '../content'
import { ClockIcon, HeartIcon, ShieldCheckIcon, TagIcon } from './icons'

const trustIcons = [ShieldCheckIcon, ClockIcon, HeartIcon, TagIcon]

export function TrustStrip() {
  return (
    <section className="trust" aria-label="Why Smooth Vault">
      <ul className="trust__list container">
        {trustPoints.map((point, i) => {
          const Icon = trustIcons[i]
          return (
            <li key={point.title} className="trust__item" data-reveal style={{ '--d': `${i * 70}ms` } as CSSProperties}>
              <span className="trust__icon">
                <Icon />
              </span>
              <span>
                <strong>{point.title}</strong>
                <span className="trust__text">{point.text}</span>
              </span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
