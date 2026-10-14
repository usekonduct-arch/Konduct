import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Phone } from "./PhoneScreens";

const STEPS = [
  {
    n: "01",
    title: "Fund your wallet once.",
    body: "Every rider gets their own account number. Transfer from any bank app or pay by card, and your balance updates the moment the money lands.",
    foot: "Top up ₦2,000 and you're set for the week.",
  },
  {
    n: "02",
    title: "Scan the code on the bus.",
    body: "Every Konduct shuttle and bike carries a code tied to a verified driver. Scan it and you'll see the driver's name, plate, route and fare before a single kobo moves.",
    foot: "No typing account numbers. No guessing the fare.",
  },
  {
    n: "03",
    title: "Tap to pay. Take your seat.",
    body: "One tap confirms. The driver's phone calls out the payment, and you both see the same reference. Something off? Report it straight from the receipt.",
    foot: "Three taps from park to seat.",
  },
];

function useInView<T extends Element>() {
  const ref = useRef<T>(null);
  const [hits, setHits] = useState(0);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setHits((h) => h + 1), { threshold: 0.45 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return [ref, hits] as const;
}

function InlinePhone({ i }: { i: number }) {
  const [ref, hits] = useInView<HTMLDivElement>();
  return (
    <div className="step-phone" ref={ref}>
      <Phone screen={i} replay={hits} />
    </div>
  );
}

export default function HowItWorks() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [replay, setReplay] = useState(0);

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>(".step").forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => {
            if (self.isActive) {
              setActive(i);
              setReplay((r) => r + 1);
            }
          },
        });
      });
      gsap.to(".how-progress i", {
        scaleY: 1,
        ease: "none",
        scrollTrigger: { trigger: ".steps", start: "top 55%", end: "bottom 55%", scrub: true },
      });
    },
    { scope: ref },
  );

  return (
    <section className="how" id="how" ref={ref}>
      <div className="wrap">
        <div className="sec-head" data-reveal>
          <p className="kicker">How it works</p>
          <h2>Three taps from park to seat.</h2>
          <p className="sub">This is exactly what a student sees on the way to a lecture.</p>
        </div>
        <div className="how-grid">
          <div className="steps">
            <div className="how-progress" aria-hidden="true">
              <i />
            </div>
            {STEPS.map((s, i) => (
              <article className={`step ${active === i ? "is-active" : ""}`} key={s.n}>
                <span className="step-n">{s.n}</span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
                <p className="step-foot">{s.foot}</p>
                <InlinePhone i={i} />
              </article>
            ))}
          </div>
          <div className="how-sticky" aria-hidden="true">
            <div className="how-stage">
              <div className="stage-blob" />
              <Phone screen={active} replay={replay} />
              <div className="stage-dots">
                {STEPS.map((s, i) => (
                  <i key={s.n} className={active === i ? "on" : ""} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
