import { runtimeConfig } from '../config/runtime'
import { site } from '../config/site'
import { whatsappLink } from '../lib/whatsapp'
import { SectionHead } from './SectionHead'
import { ArrowRightIcon, StarIcon } from './icons'

export function Reviews() {
  const { reviews } = site
  return (
    <section className="section" id="reviews" aria-labelledby="reviews-title">
      <div className="container">
        <SectionHead kicker="Reviews" title="What our customers say." id="reviews-title" />
        {reviews.length > 0 ? (
          <ul className="reviews">
            {reviews.map((review) => (
              <li key={review.name + review.text.slice(0, 12)} className="review" data-reveal>
                <p className="review__stars" aria-label={`${review.rating} out of 5 stars`}>
                  {Array.from({ length: review.rating }, (_, i) => (
                    <StarIcon key={i} width={18} height={18} />
                  ))}
                </p>
                <blockquote>“{review.text}”</blockquote>
                <p className="review__by">
                  {review.name} · {review.area}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="reviews-empty" data-reveal>
            <span className="reviews-empty__stars" aria-hidden>
              {Array.from({ length: 5 }, (_, i) => (
                <StarIcon key={i} width={22} height={22} />
              ))}
            </span>
            <div>
              <h3>Moved with us recently?</h3>
              <p>We’re collecting our first verified reviews. Tell us how your move went — it helps other families choose with confidence.</p>
            </div>
            <a
              className="btn btn--ghost"
              href={runtimeConfig().reviewUrl || whatsappLink('Hi, I moved with Smoothvault recently and would like to leave a review.')}
              target="_blank"
              rel="noopener"
            >
              Share your experience <ArrowRightIcon width={18} height={18} />
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
