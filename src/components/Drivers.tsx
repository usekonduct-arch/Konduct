import { useEffect, useRef, useState } from "react";
import { naira, prefersReducedMotion } from "../lib/naira";

type Pay = { id: number; amount: number; riders: number; ref: string };

const REFS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const makeRef = (n: number) => "KD-" + Array.from({ length: 5 }, (_, i) => REFS[(n * 7 + i * 13 + n * i) % REFS.length]).join("");
const SEED: Pay[] = [
  { id: 3, amount: 200, riders: 1, ref: makeRef(3) },
  { id: 2, amount: 600, riders: 3, ref: makeRef(2) },
  { id: 1, amount: 200, riders: 1, ref: makeRef(1) },
];
const CODE = "K7Q2MX";

export default function Drivers() {
  const [feed, setFeed] = useState<Pay[]>(SEED);
  const [trips, setTrips] = useState(37);
  const [earned, setEarned] = useState(7400);
  const [typed, setTyped] = useState(CODE.length);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let timer = 0;
    let n = 4;
    let visible = false;
    const tick = () => {
      if (visible) {
        const riders = n % 4 === 0 ? 2 : 1;
        const p = { id: n, amount: riders * 200, riders, ref: makeRef(n) };
        n++;
        setFeed((f) => [p, ...f].slice(0, 4));
        setTrips((t) => t + riders);
        setEarned((e) => e + p.amount);
        setTyped((t) => (t >= CODE.length + 4 ? 0 : t + 1));
      }
      timer = window.setTimeout(tick, 1900);
    };
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    if (box.current) io.observe(box.current);
    tick();
    return () => {
      clearTimeout(timer);
      io.disconnect();
    };
  }, []);

  const shown = Math.min(typed, CODE.length);

  return (
    <section className="drivers" id="drivers">
      <div className="wrap drivers-grid">
        <div>
          <div data-reveal>
            <p className="kicker">For drivers and bike riders</p>
            <h2>Every trip counted. Every naira paid out.</h2>
          </div>
          <ul className="ticks" data-reveal>
            <li>
              <b>A loud, glanceable alert</b> on every payment. Amount and rider count, no tapping, eyes stay on the road.
            </li>
            <li>
              <b>Today on one screen:</b> trips, earnings and what's waiting to be paid out.
            </li>
            <li>
              <b>Paid to your bank every day</b> by default, or collect cash from a campus agent.
            </li>
            <li>
              <b>Your code is yours.</b> It's tied to you and your vehicle. Lose a sticker and we switch the old one off
              instantly.
            </li>
          </ul>
        </div>

        <div className="dash" ref={box} aria-label="Example driver dashboard with sample numbers">
          <div className="dash-head">
            <span className="live">
              <i /> Live
            </span>
            <span className="mono">Tunde A. · OS 452 KJA</span>
          </div>
          <div className="dash-stats">
            <div>
              <small>Trips today</small>
              <b key={trips}>{trips}</b>
            </div>
            <div>
              <small>Earned</small>
              <b key={earned}>{naira(earned)}</b>
            </div>
            <div>
              <small>Payout</small>
              <b className="dim">Tonight</b>
            </div>
          </div>
          <ul className="feed">
            {feed.map((p) => (
              <li key={p.id}>
                <span className="feed-amt">+{naira(p.amount)}</span>
                <span className="feed-meta">
                  {p.riders > 1 ? `${p.riders} riders` : "1 rider"} · <span className="mono">{p.ref}</span>
                </span>
                <span className="feed-ok">✓</span>
              </li>
            ))}
          </ul>
          <p className="dash-note">Sample numbers for illustration.</p>
        </div>
      </div>

      <div className="wrap">
        <div className="offline" data-reveal>
          <div>
            <p className="kicker">No data at the park?</p>
            <h3>It still works.</h3>
            <p>
              The student pays from their phone, and their app shows a short code. Type it into yours and you're confirmed. Your
              app catches up as soon as you're back online.
            </p>
          </div>
          <div className="code" aria-label={`Example payment code ${CODE}`}>
            {CODE.split("").map((c, i) => (
              <span key={i} className={i < shown ? "on" : ""}>
                {i < shown ? c : ""}
              </span>
            ))}
            <em className={shown === CODE.length ? "on" : ""}>✓ Confirmed · ₦200</em>
          </div>
        </div>
      </div>
    </section>
  );
}
