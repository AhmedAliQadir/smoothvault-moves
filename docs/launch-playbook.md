# Smoothvault Moves — Launch Playbook

> Imported on 7 October 2026 from the Claude Docs artifact [Smoothvault Moves — Launch Playbook](https://claude.ai/artifact/1ZoKmdehhJ6oe1rrRSQa2n), last edited 6 October 2026.
> References to `smoothvault-site.zip`, `config.js` and uploading the `site` folder now map to this repo: settings live in
> `public/config.js`, and `npm run build` produces the folder to upload (`dist/`). See [status-and-next-steps.md](status-and-next-steps.md).

6 October 2026 · Ahmed

The website is built and tested, with the Vault S logo in place; six decisions are needed from you or the client before it goes live.

## Before you launch: decisions only you can make

| Decision | Why it matters | Recommendation |
| --- | --- | --- |
| One spelling of the name | The logo reads "Smooth Vault Moves"; the company, site text and email say "Smoothvault Moves". Google, Trustpilot and directories need one consistent name. | Keep "Smoothvault Moves" as the business name everywhere online, and treat the logo as styling, or change the wordmark to "Smoothvault". Decide before the Google profile is created. |
| Company number and registered office | UK law requires a limited company's website to show its registered number, registered office and where it's registered. I couldn't find a Companies House record under "Smoothvault Moves Ltd". | Confirm the exact registered name and number, then add them to `config.js`. An accountant's or service address can be the registered office. |
| 3D hero on phones | In a lab test, the phone home page scored 45/100 for speed with the 3D scene and 91/100 without it. The 3D version also hides the WhatsApp button in the phone hero. | Set `mobile3D: false` for launch. Desktop keeps the 3D scene. |
| Booking terms | `/terms/` is drafted from the client's policy (free cancellation 7+ days before, deposit returned, extras on top) plus the legal 14-day cancellation right. Deposit size, when the balance is due, and what happens inside 7 days are assumptions. | Confirm those three points, then have a solicitor check the page. I'm not a lawyer. |
| Insurance proof | The site promises goods-in-transit and public liability cover on every job. | Keep both certificates current and to hand. |
| "Teams in seven cities" | Claims on the site must be true, and Google only allows a separate profile for a city with its own staff. | Keep the claim only if each city has a real crew; otherwise say "covering" those cities. |

## What's ready

`smoothvault-site.zip` is the complete website, ready to upload as it is. `smoothvault-launch-kit.zip` holds the logo files, profile pictures and review QR code.

| Part | What it is |
| --- | --- |
| Home page | The approved design, with the Vault S logo in the header and footer. The page content is also built into the HTML, so search engines and link previews see it without running the 3D code. |
| `/privacy/` | UK GDPR privacy notice covering the quote form, WhatsApp, form email copies and review invitations |
| `/terms/` | Booking and cancellation terms, including the 14-day cancellation right and a cancellation form |
| `/review/` | The review page the QR code points to. It shows Google and Trustpilot buttons as soon as their links are added. |
| `/404.html` | A branded "page not found" page |
| Search and sharing | Page titles and descriptions, a social share image, business details for Google (schema), sitemap and robots file |
| Icons | Favicon, Apple and Android home-screen icons, all from the Vault S mark |
| `config.js` | One small settings file for company details, review links, form emails, stats and the phone 3D switch |
| `_headers`, `_redirects` | Security headers, long caching for assets, and short links (`/quote`, `/reviews`) for Cloudflare Pages or Netlify |

What changed from the artifact: the new logo, a legal line and links in the footer, a privacy link on the quote form, and the review button now points to `/review/` once review links exist. Fonts and code moved into separate files so returning visitors load the site faster.

Checks passed on every page, on desktop and phone: no errors, all internal links work, and the business schema is valid. Changing each `config.js` setting was tested and flows through. Lighthouse scores: accessibility 100, best practices 100, SEO 100. Speed is 99 on the inner pages, and 91 on the phone home page with the 3D scene off.

## Step 1: Put the website live

Host the site on Cloudflare Pages: it's free, Pages is still fully supported for static sites, and the same account gives you DNS, free email forwarding and cookieless visitor stats. Whoever owns the business should own the account, signed up with the business email.

1. Create a free Cloudflare account and add the site `smoothvaultmoves.co.uk` on the Free plan.
2. Cloudflare shows two nameservers. Log in where the domain was bought (check the purchase email) and replace its nameservers with Cloudflare's. A .co.uk domain usually switches within a few hours.
3. In Cloudflare, go to Workers & Pages, create a Pages project, choose to upload assets directly, name it `smoothvault-moves`, and drop in the unzipped `site` folder. You get a test address ending in `pages.dev`.
4. In the project's Custom domains, add both `smoothvaultmoves.co.uk` and `www.smoothvaultmoves.co.uk`. Cloudflare creates the DNS records and the HTTPS certificate.
5. Add a redirect rule that sends `www` to the plain domain, so Google sees one address.
6. Test on a phone: the WhatsApp buttons open a chat with 07824 101373, the quote form opens WhatsApp with the answers, the footer links work, and a link shared in WhatsApp shows the preview image.
7. Add the domain to Google Search Console (verify with a DNS record, which takes a minute on Cloudflare) and submit `https://smoothvaultmoves.co.uk/sitemap.xml`. Then import it into Bing Webmaster Tools.

To update the site later, edit the files (usually just `config.js`) and upload the folder again as a new deployment.

Netlify also works with the same files. On its free plan for new accounts, each deploy uses 15 of 300 monthly credits and the site pauses when credits run out, so it's less suited to a business site.

## Step 2: Business email on the domain

Set up `hello@smoothvaultmoves.co.uk` before Google and Trustpilot: Trustpilot verifies you through a work email on your domain, and customers trust it more than a Gmail address.

| Option | Cost | Good for | Catch |
| --- | --- | --- | --- |
| Zoho Mail Forever Free | £0, up to 5 users, 5 GB each | Starting out at no cost | Webmail and mobile app only. No Outlook or Apple Mail. |
| Microsoft 365 Business Basic | £4.60 per user a month ex VAT, annual | Outlook users | Paid |
| Google Workspace Business Starter | £5.90 per user a month ex VAT, annual | People who already live in Gmail | Paid; monthly billing costs about 20% more |
| Cloudflare Email Routing | £0 | Forwarding `hello@` to an existing inbox | Receives only. Replying as `hello@` needs a separate sending service. |

My pick is Zoho free to launch, moving to Workspace when the team needs shared inboxes or desktop mail.

DNS records go in Cloudflare, under DNS:

- **MX and SPF:** copy exactly what the email provider's setup screen shows. Use only one provider's MX records.
- **DKIM:** the provider gives a TXT record to add, then turn on signing in its admin panel.
- **DMARC:** add a TXT record named `_dmarc` with `v=DMARC1; p=none; rua=mailto:hello@smoothvaultmoves.co.uk`. After two to four weeks of clean reports, change `p=none` to `p=quarantine`.

## Step 3: Google Business Profile

Start with one service-area profile, address hidden, covering towns within about two hours' drive of the main base. Google allows one profile per business, and a second only for a location with its own staff and service area.

Google's rules that matter here:

- The name must be the real-world business name: no keywords, towns or slogans (so not "Smoothvault Moves Removals Birmingham").
- Use a local phone number that reaches the business: 07824 101373.
- Hide the address if customers don't visit you. Only list a city as its own profile if it has a staffed base.

1. Sign in at business.google.com with the business Google account and add "Smoothvault Moves" (or the spelling decided above).
2. Pick the closest primary category, such as Moving company. Add a storage category only if customers' goods are kept at a storage site.
3. Answer "No" to a location customers can visit, then add service areas.
4. Add the phone number, `https://smoothvaultmoves.co.uk/` and the real opening hours. If moves happen at weekends, show weekend hours.
5. Verify. Google often asks for a short unbroken video: show the street or base, a branded van or equipment, and proof you run the business, such as the insurance certificate or the company's documents. If a video is rejected, Google now emails you what was missing.
6. Upload `profile-photo-1024.png` as the logo and `og-image.png` as the cover, then real photos of vans, crews and storage. Real photos only.
7. Add each service with its one-line description from the website.
8. Once verified, go to Ask for reviews, copy the link into `googleReviewUrl` in `config.js`, and redeploy.

Description, ready to paste (646 of 750 characters):

```text
Smoothvault Moves is a family-run removals and storage company covering England, Scotland and Wales. We handle home removals, office moves, packing, man and van jobs, long-distance moves, house clearances and specialist items such as pianos and antiques. When completion dates don't line up, we keep your belongings safe in our own secure storage until your new home is ready. Every job is quoted individually for what it actually involves, and we're fully insured with goods-in-transit and public liability cover. We often have same-day or next-day availability. Message us on WhatsApp for a free quote, or book a free video or in-person survey.
```

Services to add:

| Service | Description |
| --- | --- |
| Home removals | Flats to family homes, packed, loaded and placed room by room. |
| Office moves | Planned around your hours so the team is back at work fast. |
| Packing service | Materials supplied and fragile items wrapped properly. |
| Secure storage | Our own secure on-site storage, short or long term. |
| Man and van | One van, one crew, for smaller loads and single items. |
| Long-distance moves | Across England, Scotland and Wales in one run. |
| House clearance | Cleared, swept and left ready for the next chapter. |
| Specialist items | Pianos, antiques, artwork and anything awkward. |

## Step 4: Trustpilot

Trustpilot's free plan is enough to start: 50 review invitations a month, one website widget, replying to and flagging reviews, and one user login.

1. Sign up at business.trustpilot.com using `hello@smoothvaultmoves.co.uk`, which proves you own the domain, and claim the page for `smoothvaultmoves.co.uk`.
2. Add the logo (`profile-photo-1024.png`), the description from Step 3, the phone number and website.
3. Copy your review link from the "Get reviews" area into `trustpilotUrl` in `config.js`, then redeploy. The `/review/` page shows a Trustpilot button automatically.
4. Send invitations through Trustpilot to every customer after each job. Reviews from invitations are marked as verified. Over 50 jobs a month, share the review link with the rest.
5. Copy the free widget code (TrustBox) and send it to me. I'll add it to the reviews section of the home page, so the rating there always comes straight from Trustpilot.

Trustpilot's rules for businesses: no freebies or discounts for reviews, no picking and choosing who to invite, invite only real customers, and give them time to experience the service first.

## Step 5: Collecting reviews the right way

Ask every customer, the same day, with one link: `smoothvaultmoves.co.uk/review/`. That page offers Google and Trustpilot side by side, and the printed QR code points to it, so the QR never needs reprinting.

Fake or bought reviews are now illegal in the UK. Since April 2025 the CMA can fine a business up to £300,000 or 10% of global turnover, whichever is higher. Google and Trustpilot also remove reviews and can penalise the profile.

| Do | Don't |
| --- | --- |
| Ask every customer, happy or not | Ask only customers you think are happy, or send unhappy ones somewhere else instead |
| Ask once, plus one reminder | Offer discounts, gifts or prize draws for reviews |
| Reply to every review, good or bad | Write reviews yourself, or ask friends, family or staff to |
| Show reviews through the Trustpilot widget or the Google profile | Copy only the best reviews onto the site |
| Thank staff for good service | Set staff review quotas, or ask for reviews that name a staff member (banned by Google since April 2026) |

The routine for each job:

1. Hand over the review card with the QR code when the move is finished.
2. The same evening, send the WhatsApp message below.
3. If you use Trustpilot invitations, send one the next day (it's the same request, just verified).
4. After 5 to 7 days with no review, send one reminder, then stop.
5. Reply to new reviews within two working days.

WhatsApp, the evening of the move:

```text
Hi [first name], thank you for moving with Smoothvault Moves today. We hope you're settling in well.

If you have a minute, we'd really value an honest review. It helps other families choose a mover:
https://smoothvaultmoves.co.uk/review/

And if anything wasn't right, just reply here and we'll sort it.
```

Text message:

```text
Thanks for moving with Smoothvault Moves, [first name]! Could you leave us an honest review? It takes about a minute: smoothvaultmoves.co.uk/review/
```

Email:

```text
Subject: How did your move go?

Hi [first name],

Thank you for choosing Smoothvault Moves. We hope the new place already feels like home.

Could you spare a minute to tell other families how your move went? Choose Google or Trustpilot here:
https://smoothvaultmoves.co.uk/review/

If there's anything we can still help with, just reply to this email.

Thanks,
Smoothvault Moves
07824 101373 · smoothvaultmoves.co.uk
```

Reminder, once only:

```text
Hi [first name], a quick reminder in case it slipped past: if you'd like to review your move, the link is https://smoothvaultmoves.co.uk/review/. Thanks again for choosing us.
```

Replying to a good review:

```text
Thank you, [first name]! It was a pleasure helping with your move. Enjoy the new home. – Smoothvault Moves
```

Replying to a poor review (never argue, and never share booking details in public):

```text
Hi [first name], we're sorry your move didn't go as it should have. We'd like to put this right. Please message us on WhatsApp on 07824 101373 or email hello@smoothvaultmoves.co.uk with your move date, and we'll look into it straight away. – Smoothvault Moves
```

## Step 6: Legal and compliance checklist

Three items are legal requirements before launch: company details on the site, the ICO fee, and terms customers see before booking. The rest keep you out of trouble as the business grows.

- [ ] Add the company number, registered office and part of the UK where registered to `config.js`. The 2015 trading disclosure regulations require them on the website. Put the same details on quotes, invoices and email signatures.
- [ ] Pay the ICO data protection fee. Tier 1 (up to 10 staff or turnover up to £632,000) is £52 a year, or £47 by direct debit.
- [ ] Read `/privacy/` and confirm it matches what you actually do: WhatsApp for quotes, form email copies only if turned on, Trustpilot invitations.
- [ ] Confirm the booking terms (deposit, balance, what happens inside 7 days), have them checked, and link them in every quote you send.
- [ ] For bookings made by phone, WhatsApp or online, customers have 14 days to cancel. If their move falls inside those 14 days, get a written request to start early, such as a WhatsApp reply saying "Please go ahead; I understand I'll pay for work done if I cancel".
- [ ] Make sure every claim on the site is true: fully insured, same-day availability, family-run, and teams in seven cities.
- [ ] Follow the review rules in Step 5.
- [ ] Cookies: the site sets none, and Cloudflare Web Analytics is cookieless, so no cookie banner is needed. Adding Google Analytics, Meta Pixel or ad tracking later would need one; advertising and cross-site cookies still need consent.
- [ ] Optional: membership of the British Association of Removers is a strong trust signal for removals customers. Check their entry criteria.

## Step 7: Get found

List the business in the same few places with exactly the same details. Matching details across sites help Google trust the profile, and a mismatch splits it.

Use these details everywhere, character for character:

```text
Smoothvault Moves
07824 101373
https://smoothvaultmoves.co.uk
hello@smoothvaultmoves.co.uk
Mon–Fri 9am–6pm
```

| Where | Why | Cost |
| --- | --- | --- |
| Google Business Profile | Most local enquiries start here (Step 3) | Free |
| Google Search Console | Gets the site indexed and shows the searches you appear for | Free |
| Bing Places and Bing Webmaster Tools | Bing, plus some voice assistants. Can import from Google. | Free |
| Apple Business Connect | Apple Maps on iPhone | Free |
| Facebook page and WhatsApp Business profile | Where people check you're real; link both to the site | Free |
| Trustpilot | Reviews (Step 4) | Free plan |
| Yell and Thomson Local | Long-standing UK directories | Free basic listing |
| Bark, Compare My Move, reallymoving | Paid lead marketplaces for removals | Pay per lead; test one at a time |

When each profile is live, send me its link. I'll add them to the site's business schema so Google connects them to the website.

## First 30 days

Week 1 puts the business online; weeks 2 to 4 turn every finished job into a review and a listing.

**Week 1: go live**

- [ ] Make the six decisions at the top of this doc
- [ ] Cloudflare account, nameservers switched, site uploaded, both domains attached (Step 1)
- [ ] Business email working, with SPF, DKIM and DMARC (Step 2)
- [ ] Company details in `config.js`, ICO fee paid, terms confirmed (Step 6)
- [ ] Search Console verified and sitemap submitted

**Week 2: profiles**

- [ ] Google Business Profile created and verification started (Step 3)
- [ ] Trustpilot claimed with the business email (Step 4)
- [ ] Review cards printed with the QR code
- [ ] Facebook page and WhatsApp Business profile filled in, both linking to the site

**Week 3: first reviews**

- [ ] Review links added to `config.js` and redeployed
- [ ] Every finished job gets the card and the evening WhatsApp message (Step 5)
- [ ] Trustpilot widget code sent over to be added to the site
- [ ] Bing Places and Apple Business Connect set up

**Week 4: keep it going**

- [ ] Every review replied to
- [ ] First Google profile update posted, with photos from a real job
- [ ] Search Console checked for the searches you're starting to show up for
- [ ] Pick one paid lead source to test, if needed

## Settings reference

Everything the site needs filling in later lives in `config.js`, at the top level of the site folder. Edit it in any text editor, then upload the site again; anything left empty stays hidden.

| Setting | What it switches on | Where to get it |
| --- | --- | --- |
| `companyNumber` | Company number in the footer and on the privacy and terms pages | Companies House |
| `registeredIn` | "Scotland" or "England and Wales" in the footer | Companies House |
| `registeredOffice` | Registered office in the footer and on the legal pages | Companies House, or the accountant's address if you change it |
| `googleReviewUrl` | Google button on `/review/`; the home page review button switches to `/review/` | Google Business Profile, Ask for reviews |
| `trustpilotUrl` | Trustpilot button on `/review/` | Trustpilot Business, Get reviews |
| `web3formsKey` | An email copy of each quote request (250 a month free) | web3forms.com, sent to `hello@` |
| `cfAnalyticsToken` | Cookieless visitor stats | Cloudflare, Web Analytics. On Cloudflare Pages you can switch it on in the dashboard instead. |
| `mobile3D` | `true` shows the 3D hero on phones; `false` shows the lighter illustrated hero | Your decision (see the top of this doc) |

## Sources

- [Guidelines for representing your business on Google](https://support.google.com/business/answer/3038177?hl=en): service areas, one profile per business, name and phone rules
- [What's new in Google Business Profile, March 2025](https://support.google.com/business/answer/16058887?hl=en): review link and QR code, video verification
- [Google tightens Maps review policy](https://ppc.land/google-tightens-maps-review-policy-staff-names-and-quotas-now-banned/): staff quotas and staff names banned, April 2026
- [Trustpilot guidelines for businesses](https://legal.trustpilot.com/for-reviewers/guidelines-for-businesses): incentives, selective invitations
- [Trustpilot free plan 2026](https://www.costbench.com/software/review-management/trustpilot/free-plan/): 50 invitations a month, one widget
- [DMCC Act 2024: fake consumer reviews](https://www.dacbeachcroft.com/en/what-we-think/the-digital-markets-competition-and-consumers-act-2024-update-three-fake-consumer-reviews): banned practices and fines
- [Company and business names (Business Companion)](https://www.businesscompanion.info/en/quick-guides/business-information-other/company-and-business-names): website disclosure requirements
- [ICO data protection fees, July 2026](https://www.barcouncilethics.co.uk/wp-content/uploads/2019/11/Data-Protection-Fees-payable-to-the-ICO-July-2026.pdf): tier amounts
- [Right to cancel consumer contracts (nibusinessinfo)](https://www.nibusinessinfo.co.uk/content/right-cancel-consumer-contracts): 14-day period, starting services early
- [Data (Use and Access) Act 2025 commencement](https://bratby.law/data-use-and-access-act-2025-commencement/): cookie exemptions from 5 February 2026
- [Cloudflare Web Analytics](https://cloudflare.com/web-analytics): free, no cookies
- [Cloudflare Pages vs Workers in 2026](https://mecanik.dev/en/posts/cloudflare-pages-vs-workers-which-to-use-in-2026/): Pages still supported
- [Cloudflare Email Routing](https://mecanik.dev/en/posts/cloudflare-email-routing-free-custom-domain-email/): free forwarding, receive only
- [Netlify free plan limits 2026](https://netli.fyi/blog/netlify-free-plan-limits-2026): credits and pausing
- [Free business email compared](https://meetergo.com/en/magazine/free-business-email): Zoho Mail free plan
- [Google Workspace vs Microsoft 365 UK costs](https://www.comparethecloud.net/articles/google-workspace-vs-microsoft-365-business-uk-startup-5-20-staff-all-in-gbp-costs): GBP prices, February 2026
- [Web3Forms pricing](https://web3forms.com/pricing): 250 submissions a month free
