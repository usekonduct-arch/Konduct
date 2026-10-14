import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import HeroScene from "./HeroScene";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ defaults: { ease: "power4.out" } })
          .from(".eyebrow", { y: 16, opacity: 0, duration: 0.6 })
          .from(".h1-line > span", { yPercent: 110, duration: 1, stagger: 0.12 }, "<0.1")
          .fromTo(".swoosh path", { strokeDashoffset: 420 }, { strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut" }, "-=0.45")
          .from(".hero-copy > *", { y: 22, opacity: 0, duration: 0.8, stagger: 0.08 }, "-=0.8");
      });
    },
    { scope: ref },
  );

  return (
    <section className="hero" ref={ref} aria-labelledby="hero-title">
      <div className="wrap hero-grid">
        <div>
          <p className="eyebrow">
            <i /> Cashless campus rides · Piloting at UNIOSUN
          </p>
          <h1 id="hero-title">
            <span className="h1-line">
              <span>Scan the bus.</span>
            </span>
            <span className="h1-line">
              <span className="hl">
                Skip the change.
                <svg className="swoosh" viewBox="0 0 400 24" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M4 16C90 6 220 4 396 12" />
                </svg>
              </span>
            </span>
          </h1>
        </div>
        <div className="hero-copy">
          <p className="lead">
            Konduct lets you pay for campus shuttles and bikes from your phone. Fund your wallet once, scan the code on the
            vehicle, and ride. The driver hears <b>“₦200 received”</b> before you've even sat down.
          </p>
          <div className="cta-row">
            <a className="btn btn-yellow" href="#join">
              Join the pilot
            </a>
            <a className="btn btn-ghost" href="#how">
              See how it works
            </a>
          </div>
          <ul className="proof">
            <li>No change needed</li>
            <li>Pay for your friends</li>
            <li>Cash still accepted</li>
          </ul>
        </div>
      </div>
      <HeroScene />
    </section>
  );
}
