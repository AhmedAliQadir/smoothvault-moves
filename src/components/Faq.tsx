import { site } from '../config/site'
import { faqs } from '../content'
import { SectionHead } from './SectionHead'

export function Faq() {
  return (
    <section className="section" id="faq" aria-labelledby="faq-title">
      <div className="container faq">
        <SectionHead kicker="FAQ" title="Good questions, straight answers." id="faq-title">
          Can’t see yours? Message us on WhatsApp — we reply during {site.hours.toLowerCase()}.
        </SectionHead>
        <div className="faq__list" data-reveal>
          {faqs.map((faq) => (
            <details key={faq.q} className="faq__item">
              <summary>
                <span>{faq.q}</span>
                <span className="faq__icon" aria-hidden />
              </summary>
              <div className="faq__answer">
                <p>{faq.a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
