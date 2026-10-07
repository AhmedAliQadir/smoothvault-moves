# Smoothvault Moves

Website for Smoothvault Moves, a family-run removals and secure storage company covering England, Scotland and Wales. It is a single-page React + TypeScript site built with Vite, with a scroll-driven Three.js hero in which a branded van loads boxes, stops at a storage vault and delivers to a new home.

This source was rebuilt from the "Smoothvault Moves" website artifact made in Claude on 4 October 2026 and checked against it (text, 3D scene values, screenshots and quote-form output all match). See [docs/status-and-next-steps.md](docs/status-and-next-steps.md) for what is here, what is still missing and what to do next.

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck and production build into dist/
npm run preview  # serve the production build
npm run lint
```

## Editing content

| What | Where |
| --- | --- |
| Business details: name, phone, WhatsApp number, email, hours, cities, Web3Forms key | `src/config/site.ts` |
| Services, trust points, the four journey steps, FAQs | `src/content/index.ts` |
| Quote form options, step titles and the WhatsApp message format | `src/lib/quote.ts` |
| Coverage map outline and city pins | `src/content/gb-map.ts` |
| Colours, fonts, spacing and all styles | `src/styles/global.css` (tokens at the top) |
| 3D scene: models, animation timings, camera moves | `src/three/diorama.ts` |

The quote form sends nothing to a server by default: the last step opens WhatsApp with the answers as a ready-to-send message. Add a [Web3Forms](https://web3forms.com) access key to `web3formsKey` in `src/config/site.ts` to also email the team a copy.

## How the page is put together

```
src/
  App.tsx                 page order: header, hero, trust strip, services, storage, coverage,
                          quote, reviews, FAQ, final call to action, footer, mobile contact bar
  components/
    Hero.tsx              3D journey when WebGL is available and motion is allowed,
                          otherwise StaticHero (illustration + step cards)
    Journey.tsx           tall scroll section with a sticky stage; maps scroll progress to the
                          four chapters (Pack, Move, Store, Delivered) and lazy-loads the scene
    QuoteForm.tsx         7-step quote wizard with validation
    ...                   one file per section, plus icons.tsx and Logo.tsx
  three/diorama.ts        the Three.js scene, in its own lazily loaded chunk
  hooks/                  reduced-motion media query, reveal-on-scroll
```

The 3D scene pauses when it scrolls off screen, renders only while something moves, and drops to a lower pixel ratio without shadows if the first frames are slow. Devices with 4 or fewer CPU cores or 3 GB or less of memory start in that lighter mode.

## Deploying

`npm run build` produces a static site in `dist/` that can be hosted anywhere. The launch playbook recommends Cloudflare Pages; connecting this GitHub repository there (build command `npm run build`, output directory `dist`) deploys automatically on every push.

## Brand

| Use | Colour |
| --- | --- |
| Navy (ink, dark sections) | `#0A1C2E` |
| Brand blue | `#1F6FB2` |
| Light blue on navy | `#6FB1E8` |
| Call-to-action orange | `#F26B21` |
| Page background | `#F7F9FC` |

Typefaces: Archivo (headings) and Inter (body), self-hosted through `@fontsource-variable`. Logo files and the review QR code are in [docs/brand](docs/brand).

## Docs

- [Launch playbook](docs/launch-playbook.md): hosting, business email, Google Business Profile, Trustpilot, collecting reviews, UK legal checklist, first 30 days
- [Review card](docs/review-card/index.html): the two-sided A6 card for customers, ready to print
- [Status and next steps](docs/status-and-next-steps.md)
