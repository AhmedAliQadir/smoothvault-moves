import { site } from '../config/site'

/** A wa.me link to the business number, optionally with a pre-filled message. */
export const whatsappLink = (message?: string) =>
  `https://wa.me/${site.whatsapp}${message ? `?text=${encodeURIComponent(message)}` : ''}`
