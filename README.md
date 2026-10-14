# Konduct landing page

Marketing site for Konduct, cashless campus transport (pilot: UNIOSUN).
React 19 + TypeScript + Vite, with GSAP for the SVG animation.

```
npm install
npm run dev       # http://localhost:5180
npm run build     # type-check + production build into dist/
npm run preview   # serve dist/ on :5180
```

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
