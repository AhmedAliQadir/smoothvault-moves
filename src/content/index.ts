export type ServiceIcon = 'home' | 'office' | 'box' | 'vault' | 'van' | 'route' | 'clear' | 'star'

export const services: { id: string; title: string; text: string; icon: ServiceIcon }[] = [
  { id: 'home', title: 'Home removals', text: 'Flats to family homes, packed, loaded and placed room by room.', icon: 'home' },
  { id: 'office', title: 'Office moves', text: 'Planned around your hours so the team is back at work fast.', icon: 'office' },
  { id: 'packing', title: 'Packing service', text: 'Materials supplied and fragile items wrapped properly.', icon: 'box' },
  { id: 'storage', title: 'Secure storage', text: 'Our own secure on-site storage, short or long term.', icon: 'vault' },
  { id: 'van', title: 'Man and van', text: 'One van, one crew, for smaller loads and single items.', icon: 'van' },
  { id: 'long', title: 'Long-distance moves', text: 'Across England, Scotland and Wales in one run.', icon: 'route' },
  { id: 'clearance', title: 'House clearance', text: 'Cleared, swept and left ready for the next chapter.', icon: 'clear' },
  { id: 'specialist', title: 'Specialist items', text: 'Pianos, antiques, artwork and anything awkward.', icon: 'star' },
]

export const trustPoints = [
  { title: 'Fully insured', text: 'Goods in transit and public liability cover.' },
  { title: 'Same-day availability', text: 'Short-notice moves when you need them.' },
  { title: 'Family-run', text: 'A personal service, not a call centre.' },
  { title: 'Competitive prices', text: 'Every job quoted for what it actually needs.' },
]

/** The four chapters of the scroll journey (and the static fallback's step cards). */
export const steps = [
  { kicker: '01 — Pack', title: 'We pack it like it matters.', text: 'Materials supplied, fragile items wrapped, everything labelled by room.' },
  { kicker: '02 — Move', title: 'One crew, one route.', text: 'Loaded carefully and driven direct — across England, Scotland and Wales.' },
  { kicker: '03 — Store', title: 'Need a gap? We vault it.', text: 'Secure on-site storage for a week or a year, on the way or at the end.' },
  { kicker: '04 — Delivered', title: 'Placed, not dropped.', text: 'Furniture assembled and boxes set down in the right rooms.' },
]

export const faqs = [
  {
    q: 'How much will my move cost?',
    a: 'Every move is quoted individually based on what you are moving, how far, access at both ends and any extras. Send us the details and we will come back with a clear price.',
  },
  {
    q: 'Do you provide packing and materials?',
    a: 'Yes. We can supply boxes, tape and wrapping, or pack everything for you, including fragile and high-value items.',
  },
  {
    q: 'Will you take apart and rebuild furniture?',
    a: 'Yes. Our crews dismantle beds, wardrobes and tables before the move and reassemble them at the new property.',
  },
  {
    q: 'What if I need to cancel?',
    a: 'Cancel 7 or more days before your move and it is free, with your deposit returned. Any extras you add are billed on top of the quoted price.',
  },
  {
    q: 'Are my belongings insured?',
    a: 'Yes. We carry goods in transit insurance and public liability cover on every job.',
  },
  {
    q: 'Where do you cover?',
    a: 'England, Scotland and Wales, with teams based in Birmingham, Nottingham, Sheffield, Manchester, London, Glasgow and Edinburgh.',
  },
  {
    q: 'Can you store my things between homes?',
    a: 'Yes. We have secure on-site storage for short gaps between completions or longer stays.',
  },
  {
    q: 'How soon can you move me?',
    a: 'We often have same-day or next-day availability. Message us on WhatsApp with your date and we will confirm quickly.',
  },
]
