import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const PAINS = [
  {
    who: "Students",
    title: "Late, holding a ₦1,000 note.",
    body: "The driver has no change, the next bus is full, and your 8am has already started.",
  },
  {
    who: "Drivers",
    title: "Cash vanishes into the day.",
    body: "No record of trips, no proof of earnings, and change you have to go and find.",
  },
  {
    who: "Park leaders",
    title: "Running the park blind.",
    body: "With cash only, nobody can see how many rides happen or where the problems start.",
  },
];

export default function Problem() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ scrollTrigger: { trigger: ".sum", start: "top 75%" } })
          .from(".sum-row", { xPercent: -8, opacity: 0, duration: 0.7, stagger: 0.18, ease: "power3.out" })
          .from(".sum-strike", { scaleX: 0, duration: 0.45, ease: "power2.inOut" }, "+=0.15")
          .from(".sum-stamp", { scale: 2.2, opacity: 0, rotation: -24, duration: 0.5, ease: "back.out(2)" }, "-=0.1");
      });
    },
    { scope: ref },
  );

  return (
    <section className="problem" id="problem" ref={ref}>
      <div className="wrap problem-grid">
        <div data-reveal>
          <p className="kicker">The problem</p>
          <h2>Change shouldn't decide if you make class.</h2>
          <p className="sub">
            Every morning at the park, a ₦200 ride turns into a hunt for change. Drivers lose fares, students lose time, and
            nobody has a record of any of it.
          </p>
        </div>
        <div className="sum" aria-label="A ₦1,000 note for a ₦200 fare leaves ₦800 change that nobody has">
          <div className="sum-row">
            <span>Your note</span>
            <b>₦1,000</b>
          </div>
          <div className="sum-row">
            <span>The fare</span>
            <b>− ₦200</b>
          </div>
          <div className="sum-row total">
            <span>Change needed</span>
            <b>
              ₦800
              <i className="sum-strike" />
            </b>
            <em className="sum-stamp">nobody has it</em>
          </div>
        </div>
      </div>
      <div className="wrap pains">
        {PAINS.map((p) => (
          <article className="pain" key={p.who} data-reveal>
            <p className="pain-who">{p.who}</p>
            <h3>{p.title}</h3>
            <p>{p.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
