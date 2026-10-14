import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

const PHASES = [
  { when: "Now · Weeks 1–4", title: "Listening at the park", body: "Talking to drivers, students and park leadership at UNIOSUN, and choosing our payment partner." },
  { when: "Weeks 5–12", title: "Pilot on one route", body: "Student app, driver app and stickers live with about 10 drivers and the first student wallets." },
  { when: "Weeks 13–20", title: "Passes and faster payouts", body: "Weekly and monthly ride passes, instant cash-out for drivers, and honest numbers on how many rides go cashless." },
  { when: "Weeks 21–30", title: "See the park before you walk there", body: "Live bus status (loading, almost full, departed), estimated seats and short seat holds." },
  { when: "Weeks 31–42", title: "Fuel perks for drivers", body: "Pay at the station straight from earnings, with discounts that cost drivers nothing." },
  { when: "Month 12 and beyond", title: "Every route, then new campuses", body: "Campus by campus, with the same wallet for more than just rides." },
];

export default function Roadmap() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.to(".rm-bus", {
        top: "100%",
        ease: "none",
        scrollTrigger: { trigger: ".rm-list", start: "top 60%", end: "bottom 60%", scrub: 0.6 },
      });
      gsap.to(".rm-road .lit", {
        scaleY: 1,
        ease: "none",
        scrollTrigger: { trigger: ".rm-list", start: "top 60%", end: "bottom 60%", scrub: 0.6 },
      });
      gsap.utils.toArray<HTMLElement>(".rm-item").forEach((el) => {
        ScrollTrigger.create({ trigger: el, start: "top 60%", toggleClass: { targets: el, className: "passed" } });
      });
    },
    { scope: ref },
  );

  return (
    <section className="roadmap" id="roadmap" ref={ref}>
      <div className="wrap rm-grid">
        <div className="sec-head" data-reveal>
          <p className="kicker">The route</p>
          <h2>One route first. Then the whole campus.</h2>
          <p className="sub">We prove every stop with real rides before we drive to the next one.</p>
        </div>
        <div className="rm-list">
          <div className="rm-road" aria-hidden="true">
            <i className="lit" />
            <div className="rm-bus">
              <svg viewBox="0 0 40 72">
                <rect x="2" y="2" width="36" height="68" rx="10" fill="#ffc700" stroke="#0e1115" strokeWidth="3" />
                <rect x="8" y="50" width="24" height="12" rx="3" fill="#0e1115" />
                <rect x="8" y="12" width="24" height="30" rx="4" fill="#0e1115" opacity=".18" />
                <circle cx="10" cy="66" r="2.5" fill="#fff6c2" />
                <circle cx="30" cy="66" r="2.5" fill="#fff6c2" />
              </svg>
            </div>
          </div>
          {PHASES.map((p, i) => (
            <article className={`rm-item ${i === 0 ? "now" : ""}`} key={p.when}>
              <span className="rm-stop" aria-hidden="true" />
              <small>{p.when}</small>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
