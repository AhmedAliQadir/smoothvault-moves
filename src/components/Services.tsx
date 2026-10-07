import { useRef, type CSSProperties, type ReactNode } from 'react'
import { services, type ServiceIcon } from '../content'
import { SectionHead } from './SectionHead'
import { BoxIcon, ClearIcon, HomeIcon, OfficeIcon, RouteIcon, StarIcon, VanIcon, VaultIcon } from './icons'

const serviceIcons: Record<ServiceIcon, typeof HomeIcon> = {
  home: HomeIcon,
  office: OfficeIcon,
  box: BoxIcon,
  vault: VaultIcon,
  van: VanIcon,
  route: RouteIcon,
  clear: ClearIcon,
  star: StarIcon,
}

/** A card that tilts towards the mouse (fine pointers only, and not with reduced motion). */
function ServiceCard({ index, children }: { index: number; children: ReactNode }) {
  const ref = useRef<HTMLLIElement>(null)
  const canTilt = useRef<boolean | null>(null)

  return (
    <li
      ref={ref}
      className="service"
      data-reveal
      style={{ '--d': `${(index % 4) * 70}ms` } as CSSProperties}
      onPointerMove={(e) => {
        canTilt.current ??=
          window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
          !window.matchMedia('(prefers-reduced-motion: reduce)').matches
        if (!canTilt.current || !ref.current) return
        const rect = ref.current.getBoundingClientRect()
        const x = (e.clientX - rect.left) / rect.width - 0.5
        const y = (e.clientY - rect.top) / rect.height - 0.5
        ref.current.style.setProperty('--ry', `${(x * 12).toFixed(2)}deg`)
        ref.current.style.setProperty('--rx', `${(-y * 10).toFixed(2)}deg`)
        ref.current.style.setProperty('--gx', `${((x + 0.5) * 100).toFixed(1)}%`)
        ref.current.style.setProperty('--gy', `${((y + 0.5) * 100).toFixed(1)}%`)
      }}
      onPointerLeave={() => {
        ref.current?.style.setProperty('--rx', '0deg')
        ref.current?.style.setProperty('--ry', '0deg')
      }}
    >
      <div className="service__inner">{children}</div>
    </li>
  )
}

export function Services() {
  return (
    <section className="section" id="services" aria-labelledby="services-title">
      <div className="container">
        <SectionHead kicker="Services" title="Everything a move needs, from one crew." id="services-title">
          Every job is quoted for what it actually involves — no surprise extras, no call-centre runaround.
        </SectionHead>
        <ul className="services">
          {services.map((service, i) => {
            const Icon = serviceIcons[service.icon]
            return (
              <ServiceCard key={service.id} index={i}>
                <span className="service__icon">
                  <Icon />
                </span>
                <h3 className="service__title">{service.title}</h3>
                <p className="service__text">{service.text}</p>
              </ServiceCard>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
