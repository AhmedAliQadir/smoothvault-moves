/**
 * Settings from public/config.js, which is loaded before the app and can be edited after a build
 * (see the comments in that file). Everything here is optional; empty values hide the related UI.
 */
export interface RuntimeConfig {
  companyNumber?: string
  registeredIn?: string
  registeredOffice?: string
  googleReviewUrl?: string
  trustpilotUrl?: string
  web3formsKey?: string
  cfAnalyticsToken?: string
  /** false shows the illustrated hero instead of the 3D one on screens under 900px. */
  mobile3D?: boolean
  /** Set by public/svm.js to /review/ once a Google or Trustpilot link exists. */
  reviewUrl?: string
}

declare global {
  interface Window {
    SVM_CONFIG?: RuntimeConfig
    /** Company disclosure line and legal links, built by public/svm.js. */
    svmLegalHTML?: () => string
  }
}

/** Safe to call while pre-rendering, where there is no window. */
export const runtimeConfig = (): RuntimeConfig => (typeof window === 'undefined' ? {} : (window.SVM_CONFIG ?? {}))

const DEFAULT_LEGAL_HTML = '<a href="/privacy/">Privacy</a> · <a href="/terms/">Booking terms</a>'

/** Footer legal line; falls back to just the links while pre-rendering. */
export const legalHTML = () =>
  typeof window !== 'undefined' && window.svmLegalHTML ? window.svmLegalHTML() : DEFAULT_LEGAL_HTML
