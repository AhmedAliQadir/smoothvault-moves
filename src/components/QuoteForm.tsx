import { useId, useMemo, useRef, useState, type FormEvent } from 'react'
import { site } from '../config/site'
import {
  buildQuoteMessage,
  EMPTY_QUOTE,
  EXTRAS,
  MOVE_TYPES,
  needsDestination,
  needsSize,
  PROPERTY_SIZES,
  STEP_TITLES,
  SURVEY_TYPES,
  todayISO,
  type QuoteData,
  type StepId,
} from '../lib/quote'
import { whatsappLink } from '../lib/whatsapp'
import { AlertIcon, ArrowLeftIcon, ArrowRightIcon, CalendarIcon, CheckIcon, WhatsAppIcon } from './icons'

type Errors = Partial<Record<keyof QuoteData, string>>

/**
 * Step-by-step quote wizard. The final step opens WhatsApp with the answers as a ready-to-send
 * message; if a Web3Forms key is configured, a copy is emailed to the team as well.
 */
export function QuoteForm() {
  const [quote, setQuote] = useState<QuoteData>(EMPTY_QUOTE)
  const [stepIndex, setStepIndex] = useState(0)
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle')
  const [emailNote, setEmailNote] = useState('')
  const titleRef = useRef<HTMLHeadingElement>(null)
  const id = useId()

  const steps = useMemo(() => {
    const list: StepId[] = ['type', 'where']
    if (!quote.type || needsSize(quote.type)) list.push('size')
    list.push('when', 'extras', 'contact', 'review')
    return list
  }, [quote.type])
  const step = steps[Math.min(stepIndex, steps.length - 1)]

  const update = <K extends keyof QuoteData>(key: K, value: QuoteData[K]) => {
    setQuote((q) => ({ ...q, [key]: value }))
    setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const validate = (current: StepId) => {
    const next: Errors = {}
    const today = todayISO()
    if (current === 'type' && !quote.type) next.type = 'Choose the type of move.'
    if (current === 'where') {
      if (!quote.from.trim()) next.from = 'Add a town or postcode.'
      if (needsDestination(quote.type) && !quote.to.trim()) next.to = 'Add a town or postcode.'
    }
    if (current === 'size' && !quote.size) next.size = 'Choose the closest size.'
    if (current === 'when') {
      if (!quote.flexible && !quote.date) next.date = 'Pick a date, or tick “I’m flexible”.'
      if (quote.date && quote.date < today) next.date = 'That date has passed.'
      if (quote.surveyDate && quote.surveyDate < today) next.surveyDate = 'That date has passed.'
    }
    if (current === 'contact') {
      if (!quote.name.trim()) next.name = 'Tell us your name.'
      if (quote.phone.replace(/\D/g, '').length < 10) next.phone = 'Add a phone number we can reach you on.'
      if (quote.email && !/^\S+@\S+\.\S+$/.test(quote.email)) next.email = 'Check the email address.'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const go = (delta: number) => {
    if (delta === 1 && !validate(step)) return
    setStepIndex((i) => Math.max(0, Math.min(steps.length - 1, i + delta)))
    requestAnimationFrame(() => titleRef.current?.focus())
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (step !== 'review') go(1)
  }

  // The WhatsApp link itself opens the chat; this records the request and emails a copy if configured.
  const send = async () => {
    const message = buildQuoteMessage(quote)
    setStatus('sending')
    if (site.web3formsKey) {
      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            access_key: site.web3formsKey,
            subject: `Quote request — ${quote.type} — ${quote.name}`,
            from_name: quote.name,
            ...quote,
            extras: quote.extras.join(', '),
            message,
          }),
        })
        setEmailNote(response.ok ? 'A copy has also been emailed to the team.' : '')
      } catch {
        setEmailNote('')
      }
    }
    setStatus('done')
  }

  const errorFor = (key: keyof QuoteData) =>
    errors[key] ? (
      <p className="field__error" id={`${id}-${key}-err`}>
        <AlertIcon width={16} height={16} /> {errors[key]}
      </p>
    ) : null

  const ariaFor = (key: keyof QuoteData) => ({
    'aria-invalid': !!errors[key] || undefined,
    'aria-describedby': errors[key] ? `${id}-${key}-err` : undefined,
  })

  if (status === 'done') {
    return (
      <div className="quote__done" role="status">
        <span className="quote__done-icon">
          <CheckIcon width={28} height={28} />
        </span>
        <h3>Thanks, {quote.name.split(' ')[0]}. Your quote request is ready in WhatsApp.</h3>
        <p>
          Press send in WhatsApp and we’ll come back with a clear price. If WhatsApp didn’t open, use the button below or call{' '}
          {site.phoneDisplay}. {emailNote}
        </p>
        <div className="quote__done-ctas">
          <a className="btn btn--cta" href={whatsappLink(buildQuoteMessage(quote))} target="_blank" rel="noopener">
            <WhatsAppIcon width={20} height={20} /> Open WhatsApp again
          </a>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => {
              setQuote(EMPTY_QUOTE)
              setStepIndex(0)
              setStatus('idle')
            }}
          >
            Start a new quote
          </button>
        </div>
      </div>
    )
  }

  const today = todayISO()

  return (
    <form className="quote__form" onSubmit={onSubmit} noValidate>
      <div className="quote__progress" aria-hidden>
        <span style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }} />
      </div>
      <p className="quote__count">
        Step {stepIndex + 1} of {steps.length}
      </p>
      <h3 className="quote__step-title" tabIndex={-1} ref={titleRef}>
        {STEP_TITLES[step]}
      </h3>

      <div className="quote__step" key={step}>
        {step === 'type' && (
          <fieldset className="field">
            <legend className="sr-only">Type of move</legend>
            <div className="choices">
              {MOVE_TYPES.map((type) => (
                <label key={type} className={`choice${quote.type === type ? ' is-on' : ''}`}>
                  <input type="radio" name="type" value={type} checked={quote.type === type} onChange={() => update('type', type)} />
                  <span>{type}</span>
                </label>
              ))}
            </div>
            {errorFor('type')}
          </fieldset>
        )}

        {step === 'where' && (
          <div className="fields">
            <div className="field">
              <label htmlFor={`${id}-from`}>Moving from</label>
              <input
                id={`${id}-from`}
                autoComplete="address-level2"
                placeholder="Town or postcode"
                value={quote.from}
                onChange={(e) => update('from', e.target.value)}
                {...ariaFor('from')}
              />
              {errorFor('from')}
            </div>
            <div className="field">
              <label htmlFor={`${id}-to`}>
                Moving to {!needsDestination(quote.type) && <span className="optional">(optional)</span>}
              </label>
              <input
                id={`${id}-to`}
                placeholder="Town or postcode"
                value={quote.to}
                onChange={(e) => update('to', e.target.value)}
                {...ariaFor('to')}
              />
              {errorFor('to')}
            </div>
          </div>
        )}

        {step === 'size' && (
          <fieldset className="field">
            <legend className="sr-only">Property size</legend>
            <div className="choices choices--3">
              {PROPERTY_SIZES.map((size) => (
                <label key={size} className={`choice${quote.size === size ? ' is-on' : ''}`}>
                  <input type="radio" name="size" value={size} checked={quote.size === size} onChange={() => update('size', size)} />
                  <span>{size}</span>
                </label>
              ))}
            </div>
            {errorFor('size')}
          </fieldset>
        )}

        {step === 'when' && (
          <div className="fields">
            <div className="field">
              <label htmlFor={`${id}-date`}>Preferred move date</label>
              <div className="input-icon">
                <CalendarIcon width={18} height={18} />
                <input
                  id={`${id}-date`}
                  type="date"
                  min={today}
                  value={quote.date}
                  onChange={(e) => update('date', e.target.value)}
                  {...ariaFor('date')}
                />
              </div>
              {errorFor('date')}
              <label className="check">
                <input type="checkbox" checked={quote.flexible} onChange={(e) => update('flexible', e.target.checked)} />
                {' I’m flexible on the date'}
              </label>
            </div>
            <div className="field">
              <label htmlFor={`${id}-survey`}>
                Book a free survey <span className="optional">(optional)</span>
              </label>
              <div className="input-icon">
                <CalendarIcon width={18} height={18} />
                <input
                  id={`${id}-survey`}
                  type="date"
                  min={today}
                  value={quote.surveyDate}
                  onChange={(e) => update('surveyDate', e.target.value)}
                  {...ariaFor('surveyDate')}
                />
              </div>
              {errorFor('surveyDate')}
              <div className="segmented" role="radiogroup" aria-label="Survey type">
                {SURVEY_TYPES.map((type) => (
                  <label key={type} className={quote.surveyType === type ? 'is-on' : ''}>
                    <input
                      type="radio"
                      name="surveyType"
                      value={type}
                      checked={quote.surveyType === type}
                      onChange={() => update('surveyType', type)}
                    />
                    {type}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 'extras' && (
          <fieldset className="field">
            <legend className="sr-only">Extras</legend>
            <div className="choices">
              {EXTRAS.map((extra) => {
                const on = quote.extras.includes(extra)
                return (
                  <label key={extra} className={`choice choice--check${on ? ' is-on' : ''}`}>
                    <input
                      type="checkbox"
                      checked={on}
                      onChange={() => update('extras', on ? quote.extras.filter((x) => x !== extra) : [...quote.extras, extra])}
                    />
                    <span>{extra}</span>
                  </label>
                )
              })}
            </div>
            <p className="hint">Extras are quoted on top of the move. Not sure? Skip — we’ll ask.</p>
          </fieldset>
        )}

        {step === 'contact' && (
          <div className="fields">
            <div className="field">
              <label htmlFor={`${id}-name`}>Your name</label>
              <input
                id={`${id}-name`}
                autoComplete="name"
                value={quote.name}
                onChange={(e) => update('name', e.target.value)}
                {...ariaFor('name')}
              />
              {errorFor('name')}
            </div>
            <div className="field">
              <label htmlFor={`${id}-phone`}>Phone / WhatsApp</label>
              <input
                id={`${id}-phone`}
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                value={quote.phone}
                onChange={(e) => update('phone', e.target.value)}
                {...ariaFor('phone')}
              />
              {errorFor('phone')}
            </div>
            <div className="field field--wide">
              <label htmlFor={`${id}-email`}>
                Email <span className="optional">(optional)</span>
              </label>
              <input
                id={`${id}-email`}
                type="email"
                autoComplete="email"
                value={quote.email}
                onChange={(e) => update('email', e.target.value)}
                {...ariaFor('email')}
              />
              {errorFor('email')}
            </div>
            <div className="field field--wide">
              <label htmlFor={`${id}-notes`}>
                Anything we should know? <span className="optional">(optional)</span>
              </label>
              <textarea
                id={`${id}-notes`}
                rows={3}
                placeholder="Stairs, parking, a piano, fragile items…"
                value={quote.notes}
                onChange={(e) => update('notes', e.target.value)}
              />
            </div>
          </div>
        )}

        {step === 'review' && (
          <div className="review-box">
            <pre className="review-box__text">{buildQuoteMessage(quote)}</pre>
            <p className="hint">
              Sending opens WhatsApp with this message ready — just press send. How we use your details:{' '}
              <a href="/privacy/" target="_blank">
                privacy notice
              </a>
              .
            </p>
          </div>
        )}
      </div>

      <div className="quote__nav">
        {stepIndex > 0 ? (
          <button type="button" className="btn btn--ghost" onClick={() => go(-1)}>
            <ArrowLeftIcon width={18} height={18} /> Back
          </button>
        ) : (
          <span />
        )}
        {step === 'review' ? (
          <a className="btn btn--cta" href={whatsappLink(buildQuoteMessage(quote))} target="_blank" rel="noopener" onClick={() => void send()}>
            <WhatsAppIcon width={20} height={20} /> Send on WhatsApp
          </a>
        ) : (
          <button type="submit" className="btn btn--cta">
            Continue <ArrowRightIcon width={18} height={18} />
          </button>
        )}
      </div>
    </form>
  )
}
