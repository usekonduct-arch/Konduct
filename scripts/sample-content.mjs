// Sample blog posts and jobs for previewing the site locally without Firestore:
//   PRERENDER_SAMPLE=1 npm run build && npm run preview
// Never used in a real deploy.
const day = 86_400_000;
const now = Date.parse("2026-10-17T09:00:00Z");

export const samplePosts = [
  {
    id: "sample1",
    slug: "how-to-pay-your-bus-fare-with-konduct",
    title: "How to pay your campus bus fare with Konduct in 10 seconds",
    excerpt: "No change, no wahala: a step-by-step guide to funding your wallet, scanning the sticker on the Korope and getting your receipt.",
    body: `Paying for a campus bus shouldn't mean hunting for ₦50 change at 7:45am. Here's how Konduct works, from your first top-up to your first ride.

## 1. Add money to your wallet

Every rider gets their **own account number**. Transfer to it from any bank app and it lands in your wallet automatically, usually within a minute.

- Open Konduct and tap **Add money**
- Copy your account number
- Transfer from your bank app

> Tip: add enough for a week of rides at once. It saves you transfer fees.

## 2. Scan the sticker on the bus

Every Konduct bus has a yellow sticker by the sliding door. Tap **Scan** in the app and point your camera at it.

You'll see the driver, the plate and the fare before you pay. **Check the plate matches the bus.**

## 3. Tap Pay and ride

That's it. The driver's phone announces the payment out loud and you both get a receipt.

### Paying for friends

Travelling with your squad? Add up to five friends on the same scan and pay for everyone at once.

---

Questions? Read the [FAQ](/#faq) or chat with us from the Help tab.`,
    coverUrl: "",
    coverAlt: "",
    tags: ["guides", "riders"],
    authorName: "Ada Obi",
    authorRole: "Community lead",
    seoTitle: "",
    seoDescription: "",
    readMinutes: 3,
    publishedAtMs: now - 2 * day,
    updatedAtMs: now - day,
  },
  {
    id: "sample2",
    slug: "konduct-is-live-at-uniosun",
    title: "Konduct is live at UNIOSUN",
    excerpt: "Our pilot starts at Osun State University with buses and bikes on the main routes. Here's what that means for riders and drivers.",
    body: "We're starting where the need is biggest: the morning rush between the hostels and the main gate.\n\n## What's live\n\nBuses and bikes on the main routes accept Konduct today. Cash stays accepted everywhere during the pilot.\n\n## What's next\n\nMore routes, more parks, and more campuses across Osun.",
    coverUrl: "",
    coverAlt: "",
    tags: ["news"],
    authorName: "The Konduct team",
    authorRole: "",
    seoTitle: "",
    seoDescription: "",
    readMinutes: 1,
    publishedAtMs: now - 9 * day,
    updatedAtMs: now - 9 * day,
  },
];

export const sampleJobs = [
  {
    id: "samplejob1",
    slug: "campus-ambassador-uniosun",
    title: "Campus Ambassador, UNIOSUN",
    team: "Campus",
    location: "Osogbo",
    workplace: "onsite",
    employment: "PART_TIME",
    summary: "Be the face of Konduct on campus: sign up riders at the parks, run pop-ups and tell us what students need.",
    body: "## What you'll do\n\n- Help students sign up and make their first payment at the parks\n- Run sign-up stands during the morning and evening rush\n- Collect feedback and report problems from the road\n\n## What we're looking for\n\n- A current UNIOSUN student\n- Comfortable talking to strangers, in English, Pidgin or Yorùbá\n- You ride campus buses yourself\n\n## What you get\n\n- A monthly stipend plus bonuses for active riders\n- Experience in a fast-moving startup",
    salaryMinNaira: 40000,
    salaryMaxNaira: 60000,
    salaryUnit: "MONTH",
    closesAtMs: now + 30 * day,
    status: "open",
    postedAtMs: now - 3 * day,
    updatedAtMs: now - 3 * day,
  },
  {
    id: "samplejob2",
    slug: "flutter-engineer",
    title: "Flutter Engineer",
    team: "Engineering",
    location: "Remote, Nigeria",
    workplace: "remote",
    employment: "FULL_TIME",
    summary: "Build the rider and driver apps: payments, offline codes and scanning that works on a ₦60,000 phone with one bar of network.",
    body: "## What you'll do\n\nShip features in our two Flutter apps end to end, from design review to release.\n\n## What we're looking for\n\n- 2+ years of Flutter in production\n- You care about performance on low-end Android",
    salaryMinNaira: null,
    salaryMaxNaira: null,
    salaryUnit: "MONTH",
    closesAtMs: null,
    status: "open",
    postedAtMs: now - 5 * day,
    updatedAtMs: now - 5 * day,
  },
];
