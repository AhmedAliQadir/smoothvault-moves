import type { ReactNode } from 'react'

export function SectionHead({ kicker, title, id, children }: { kicker: string; title: string; id: string; children?: ReactNode }) {
  return (
    <div className="section-head" data-reveal>
      <p className="kicker">{kicker}</p>
      <h2 className="section-title" id={id}>
        {title}
      </h2>
      {children && <p className="section-lede">{children}</p>}
    </div>
  )
}
