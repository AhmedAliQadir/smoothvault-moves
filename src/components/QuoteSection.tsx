import { CheckIcon } from './icons'
import { QuoteForm } from './QuoteForm'

export function QuoteSection() {
  return (
    <section className="section section--tint" id="quote" aria-labelledby="quote-title">
      <div className="container quote">
        <div className="quote__intro" data-reveal>
          <p className="kicker">Free quote</p>
          <h2 className="section-title" id="quote-title">
            Get a price in under two minutes.
          </h2>
          <p className="section-lede">Answer a few quick questions and we’ll reply on WhatsApp with a clear, all-in price for your move.</p>
          <ul className="checklist checklist--ink">
            <li>
              <CheckIcon width={20} height={20} /> No obligation, no call-centre
            </li>
            <li>
              <CheckIcon width={20} height={20} /> Free cancellation 7+ days before, deposit returned
            </li>
            <li>
              <CheckIcon width={20} height={20} /> Free video or in-person survey
            </li>
          </ul>
        </div>
        <div className="quote__card" data-reveal>
          <QuoteForm />
        </div>
      </div>
    </section>
  )
}
