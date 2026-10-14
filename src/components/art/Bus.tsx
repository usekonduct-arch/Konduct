/*
 * Side-on korope (campus shuttle), facing right. Local box is 562 x 240,
 * wheels touch y = 236. Animated parts carry class hooks:
 *   .bus-body   bobs while driving       .bus-wheel  spins (two of them)
 *   .bus-door   folds open (scaleX)      .seat-N     passenger heads, hidden until boarded
 *   .bus-puff   exhaust                  .bus-lamp   headlight glow
 */
type Props = { id: string; route?: string; seats?: boolean };

const WINDOWS = [26, 106, 186];
// Where boarded riders sit: [x, window index]
export const SEATS: [number, number][] = [
  [222, 2],
  [142, 1],
  [50, 0],
  [80, 0],
];

function Wheel({ cx }: { cx: number }) {
  return (
    <g>
      <circle cx={cx} cy={202} r={40} fill="#0e1115" />
      <g className="bus-wheel">
        <circle cx={cx} cy={204} r={32} fill="#07090b" />
        <circle cx={cx} cy={204} r={19} fill="#c9ced5" />
        <circle cx={cx} cy={204} r={19} fill="none" stroke="#9aa2ad" strokeWidth={3} />
        <path
          d={`M${cx} 188v32M${cx - 16} 204h32M${cx - 11} 193l22 22M${cx + 11} 193l-22 22`}
          stroke="#6b7480"
          strokeWidth={3}
          strokeLinecap="round"
        />
        <circle cx={cx} cy={204} r={6} fill="#0e1115" />
      </g>
    </g>
  );
}

export default function Bus({ id, route = "MAIN GATE ⇄ FACULTY", seats = true }: Props) {
  return (
    <g className="bus">
      <ellipse cx={282} cy={237} rx={272} ry={7} fill="#000" opacity={0.35} />
      <circle className="bus-puff" cx={-6} cy={186} r={10} fill="#8b939e" opacity={0} />
      <circle className="bus-puff" cx={-6} cy={186} r={10} fill="#8b939e" opacity={0} />
      <g className="bus-body">
        <defs>
          {WINDOWS.map((x, i) => (
            <clipPath id={`${id}-win${i}`} key={x}>
              <rect x={x} y={44} width={72} height={70} rx={9} />
            </clipPath>
          ))}
          <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#d9f0fa" />
            <stop offset="1" stopColor="#8fc6de" />
          </linearGradient>
        </defs>

        {/* route board on the roof rack */}
        <rect x={240} y={8} width={6} height={24} fill="#0e1115" />
        <rect x={452} y={8} width={6} height={24} fill="#0e1115" />
        <rect x={226} y={0} width={246} height={24} rx={7} fill="#0e1115" />
        <text x={349} y={16.5} textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontWeight={700} fontSize={12} letterSpacing={1.2} fill="#ffc700">
          {route}
        </text>

        {/* body */}
        <path d="M30 30H468Q496 30 511 52L548 112Q557 125 557 143V188Q557 200 545 200H18Q8 200 8 188V52Q8 30 30 30Z" fill="#ffc700" />
        <path d="M8 170H557V188Q557 200 545 200H18Q8 200 8 188Z" fill="#e3ab00" />
        <rect x={8} y={160} width={549} height={10} fill="#0e1115" />
        <path d="M30 30H468Q490 30 503 44H22Q24 30 30 30Z" fill="#fff" opacity={0.25} />

        {/* side windows + seated riders */}
        {WINDOWS.map((x, i) => (
          <g key={x}>
            <rect x={x} y={44} width={72} height={70} rx={9} fill="#1b222b" />
            {seats && (
              <g clipPath={`url(#${id}-win${i})`}>
                {SEATS.map(([sx, w], s) =>
                  w === i ? (
                    <g className={`seat seat-${s}`} key={s}>
                      <ellipse cx={sx} cy={120} rx={20} ry={16} fill={["#ff6b4a", "#3d7bff", "#19b86a", "#b483ff"][s]} />
                      <circle cx={sx} cy={90} r={13} fill={["#8d5524", "#5c3a1e", "#c68642", "#3d2412"][s]} />
                    </g>
                  ) : null,
                )}
              </g>
            )}
            <path d={`M${x + 10} ${108}L${x + 46} ${50}`} stroke="#fff" strokeOpacity={0.12} strokeWidth={8} strokeLinecap="round" />
          </g>
        ))}

        {/* QR sticker beside the door */}
        <g>
          <rect x={264} y={60} width={44} height={44} rx={7} fill="#fff" />
          <rect x={264} y={60} width={44} height={44} rx={7} fill="none" stroke="#0e1115" strokeWidth={2} />
          <path
            d="M270 66h10v10h-10zM292 66h10v10h-10zM270 88h10v10h-10zM284 66h4v4h-4zM284 74h4v8h-4zM292 82h4v4h-4zM298 80h4v8h-4zM284 88h6v4h-6zM292 92h10v6h-10zM284 96h4v2h-4z"
            fill="#0e1115"
          />
          <rect x={264} y={106} width={44} height={10} rx={3} fill="#0e1115" />
          <text x={286} y={113.5} textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontWeight={700} fontSize={7} fill="#ffc700">
            OS·452
          </text>
        </g>

        {/* doorway + folding door */}
        <rect x={316} y={42} width={74} height={152} rx={7} fill="#07090b" />
        <rect x={322} y={180} width={62} height={8} rx={2} fill="#3a424d" />
        <g className="bus-door">
          <rect x={316} y={42} width={74} height={152} rx={7} fill="#ffc700" stroke="#c99600" strokeWidth={2} />
          <rect x={324} y={50} width={58} height={62} rx={7} fill="#1b222b" />
          <rect x={324} y={160} width={58} height={10} fill="#0e1115" />
          <rect x={372} y={124} width={5} height={22} rx={2.5} fill="#0e1115" />
        </g>

        {/* driver cabin */}
        <rect x={398} y={44} width={86} height={70} rx={9} fill="#1b222b" />
        <ellipse cx={446} cy={118} rx={22} ry={16} fill="#2a3340" />
        <circle cx={448} cy={88} r={13} fill="#5c3a1e" />
        <path d="M434 84q14-14 28 0v-5q-14-12-28 0z" fill="#0e1115" />
        <path d="M490 44H505Q512 44 516 51L547 108Q549 114 543 114H490Z" fill={`url(#${id}-glass)`} />
        <path d="M498 104L512 56" stroke="#fff" strokeOpacity={0.5} strokeWidth={5} strokeLinecap="round" />

        {/* wordmark */}
        <text x={28} y={148} fontFamily="Bricolage Grotesque, sans-serif" fontWeight={800} fontSize={26} letterSpacing={-0.5} fill="#0e1115">
          konduct
        </text>
        <text x={152} y={147} fontFamily="JetBrains Mono, monospace" fontWeight={700} fontSize={9} letterSpacing={1.5} fill="#0e1115" opacity={0.75}>
          SCAN · PAY · RIDE
        </text>

        {/* lights, mirror, bumper */}
        <circle className="bus-lamp" cx={552} cy={156} r={22} fill="#fff6c2" opacity={0.18} />
        <rect x={541} y={148} width={15} height={15} rx={4} fill="#fff6c2" />
        <rect x={8} y={122} width={9} height={24} rx={3} fill="#ff4d4f" />
        <path d="M548 60h8a4 4 0 0 1 4 4v14h-6V66h-6z" fill="#0e1115" />
        <rect x={0} y={192} width={564} height={11} rx={5.5} fill="#0e1115" />
      </g>
      <Wheel cx={112} />
      <Wheel cx={450} />
    </g>
  );
}
