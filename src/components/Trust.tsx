const ITEMS = [
  {
    title: "A licensed partner holds the money",
    body: "Wallet funds sit with a licensed payment partner, not in Konduct's own account.",
    icon: <path d="M8 22h32M12 22v14M20 22v14M28 22v14M36 22v14M6 40h36M24 8L6 18h36z" />,
  },
  {
    title: "You see who you're paying",
    body: "Driver's name, plate, route and fare show up before any money moves. A swapped sticker is easy to spot.",
    icon: <path d="M4 24s7-12 20-12s20 12 20 12s-7 12-20 12S4 24 4 24zM24 30a6 6 0 1 0 0-12a6 6 0 0 0 0 12z" />,
  },
  {
    title: "One reference, two screens",
    body: "You and the driver see the same transaction reference, so any argument ends in seconds.",
    icon: <path d="M6 10h20v28H6zM22 10h20v28H22zM11 18h10M11 24h10M27 18h10M27 24h10" />,
  },
  {
    title: "Disputes built in",
    body: "Wrong amount or charged twice? Report it from the receipt. Refunds add a correction to the record, never erase it.",
    icon: <path d="M8 6h32v26H22l-10 10V32H8zM24 13v9M24 26v1" />,
  },
  {
    title: "PIN for bigger payments",
    body: "Use a PIN or your fingerprint. Lost your phone? Lock your wallet from the app or through a campus agent.",
    icon: <path d="M12 22h24v20H12zM16 22v-6a8 8 0 0 1 16 0v6M24 30v5" />,
  },
  {
    title: "Cash still works",
    body: "The pilot never forces anyone off cash. Switch when it suits you, not before.",
    icon: <path d="M4 14h40v22H4zM24 31a6 6 0 1 0 0-12a6 6 0 0 0 0 12zM10 20v10M38 20v10" />,
  },
];

export default function Trust() {
  return (
    <section className="trust" id="trust">
      <div className="wrap">
        <div className="sec-head" data-reveal>
          <p className="kicker">Safety</p>
          <h2>Built so nobody has to take a risk on us.</h2>
          <p className="sub">Money moves through licensed partners, every payment leaves a trail, and cash is never banned from the bus.</p>
        </div>
        <div className="trust-grid">
          {ITEMS.map((it) => (
            <article className="tcard" key={it.title} data-reveal>
              <svg viewBox="0 0 48 48" aria-hidden="true">
                {it.icon}
              </svg>
              <h3>{it.title}</h3>
              <p>{it.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
