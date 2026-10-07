/*
  Smoothvault Moves — website settings
  ------------------------------------
  Edit the values between the quotes, save, then redeploy the site.
  Leave a value as "" if you don't have it yet — the site hides anything that's empty.
*/
window.SVM_CONFIG = {
  // Company details. UK law requires a limited company's website to show these.
  companyNumber: "",        // from Companies House, e.g. "SC812345" or "16012345"
  registeredIn: "",         // "Scotland" or "England and Wales"
  registeredOffice: "",     // registered office address (an accountant or virtual-office address is fine)

  // Review links. Paste these once the profiles exist; the /review/ page and the
  // "Share your experience" button switch over automatically.
  googleReviewUrl: "",      // Google Business Profile -> "Ask for reviews" -> copy link
  trustpilotUrl: "",        // Trustpilot Business -> Get reviews -> your review link

  // Optional: emails you a copy of every quote request (free key from web3forms.com).
  web3formsKey: "",

  // Optional: cookieless visitor stats (Cloudflare Web Analytics site token).
  cfAnalyticsToken: "",

  // 3D hero animation on phones. Set to false to show the lighter illustrated
  // hero on small screens instead (faster pages on older phones).
  mobile3D: false
};
