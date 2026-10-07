import { site } from '../config/site'

export const MOVE_TYPES = ['Home removal', 'Office move', 'Man and van', 'Storage', 'House clearance', 'Specialist item']
export const PROPERTY_SIZES = ['Studio / 1 bed', '2 bed', '3 bed', '4+ bed', 'Small office', 'Large office']
export const EXTRAS = ['Packing service', 'Packing materials only', 'Furniture dismantle & assembly', 'Storage between homes']
export const SURVEY_TYPES = ['Video call', 'In person']

export interface QuoteData {
  type: string
  from: string
  to: string
  size: string
  date: string
  flexible: boolean
  surveyDate: string
  surveyType: string
  extras: string[]
  name: string
  phone: string
  email: string
  notes: string
}

export const EMPTY_QUOTE: QuoteData = {
  type: '',
  from: '',
  to: '',
  size: '',
  date: '',
  flexible: false,
  surveyDate: '',
  surveyType: 'Video call',
  extras: [],
  name: '',
  phone: '',
  email: '',
  notes: '',
}

export type StepId = 'type' | 'where' | 'size' | 'when' | 'extras' | 'contact' | 'review'

export const STEP_TITLES: Record<StepId, string> = {
  type: 'What are we moving?',
  where: 'Where from, where to?',
  size: 'How big is it?',
  when: 'When suits you?',
  extras: 'Any extras?',
  contact: 'How do we reach you?',
  review: 'Check and send',
}

/** Today's date as YYYY-MM-DD in local time, for date input `min` values. */
export const todayISO = () => {
  const d = new Date()
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 10)
}

export const formatDate = (iso: string) =>
  iso
    ? new Date(`${iso}T12:00:00`).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
    : ''

/** Storage and clearances don't need a destination. */
export const needsDestination = (type: string) => !['Storage', 'House clearance'].includes(type)

/** Man and van and single specialist items skip the property-size step. */
export const needsSize = (type: string) => !['Man and van', 'Specialist item'].includes(type)

/** The WhatsApp message (and email copy) built from the quote answers. */
export function buildQuoteMessage(q: QuoteData) {
  const moveDate = q.flexible ? `flexible${q.date ? ` (ideally ${formatDate(q.date)})` : ''}` : formatDate(q.date)
  return [
    `Hi ${site.name}, I'd like a quote.`,
    '',
    `• Move type: ${q.type}`,
    `• From: ${q.from}`,
    needsDestination(q.type) || q.to ? `• To: ${q.to}` : '',
    needsSize(q.type) && q.size ? `• Size: ${q.size}` : '',
    `• Move date: ${moveDate}`,
    q.surveyDate ? `• Survey: ${q.surveyType}, ${formatDate(q.surveyDate)}` : '',
    q.extras.length ? `• Extras: ${q.extras.join(', ')}` : '',
    q.notes ? `• Notes: ${q.notes}` : '',
    '',
    `${q.name} · ${q.phone}${q.email ? ` · ${q.email}` : ''}`,
  ]
    .filter((line, i, lines) => line !== '' || (i > 0 && lines[i - 1] !== ''))
    .join('\n')
}
