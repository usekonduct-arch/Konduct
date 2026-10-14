import { useState } from "react";
import { naira } from "../lib/naira";

const FARE = 200;
const MAX = 5;
const FACES = [
  { name: "You", bg: "#ffc700", fg: "#0e1115" },
  { name: "Ife", bg: "#ff6b4a", fg: "#fff" },
  { name: "Musa", bg: "#3d7bff", fg: "#fff" },
  { name: "Bisi", bg: "#19b86a", fg: "#fff" },
  { name: "Chi", bg: "#b483ff", fg: "#fff" },
  { name: "Seun", bg: "#f4f3ec", fg: "#0e1115" },
];

export default function Squad() {
  const [extra, setExtra] = useState(2);
  const riders = extra + 1;
  const total = riders * FARE;

  return (
    <section className="squad" id="squad">
      <div className="wrap squad-grid">
        <div data-reveal>
          <p className="kicker">Pay for friends</p>
          <h2>Paying for the squad? One scan covers everyone.</h2>
          <p className="sub">
            Tap <b>Pay for others</b>, pick how many, and confirm once. One debit, one receipt, and a ride for each person.
          </p>
          <div className="double-scan">
            <span className="ds-icon" aria-hidden="true">
              ↺
            </span>
            <p>
              <b>Scanned the same bus twice?</b> Konduct asks “Add another passenger, or already paid?” before it charges
              again. Nothing is ever taken twice by accident.
            </p>
          </div>
        </div>

        <div className="squad-card" data-reveal>
          <div className="squad-top">
            <span>Main Gate → Faculty</span>
            <span className="mono">OS 452 KJA</span>
          </div>

          <div className="faces" aria-hidden="true">
            {FACES.slice(0, riders).map((f, i) => (
              <span key={f.name} className="face" style={{ background: f.bg, color: f.fg, zIndex: 10 - i }}>
                {f.name}
              </span>
            ))}
          </div>

          <div className="stepper">
            <span className="stepper-label">
              You <b>+ {extra}</b> {extra === 1 ? "friend" : "friends"}
            </span>
            <div className="stepper-btns">
              <button type="button" aria-label="One fewer passenger" onClick={() => setExtra((e) => Math.max(0, e - 1))} disabled={extra === 0}>
                −
              </button>
              <output aria-live="polite">{extra}</output>
              <button type="button" aria-label="One more passenger" onClick={() => setExtra((e) => Math.min(MAX, e + 1))} disabled={extra === MAX}>
                +
              </button>
            </div>
          </div>

          <div className="squad-total">
            <span>
              {riders} × {naira(FARE)}
            </span>
            <b key={total}>{naira(total)}</b>
          </div>
          <span className="ph-btn big">Pay {naira(total)}</span>

          <div className="squad-driver" key={riders}>
            <span className="ph-dot" />
            <div>
              <small>Driver hears</small>
              <b>
                “{naira(total)} for {riders} {riders === 1 ? "rider" : "riders"}”
              </b>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
