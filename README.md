# Konduct landing page

Marketing site for Konduct, cashless campus transport (pilot: UNIOSUN).
React 19 + TypeScript + Vite, with GSAP for the SVG animation.

```
npm install
npm run dev       # http://localhost:5180 (client-rendered, no blog data)
npm run build     # type-check, build, then pre-render every page into dist/
npm run preview   # serve dist/ like Vercel does (clean URLs, rewrites, 404) on :5180
PRERENDER_SAMPLE=1 npm run build   # build with sample posts and jobs, for a local look
```

## Pages, blog, careers and SEO

Every address is real, pre-rendered HTML (`scripts/prerender.mjs`, run by `npm run build`):
`/`, `/terms`, `/privacy`, `/delete-account`, `/blog`, `/blog/<slug>`, `/careers`, `/careers/<slug>`, and `404.html`.
The build reads published posts and jobs from Firestore, renders each page with React on the server,
writes its head tags (`src/lib/seo.ts`: title, description, canonical, Open Graph, X card, robots,
schema.org Organization / WebSite / MobileApplication / FAQPage / Blog / BlogPosting / JobPosting /
BreadcrumbList), and writes `sitemap.xml` (with images), `robots.txt` and the RSS feed `blog/feed.xml`.
Blog covers are copied next to the pages so they load from the CDN, not the API server.

- **Content** is written in the staff console (Website blog, Careers & applicants) and saved through
  the backend (`konduct-backend/functions/src/domain/site.ts`). Bodies are Markdown (`src/lib/markdown.ts`,
  escaped, so a post can't inject HTML).
- **Publishing rebuilds the site** when the backend has `SITE_DEPLOY_HOOK` set to a Vercel deploy hook
  (Vercel → Project → Settings → Git → Deploy Hooks). Until the rebuild lands, `vercel.json` sends unknown
  `/blog/<slug>` and `/careers/<slug>` to shells that load the content in the browser (kept out of search).
- **Applications** go straight into Firestore `applications`; the rules check the shape and that the role is
  open. CVs are links (Drive, LinkedIn…): the free Firebase plan has no file storage.
- **Legal documents** live in `src/content/legal.ts`. Fill in `COMPANY` (registered name, RC number, address)
  and create the mailboxes it names. If you change them in a way people must re-accept, bump `LEGAL_VERSION`
  there and `AppConfig.legalVersion` in both apps.
- **Deploy order:** deploy the Firestore rules first (`firebase deploy --only firestore:rules` from
  konduct-backend). Until then the build fails with `posts 403`, on purpose: a site without its blog
  would drop every post from search.
- **After launch:** add the site to Google Search Console and Bing Webmaster Tools and submit
  `https://konduct.com.ng/sitemap.xml`. Put the social profile links in `src/components/Socials.tsx`;
  they also feed the Organization `sameAs` that ties the profiles to the site in Google.

## Where things are

| Section | File | What moves |
| --- | --- | --- |
| Hero scene | `src/components/HeroScene.tsx` | One ~15s GSAP loop: bus arrives, door folds open, four students scan and board (the third pays for a friend), driver alert, bus leaves, an okada crosses. Pauses offscreen; freezes on one frame for reduced-motion users. |
| Bus / people / campus art | `src/components/art/` | Hand-drawn SVG. Animated parts carry class hooks (`.bus-wheel`, `.bus-door`, `.seat-N`, `.leg-f`, `.arm`, …). |
| How it works | `HowItWorks.tsx`, `PhoneScreens.tsx` | Sticky phone swaps screens as each step scrolls past (desktop); inline phones on mobile. |
| Pay for friends | `Squad.tsx` | Live stepper: 1 to 5 extra riders, total and the driver's alert update. |
| Drivers | `Drivers.tsx` | Simulated payment feed and offline-code demo (sample numbers, labelled as such). |
| Roadmap | `Roadmap.tsx` | Bus drives down the road as you scroll, stops light up. |

Palette and type live at the top of `src/styles.css` (asphalt `#0e1115`, korope yellow `#ffc700`, campus green).
Wheel spin is derived from distance travelled (`spin()` in `HeroScene.tsx`), so if you change a bus
position, the wheels stay in sync.

## Pilot sign-up form

`Join.tsx` saves each sign-up (`role`, `name`, `contact`, `source`, server `createdAt`) to the
`waitlist` collection in Firestore (project `konduct-10ffb`) through `src/lib/waitlist.ts`. The rule in
`konduct-backend/firestore.rules` lets a browser add a well-formed entry and nothing else, so
**deploy the rules once** before the form works:
`firebase deploy --only firestore:rules --project konduct-10ffb` (from `konduct-backend`).
Read sign-ups in the Firebase console → Firestore → `waitlist`. A hidden honeypot field drops most bots.
Override the project with `VITE_FIREBASE_PROJECT_ID` / `VITE_FIREBASE_API_KEY`.

## Social links

Icons for WhatsApp, Instagram, X, LinkedIn and TikTok sit in the footer (`src/components/Socials.tsx`).
Put each profile URL in `SOCIALS`; an icon with no URL shows greyed out as "coming soon".

## Copy facts to confirm before launch

Account number, driver name, plate (OS 452 KJA), references and the ₦200 fare are illustrative.
Claims tied to open questions in the SRS (refund policy, partner name, fees) are worded to avoid
promising specifics; revisit them once the partner and policies are settled.
