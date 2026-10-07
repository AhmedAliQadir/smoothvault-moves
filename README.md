# Smooth Vault Moves

Website for Smooth Vault Moves, a family-run removals and secure storage company covering England, Scotland and Wales. React + TypeScript, built with Vite, with a scroll-driven Three.js hero in which a branded van loads boxes, stops at a storage vault and delivers to a new home.

Pages: the home page, `/privacy/`, `/terms/`, `/review/` (where the review-card QR code points) and a `404.html`.

This source was rebuilt from the website made in Claude (the 4 October artifact and the final `smoothvault-site.zip` from 6 October) and checked against both. See [docs/status-and-next-steps.md](docs/status-and-next-steps.md).

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck, production build into dist/, then pre-render the home page
npm run preview  # serve the production build
npm run lint
```

## Settings you can change without rebuilding: `public/config.js`

`config.js` is copied into the build as-is, so it can be edited in the deployed site and re-uploaded. Anything left as `""` stays hidden.

| Setting | What it does |
| --- | --- |
| `companyNumber`, `registeredIn`, `registeredOffice` | Company details in the footer and on the privacy and terms pages (a UK legal requirement) |
| `googleReviewUrl`, `trustpilotUrl` | Buttons on `/review/`; once either is set, the home page's "Share your experience" goes to `/review/` |
| `web3formsKey` | Emails the team a copy of each quote request ([Web3Forms](https://web3forms.com)) |
| `cfAnalyticsToken` | Cookieless Cloudflare Web Analytics |
| `mobile3D` | `false` shows the lighter illustrated hero on screens under 900px |

`public/svm.js` applies these settings on every page (footer legal line, review buttons, analytics, the static pages' menu).

## Editing content

| What | Where |
| --- | --- |
| Business details: name, phone, WhatsApp number, email, hours, cities | `src/config/site.ts` |
| Services, trust points, the four journey steps, FAQs | `src/content/index.ts` |
| Quote form options, step titles and the WhatsApp message format | `src/lib/quote.ts` |
| Coverage map outline and city pins | `src/content/gb-map.ts` |
| Colours, fonts, spacing and all styles | `src/styles/global.css` (tokens at the top) |
| 3D scene: models, animation timings, camera moves | `src/three/diorama.ts` |
| Privacy, terms, review and 404 pages | `privacy/index.html`, `terms/index.html`, `review/index.html`, `404.html` (plain HTML) |
| Page titles, descriptions, social preview and business schema for Google | `<head>` of each HTML page |
| Icons, logos, social image, sitemap, robots, security headers, redirects | `public/` |

If you change business details, also update them in the static pages, the schema in `index.html` and `public/sitemap.xml` as needed.

## How the home page is put together

```
src/
  App.tsx                 header, hero, trust strip, services, storage, coverage, quote,
                          reviews, FAQ, final call to action, footer, mobile contact bar
  components/
    Hero.tsx              3D journey when WebGL is available, motion is allowed and mobile3D
                          allows it; otherwise StaticHero (illustration + step cards)
    Journey.tsx           tall scroll section with a sticky stage; maps scroll progress to the
                          four chapters (Pack, Move, Store, Delivered) and lazy-loads the scene
    QuoteForm.tsx         7-step quote wizard that ends in a ready-to-send WhatsApp message
    Logo.tsx              the Vault S logo
  three/diorama.ts        the Three.js scene, in its own lazily loaded chunk
  config/runtime.ts       typed access to public/config.js
  entry-server.tsx        used by scripts/prerender.mjs
```

At build time `scripts/prerender.mjs` writes a snapshot of the home page into `dist/index.html`, so search engines and link previews see the content; React replaces it when the page loads. The 3D scene pauses off screen, renders only while something moves, and drops to a lighter mode on slow devices.

## Deploying

`npm run build` produces a static site in `dist/`, including `_headers` and `_redirects` for Cloudflare Pages. The site is deployed by connecting this repository to Cloudflare Pages (production branch `master`, build command `npm run build`, output directory `dist`; Node comes from `.node-version`). Every push to `master` goes live, and other branches get preview addresses. Full steps: [launch playbook, Step 1](docs/launch-playbook.md#step-1-put-the-website-live).

## Brand

| Use | Colour |
| --- | --- |
| Navy (ink, dark sections) | `#0A1C2E` |
| Brand blue | `#1F6FB2` |
| Light blue on navy | `#6FB1E8` (logo on navy: `#5AA0E0`) |
| Call-to-action orange | `#F26B21` |
| Page background | `#F7F9FC` |

Typefaces: Archivo (headings) and Inter (body), self-hosted through `@fontsource-variable`. Logo variants, icons and the social image are in `public/brand/` and `public/`; the profile picture and high-res PNG logos are in `docs/brand/`.

## Docs

- [Launch playbook](docs/launch-playbook.md): hosting, business email, Google Business Profile, Trustpilot, collecting reviews, UK legal checklist, first 30 days
- [Review card](docs/review-card/index.html): the two-sided A6 card for customers
- [Brand files](docs/brand/README.md): profile picture, high-res logos and the review QR code
- [Status and next steps](docs/status-and-next-steps.md)
