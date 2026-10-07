# Status and next steps

The website from the Claude artifact is now editable source in this repo and matches the original; the final version described in the launch playbook (new logo, legal and review pages, `config.js`) is still only in two zip files from the phone chat, and is the main thing to bring in next.

Last updated 7 October 2026.

## Where everything came from

| Source on claude.ai | Last edited | Now in this repo |
| --- | --- | --- |
| [Smoothvault Moves](https://claude.ai/artifact/7we3h6QqGXZC4oEcBegLtz) (website artifact) | 4 Oct 2026 | `src/`, rebuilt as React + TypeScript |
| [Smoothvault Moves — Launch Playbook](https://claude.ai/artifact/1ZoKmdehhJ6oe1rrRSQa2n) (doc) | 6 Oct 2026 | [launch-playbook.md](launch-playbook.md) |
| [Smoothvault Review Card](https://claude.ai/artifact/8VgKqgFYU6ZNPxaj43W9xo) (design) | 6 Oct 2026 | [review-card/index.html](review-card/index.html), logos and QR code in [brand/](brand) |
| `smoothvault-site.zip` and `smoothvault-launch-kit.zip` (downloads in the chat) | 6 Oct 2026 | Not here yet, see below |

The artifact was a single compiled HTML file (fonts, React, Three.js and the site code inlined, 1.2 MB). The source was reconstructed from it and checked:

- All 686 text strings in the original site code (copy, class names, SVG paths, colours, labels) appear word for word in `src/`, apart from 3 that belong to React and Three.js themselves.
- Every number in the 3D scene (positions, sizes, colours, timings, camera keyframes) matches the original.
- Screenshots of 22 matching desktop and phone views differ by at most 2.5% of pixels, all of it 3D animation timing.
- The quote wizard gives the same steps, error messages and WhatsApp message, byte for byte.
- Typecheck, lint and build pass, and `npm audit` reports no vulnerabilities.

## Still missing: the final version in the zips

The playbook describes a later static build that went beyond the artifact. None of these are in the repo yet:

- The "Vault S" logo in the header and footer (the logo files are in [brand/](brand); the site still shows the earlier mark)
- Footer legal line and links, and a privacy link on the quote form
- `/privacy/` (UK GDPR notice), `/terms/` (booking terms with the 14-day cancellation form), `/review/` (Google and Trustpilot buttons) and a branded `404.html`
- `config.js` switches: `companyNumber`, `registeredIn`, `registeredOffice`, `googleReviewUrl`, `trustpilotUrl`, `web3formsKey`, `cfAnalyticsToken`, `mobile3D`
- Page content pre-rendered into the HTML, page titles and descriptions, a social share image, business schema, sitemap and robots file
- Home-screen icons, `_headers` and `_redirects`
- From the launch kit: profile pictures (`profile-photo-1024.png`, `og-image.png`)

To bring them in: open yesterday's chat on your phone, download both zips, then attach them in this session or upload them to the repo (for example into a `reference/` folder). I can then port each change into this source, so there is one codebase rather than a separate hand-edited copy.

## Issues to fix or decide

| Issue | Effect | Suggested fix |
| --- | --- | --- |
| The review card QR code points to `smoothvaultmoves.co.uk/review/`, which this version doesn't have | Cards printed now would send customers to a missing page | Don't print until `/review/` is live (comes with the zips) |
| On the card front, `smoothvaultmoves.co.uk/review` needs 225 px but the column beside the QR code is 143 px, so it runs 42 px past the card's right edge | The address would be cut off when printed | Move "Or visit" and the address below the QR code, where there is 317 px; shrinking it to fit beside the code would take about 9.5 px type |
| No company number, registered office or legal pages | UK law requires company details on a limited company's website | Bring in the zip version, then fill in the details |
| The 3D hero always runs on phones | The playbook measured phone speed at 45/100 with 3D versus 91/100 without | Add the `mobile3D` switch from the final version; launch with it off |
| On phones, the hero hides its WhatsApp button | Only the sticky bottom bar offers WhatsApp there | Fine while the bar is visible; revisit with the switch above |
| Page text is rendered by JavaScript only | Search engines and link previews see little content | Pre-render the HTML at build time, as the final version did |
| `site.reviews` holds hand-entered reviews | Showing only hand-picked reviews breaks the guidance in the playbook (Step 5) | Replace with the Trustpilot widget once the profile exists |
| Two spellings: "Smoothvault Moves" in text, "Smooth Vault Moves" in the new logo | Inconsistent name across Google, Trustpilot and directories | Decide before creating the Google profile (playbook, first decision) |
| The FAQ intro lowercases the hours: "we reply during mon–fri, 9am–6pm." | Reads oddly | Show `site.hours` as written |
| Choosing Storage or House clearance and skipping "Moving to" leaves a blank line after "From" in the WhatsApp message | Cosmetic | Filter out empty lines before adding the section breaks |

These behave the same as in the original; nothing was changed except the list below.

## Small changes made during the rebuild

None of these change how the site looks:

- Shadows use `PCFShadowMap` directly. Three.js r186 removed `PCFSoftShadowMap` and was already falling back to it.
- The frosted-glass header and bars now include the unprefixed `backdrop-filter`, which the original build had dropped, so Firefox gets the blur too.
- The temporary scene used to light the 3D models is disposed after use.
- Added a meta description, theme colour, `lang="en-GB"` and a favicon made from the Vault S mark.
- `package.json` now lists Three.js and the Archivo and Inter fonts the site uses, and drops Tailwind, PostCSS and two font packages that nothing used.
- The footer year is worked out once when the page loads instead of on every render.

## Suggested order of work

1. Bring in the two zips, then merge the final version into this source (logo, legal pages, review page, settings, pre-rendering, headers).
2. Make the six launch decisions at the top of the [playbook](launch-playbook.md).
3. Fix the review card overflow, and print only once `/review/` is live.
4. Connect this repo to Cloudflare Pages (build `npm run build`, output `dist`) so every push deploys.
5. Work through the playbook: business email, Google Business Profile, Trustpilot, then the Trustpilot widget on the site.
