export interface Review {
  name: string
  area: string
  rating: number
  text: string
}

/** Business details used across the site. Change them here, not in components. */
export const site = {
  name: 'Smoothvault Moves',
  legalName: 'Smoothvault Moves Ltd',
  domain: 'smoothvaultmoves.co.uk',
  slogan: 'Moving made easy.',
  sloganTail: 'From door to door.',
  tagline: 'Moved. Vaulted. Sorted.',
  phoneDisplay: '07824 101373',
  phoneE164: '+447824101373',
  /** WhatsApp number in international format, no plus sign (used in wa.me links). */
  whatsapp: '447824101373',
  email: 'hello@smoothvaultmoves.co.uk',
  hours: 'Mon–Fri, 9am–6pm',
  /** Optional Web3Forms access key. When set, each quote request is also emailed to the team. */
  web3formsKey: '',
  cities: ['Birmingham', 'Nottingham', 'Sheffield', 'Manchester', 'London', 'Glasgow', 'Edinburgh'],
  nations: ['England', 'Scotland', 'Wales'],
  /** Verified customer reviews. While empty, the reviews section asks customers to share theirs. */
  reviews: [] as Review[],
}
