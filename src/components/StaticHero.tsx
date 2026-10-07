import { steps } from '../content'
import { HeroCopy } from './HeroCopy'
import { HeroIllustration } from './HeroIllustration'

/** Lightweight hero used when WebGL is unavailable or the visitor prefers reduced motion. */
export function StaticHero() {
  return (
    <>
      <section className="hero-static" aria-labelledby="hero-title">
        <div className="container hero-static__grid">
          <div className="hero-static__copy" id="hero-title">
            <HeroCopy />
          </div>
          <HeroIllustration className="hero-static__art" />
        </div>
      </section>
      <section className="steps-static container" aria-label="How a move works">
        <ol className="steps-static__list">
          {steps.map((step) => (
            <li key={step.kicker} className="steps-static__item">
              <p className="kicker">{step.kicker}</p>
              <h2 className="steps-static__title">{step.title}</h2>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </section>
    </>
  )
}
