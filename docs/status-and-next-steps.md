# Status and next steps

The repo now holds everything from the Claude session: the website as editable source (the artifact's home page plus what the final `smoothvault-site.zip` added: Vault S logo, legal and review pages, `config.js` settings, SEO), the launch playbook, the review card and the launch kit. The website was checked against the originals. What's left is mostly decisions and setup from the launch playbook.

Last updated 7 October 2026.

## Where everything came from

| Source | Last edited | Now in this repo |
| --- | --- | --- |
| [Smoothvault Moves](https://claude.ai/artifact/7we3h6QqGXZC4oEcBegLtz) (website artifact) | 4 Oct 2026 | `src/`, rebuilt as React + TypeScript |
| `smoothvault-site.zip` (final build from the chat) | 6 Oct 2026 | Merged into `src/`, the static pages, `index.html` and `public/` |
| [Smoothvault Moves — Launch Playbook](https://claude.ai/artifact/1ZoKmdehhJ6oe1rrRSQa2n) (doc) | 6 Oct 2026 | [launch-playbook.md](launch-playbook.md) |
| [Smoothvault Review Card](https://claude.ai/artifact/8VgKqgFYU6ZNPxaj43W9xo) (design) | 6 Oct 2026 | [review-card/index.html](review-card/index.html), QR code in [brand/](brand) |
| `smoothvault-launch-kit.zip` | 6 Oct 2026 | Profile picture, high-res logos and QR code in [brand/](brand) (see its README); vector logos in `public/brand/`; review messages in the playbook, Step 5 |

## How it was checked

Against the artifact:
- all 686 text strings and every number in the 3D scene match
- screenshots match
- the quote form gives the same WhatsApp message

Against the final zip, after merging:
- The home page code differed from the artifact in exactly six places, all ported: the Vault S logo, the footer legal line, the privacy link on the quote form's last step, the review button pointing to `/review/`, and `mobile3D` and the Web3Forms key read from `config.js`.
- The CSS additions were ported as written.
- Screenshots of 22 home page views and all four static pages, on desktop and phone, match the zip. The static pages and the footer are pixel-identical; the rest differs only in 3D animation timing.
- With test values in `config.js`, the footer legal line, the privacy page details, the review page buttons, the home page review link and `mobile3D: false` on a phone behave the same as the zip.
- The quote form output is identical.
- The pre-rendered `index.html` contains the page text, as the zip's did.

Typecheck, lint and build pass, and `npm audit` reports no vulnerabilities.

## Issues to fix or decide

| Issue | Effect | Suggested fix |
| --- | --- | --- |
| `config.js` has no company number or registered office yet | The legal line shows only the Privacy and Booking terms links; UK law requires the company details | Fill in `companyNumber`, `registeredIn` and `registeredOffice` (playbook, Step 6) |
| `/review/` shows only a WhatsApp fallback until review links exist | Customers scanning the card can't leave a Google or Trustpilot review yet | Add `googleReviewUrl` and/or `trustpilotUrl` once the profiles exist |
| `site.reviews` holds hand-entered reviews | Showing only hand-picked reviews breaks the guidance in the playbook (Step 5) | Leave it empty; add the Trustpilot widget once the profile exists |
| Booking terms rest on assumptions (deposit size, when the balance is due, cancelling within 7 days) | Terms customers rely on may not match how the business works | Confirm them and have a solicitor check `/terms/` |
| The FAQ intro lowercases the hours: "we reply during mon–fri, 9am–6pm." | Reads oddly | Show `site.hours` as written |
| Choosing Storage or House clearance and skipping "Moving to" leaves a blank line after "From" in the WhatsApp message | Cosmetic | Filter out empty lines before adding the section breaks |

The last two behave the same in the original; they were kept so the rebuild matches it exactly.

## Differences from the zip build

These don't change what visitors see:
- The source is one Vite project rather than prebuilt files, so asset file names (hashes) differ, and `svm.js` lives at `/svm.js` with an hour's cache.
- The logo is a React component instead of an injected SVG string.
- Shadows use `PCFShadowMap` directly. Three.js r186 removed `PCFSoftShadowMap` and was already falling back.
- The frosted header and bars include the unprefixed `backdrop-filter`, so Firefox gets the blur too.

## Name

The business name is "Smooth Vault Moves", matching the logo (decided 7 October 2026). Every "Smoothvault" in the site text, page titles, Google business details, legal pages, WhatsApp messages, the 3D van's livery and the playbook now reads "Smooth Vault"; the original Claude session used "Smoothvault" in text, so those strings now differ from it on purpose. The web address and email stay `smoothvaultmoves.co.uk`. The site's legal name is now "Smooth Vault Moves Ltd": check it matches the Companies House record exactly.

## Changes from the review card design

On the front, "Or visit" and the address now sit below the QR code instead of beside it. Beside it, the address (225 px) was wider than its 143 px column and ran 42 px past the card's edge.

## Suggested order of work

1. Make the remaining launch decisions at the top of the [playbook](launch-playbook.md), then fill in `public/config.js`.
2. Connect this repo to Cloudflare Pages (build `npm run build`, output `dist`) so every push deploys.
3. Print the review cards once `/review/` has its review links.
4. Work through the playbook: business email, Google Business Profile, Trustpilot, then the Trustpilot widget on the site.
