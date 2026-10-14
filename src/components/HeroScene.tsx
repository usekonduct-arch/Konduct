import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Bus from "./art/Bus";
import Person, { LOOKS } from "./art/Person";
import Skyline from "./art/Skyline";

/*
 * The hero loop (about 15s), all on one GSAP timeline so it repeats cleanly:
 *   bus pulls into the park while four students walk up to the stop
 *   door folds open, each student scans the sticker and boards
 *   student three pays for the friend behind them (one scan, two riders)
 *   door closes, the driver's alert lands, the bus pulls away
 *   an okada crosses on the far lane mid-loop
 */

const BUS_Y = 378;
const BUS_STOP = 430;
const DOOR_X = 800;
const QUEUE = [890, 975, 1060, 1145];
const WHEEL_C = 2 * Math.PI * 32;
const spin = (dist: number) => (dist / WHEEL_C) * 360;

const CHIPS = [
  { text: "+₦200 · paid", w: 150 },
  { text: "+₦200 · paid", w: 150 },
  { text: "+₦400 · 2 riders", w: 196 },
];

function Bike() {
  return (
    <g className="bike">
      <g className="bike-wheel"><circle cx={-34} cy={-17} r={17} fill="#07090b" /><circle cx={-34} cy={-17} r={7} fill="#9aa2ad" /></g>
      <g className="bike-wheel"><circle cx={34} cy={-17} r={17} fill="#07090b" /><circle cx={34} cy={-17} r={7} fill="#9aa2ad" /></g>
      <path d="M-34 -17L-14 -44H18L34 -17" stroke="#0b0e12" strokeWidth={6} fill="none" strokeLinejoin="round" />
      <path d="M-20 -52q14-12 34 0v10h-34z" fill="#ffc700" />
      <path d="M-30 -48l-8-12" stroke="#0b0e12" strokeWidth={5} strokeLinecap="round" />
      {/* rider */}
      <path d="M2 -48q-6-34 6-48l14 4q4 24-4 44z" fill="#19b86a" />
      <path d="M4 -56l-26 -10" stroke="#0e8a4e" strokeWidth={9} strokeLinecap="round" />
      <path d="M12 -50l-16 24h-8" stroke="#1d2530" strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx={8} cy={-106} r={13} fill="#5c3a1e" />
      <path d="M-6 -106a14 14 0 0 1 28 0v3h-28z" fill="#ffc700" />
      {/* passenger */}
      <path d="M20 -50q-2-28 8-40l14 5q2 20-6 35z" fill="#ff6b4a" />
      <circle cx={30} cy={-98} r={12} fill="#8d5524" />
      <path d="M24 -48l-6 22h-8" stroke="#26303d" strokeWidth={8} strokeLinecap="round" fill="none" />
    </g>
  );
}

export default function HeroScene() {
  const root = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const bus = q(".bus")[0];
      const body = q(".bus-body")[0];
      const wheels = q(".bus-wheel");
      const door = q(".bus-door")[0];
      const seats = q(".seat");
      const people = q(".actor");
      const legF = people.map((p) => p.querySelector(".leg-f")!);
      const legB = people.map((p) => p.querySelector(".leg-b")!);
      const bodies = people.map((p) => p.querySelector(".p-body")!);
      const arms = people.map((p) => p.querySelector(".arm")!);
      const chips = q(".chip");
      const [beam, ring] = [q(".beam")[0], q(".ring")[0]];
      const card = q(".driver-card")[0];
      const bike = q(".bike")[0];

      gsap.set(bus, { x: -700, y: BUS_Y });
      gsap.set(wheels, { transformOrigin: "50% 50%" });
      gsap.set(q(".bike-wheel"), { transformOrigin: "50% 50%" });
      gsap.set(door, { transformOrigin: "100% 50%" });
      gsap.set(seats, { scale: 0, transformOrigin: "50% 100%" });
      gsap.set(people, { x: (i) => 1720 + i * 95, y: 690, transformOrigin: "50% 100%" });
      gsap.set([...legF, ...legB, ...arms], { transformOrigin: "50% 0%" });
      gsap.set(chips, { opacity: 0, transformOrigin: "50% 50%" });
      gsap.set([beam, ring], { opacity: 0 });
      gsap.set(ring, { transformOrigin: "50% 50%" });
      gsap.set(card, { opacity: 0, transformOrigin: "50% 100%" });
      gsap.set(bike, { x: 1760, y: 528 });

      const tl = gsap.timeline({ repeat: -1, paused: true });

      const walk = (i: number, at: number, dur: number) => {
        const half = Math.max(2, Math.round(dur / 0.17));
        const even = half % 2 ? half + 1 : half;
        const step = dur / even;
        tl.to(legF[i], { rotation: 26, duration: step, yoyo: true, repeat: even - 1, ease: "sine.inOut" }, at);
        tl.to(legB[i], { rotation: -26, duration: step, yoyo: true, repeat: even - 1, ease: "sine.inOut" }, at);
        tl.to(bodies[i], { y: -3, duration: step / 2, yoyo: true, repeat: even * 2 - 1, ease: "sine.inOut" }, at);
      };

      /* 1. arrival */
      tl.to(bus, { x: BUS_STOP, duration: 3.2, ease: "power3.out" }, 0);
      tl.to(wheels, { rotation: spin(BUS_STOP + 700), duration: 3.2, ease: "power3.out" }, 0);
      tl.to(body, { y: -2.5, duration: 0.11, yoyo: true, repeat: 21, ease: "sine.inOut" }, 0);
      tl.to(body, { rotation: 0.7, transformOrigin: "100% 100%", duration: 0.2, yoyo: true, repeat: 1, ease: "power2.out" }, 3.0);

      people.forEach((p, i) => {
        const at = 0.3 + i * 0.32;
        const dist = 1720 + i * 95 - QUEUE[i];
        const dur = dist / 340;
        tl.to(p, { x: QUEUE[i], duration: dur, ease: "none" }, at);
        walk(i, at, dur);
      });

      tl.to(door, { scaleX: 0.1, duration: 0.45, ease: "power2.inOut" }, 3.35);

      /* 2. boarding */
      let t = 3.9;
      for (let k = 0; k < 4; k++) {
        const toDoor = 0.4;
        tl.to(people[k], { x: DOOR_X, duration: toDoor, ease: "power1.inOut" }, t);
        walk(k, t, toDoor);
        for (let j = k + 1; j < 4; j++) {
          tl.to(people[j], { x: QUEUE[j - k - 1], duration: 0.55, ease: "power1.inOut" }, t + 0.05);
          walk(j, t + 0.05, 0.55);
        }
        t += toDoor;

        if (k < 3) {
          tl.to(arms[k], { rotation: 142, duration: 0.25, ease: "back.out(2)" }, t);
          t += 0.22;
          tl.to(beam, { opacity: 0.6, duration: 0.1, yoyo: true, repeat: 3, ease: "none" }, t);
          tl.fromTo(ring, { scale: 0.3, opacity: 1 }, { scale: 2.8, opacity: 0, duration: 0.75, ease: "power2.out", immediateRender: false }, t + 0.3);
          tl.fromTo(chips[k], { opacity: 0, y: 18, scale: 0.6 }, { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "back.out(2.2)", immediateRender: false }, t + 0.32);
          tl.to(chips[k], { opacity: 0, y: -34, duration: 0.5, ease: "power1.in" }, t + 1.35);
          t += 0.72;
          tl.to(arms[k], { rotation: 0, duration: 0.2, ease: "power1.in" }, t);
        }

        tl.to(people[k], { x: DOOR_X - 20, y: 596, scale: 0.8, opacity: 0, duration: 0.42, ease: "power1.in" }, t + 0.05);
        tl.to(seats[k], { scale: 1, duration: 0.35, ease: "back.out(2.5)" }, t + 0.4);
        t += 0.55;
      }

      /* 3. departure */
      tl.to(door, { scaleX: 1, duration: 0.4, ease: "power2.inOut" }, t + 0.15);
      tl.fromTo(card, { opacity: 0, y: 20, scale: 0.85 }, { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: "back.out(1.8)", immediateRender: false }, t + 0.35);
      tl.to(card, { opacity: 0, y: -16, duration: 0.45, ease: "power1.in" }, t + 3.5);
      const go = t + 1.1;
      tl.fromTo(q(".bus-puff"), { opacity: 0.6, scale: 0.4, x: 0, y: 0 }, { opacity: 0, scale: 2.2, x: -70, y: -14, duration: 0.9, stagger: 0.28, ease: "power1.out", immediateRender: false }, go - 0.2);
      tl.to(bus, { x: 1760, duration: 2.8, ease: "power2.in" }, go);
      tl.to(wheels, { rotation: spin(BUS_STOP + 700) + spin(1760 - BUS_STOP), duration: 2.8, ease: "power2.in" }, go);
      tl.to(body, { y: -2.5, duration: 0.11, yoyo: true, repeat: 19, ease: "sine.inOut" }, go + 0.6);
      tl.to({}, { duration: 0.7 }, go + 2.8);

      /* okada on the far lane */
      tl.to(bike, { x: -260, duration: 3.4, ease: "none" }, 6.2);
      tl.to(q(".bike-wheel"), { rotation: -((2020 / (2 * Math.PI * 17)) * 360), duration: 3.4, ease: "none" }, 6.2);
      tl.to(bike, { y: 525, duration: 0.15, yoyo: true, repeat: 21, ease: "sine.inOut" }, 6.2);

      /* clouds drift forever on their own clock */
      const clouds = gsap.to(q(".clouds"), { x: -1600, duration: 120, ease: "none", repeat: -1 });

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: reduce)", () => {
        tl.pause(5.3);
        clouds.pause();
      });
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const io = new IntersectionObserver(([e]) => {
          if (e.isIntersecting) {
            tl.play();
            clouds.play();
          } else {
            tl.pause();
            clouds.pause();
          }
        });
        io.observe(root.current!);
        return () => io.disconnect();
      });
    },
    { scope: root },
  );

  return (
    <svg
      ref={root}
      className="scene"
      viewBox="0 100 1600 600"
      preserveAspectRatio="xMidYMax slice"
      role="img"
      aria-label="A yellow Konduct shuttle pulls into the campus park. Students scan the code beside the door, one pays for a friend, they board, and the driver's phone shows ₦800 received for 4 riders."
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset=".2" stopColor="#0e1115" />
          <stop offset=".6" stopColor="#1a1d27" />
          <stop offset="1" stopColor="#3a2a24" />
        </linearGradient>
        <radialGradient id="sun" cx=".5" cy=".42" r=".6">
          <stop offset="0" stopColor="#ffe066" />
          <stop offset=".7" stopColor="#ffc700" />
          <stop offset="1" stopColor="#ff9f1a" />
        </radialGradient>
        <radialGradient id="lampGlow">
          <stop offset="0" stopColor="#fff1a8" stopOpacity=".45" />
          <stop offset="1" stopColor="#fff1a8" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="halo">
          <stop offset=".55" stopColor="#ffc700" stopOpacity=".18" />
          <stop offset="1" stopColor="#ffc700" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="1600" height="700" fill="url(#sky)" />
      <g fill="#f4f3ec">
        {[[90, 60], [260, 120], [470, 40], [610, 150], [760, 80], [880, 30], [1010, 120], [1420, 70], [1530, 150], [330, 200], [1340, 190], [40, 210]].map(([x, y], i) => (
          <circle key={i} className="star" cx={x} cy={y} r={i % 3 ? 1.4 : 2.1} style={{ animationDelay: `${i * 0.37}s` }} />
        ))}
      </g>
      <circle cx="1235" cy="335" r="300" fill="url(#halo)" />
      <circle cx="1235" cy="335" r="150" fill="url(#sun)" />
      <g opacity=".9">
        <rect x="1085" y="318" width="300" height="9" fill="#1a1d27" opacity=".55" />
        <rect x="1085" y="350" width="300" height="12" fill="#1a1d27" opacity=".55" />
        <rect x="1085" y="388" width="300" height="16" fill="#1a1d27" opacity=".55" />
      </g>
      <g transform="translate(0 110)"><g className="clouds" fill="#222734" opacity=".9">
        {[0, 1600].map((o) => (
          <g key={o} transform={`translate(${o} 0)`}>
            <path d="M120 140h170a26 26 0 0 0-30-30a40 40 0 0 0-76-6a28 28 0 0 0-64 36z" />
            <path d="M700 90h130a20 20 0 0 0-24-22a32 32 0 0 0-60-4a22 22 0 0 0-46 26z" />
            <path d="M1080 170h210a30 30 0 0 0-36-34a46 46 0 0 0-88-6a32 32 0 0 0-86 40z" />
          </g>
        ))}
      </g></g>

      <Skyline />

      {/* road */}
      <rect x="0" y="474" width="1600" height="178" fill="#1a1f26" />
      <rect x="0" y="482" width="1600" height="3" fill="#f4f3ec" opacity=".14" />
      <line className="lane" x1="-90" y1="558" x2="1690" y2="558" stroke="#f4f3ec" strokeOpacity=".5" strokeWidth="5" strokeDasharray="52 38" />

      <Bike />

      <Bus id="hero-bus" />

      {/* scan beam, ping and paid chips live in world space at the sticker */}
      <polygon className="beam" points="768,548 735,449 697,471" fill="#ffc700" />
      <circle className="ring" cx="716" cy="460" r="22" fill="none" stroke="#ffc700" strokeWidth="4" />
      {CHIPS.map((c, i) => (
        <g className="chip" key={i}>
          <rect x={716 - c.w / 2} y="312" width={c.w} height="44" rx="22" fill="#19b86a" />
          <circle cx={716 - c.w / 2 + 22} cy="334" r="11" fill="#fff" />
          <path d={`M${716 - c.w / 2 + 16} 334l4.5 4.5l8-9`} stroke="#19b86a" strokeWidth="3.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <text x={716 - c.w / 2 + 42} y="340.5" fontFamily="Figtree, sans-serif" fontWeight="700" fontSize="19" fill="#fff">
            {c.text}
          </text>
        </g>
      ))}

      {/* driver's phone alert */}
      <g className="driver-card">
        <g transform="translate(0 70)">
        <rect x="520" y="176" width="390" height="116" rx="22" fill="#f4f3ec" />
        <rect x="520" y="176" width="390" height="116" rx="22" fill="none" stroke="#0e1115" strokeWidth="3" />
        <circle cx="552" cy="206" r="7" fill="#19b86a" />
        <text x="568" y="211.5" fontFamily="JetBrains Mono, monospace" fontWeight="700" fontSize="14" letterSpacing="1" fill="#5d636b">
          KONDUCT DRIVER · NOW
        </text>
        <text x="544" y="254" fontFamily="Bricolage Grotesque, sans-serif" fontWeight="800" fontSize="36" fill="#0e1115" letterSpacing="-1">
          ₦800 received
        </text>
        <text x="545" y="279" fontFamily="Figtree, sans-serif" fontWeight="600" fontSize="16" fill="#5d636b">
          4 riders · Ref KD-48Q2
        </text>
        <g stroke="#0e1115" strokeWidth="3.5" fill="none" strokeLinecap="round" transform="translate(42 -12)">
          <path d="M796 238v14h8l10 8v-30l-10 8z" fill="#0e1115" />
          <path className="wave" d="M822 236q6 9 0 18" />
          <path className="wave w2" d="M830 230q11 15 0 30" />
        </g>
        </g>
      </g>

      {/* near curb, painted at the stop */}
      <rect x="0" y="652" width="1600" height="48" fill="#262d37" />
      <rect x="0" y="652" width="1600" height="12" fill="#3a424d" />
      {Array.from({ length: 19 }, (_, i) => (
        <rect key={i} x={600 + i * 36} y="652" width="36" height="12" fill={i % 2 ? "#0e1115" : "#ffc700"} />
      ))}

      {/* stop pole */}
      <g>
        <rect x="1226" y="520" width="8" height="172" rx="3" fill="#0b0e12" />
        <rect x="1190" y="462" width="80" height="88" rx="12" fill="#ffc700" />
        <path d="M1214 474h9v16l13-16h11l-15 18l16 22h-11l-14-18v18h-9z" fill="#0e1115" />
        <text x="1230" y="538" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontWeight="700" fontSize="9" fill="#0e1115">
          STOP
        </text>
      </g>

      {LOOKS.map((look, i) => (
        <Person key={i} look={look} className={`actor actor-${i}`} />
      ))}
    </svg>
  );
}
