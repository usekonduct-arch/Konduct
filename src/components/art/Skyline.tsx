/* Static campus backdrop for the hero: buildings, clock tower, trees, lamps, park canopy. */
import Person, { type Look } from "./Person";

const NEAR: [number, number, number][] = [
  [0, 110, 330], [110, 70, 300], [180, 140, 360], [376, 120, 340], [500, 180, 312],
  [690, 90, 284], [790, 150, 352], [950, 110, 300], [1070, 60, 252], [1140, 170, 330],
  [1320, 90, 292], [1420, 180, 346],
];
const FAR: [number, number, number][] = [
  [40, 90, 276], [220, 100, 258], [560, 80, 236], [860, 100, 246], [1000, 90, 218], [1260, 120, 236], [1480, 120, 268],
];

function windows() {
  const out: { x: number; y: number; lit: boolean; blink: boolean }[] = [];
  NEAR.forEach(([bx, bw, top], b) => {
    for (let x = bx + 14; x < bx + bw - 14; x += 20) {
      for (let y = top + 20; y < 426; y += 24) {
        const h = (x * 7 + y * 13 + b * 31) % 23;
        out.push({ x, y, lit: h < 5, blink: h === 2 });
      }
    }
  });
  return out;
}
const WINDOWS = windows();

const SHADOW: Look = { skin: "#0b0e12", shirt: "#141a21", shirtDark: "#10151b", pants: "#0b0e12", bag: "#10151b", hair: "low" };

function Palm({ x, s = 1 }: { x: number; s?: number }) {
  return (
    <g transform={`translate(${x} 446) scale(${s})`}>
      <path d="M-4 0q-2-70 10-130l6 1q-10 60-7 129z" fill="#3b2a1a" />
      <g fill="#0e7a4b">
        <path d="M8-130q-40-14-70 10q34-6 68-2z" />
        <path d="M8-130q40-16 72 6q-36-4-70 0z" />
        <path d="M8-132q-22-34-60-36q30 14 56 38z" />
        <path d="M8-132q24-32 62-30q-32 12-58 34z" />
        <path d="M8-132q4-34-10-52q18 18 14 52z" fill="#12955b" />
      </g>
    </g>
  );
}

function Tree({ x, r = 34 }: { x: number; r?: number }) {
  return (
    <g>
      <rect x={x - 4} y={446 - r - 20} width={8} height={r + 20} fill="#0a5836" />
      <circle cx={x} cy={446 - r - 30} r={r} fill="#0e7a4b" />
      <circle cx={x - r * 0.45} cy={446 - r - 18} r={r * 0.7} fill="#0c6b42" />
      <circle cx={x + r * 0.3} cy={446 - r * 1.55 - 18} r={r * 0.45} fill="#12955b" />
    </g>
  );
}

function Lamp({ x }: { x: number }) {
  return (
    <g>
      <circle cx={x + 26} cy={338} r={46} fill="url(#lampGlow)" />
      <rect x={x - 3} y={330} width={6} height={142} fill="#0b0e12" />
      <path d={`M${x} 332q4-10 26-6`} stroke="#0b0e12" strokeWidth={6} fill="none" />
      <rect x={x + 16} y={326} width={22} height={8} rx={3} fill="#fff1a8" />
    </g>
  );
}

export default function Skyline() {
  return (
    <g>
      <g fill="#161c24">
        {FAR.map(([x, w, t]) => (
          <rect key={x} x={x} y={t} width={w} height={446 - t} />
        ))}
      </g>
      <g fill="#1c232d">
        {NEAR.map(([x, w, t]) => (
          <rect key={x} x={x} y={t} width={w} height={446 - t} />
        ))}
        {/* clock tower */}
        <rect x={330} y={228} width={46} height={218} />
        <path d="M324 230L353 186L382 230Z" />
        <rect x={350} y={170} width={6} height={20} />
        {/* auditorium dome */}
        <path d="M530 314a60 60 0 0 1 120 0z" />
        <rect x={586} y={240} width={8} height={18} />
      </g>
      <circle cx={353} cy={252} r={12} fill="#ffc700" opacity={0.85} />
      <path d="M353 252v-8M353 252l6 3" stroke="#1c232d" strokeWidth={2.4} strokeLinecap="round" />
      <g>
        {WINDOWS.map((w, i) => (
          <rect
            key={i}
            className={w.blink ? "twinkle" : undefined}
            x={w.x}
            y={w.y}
            width={9}
            height={12}
            rx={1.5}
            fill={w.lit ? "#ffc700" : "#252e3a"}
            opacity={w.lit ? 0.6 : 1}
            style={w.blink ? { animationDelay: `${(i % 7) * 0.9}s` } : undefined}
          />
        ))}
      </g>

      <Palm x={150} />
      <Tree x={268} r={30} />
      <Palm x={655} s={0.9} />
      <Tree x={940} r={36} />
      <Palm x={1500} s={1.05} />
      <Lamp x={60} />
      <Lamp x={520} />
      <Lamp x={1010} />

      {/* far sidewalk */}
      <rect x={0} y={444} width={1600} height={30} fill="#232a34" />
      <rect x={0} y={444} width={1600} height={3} fill="#313a47" />

      {/* the park: canopy, sign, waiting silhouettes */}
      <g>
        <rect x={1094} y={384} width={8} height={88} fill="#0b0e12" />
        <rect x={1428} y={384} width={8} height={88} fill="#0b0e12" />
        <path d="M1070 386L1100 360H1430L1460 386Z" fill="#ffc700" />
        <rect x={1070} y={386} width={390} height={8} fill="#c99600" />
        <text x={1265} y={379} textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontWeight={700} fontSize={13} letterSpacing={2} fill="#0e1115">
          KONDUCT PARK · MAIN GATE
        </text>
        <rect x={1130} y={448} width={120} height={8} rx={3} fill="#0b0e12" />
        <g transform="translate(1160 470) scale(.5)"><Person look={SHADOW} className="bg-person" /></g>
        <g transform="translate(1214 470) scale(.52) scale(-1 1)"><Person look={SHADOW} className="bg-person" /></g>
        <g transform="translate(1370 470) scale(.48)"><Person look={SHADOW} className="bg-person" /></g>
      </g>
    </g>
  );
}
