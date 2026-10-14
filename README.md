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

`Join.tsx` POSTs `{ role, name, contact, source }` as JSON to `VITE_WAITLIST_URL`.
**Until that env var is set, submissions are not stored anywhere** (the form still shows the thank-you
state and logs a warning to the console). Point it at a backend endpoint, a Google Apps Script,
or a form service before launch.

## Copy facts to confirm before launch

Account number, driver name, plate (OS 452 KJA), references and the ₦200 fare are illustrative.
Claims tied to open questions in the SRS (refund policy, partner name, fees) are worded to avoid
promising specifics; revisit them once the partner and policies are settled.
