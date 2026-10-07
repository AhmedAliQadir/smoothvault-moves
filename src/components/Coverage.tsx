import type { CSSProperties } from 'react'
import { site } from '../config/site'
import { cityPins, GB_OUTLINE, GB_VIEWBOX, labelSide } from '../content/gb-map'
import { SectionHead } from './SectionHead'
import { PinIcon } from './icons'

const routePath = cityPins.map((city, i) => `${i === 0 ? 'M' : 'L'}${city.x} ${city.y}`).join(' ')

export function Coverage() {
  return (
    <section className="section section--tint" id="coverage" aria-labelledby="coverage-title">
      <div className="container coverage">
        <div className="coverage__copy">
          <SectionHead kicker="Coverage" title="Local teams. Nationwide reach." id="coverage-title">
            We cover England, Scotland and Wales, with crews based in seven cities — so there’s usually a team near both ends of your move.
          </SectionHead>
          <ul className="cities" data-reveal>
            {site.cities.map((city) => (
              <li key={city}>
                <PinIcon width={18} height={18} /> {city}
              </li>
            ))}
          </ul>
        </div>
        <div className="coverage__map" data-reveal>
          <svg
            viewBox={GB_VIEWBOX}
            role="img"
            aria-label="Map of Great Britain showing Smooth Vault teams in Glasgow, Edinburgh, Manchester, Sheffield, Nottingham, Birmingham and London"
          >
            <path d={GB_OUTLINE} className="map__land" />
            <path d={routePath} className="map__route" pathLength={1} />
            {cityPins.map((city, i) => {
              const labelLeft = labelSide[city.name] === 'l'
              return (
                <g
                  key={city.name}
                  className="map__pin"
                  style={{ '--d': `${300 + i * 110}ms` } as CSSProperties}
                  transform={`translate(${city.x} ${city.y})`}
                >
                  <circle r="9" className="map__halo" />
                  <circle r="4.2" className="map__dot" />
                  <text x={labelLeft ? -10 : 10} y="4" textAnchor={labelLeft ? 'end' : 'start'} className="map__label">
                    {city.name}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>
      </div>
    </section>
  )
}
